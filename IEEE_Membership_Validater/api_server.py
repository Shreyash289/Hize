#!/usr/bin/env python3
"""
IEEE Cookie API Server - Serves fresh cookie to Next.js app

Run this on your VPS to provide cookie API endpoint.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import logging
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js app

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

COOKIE_FILE = os.path.join(os.path.dirname(__file__), 'ieee_cookie.txt')
API_KEY = os.getenv('API_KEY', '')  # Optional API key for security


def read_cookie():
    """Read cookie from file."""
    try:
        if os.path.exists(COOKIE_FILE):
            with open(COOKIE_FILE, 'r') as f:
                cookie = f.read().strip()
            if cookie and len(cookie) > 50:  # Basic validation
                return cookie
        return None
    except Exception as e:
        logger.error(f"Error reading cookie: {e}")
        return None


def check_auth():
    """Check API key if set."""
    if not API_KEY:
        return True  # No auth required if API_KEY not set
    
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return False
    
    # Support both "Bearer token" and "token" formats
    token = auth_header.replace('Bearer ', '').strip()
    return token == API_KEY


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    cookie_available = read_cookie() is not None
    return jsonify({
        'status': 'ok',
        'cookie_available': cookie_available,
        'timestamp': datetime.utcnow().isoformat()
    })


@app.route('/api/cookie', methods=['GET'])
def get_cookie():
    """Get the current IEEE cookie."""
    if not check_auth():
        return jsonify({'error': 'Unauthorized'}), 401
    
    cookie = read_cookie()
    
    if not cookie:
        logger.warning("Cookie not available - refresh may be needed")
        return jsonify({
            'error': 'Cookie not available',
            'message': 'Cookie refresh service may still be initializing'
        }), 503
    
    logger.info("Cookie requested and served successfully")
    return jsonify({
        'cookie': cookie,
        'timestamp': datetime.utcnow().isoformat()
    })


@app.route('/api/validate-member', methods=['POST'])
def validate_member():
    """Validate an IEEE member number."""
    # Don't require auth for validation (public endpoint)
    # Auth is optional if API_KEY is set
    
    data = request.get_json()
    if not data or 'memberId' not in data:
        return jsonify({'error': 'memberId is required'}), 400
    
    member_id = data['memberId'].strip()
    if not member_id:
        return jsonify({'error': 'memberId cannot be empty'}), 400
    
    cookie = read_cookie()
    if not cookie:
        return jsonify({
            'error': 'Cookie not available',
            'message': 'Cookie refresh service may still be initializing'
        }), 503
    
    try:
        # Import the validator class
        import sys
        import os
        validator_dir = os.path.dirname(os.path.abspath(__file__))
        sys.path.insert(0, validator_dir)
        
        from ieee_validator import IEEEMembershipValidator
        
        validator = IEEEMembershipValidator(cookie)
        result = validator.validate_member(member_id)
        
        # Convert to our API format
        if result['error']:
            return jsonify({
                'isValid': False,
                'error': result['error'],
                'membershipStatus': result['membership_status'] or 'Unknown',
                'memberId': member_id
            }), 200 if 'Session expired' not in result['error'] else 503
        
        return jsonify({
            'isValid': result['membership_status'] and 'Active' in result['membership_status'],
            'membershipStatus': result['membership_status'] or 'Unknown',
            'nameInitials': result['name_initials'],
            'memberGrade': result['member_grade'],
            'standardsAssociationMember': result['standards_association_member'],
            'societyMemberships': result['society_memberships'],
            'memberId': member_id
        })
        
    except ImportError as e:
        logger.error(f"Failed to import validator: {e}")
        return jsonify({'error': 'Validation service configuration error'}), 500
    except Exception as e:
        logger.error(f"Validation error: {e}")
        return jsonify({'error': f'Validation failed: {str(e)}'}), 500


@app.route('/api/cookie/status', methods=['GET'])
def cookie_status():
    """Get cookie status information."""
    # Status endpoint doesn't require auth (useful for monitoring)
    
    cookie = read_cookie()
    file_exists = os.path.exists(COOKIE_FILE)
    
    stats = {
        'available': cookie is not None,
        'file_exists': file_exists,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    if file_exists:
        stats['file_size'] = os.path.getsize(COOKIE_FILE)
        stats['file_modified'] = datetime.fromtimestamp(
            os.path.getmtime(COOKIE_FILE)
        ).isoformat()
    
    return jsonify(stats)


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting IEEE Cookie API Server on port {port}")
    logger.info(f"Cookie file: {COOKIE_FILE}")
    logger.info(f"API Key required: {bool(API_KEY)}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)

