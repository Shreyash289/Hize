#!/usr/bin/env python3
"""
IEEE Validation Worker
Processes jobs from Redis queue and validates IEEE memberships
"""

import time
import json
import os
import sys
import redis
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from typing import Dict, Optional
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configuration
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379')
QUEUE_NAME = 'ieee_validation_queue'
IEEE_COOKIE = os.getenv('IEEE_COOKIE', '')
REQUEST_DELAY = 0.7  # 0.7 seconds between requests
WORKER_ID = os.getenv('WORKER_ID', f'worker-{os.getpid()}')

# IEEE API endpoint
IEEE_VALIDATOR_URL = 'https://services24.ieee.org/membership-validator.html'


class IEEEWorker:
    """Worker that processes IEEE validation jobs from Redis queue."""
    
    def __init__(self):
        self.redis_client = None
        self.session = requests.Session()
        self.last_request_time = 0
        self.current_cookie = IEEE_COOKIE  # Track current cookie value
        self.setup_session()
        
    def setup_session(self):
        """Setup HTTP session with proper headers."""
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://services24.ieee.org/membership-validator.html',
            'Origin': 'https://services24.ieee.org',
        })
        
        # Set cookie from current_cookie (instance variable)
        cookie_to_use = self.current_cookie if hasattr(self, 'current_cookie') else IEEE_COOKIE
        if cookie_to_use:
            # Extract cookie value if it's in format "PA.Global_Websession=value"
            cookie_value = cookie_to_use
            if '=' in cookie_to_use:
                cookie_value = cookie_to_use.split('=', 1)[1]
            self.session.cookies.set('PA.Global_Websession', cookie_value, domain='services24.ieee.org')
            logger.info('✓ Cookie loaded from environment')
        else:
            logger.warning('⚠️  No IEEE_COOKIE found in environment')
    
    def connect_redis(self):
        """Connect to Redis."""
        try:
            self.redis_client = redis.from_url(REDIS_URL, decode_responses=True)
            self.redis_client.ping()
            logger.info(f'✅ Redis connected: {REDIS_URL}')
            return True
        except Exception as e:
            logger.error(f'❌ Redis connection failed: {e}')
            return False
    
    def rate_limit(self):
        """Enforce 0.7s delay between requests."""
        elapsed = time.time() - self.last_request_time
        if elapsed < REQUEST_DELAY:
            sleep_time = REQUEST_DELAY - elapsed
            time.sleep(sleep_time)
        self.last_request_time = time.time()
    
    def check_session_expiry(self, soup: BeautifulSoup, status_code: int) -> bool:
        """Check if session has expired."""
        # Check for session expiry indicators
        if status_code == 401 or status_code == 403:
            return True
        
        page_text = soup.get_text().lower()
        if 'sign in' in page_text or 'login' in page_text or 'unauthorized' in page_text:
            return True
        
        # Check for membership validation status section
        status_section = soup.find(string=lambda text: text and 'Membership validation status' in text)
        return status_section is None
    
    def extract_field_value(self, soup: BeautifulSoup, label_text: str) -> Optional[str]:
        """Extract field value by label text."""
        label_element = soup.find(string=lambda text: text and label_text in text)
        if not label_element:
            return None
        
        parent = label_element.find_parent()
        if not parent:
            return None
        
        # Check for sibling span elements
        next_sibling = parent.find_next_sibling()
        if next_sibling:
            if next_sibling.name == 'span':
                value = next_sibling.get_text(strip=True)
                # Handle name initials (multiple spans)
                if label_text == 'First and last name initials':
                    spans = [next_sibling]
                    current = next_sibling.find_next_sibling()
                    while current and current.name == 'span':
                        spans.append(current)
                        current = current.find_next_sibling()
                    if len(spans) > 1:
                        values = [s.get_text(strip=True) for s in spans]
                        return '. '.join(values) + '.' if values else None
                if value:
                    return value
            else:
                value = next_sibling.get_text(strip=True)
                if value and value not in label_text:
                    return value
        
        # Try extracting from same element (after colon)
        full_text = parent.get_text(separator=' ', strip=True)
        if ':' in full_text:
            parts = full_text.split(':', 1)
            if len(parts) > 1:
                value = parts[1].strip()
                if value:
                    return value
        
        # Try next siblings
        for sibling in parent.find_next_siblings():
            text = sibling.get_text(strip=True)
            if text and text not in label_text:
                return text
        
        return None
    
    def extract_society_memberships(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract society memberships."""
        label_element = soup.find(string=lambda text: text and 'Society membership' in text)
        if not label_element:
            return None
        
        parent = label_element.find_parent()
        if not parent:
            return None
        
        societies = []
        
        # Try to find list (ul/ol) after label
        list_elem = parent.find_next(['ul', 'ol'])
        if list_elem:
            for li in list_elem.find_all('li'):
                text = li.get_text(strip=True)
                if text and 'IEEE' in text:
                    societies.append(text)
            if societies:
                return ', '.join(societies)
        
        # Check siblings
        for sibling in parent.find_next_siblings(['div', 'span', 'p', 'ul', 'ol']):
            if sibling.name in ['ul', 'ol']:
                for li in sibling.find_all('li'):
                    text = li.get_text(strip=True)
                    if text and 'IEEE' in text:
                        societies.append(text)
            else:
                text = sibling.get_text(strip=True)
                if text and 'IEEE' in text and 'Society' in text:
                    societies.append(text)
        
        if societies:
            return ', '.join(societies)
        
        return None
    
    def validate_member(self, member_id: str) -> Dict:
        """Validate a single IEEE member."""
        self.rate_limit()
        
        form_data = {
            'customerId': member_id.strip()
        }
        
        try:
            response = self.session.post(
                IEEE_VALIDATOR_URL,
                data=form_data,
                timeout=30
            )
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Check for session expiry
            if self.check_session_expiry(soup, response.status_code):
                return {
                    'success': False,
                    'error': 'Session expired: Cookie needs refresh',
                    'session_expired': True
                }
            
            # Extract fields
            result = {
                'success': True,
                'memberId': member_id,
                'nameInitials': self.extract_field_value(soup, 'First and last name initials'),
                'membershipStatus': self.extract_field_value(soup, 'Membership status'),
                'memberGrade': self.extract_field_value(soup, 'IEEE member grade'),
                'standardsAssociationMember': self.extract_field_value(soup, 'Standards Association Member'),
                'societyMemberships': self.extract_society_memberships(soup),
                'isValid': False
            }
            
            # Determine if membership is valid (Active status)
            if result['membershipStatus'] and 'Active' in result['membershipStatus']:
                result['isValid'] = True
            
            return result
            
        except requests.exceptions.RequestException as e:
            logger.error(f'Request error for {member_id}: {e}')
            return {
                'success': False,
                'error': f'Request failed: {str(e)}',
                'session_expired': False
            }
        except Exception as e:
            logger.error(f'Validation error for {member_id}: {e}')
            return {
                'success': False,
                'error': f'Validation failed: {str(e)}',
                'session_expired': False
            }
    
    def process_job(self, job_data: Dict) -> Dict:
        """Process a single validation job."""
        job_id = job_data.get('jobId')
        member_id = job_data.get('memberId')
        
        logger.info(f'🔄 Processing job {job_id} for member {member_id}')
        
        # Update job status to processing
        if self.redis_client:
            try:
                self.redis_client.set(
                    f'job:{job_id}',
                    json.dumps({**job_data, 'status': 'processing', 'worker': WORKER_ID}),
                    ex=600
                )
            except Exception as e:
                logger.error(f'Failed to update job status: {e}')
        
        # Validate member
        result = self.validate_member(member_id)
        
        if result.get('session_expired'):
            logger.warning('⚠️  Session expired - worker should pause for cookie refresh')
            # Mark job as failed with special flag
            if self.redis_client:
                try:
                    self.redis_client.set(
                        f'job:{job_id}',
                        json.dumps({
                            **job_data,
                            'status': 'failed',
                            'error': 'Session expired',
                            'session_expired': True
                        }),
                        ex=600
                    )
                except Exception as e:
                    logger.error(f'Failed to update job status: {e}')
            return result
        
        if not result.get('success'):
            # Mark job as failed
            if self.redis_client:
                try:
                    self.redis_client.set(
                        f'job:{job_id}',
                        json.dumps({
                            **job_data,
                            'status': 'failed',
                            'error': result.get('error', 'Validation failed')
                        }),
                        ex=600
                    )
                    # Remove from pending
                    self.redis_client.delete(f'pending:{member_id}')
                except Exception as e:
                    logger.error(f'Failed to update job status: {e}')
            return result
        
        # Success - cache result and update job
        result['jobId'] = job_id
        result['completedAt'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
        
        if self.redis_client:
            try:
                # Cache result for 24 hours
                cache_key = f'result:{member_id}'
                self.redis_client.set(
                    cache_key,
                    json.dumps(result),
                    ex=24 * 60 * 60  # 24 hours
                )
                
                # Update job status
                self.redis_client.set(
                    f'job:{job_id}',
                    json.dumps({
                        **job_data,
                        'status': 'completed',
                        'completedAt': result['completedAt']
                    }),
                    ex=600
                )
                
                # Remove from pending
                self.redis_client.delete(f'pending:{member_id}')
                
                logger.info(f'✅ Job {job_id} completed successfully')
                
            except Exception as e:
                logger.error(f'Failed to cache result: {e}')
        
        return result
    
    def run(self):
        """Main worker loop."""
        logger.info(f'🚀 IEEE Worker starting (ID: {WORKER_ID})')
        
        if not self.connect_redis():
            logger.error('❌ Cannot start worker: Redis connection failed')
            sys.exit(1)
        
        # Reload cookie periodically
        logger.info('📋 Worker ready. Waiting for jobs...')
        
        while True:
            try:
                # Blocking pop from queue (timeout 5 seconds)
                result = self.redis_client.blpop(QUEUE_NAME, timeout=5)
                
                if result:
                    queue_name, job_json = result
                    job_data = json.loads(job_json)
                    self.process_job(job_data)
                else:
                    # Timeout - check if cookie needs refresh
                    # Reload cookie from .env in case it was updated
                    load_dotenv(override=True)
                    new_cookie = os.getenv('IEEE_COOKIE', '')
                    if new_cookie and new_cookie != self.current_cookie:
                        logger.info('🔄 Cookie updated, reloading session...')
                        self.current_cookie = new_cookie
                        self.setup_session()
                
            except redis.exceptions.ConnectionError:
                logger.error('❌ Redis connection lost. Reconnecting...')
                time.sleep(5)
                if not self.connect_redis():
                    logger.error('❌ Reconnection failed. Exiting...')
                    sys.exit(1)
            except KeyboardInterrupt:
                logger.info('🛑 Worker stopped by user')
                break
            except Exception as e:
                logger.error(f'❌ Unexpected error: {e}')
                time.sleep(1)


if __name__ == '__main__':
    worker = IEEEWorker()
    try:
        worker.run()
    except KeyboardInterrupt:
        logger.info('🛑 Worker shutting down...')
        sys.exit(0)

