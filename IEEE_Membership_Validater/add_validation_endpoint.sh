#!/bin/bash
# Run this ON THE VPS to add validation endpoint to api_server.py

cat >> /opt/ieee-validator/api_server.py << 'ENDPOINT_EOF'


@app.route('/api/validate-member', methods=['POST'])
def validate_member():
    """Validate an IEEE member number."""
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
        from ieee_validator import IEEEMembershipValidator
        
        validator = IEEEMembershipValidator(cookie)
        result = validator.validate_member(member_id)
        
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
ENDPOINT_EOF

echo "✓ Validation endpoint added to api_server.py"
echo "Now restart the service: sudo systemctl restart ieee-api-server"

