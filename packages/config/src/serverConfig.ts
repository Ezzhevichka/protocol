export const config = {
  rollAdvantageSteamIds: [
    '76561198149706541', // BulletProoff
    '76561198141630102', // Cortez
    '76561198374406781', // Генерал
    '76561198215922709', // giroskoooop
    '76561198009248589', // Филин
  ],
  rollDisadvantageSteamIds: [],
  admins_path: '/home/squadserver/admins/Admins.cfg',
  bans_path: '/home/squadserver/admins/Bans.cfg',
  steam_sh: '/home/squadserver/steamcmd/steamcmd.sh',
  disabled_commands: [],
  broadcast: 'Доступные команды | !r ник нарушение | !admins | !roll | !vip | !online | !bonus | !stats',
  ad: [
    'Вы можете купить вход без очереди для себя (200 руб) или своего клана (1200 руб) в месяц!',
    'Наш дискорд: https://discord.gg/prtcl',
  ],
  discord: 'https://discord.gg/prtcl',
  //[RU] Сообщения которые будут показаны при старте новой карты
  start_text: [
    'За создание сквада и перекидывание сквадного - предусмотрено наказание!',
  ],
  //[RU] Сообщения которые будут показаны при вводе команды !vip
  vip_text: [
    '- Вход без очереди',
    '- Не кикает за AFK',
  ],
  //[RU] Сообщения которые будут показаны при вводе команды !bonus
  bonus_text: [
    'Копите бонусы и получайте VIP',
    '1 минута = 1 бонус',
    '1 минута при <10 игроков = 3 бонуса',
    '3 минуты в очереди = 1 бонус',
    '12,000 бонусов = VIP на месяц',
    'Получить vip - !vipbonus',
    'Узнать свои бонусы - !online',
  ],
  //[RU] Сообщение которое будет показано при создании сквада
  squad_text: 'За несогласованный перекид сквадного - Бан',
  //[RU] Сообщение которое будет показано при бане ника
  names_text: 'Ник не соответствует правилам сервера',
  //[RU] Проверять нахождение игроков в отрядах
  check_afk: true,
  //[RU] Проверяет кит сквадного
  check_noSL: true,
  //[RU] Проверять наличие 4 и более игроков в экипажном отряде
  check_crewman: true,
  //[RU] Количество игроков с которого начинают работать проверки
  check_players: 40,
  //[RU] Количество игроков при котором ставится сид или обычная карта
  max_seed_players: 30,

  //[EN] Number of players for which skipmap works
  //[RU] Количество игроков при котором работает skipmap
  skipmap_min: 20,

  //[EN] Record kills/deaths on Seed maps
  //[RU] Записывать убийства/смерти на Seed картах
  seed_stats: false,

  //[EN] The message "Your friend killed you: NAME"
  //[RU] Сообщение "Вас убил свой: НИК"
  teamkill_warn: true,

  //[EN] Kick players with the same nicknames found
  //[RU] Кикать игроков с найденными такими же никами
  kick_recurring_nicks: false,

  //[EN] VoiceConnect mod prefix support
  //[RU] Поддержка префиксов VoiceConnect
  player_prefixes: true,

  //[EN] Write all administrative groups even if they do not have a prefix set
  //[RU] Записывать все администраторские группы даже если у них не выставлен префикс
  player_prefixes_all: true,

  //[EN] Kick cheaters. What is important is not a ban, but a quick response to protect the server
  //[RU] Кикать читеров. Важно это не бан, а быстрая реакция чтобы защитить сервер
  cheater_kick: true,

  //[EN] Show the experience of a SL when creating a squad
  //[RU] Показывать опыт сквадного при создании сквада
  sl_expirience: false,

  //[EN] Kick players who don't have Steam detected
  //[RU] Кикать игроков у которых не обнаружен Steam
  kick_nonsteam: true,

  //[EN] IP ban for 20 minutes with a high connection frequency to the server (clickers)
  //[RU] Бан IP на 20 мин при высокой частоте коннекта на сервер (кликеры)
  auth_ban: true,

  //[EN] Discord webhook URL for match end notifications
  //[RU] URL Discord вебхука для уведомлений об окончании матча
  discord_webhook: 'https://discord.com/api/webhooks/1459183643003195474/4CcIXiP61J84VgtYyttkN59yV6vyO0l3agzjz7F8uPdHKoI5KEaSY39g-MKmQGErxEUY',

  //[EN] Setting up a team change
  //[RU] Настройка смены команды
  team_switch: {
    //[EN] Maximum difference between players in a team when changing sides
    //[RU] Максимальная разница игроков в команде при смене стороны
    difference: 2,

    //[EN] Command input cooldown
    //[RU] Задержка вводы команды
    cooldown: 120,
  },

  //[EN] Setting up bot update
  //[RU] Настройка обновления бота
  //Default: "start node app.js" for Win or "screen" for linux
  bot_update: {
    stop: false,
    start: false,
  },
};

module.exports = config;
