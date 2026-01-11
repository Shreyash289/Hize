#!/usr/bin/env python3
"""
Cookie Refresher Service - Runs continuously and refreshes cookie periodically

This version is optimized for VPS deployment with better error handling.
"""

import subprocess
import time
import sys
import os
from datetime import datetime
import logging

# Configure logging
log_file = os.path.join(os.path.dirname(__file__), 'cookie_refresh.log')
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

REFRESH_INTERVAL_HOURS = 4  # Refresh every 4 hours (before 6-hour expiry)
MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 300  # 5 minutes between retries


def refresh_cookie():
    """Refresh the IEEE cookie using the login script."""
    logger.info("=" * 60)
    logger.info("Starting cookie refresh...")
    
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            logger.info(f"Attempt {attempt}/{MAX_RETRIES}")
            
            result = subprocess.run(
                [sys.executable, "ieee_login.py"],
                capture_output=True,
                text=True,
                timeout=300,  # 5 minute timeout
                cwd=os.path.dirname(__file__)
            )
            
            if result.returncode == 0:
                logger.info("✓ Cookie refreshed successfully")
                logger.info(f"Output: {result.stdout[-200:]}")  # Last 200 chars
                return True
            else:
                logger.error(f"✗ Cookie refresh failed (exit code: {result.returncode})")
                logger.error(f"Error output: {result.stderr}")
                
                # Check for specific errors
                if "CAPTCHA" in result.stderr or "captcha" in result.stdout:
                    logger.error("❌ CAPTCHA detected - manual intervention required")
                    return False
                
                if attempt < MAX_RETRIES:
                    logger.info(f"Waiting {RETRY_DELAY_SECONDS}s before retry...")
                    time.sleep(RETRY_DELAY_SECONDS)
                    
        except subprocess.TimeoutExpired:
            logger.error(f"✗ Cookie refresh timed out (attempt {attempt}/{MAX_RETRIES})")
            if attempt < MAX_RETRIES:
                logger.info(f"Waiting {RETRY_DELAY_SECONDS}s before retry...")
                time.sleep(RETRY_DELAY_SECONDS)
                
        except Exception as e:
            logger.error(f"✗ Error refreshing cookie: {str(e)}")
            if attempt < MAX_RETRIES:
                logger.info(f"Waiting {RETRY_DELAY_SECONDS}s before retry...")
                time.sleep(RETRY_DELAY_SECONDS)
    
    logger.error("❌ All refresh attempts failed")
    return False


def verify_cookie():
    """Verify that cookie file exists and is valid."""
    cookie_file = os.path.join(os.path.dirname(__file__), 'ieee_cookie.txt')
    
    if not os.path.exists(cookie_file):
        logger.warning("Cookie file does not exist")
        return False
    
    try:
        with open(cookie_file, 'r') as f:
            cookie = f.read().strip()
        
        if not cookie or len(cookie) < 50:
            logger.warning(f"Cookie appears invalid (length: {len(cookie)})")
            return False
        
        logger.info(f"✓ Cookie verified (length: {len(cookie)} chars)")
        return True
        
    except Exception as e:
        logger.error(f"Error verifying cookie: {e}")
        return False


def main():
    """Main service loop."""
    logger.info("=" * 60)
    logger.info("IEEE Cookie Refresher Service")
    logger.info(f"Refresh interval: {REFRESH_INTERVAL_HOURS} hours")
    logger.info(f"Working directory: {os.getcwd()}")
    logger.info("=" * 60)
    
    # Initial refresh on startup
    logger.info("\n🔄 Performing initial cookie refresh...")
    if refresh_cookie():
        verify_cookie()
    else:
        logger.warning("⚠️  Initial refresh failed - will retry on next interval")
    
    # Main loop
    while True:
        try:
            sleep_seconds = REFRESH_INTERVAL_HOURS * 60 * 60
            next_refresh = datetime.now().timestamp() + sleep_seconds
            
            logger.info(f"\n💤 Sleeping for {REFRESH_INTERVAL_HOURS} hours...")
            logger.info(f"Next refresh scheduled for: {datetime.fromtimestamp(next_refresh)}")
            
            time.sleep(sleep_seconds)
            
            logger.info("\n" + "=" * 60)
            logger.info("Scheduled refresh triggered")
            
            if refresh_cookie():
                verify_cookie()
                logger.info("✅ Cookie refresh cycle completed successfully")
            else:
                logger.warning("⚠️  Cookie refresh cycle failed - will retry on next interval")
                
        except KeyboardInterrupt:
            logger.info("\n🛑 Shutting down (Ctrl+C received)...")
            break
        except Exception as e:
            logger.error(f"✗ Unexpected error in main loop: {str(e)}")
            logger.info("Waiting 1 minute before retrying...")
            time.sleep(60)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        logger.critical(f"Fatal error: {str(e)}")
        sys.exit(1)

