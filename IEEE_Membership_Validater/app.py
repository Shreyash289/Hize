#!/usr/bin/env python3
"""
IEEE Membership Validator Web Application

A Flask web interface for bulk validating IEEE memberships.
"""

from flask import Flask, render_template, request, jsonify, send_file
from ieee_validator import IEEEMembershipValidator
import pandas as pd
import io
import time
from typing import List, Dict

app = Flask(__name__)


@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')


@app.route('/validate', methods=['POST'])
def validate():
    """Validate IEEE membership numbers."""
    try:
        # Get form data
        cookie = request.form.get('cookie', '').strip()
        membership_ids_text = request.form.get('membership_ids', '').strip()
        
        # Validate inputs
        if not cookie:
            return jsonify({'error': 'Authentication cookie is required'}), 400
        
        if not membership_ids_text:
            return jsonify({'error': 'Please provide at least one membership ID'}), 400
        
        # Parse membership IDs (one per line, remove empty lines)
        membership_ids = [
            line.strip() 
            for line in membership_ids_text.split('\n') 
            if line.strip()
        ]
        
        if not membership_ids:
            return jsonify({'error': 'No valid membership IDs found'}), 400
        
        # Initialize validator
        validator = IEEEMembershipValidator(cookie)
        
        # Validate each member
        results = []
        total = len(membership_ids)
        
        for idx, member_id in enumerate(membership_ids):
            result = validator.validate_member(member_id)
            results.append(result)
            
            # Add delay between requests (except for the last one)
            if idx < total - 1:
                time.sleep(validator.delay)
        
        # Convert to DataFrame for Excel export
        df = pd.DataFrame(results)
        
        # Create Excel file in memory
        output = io.BytesIO()
        df.to_excel(output, index=False, engine='openpyxl')
        output.seek(0)
        
        # Return results as JSON and Excel file
        return jsonify({
            'success': True,
            'total': total,
            'results': results,
            'excel_data': output.getvalue().hex()  # Send as hex for JSON
        })
        
    except Exception as e:
        return jsonify({'error': f'Validation error: {str(e)}'}), 500


@app.route('/download', methods=['POST'])
def download():
    """Download results as Excel file."""
    try:
        # Get results from request
        results = request.json.get('results', [])
        
        if not results:
            return jsonify({'error': 'No results to download'}), 400
        
        # Create DataFrame
        df = pd.DataFrame(results)
        
        # Create Excel file in memory
        output = io.BytesIO()
        df.to_excel(output, index=False, engine='openpyxl')
        output.seek(0)
        
        # Return as downloadable file
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name='ieee_validation_results.xlsx'
        )
        
    except Exception as e:
        return jsonify({'error': f'Download error: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

