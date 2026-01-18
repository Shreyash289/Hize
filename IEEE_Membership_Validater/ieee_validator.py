#!/usr/bin/env python3
"""
IEEE Membership Bulk Validator

This script reads IEEE member numbers from an Excel file, validates them
against the IEEE membership validator service, and writes results to an output file.
"""

import time
import requests
from bs4 import BeautifulSoup
import pandas as pd
from typing import Dict, Optional
import sys
import os


class IEEEMembershipValidator:
    """Handles bulk validation of IEEE memberships."""
    
    def __init__(self, cookie: str):
        """
        Initialize the validator with authentication cookie.
        
        Args:
            cookie: PA.Global_Websession cookie value
        """
        self.base_url = "https://services24.ieee.org/membership-validator.html"
        self.session = requests.Session()
        
        # Set up session headers
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://services24.ieee.org/membership-validator.html',
            'Origin': 'https://services24.ieee.org',
        })
        
        # Set authentication cookie
        self.session.cookies.set('PA.Global_Websession', cookie, domain='services24.ieee.org')
        
        # Delay between requests (seconds)
        self.delay = 0.7
    
    def _check_session_expiry(self, soup: BeautifulSoup) -> bool:
        """
        Check if session has expired by looking for 'Membership validation status' section.
        
        Args:
            soup: BeautifulSoup object of the HTML response
            
        Returns:
            True if session expired (status section missing), False otherwise
        """
        # Look for "Membership validation status" text in the HTML
        status_section = soup.find(string=lambda text: text and 'Membership validation status' in text)
        return status_section is None
    
    def validate_member(self, member_number: str) -> Dict[str, Optional[str]]:
        """
        Validate a single IEEE member number.
        
        Args:
            member_number: IEEE member number (8-9 characters) or email address
            
        Returns:
            Dictionary containing validation results
        """
        # Prepare form data
        form_data = {
            'customerId': str(member_number).strip()
        }
        
        try:
            # Send POST request
            response = self.session.post(
                self.base_url,
                data=form_data,
                timeout=30
            )
            response.raise_for_status()
            
            # Parse HTML response
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Check for session expiry or authentication failure
            if self._check_session_expiry(soup):
                error_msg = 'Session expired: Membership validation status section not found'
                # Check for 401/403 indicators
                if response.status_code == 401 or 'unauthorized' in response.text.lower():
                    error_msg = 'Authentication failed: Cookie expired or invalid (401)'
                elif 'sign in' in response.text.lower() or 'login' in response.text.lower():
                    error_msg = 'Session expired: Please refresh cookie'
                return {
                    'ieee_number': member_number,
                    'name_initials': None,
                    'membership_status': None,
                    'member_grade': None,
                    'standards_association_member': None,
                    'society_memberships': None,
                    'error': error_msg
                }
            
            # Extract fields using robust selectors
            result = {
                'ieee_number': member_number,
                'name_initials': self._extract_name_initials(soup),
                'membership_status': self._extract_membership_status(soup),
                'member_grade': self._extract_member_grade(soup),
                'standards_association_member': self._extract_standards_association(soup),
                'society_memberships': self._extract_society_memberships(soup),
                'error': None
            }
            
            return result
            
        except requests.exceptions.RequestException as e:
            return {
                'ieee_number': member_number,
                'name_initials': None,
                'membership_status': None,
                'member_grade': None,
                'standards_association_member': None,
                'society_memberships': None,
                'error': f'Request error: {str(e)}'
            }
        except Exception as e:
            return {
                'ieee_number': member_number,
                'name_initials': None,
                'membership_status': None,
                'member_grade': None,
                'standards_association_member': None,
                'society_memberships': None,
                'error': f'Parsing error: {str(e)}'
            }
    
    def _extract_field_value(self, soup: BeautifulSoup, label_text: str) -> Optional[str]:
        """
        Generic method to extract a field value by its label text.
        
        Args:
            soup: BeautifulSoup object
            label_text: The label text to search for (e.g., "First and last name initials")
            
        Returns:
            The extracted value or None
        """
        # Find the label text
        label_element = soup.find(string=lambda text: text and label_text in text)
        if not label_element:
            return None
        
        # Get parent element (usually <strong>)
        parent = label_element.find_parent()
        if not parent:
            return None
        
        # Check for sibling <span> elements (common structure)
        # Values are often in sibling spans after the label
        next_sibling = parent.find_next_sibling()
        if next_sibling:
            # If it's a span, get its text
            if next_sibling.name == 'span':
                value = next_sibling.get_text(strip=True)
                # For name initials, there might be multiple spans (e.g., "K" and "G")
                if label_text == 'First and last name initials':
                    spans = [next_sibling]
                    # Collect all consecutive span siblings
                    current = next_sibling.find_next_sibling()
                    while current and current.name == 'span':
                        spans.append(current)
                        current = current.find_next_sibling()
                    # Combine spans with periods and spaces
                    if len(spans) > 1:
                        values = [s.get_text(strip=True) for s in spans]
                        return '. '.join(values) + '.' if values else None
                if value:
                    return value
            else:
                # If it's another element, get its text
                value = next_sibling.get_text(strip=True)
                if value and value not in label_text:
                    return value
        
        # Try to extract value from the same element (after colon)
        full_text = parent.get_text(separator=' ', strip=True)
        if ':' in full_text:
            parts = full_text.split(':', 1)
            if len(parts) > 1:
                value = parts[1].strip()
                if value:
                    return value
        
        # Try next element in parent's siblings
        for sibling in parent.find_next_siblings():
            text = sibling.get_text(strip=True)
            if text and text not in label_text:
                return text
        
        return None
    
    def _extract_name_initials(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract first and last name initials from the response."""
        return self._extract_field_value(soup, 'First and last name initials')
    
    def _extract_membership_status(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract membership status (e.g., Active, Inactive)."""
        return self._extract_field_value(soup, 'Membership status')
    
    def _extract_member_grade(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract IEEE member grade (e.g., Student Member, Member)."""
        return self._extract_field_value(soup, 'IEEE member grade')
    
    def _extract_standards_association(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract Standards Association Member status (Yes/No)."""
        return self._extract_field_value(soup, 'Standards Association Member')
    
    def _extract_society_memberships(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract society memberships as comma-separated string."""
        # Look for "Society membership" section
        label_element = soup.find(string=lambda text: text and 'Society membership' in text)
        if not label_element:
            return None
        
        parent = label_element.find_parent()
        if not parent:
            return None
        
        societies = []
        
        # First, try to find a list (ul/ol) after the label
        list_elem = parent.find_next(['ul', 'ol'])
        if list_elem:
            for li in list_elem.find_all('li'):
                text = li.get_text(strip=True)
                if text and 'IEEE' in text:
                    societies.append(text)
            if societies:
                return ', '.join(societies)
                
        # If no list found, look for siblings or next elements
        # Check parent's next siblings
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
        
        # Also check elements that come after the parent in the document
        for elem in parent.find_all_next(['li', 'div', 'span', 'p']):
            text = elem.get_text(strip=True)
            if text and 'IEEE' in text and 'Society' in text and 'Membership' in text:
                if text not in societies:
                    societies.append(text)
        
        if societies:
            return ', '.join(societies)
        
        return None
    
    def validate_bulk(self, input_file: str, output_file: str):
        """
        Validate multiple members from an Excel file.
        
        Args:
            input_file: Path to input Excel file (must have 'ieee_number' column)
            output_file: Path to output Excel file
        """
        try:
            # Read input Excel file
            print(f"Reading member numbers from {input_file}...")
            df = pd.read_excel(input_file)
            
            # Validate column exists
            if 'ieee_number' not in df.columns:
                raise ValueError(f"Column 'ieee_number' not found in {input_file}. Available columns: {list(df.columns)}")
            
            # Remove rows with empty member numbers
            df = df.dropna(subset=['ieee_number'])
            total = len(df)
            
            print(f"Found {total} member numbers to validate.")
            print(f"Starting validation (delay: {self.delay}s between requests)...\n")
            
            # Validate each member
            results = []
            session_expired = False
            for idx, row in df.iterrows():
                member_number = str(row['ieee_number'])
                print(f"[{idx + 1}/{total}] Validating: {member_number}", end=' ... ', flush=True)
                
                result = self.validate_member(member_number)
                results.append(result)
                
                if result['error']:
                    print(f"ERROR: {result['error']}")
                    # Check if it's a session expiry error
                    if 'Session expired' in result['error']:
                        session_expired = True
                        print(f"\n⚠️  Session expired! Stopping validation.")
                        print(f"Processed {idx + 1} out of {total} members before session expired.")
                        break
                else:
                    status = result['membership_status'] or 'Unknown'
                    print(f"{status}")
                
                # Delay between requests
                if idx < total - 1:  # Don't delay after last request
                    time.sleep(self.delay)
            
            # Create results DataFrame
            results_df = pd.DataFrame(results)
            
            # Write to Excel
            print(f"\nWriting results to {output_file}...")
            results_df.to_excel(output_file, index=False)
            print(f"Validation complete! Results saved to {output_file}")
            
            # Print summary
            successful = len([r for r in results if not r['error']])
            failed = len([r for r in results if r['error']])
            print(f"\nSummary: {successful} successful, {failed} failed")
            
        except FileNotFoundError:
            print(f"Error: Input file '{input_file}' not found.")
            sys.exit(1)
        except Exception as e:
            print(f"Error: {str(e)}")
            sys.exit(1)


def main():
    """Main entry point for the script."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Bulk validate IEEE memberships',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Example usage:
  python ieee_validator.py --cookie "your_cookie_value_here"
  
  Or set the cookie interactively:
  python ieee_validator.py
        """
    )
    
    parser.add_argument(
        '--cookie',
        type=str,
        help='PA.Global_Websession cookie value'
    )
    
    parser.add_argument(
        '--input',
        type=str,
        default='ieee_numbers.xlsx',
        help='Input Excel file path (default: ieee_numbers.xlsx)'
    )
    
    parser.add_argument(
        '--output',
        type=str,
        default='validated_output.xlsx',
        help='Output Excel file path (default: validated_output.xlsx)'
    )
    
    args = parser.parse_args()
    
    # Get cookie from argument, file, or prompt user
    cookie = None
    
    if args.cookie:
        cookie = args.cookie
    else:
        # Try to read from cookie file
        cookie_file = "ieee_cookie.txt"
        if os.path.exists(cookie_file):
            try:
                with open(cookie_file, 'r') as f:
                    cookie = f.read().strip()
                print(f"✓ Using cookie from {cookie_file}")
            except Exception as e:
                print(f"Warning: Could not read cookie file: {e}")
        
        # If still no cookie, prompt user
        if not cookie:
            print("Please paste your PA.Global_Websession cookie value:")
            cookie = input().strip()
        if not cookie:
            print("Error: Cookie is required.")
            sys.exit(1)
    
    # Initialize validator and run
    validator = IEEEMembershipValidator(cookie)
    validator.validate_bulk(args.input, args.output)


if __name__ == '__main__':
    main()

