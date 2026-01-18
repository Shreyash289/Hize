# Deploy Validation Endpoint to VPS

## Quick Deploy (SSH to VPS)

You're already SSH'd in! Just run these commands:

### Method 1: Copy the file content manually

```bash
cp /opt/ieee-validator/api_server.py /opt/ieee-validator/api_server.py.backup

# The updated file is at: IEEE_Membership_Validater/api_server.py
# You can either:
# A) Copy the entire file from your local machine via scp (needs password)
# B) Edit manually on VPS and add the endpoint
```

### Method 2: Quick fix - Add endpoint directly on VPS

```bash
# On your VPS, add this to the end of api_server.py (before the if __name__ == '__main__': line)
sudo nano /opt/ieee-validator/api_server.py
```

Then add this code before the `if __name__ == '__main__':` line:

```python
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
        
    except Exception as e:
        logger.error(f"Validation error: {e}")
        return jsonify({'error': f'Validation failed: {str(e)}'}), 500
```

Save: `Ctrl+X`, then `Y`, then `Enter`

Then restart:
```bash
sudo systemctl restart ieee-api-server
sleep 2
curl -X POST http://localhost:5001/api/validate-member -H "Content-Type: application/json" -d '{"memberId":"99634594"}'
```

## Or: Upload via rsync/scp (from local machine)

Since you have the password, run this from local terminal:

```bash
# This will prompt for password
scp "/Users/mrstark/Desktop/Code PlayGround/IEEE/Hize/IEEE_Membership_Validater/api_server.py" root@65.20.84.46:/opt/ieee-validator/api_server.py

# Then SSH and restart
ssh root@65.20.84.46 "sudo systemctl restart ieee-api-server"
```

