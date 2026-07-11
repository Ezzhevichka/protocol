const { config } = require('./config.js');

const servers = config.servers;
const apps = servers.map((server, index) => ({
    name: `bot-${server.name}`,
    script: "./dist/index.js",
    ignore_watch: ["node_modules", "dist", "logs", "*.log", "*.log.*"],
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '400M',
    error_file: `./logs/bot-${server.name}-error.log`,
    out_file: `./logs/bot-${server.name}-out.log`,
    log_file: `./logs/bot-${server.name}-combined.log`,
    log_date_format: 'HH:mm:ss YYYY-MM-DD',
    env: {
      PORT: 4000 + index + 1,
      SERVER_ID: index + 1,
      BACKEND_INTERNAL_URL: "http://127.0.0.1:4000",
	  BOT_TOKEN: "b92482f1-b907-46d5-b480-35f8a0ea165f",
	  DATABASE_URL: "postgresql://superadmin:superadmin@localhost:5432/protocol_site?schema=public",
      SERVER_INITIAL_NAME: server.name,
      SERVER_PATH: server.path,
      SH_PATH: server.sh,
      ROTATION_PATH: server.rotation_path,
      ROTATION_FILE: server.rotation_file,
      SQUAD_LOG_PATH: `${server.path}/SquadGame/Saved/Logs/SquadGame.log`,
      SERVER_CFG_PATH: `${server.path}/SquadGame/ServerConfig/Server.cfg`,
      BANS_PATH: server.bans_path,
      ADMINS_PATH: server.admins_path,
      STEAM_SH: server.steam_sh,
      RCON_HOST: "195.18.27.195", // "195.18.27.195" for local development | "127.0.0.1" for prod
      RCON_PASSWORD: "s8K#dL9QwPz2Xy!",
      RCON_PORT: server.port,
      LOG_TAIL_MODE: "remote-ssh", // "local-file" | "remote-ssh"
      LOG_FILE_PATH: `${server.path}/SquadGame/Saved/Logs/SquadGame.log`,
      REMOTE_LOG_FILE: `${server.path}/SquadGame/Saved/Logs/SquadGame.log`,
      SQUAD_LOG_PATH: `${server.path}/SquadGame/Saved/Logs/SquadGame.log`,
      SSH_HOST: "195.18.27.195", // only for local development
      SSH_PORT: 22, // only for local development
      SSH_USER: "root", // only for local development
      SSH_PASSWORD: "38Dxl9hQWvZOXNSl9vhlqv6N", // only for local development
      LOG_POLL_INTERVAL_MS: 1000,
    }
}));
  
module.exports = { apps };
