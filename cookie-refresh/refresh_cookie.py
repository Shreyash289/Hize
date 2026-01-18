#!/usr/bin/env python3
"""
IEEE Cookie Auto-Refresh Script
Logs into IEEE SSO and updates .env file with new cookie
"""

import os
import sys
import time
import subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
from dotenv import load_dotenv, set_key
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Get project root (parent of cookie-refresh directory)
PROJECT_ROOT = Path(__file__).parent.parent
BACKEND_ENV = PROJECT_ROOT / 'backend' / '.env'
WORKER_ENV = PROJECT_ROOT / 'worker' / '.env'

IEEE_LOGIN_URL = "https://www.ieee.org/profile/public/createwebaccount/showSignIn.html"


def get_credentials():
    """Get IEEE credentials from environment or prompt."""
    username = os.getenv("IEEE_USERNAME")
    password = os.getenv("IEEE_PASSWORD")
    
    if not username:
        username = input("Enter IEEE email: ").strip()
    
    if not password:
        import getpass
        password = getpass.getpass("Enter IEEE password: ").strip()
    
    if not username or not password:
        logger.error("Error: Username and password are required")
        sys.exit(1)
    
    return username, password


def login_and_extract_cookie(username: str, password: str) -> str:
    """Login to IEEE and extract PA.Global_Websession cookie."""
    logger.info("Navigating to IEEE login page...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        page = context.new_page()
        
        try:
            page.goto(IEEE_LOGIN_URL, timeout=60000, wait_until="networkidle")
            time.sleep(2)
            
            current_url = page.url
            logger.info(f"Current URL: {current_url}")
            
            # Handle OAuth redirect
            if "authorization.oauth2" in current_url or "services10.ieee.org" in current_url:
                logger.info("Detected OAuth flow, waiting for login page...")
                page.wait_for_load_state("networkidle", timeout=30000)
                time.sleep(3)
            
            # Find and fill email field
            logger.info("Filling email field...")
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
            
            email_filled = False
            for selector in email_selectors:
                try:
                    if page.locator(selector).count() > 0:
                        page.fill(selector, username)
                        email_filled = True
                        logger.info(f"✓ Email field filled with selector: {selector}")
                        break
                except:
                    continue
            
            if not email_filled:
                # Fallback: try first text input
                try:
                    first_input = page.locator("input[type='text'], input[type='email']").first
                    if first_input.count() > 0:
                        first_input.fill(username)
                        email_filled = True
                        logger.info("✓ Email field filled (fallback)")
                except:
                    pass
            
            if not email_filled:
                raise Exception("Could not find email input field")
            
            # Find and fill password field
            logger.info("Filling password field...")
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
                        logger.info(f"✓ Password field filled")
                        break
                except:
                    continue
            
            if not password_filled:
                raise Exception("Could not find password input field")
            
            # Submit form
            logger.info("Submitting login form...")
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
                        logger.info(f"✓ Form submitted")
                        break
                except:
                    continue
            
            if not submitted:
                logger.info("Trying Enter key as fallback...")
                page.keyboard.press("Enter")
            
            # Wait for login to complete
            logger.info("Waiting for login to complete...")
            page.wait_for_load_state("networkidle", timeout=60000)
            time.sleep(5)  # Additional wait for cookie to be set
            
            # Check for CAPTCHA or errors
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
                    logger.info("✓ Cookie extracted successfully")
                    return c["value"]
            
            raise Exception("PA.Global_Websession cookie not found after login")
            
        except Exception as e:
            browser.close()
            raise Exception(f"Login failed: {str(e)}")


def update_env_file(env_path: Path, cookie_value: str):
    """Update .env file with new cookie."""
    # Ensure directory exists
    env_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Read existing .env if it exists
    env_vars = {}
    if env_path.exists():
        load_dotenv(env_path)
        # Read all existing vars
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip()
    
    # Update cookie
    env_vars['IEEE_COOKIE'] = f'PA.Global_Websession={cookie_value}'
    
    # Write updated .env
    with open(env_path, 'w') as f:
        f.write("# IEEE Validator Configuration\n")
        f.write("# Auto-generated by cookie refresh script\n\n")
        for key, value in env_vars.items():
            f.write(f"{key}={value}\n")
    
    logger.info(f"✓ Updated {env_path}")


def main():
    """Main entry point."""
    logger.info("=" * 60)
    logger.info("IEEE Cookie Refresh Script")
    logger.info("=" * 60)
    
    try:
        # Get credentials
        username, password = get_credentials()
        
        # Login and extract cookie
        logger.info("\n🔄 Logging into IEEE...")
        cookie_value = login_and_extract_cookie(username, password)
        
        # Update .env files
        logger.info("\n📝 Updating .env files...")
        update_env_file(BACKEND_ENV, cookie_value)
        update_env_file(WORKER_ENV, cookie_value)
        
        logger.info("\n✅ Cookie refresh completed successfully!")
        logger.info(f"Cookie value: {cookie_value[:50]}...")
        logger.info("\n⚠️  Note: Worker processes need to be restarted to use new cookie")
        logger.info("   Or wait for automatic reload (worker checks .env periodically)")
        
        return 0
        
    except Exception as e:
        logger.error(f"❌ Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    sys.exit(main())

