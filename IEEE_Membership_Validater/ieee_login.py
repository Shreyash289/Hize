#!/usr/bin/env python3
"""
IEEE Login Script - Automated cookie extraction using Playwright

This script logs into IEEE.org and extracts the PA.Global_Websession cookie
for use with the membership validator.
"""

from playwright.sync_api import sync_playwright
import json
import time
import sys
import os

IEEE_LOGIN_URL = "https://www.ieee.org/profile/public/createwebaccount/showSignIn.html"
COOKIE_FILE = "ieee_cookie.txt"

def login_and_get_cookie(username: str, password: str):
    """
    Login to IEEE.org and extract PA.Global_Websession cookie.
    
    Args:
        username: IEEE account email
        password: IEEE account password
        
    Returns:
        Cookie value string
        
    Raises:
        Exception: If login fails or cookie not found
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        page = context.new_page()

        try:
            print("Navigating to IEEE login page...")
            page.goto(IEEE_LOGIN_URL, timeout=60000, wait_until="networkidle")
            
            # Wait a bit for any redirects
            time.sleep(2)
            
            # Check if we're already logged in or redirected
            current_url = page.url
            print(f"Current URL: {current_url}")
            
            # If redirected to OAuth, follow the flow
            if "authorization.oauth2" in current_url or "services10.ieee.org" in current_url:
                print("Detected OAuth flow, waiting for login page...")
                # Wait for the actual login form to appear
                page.wait_for_load_state("networkidle", timeout=30000)
                time.sleep(3)

            # Wait for login form (try multiple selectors)
            print("Waiting for login form...")
            email_found = False
            email_selectors = [
                "input[type='email']",
                "input[name='email']",
                "input[id*='email']",
                "input[type='text'][name*='email']",
                "input[type='text'][name*='username']",
                "input[name='username']",
                "#username",
                "#email"
            ]
            
            for selector in email_selectors:
                try:
                    page.wait_for_selector(selector, timeout=10000)
                    page.fill(selector, username)
                    email_found = True
                    print(f"✓ Found email field with selector: {selector}")
                    break
                except:
                    continue
            
            if not email_found:
                # Try to find any text input and fill it
                try:
                    first_input = page.locator("input[type='text'], input[type='email']").first
                    if first_input.count() > 0:
                        first_input.fill(username)
                        email_found = True
                        print("✓ Found email field (fallback)")
                except:
                    pass
            
            if not email_found:
                raise Exception("Could not find email input field")

            # Find and fill password field
            password_selectors = [
                "input[type='password']",
                "input[name='password']",
                "input[id*='password']",
                "#password"
            ]
            
            password_filled = False
            for selector in password_selectors:
                try:
                    if page.locator(selector).count() > 0:
                        page.fill(selector, password)
                        password_filled = True
                        print(f"✓ Found password field with selector: {selector}")
                        break
                except:
                    continue
            
            if not password_filled:
                raise Exception("Could not find password input field")

            # Find and click submit button
            submit_selectors = [
                "button[type='submit']",
                "input[type='submit']",
                "button:has-text('Sign In')",
                "button:has-text('Login')",
                "button:has-text('Sign in')",
                "form button[type='submit']",
                "button.btn-primary",
                "input[value*='Sign']"
            ]
            
            submitted = False
            for selector in submit_selectors:
                try:
                    if page.locator(selector).count() > 0:
                        page.click(selector)
                        submitted = True
                        print(f"✓ Clicked submit with selector: {selector}")
                        break
                except:
                    continue
            
            if not submitted:
                # Try pressing Enter as fallback
                print("Trying Enter key as fallback...")
                page.keyboard.press("Enter")

            print("Waiting for login to complete...")
            # Wait for successful login (check for redirect or profile elements)
            page.wait_for_load_state("networkidle", timeout=60000)
            time.sleep(5)  # Additional wait for cookie to be set

            # Check for CAPTCHA or error messages
            page_content = page.content()
            if "captcha" in page_content.lower() or "robot" in page_content.lower():
                raise Exception("CAPTCHA detected - manual intervention required")
            
            if "error" in page_content.lower() and "invalid" in page_content.lower():
                raise Exception("Login failed - invalid credentials")

            # Extract cookies
            cookies = context.cookies()
            browser.close()

            # Find PA.Global_Websession cookie
            for c in cookies:
                if c["name"] == "PA.Global_Websession":
                    print("✓ Cookie extracted successfully")
                    return c["value"]

            raise Exception("PA.Global_Websession cookie not found after login")

        except Exception as e:
            browser.close()
            raise Exception(f"Login failed: {str(e)}")


def save_cookie(cookie_value: str, filename: str = COOKIE_FILE):
    """Save cookie to file."""
    with open(filename, "w") as f:
        f.write(cookie_value.strip())
    print(f"✓ Cookie saved to {filename}")


def main():
    """Main entry point."""
    # Get credentials from environment or prompt
    username = os.getenv("IEEE_USERNAME")
    password = os.getenv("IEEE_PASSWORD")
    
    if not username:
        print("IEEE_USERNAME environment variable not set.")
        username = input("Enter IEEE email: ").strip()
    
    if not password:
        print("IEEE_PASSWORD environment variable not set.")
        import getpass
        password = getpass.getpass("Enter IEEE password: ").strip()
    
    if not username or not password:
        print("Error: Username and password are required.")
        sys.exit(1)
    
    try:
        cookie = login_and_get_cookie(username, password)
        save_cookie(cookie)
        print("Cookie refresh completed successfully!")
        return 0
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    sys.exit(main())

