const common = {
  BOT_TOKEN: process.env.BOT_TOKEN || "pizda",
  RCON_HOST: process.env.RCON_HOST || "185.207.214.49",
  RCON_PASSWORD: process.env.RCON_PASSWORD || "s8K#dL9QwPz2Xy!",
  BACKEND_INTERNAL_URL: process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:4000",
  INTERNAL_BOT_TOKEN: process.env.INTERNAL_BOT_TOKEN || "pizda",
  LOG_TAIL_MODE: process.env.LOG_TAIL_MODE || "remote-ssh",
  SSH_HOST: process.env.SSH_HOST || "185.207.214.49",
  SSH_PORT: Number(process.env.SSH_PORT || 22),
  SSH_USERNAME: process.env.SSH_USERNAME || "root",
  SSH_PASSWORD: process.env.SSH_PASSWORD || "9MLwO4y_9d",
};

module.exports = {
  apps: [
    {
      name: "1-invasion",
      script: "./dist/index.js",
      env: {
        ...common,
        SERVER_ID: 1,
        PORT: 4001,
        RCON_PORT: 21114,
        SQUAD_LOG_PATH: "/home/squadserver/squad_server_a/SquadGame/Saved/Logs/SquadGame.log",
      },
    },
    {
      name: "2-supermod-all",
      script: "./dist/index.js",
      env: {
        ...common,
        SERVER_ID: 2,
        PORT: 4002,
        RCON_PORT: 21144,
        SQUAD_LOG_PATH: "/home/squadserver/squad_server_b/SquadGame/Saved/Logs/SquadGame.log",
      },
    },
    {
      name: "3-ru-vs-ua",
      script: "./dist/index.js",
      env: {
        ...common,
        SERVER_ID: 3,
        PORT: 4003,
        RCON_PORT: 21134,
        SQUAD_LOG_PATH: "/home/squadserver/squad_server_c/SquadGame/Saved/Logs/SquadGame.log",
      },
    },
    {
      name: "4-supermod-inv",
      script: "./dist/index.js",
      env: {
        ...common,
        SERVER_ID: 4,
        PORT: 4004,
        RCON_PORT: 21154,
        SQUAD_LOG_PATH: "/home/squadserver/squad_server_d/SquadGame/Saved/Logs/SquadGame.log",
      },
    },
  ],
};
