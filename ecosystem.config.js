module.exports = {
  apps: [
    {
      name: 'souq-el-hakl',
      script: 'npx',
      args: 'next start -H 0.0.0.0 -p 3010',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
        PORT: '3010',
      },
      autorestart: true,
      restart_delay: 2000,
      max_restarts: 10,
      watch: false,
      instances: 1,
      exec_mode: 'fork',
    },
  ],
};
