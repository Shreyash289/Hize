# Quick Fix - Add Validation Endpoint to VPS

## Option 1: Quick Add (While SSH'd into VPS)

Since you're already SSH'd in, run this:

```bash
# On VPS, edit the api_server.py file
sudo nano /opt/ieee-validator/api_server.py
```

**Go to the end of the file, BEFORE the `if __name__ == '__main__':` line, add this:**

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
            'memberId': member_id
        })
    except Exception as e:
        logger.error(f"Validation error: {e}")
        return jsonify({'error': f'Validation failed: {str(e)}'}), 500
```

**Save:** `Ctrl+X`, then `Y`, then `Enter`

**Then restart:**
```bash
sudo systemctl restart ieee-api-server
sleep 3
curl -X POST http://localhost:5001/api/validate-member \
  -H "Content-Type: application/json" \
  -d '{"memberId":"99634594"}'
```

## Option 2: One-Liner (Easier)

```bash
# On VPS, add the endpoint using a here-doc
sudo bash -c 'cat >> /opt/ieee-validator/api_server.py << '\''VALIDATION_ENDPOINT_EOF'\''

@app.route('\''/api/validate-member'\'', methods=[\''POST'\''])
def validate_member():
    data = request.get_json()
    if not data or '\''memberId'\'' not in data:
        return jsonify({\''error'\'': '\''memberId is required'\''}), 400
    member_id = data[\''memberId'\''].strip()
    if not member_id:
        return jsonify({\''error'\'': '\''memberId cannot be empty'\''}), 400
    cookie = read_cookie()
    if not cookie:
        return jsonify({\''error'\'': '\''Cookie not available'\''}), 503
    try:
        from ieee_validator import IEEEMembershipValidator
        validator = IEEEMembershipValidator(cookie)
        result = validator.validate_member(member_id)
        if result[\''error'\'']:
            return jsonify({
                '\''isValid'\'': False,
                '\''error'\'': result[\''error'\''],
                '\''membershipStatus'\'': result[\''membership_status'\''] or '\''Unknown'\'',
                '\''memberId'\'': member_id
            }), 200 if '\''Session expired'\'' not in result[\''error'\''] else 503
        return jsonify({
            '\''isValid'\'': result[\''membership_status'\''] and '\''Active'\'' in result[\''membership_status'\''],
            '\''membershipStatus'\'': result[\''membership_status'\''] or '\''Unknown'\'',
            '\''nameInitials'\'': result[\''name_initials'\''],
            '\''memberGrade'\'': result[\''member_grade'\''],
            '\''memberId'\'': member_id
        })
    except Exception as e:
        logger.error(f"\''Validation error: {e}\''")
        return jsonify({\''error'\'': f"\''Validation failed: {str(e)}\''"}), 500
VALIDATION_ENDPOINT_EOF'

# Then restart
sudo systemctl restart ieee-api-server
```

## Test After Update

```bash
# Test from VPS
curl -X POST http://localhost:5001/api/validate-member \
  -H "Content-Type: application/json" \
  -d '{"memberId":"99634594"}'

# Test from local machine
curl -X POST http://65.20.84.46:5001/api/validate-member \
  -H "Content-Type: application/json" \
  -d '{"memberId":"99634594"}'
```

## Then Test in Browser

Once VPS endpoint works:
1. Open http://localhost:3002
2. Registration modal should appear
3. Enter IEEE number
4. Should validate! ✅

