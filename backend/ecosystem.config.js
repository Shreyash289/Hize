/**
 * PM2 Ecosystem Configuration for Backend API
 * Usage: pm2 start ecosystem.config.js
 */

module.exports = {
  apps: [
    {
      name: 'ieee-validator-api',
      script: 'server.js',
      cwd: '/opt/ieee-validator/backend',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        REDIS_URL: 'redis://localhost:6379'
      },
      error_file: '/var/log/ieee-validator/api-error.log',
      out_file: '/var/log/ieee-validator/api-out.log',
      log_file: '/var/log/ieee-validator/api-combined.log',
      time: true,
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};

