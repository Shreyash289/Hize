#!/usr/bin/env python3
"""
Cookie Refresher - Automatically refreshes IEEE cookie and runs validator

This script runs in a loop, refreshing the cookie every X hours and optionally
running the validator script.
"""

import subprocess
import time
import sys
import os
from datetime import datetime

REFRESH_INTERVAL_HOURS = 6  # Refresh cookie every 6 hours
RUN_VALIDATOR_AFTER_REFRESH = False  # Set to True to auto-run validator


def refresh_cookie():
    """Refresh the IEEE cookie using the login script."""
    print(f"[{datetime.now()}] Refreshing IEEE cookie...")
    try:
        result = subprocess.run(
            [sys.executable, "ieee_login.py"],
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        if result.returncode == 0:
            print(f"[{datetime.now()}] ✓ Cookie refreshed successfully")
            return True
        else:
            print(f"[{datetime.now()}] ✗ Cookie refresh failed:")
            print(result.stderr)
            return False
    except subprocess.TimeoutExpired:
        print(f"[{datetime.now()}] ✗ Cookie refresh timed out")
        return False
    except Exception as e:
        print(f"[{datetime.now()}] ✗ Error refreshing cookie: {str(e)}")
        return False


def run_validator():
    """Run the membership validator script."""
    print(f"[{datetime.now()}] Running validator...")
    try:
        result = subprocess.run(
            [sys.executable, "ieee_validator.py"],
            timeout=3600  # 1 hour timeout
        )
        return result.returncode == 0
    except Exception as e:
        print(f"[{datetime.now()}] ✗ Error running validator: {str(e)}")
        return False


def main():
    """Main loop."""
    print("=" * 60)
    print("IEEE Cookie Refresher")
    print(f"Refresh interval: {REFRESH_INTERVAL_HOURS} hours")
    print(f"Auto-run validator: {RUN_VALIDATOR_AFTER_REFRESH}")
    print("=" * 60)
    
    # Initial refresh
    refresh_cookie()
    
    if RUN_VALIDATOR_AFTER_REFRESH:
        run_validator()
    
    # Loop forever
    while True:
        try:
            sleep_seconds = REFRESH_INTERVAL_HOURS * 60 * 60
            print(f"\n[{datetime.now()}] Sleeping for {REFRESH_INTERVAL_HOURS} hours...")
            time.sleep(sleep_seconds)
            
            if refresh_cookie():
                if RUN_VALIDATOR_AFTER_REFRESH:
                    run_validator()
            else:
                print(f"[{datetime.now()}] ⚠ Cookie refresh failed, will retry in {REFRESH_INTERVAL_HOURS} hours")
                
        except KeyboardInterrupt:
            print(f"\n[{datetime.now()}] Shutting down...")
            break
        except Exception as e:
            print(f"[{datetime.now()}] ✗ Unexpected error: {str(e)}")
            time.sleep(60)  # Wait 1 minute before retrying


if __name__ == "__main__":
    main()

