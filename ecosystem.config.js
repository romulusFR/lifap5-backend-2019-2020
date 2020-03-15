/* eslint-disable camelcase */
/**
 * @file Configuration for the pm2 process manager
 * @author Romuald THION
 */

module.exports = {
  apps: [
    {
      name: "lifap5",
      script: "src/server.js",
      instances: 2,
      autorestart: true,
      watch: true,
      max_memory_restart: "512M",
      exec_mode: "cluster",
      merge_logs: true,
    }
  ]
};
