#!/bin/bash
# Cron job script to refresh IEEE cookie
# Add to crontab: 0 */6 * * * /opt/ieee-validator/deploy/cron/refresh-cookie.sh

cd /opt/ieee-validator/cookie-refresh
source venv/bin/activate

export IEEE_USERNAME="ha1487@srmist.edu.in"
export IEEE_PASSWORD="Harsh@954"

python3 refresh_cookie.py >> /var/log/ieee-validator/cookie-refresh.log 2>&1

# Restart worker to pick up new cookie (optional - worker auto-reloads)
# systemctl restart ieee-worker.service

