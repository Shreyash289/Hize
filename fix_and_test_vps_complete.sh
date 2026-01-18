#!/bin/bash
# Complete script to fix VPS API and test - Run ON THE VPS

echo "=========================================="
echo "Fixing and Testing VPS API Server"
echo "=========================================="
echo ""

# Step 1: Check current status
echo "1. Checking service status..."
sudo systemctl status ieee-api-server --no-pager -l | head -20

echo ""
echo "2. Checking for syntax errors..."
cd /opt/ieee-validator
python3 -m py_compile api_server.py 2>&1
if [ $? -ne 0 ]; then
    echo "✗ Syntax error found! Fix the file first."
    exit 1
fi
echo "✓ No syntax errors"

echo ""
echo "3. Checking if validation endpoint exists..."
if grep -q "@app.route('/api/validate-member'" api_server.py; then
    echo "✓ Validation endpoint found"
else
    echo "✗ Validation endpoint missing - adding it..."
    
    # Add endpoint before the if __name__ == '__main__': line
    sed -i "/if __name__ == '__main__':/i\\
@app.route('/api/validate-member', methods=['POST'])\\
def validate_member():\\
    data = request.get_json()\\
    if not data or 'memberId' not in data:\\
        return jsonify({'error': 'memberId is required'}), 400\\
    member_id = data['memberId'].strip()\\
    if not member_id:\\
        return jsonify({'error': 'memberId cannot be empty'}), 400\\
    cookie = read_cookie()\\
    if not cookie:\\
        return jsonify({'error': 'Cookie not available'}), 503\\
    try:\\
        from ieee_validator import IEEEMembershipValidator\\
        validator = IEEEMembershipValidator(cookie)\\
        result = validator.validate_member(member_id)\\
        if result['error']:\\
            return jsonify({\\
                'isValid': False,\\
                'error': result['error'],\\
                'membershipStatus': result['membership_status'] or 'Unknown',\\
                'memberId': member_id\\
            }), 200 if 'Session expired' not in result['error'] else 503\\
        return jsonify({\\
            'isValid': result['membership_status'] and 'Active' in result['membership_status'],\\
            'membershipStatus': result['membership_status'] or 'Unknown',\\
            'nameInitials': result['name_initials'],\\
            'memberGrade': result['member_grade'],\\
            'memberId': member_id\\
        })\\
    except Exception as e:\\
        logger.error(f\"Validation error: {e}\")\\
        return jsonify({'error': f'Validation failed: {str(e)}'}), 500\\
" api_server.py
    
    echo "✓ Endpoint added"
fi

echo ""
echo "4. Restarting service..."
sudo systemctl daemon-reload
sudo systemctl restart ieee-api-server
sleep 3

echo ""
echo "5. Checking status after restart..."
sudo systemctl status ieee-api-server --no-pager -l | head -20

echo ""
echo "6. Testing endpoints..."
echo "Health:"
curl -s http://localhost:5001/health | head -3

echo ""
echo "Validate member:"
curl -s -X POST http://localhost:5001/api/validate-member \
  -H "Content-Type: application/json" \
  -d '{"memberId":"99634594"}' | head -10

echo ""
echo "=========================================="
echo "Done!"
echo "=========================================="

