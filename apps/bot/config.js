export const config = {
	//[RU] Стим IDs получающих преимущество при !roll
	rollAdvantageSteamIds: [
		'76561198149706541', // BulletProoff
		'76561198141630102', // Cortez
		'76561198374406781', // Генерал
		'76561198215922709', // giroskoooop
		'76561198009248589', // Филин
	],
	//[RU] Стим IDs теряющих преимущество при !roll
	rollDisadvantageSteamIds: [],
	//[RU] Путь где будет лежать общий список админов для всех серверов (только для Linux)
	admins_path: '/home/squadserver/admins/Admins.cfg',
	//[RU] Путь где будет лежать общий список банов для всех серверов
	bans_path: '/home/squadserver/admins/Bans.cfg',
	//[RU] Скрипт запуска SteamCMD
	steam_sh: '/home/squadserver/steamcmd/steamcmd.sh',
	//[RU] Отключает комманды в чате
	disabled_commands: [],
	//[RU] Текст который время от времени показывается на сервере
	broadcast: 'Доступные команды | !r ник нарушение | !admins | !roll | !vip | !online | !bonus | !stats',
	//[RU] Рекламный текст который время от времени показывается на сервере
	ad: [ 'Вы можете купить вход без очереди для себя (200 руб) или своего клана (1200 руб) в месяц!', 'Наш дискорд: https://discord.gg/prtcl'],
	//[RU] Ссылка на дискорд сервер
	discord: 'https://discord.gg/prtcl',
	//[RU] Сообщения которые будут показаны при старте новой карты
	start_text: [ 'За создание сквада и перекидывание сквадного - предусмотрено наказание!'],
	//[RU] Сообщения которые будут показаны при вводе команды !vip
	vip_text: [ '- Вход без очереди', '- Не кикает за AFK' ],
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
	//[RU] Количество игроков при котором работает skipmap
	skipmap_min: 20,
	//[RU] Записывать убийства/смерти на Seed картах
	seed_stats: false,
	//[RU] Сообщение "Вас убил свой: НИК"
	teamkill_warn: true,
	//[RU] Кикать игроков с найденными такими же никами
	kick_recurring_nicks: false,
	//[RU] Поддержка префиксов VoiceConnect
	player_prefixes: true,
	//[RU] Записывать все администраторские группы даже если у них не выставлен префикс
	player_prefixes_all: true,
	//[RU] Кикать читеров. Важно это не бан, а быстрая реакция чтобы защитить сервер
	cheater_kick:false,
	//[RU] Показывать опыт сквадного при создании сквада
	sl_expirience: false,
	//[RU] Кикать игроков у которых не обнаружен Steam
	kick_nonsteam:true,
	//[RU] Бан IP на 20 мин при высокой частоте коннекта на сервер (кликеры)
	auth_ban:true,
	//[RU] URL Discord вебхука для уведомлений об окончании матча
	discord_webhook: 'https://discord.com/api/webhooks/1459183643003195474/4CcIXiP61J84VgtYyttkN59yV6vyO0l3agzjz7F8uPdHKoI5KEaSY39g-MKmQGErxEUY',
	//[RU] Настройка смены команды
	team_switch: {
		//[RU] Максимальная разница игроков в команде при смене стороны
		difference:2,
		
		//[RU] Задержка вводы команды
		cooldown: 120,
	},
	//[RU] Настройка обновления бота
	bot_update: {
		stop: false,
		start: false,
	},
	//[RU] Подключение серверов
	servers: [
		{
			//[RU] RCON адресс
			ip: '127.0.0.1',
			//[RU] RCON порт
			port:21114, 
			//[RU] RCON пароль
			password:'s8K#dL9QwPz2Xy!',
			//[RU] Индекс сервера для интеграции с панелью
			name:'A',
			//[RU] Папка где лежит сервер
			path: '/home/squadserver/squad_server_a',
			//[RU] Скрипт запуска сервера
			sh: '/home/squadserver/start_a.sh', 
			//[RU] Папка где будет лежать недельная ротация сервера
			rotation_path: '/home/squadserver/admins/rotation/a/', 
			//[RU] Файл ротации
			rotation_file: 'LayerVoting.cfg',
			//[RU] Включает большинство логики, отключение подходит для эвент сервера
			control:true, 
			//[RU] Запускать сервер когда он упал
			auto_up:true,
			//[RU] Выключать туман войны
			disable_fogofwar:false,
			//[RU] Часы когда будет рестарт
			hours:['03','04'],
			//[RU] Максимальное кол-во игроков при котором будет рестарт
			max_restart_players: 5, 
			//[RU] Ставить Seed карты
			auto_seed: true, 
			//[RU] Токен Discord для вывода онлайна
			discord_token: '', 
		},
		{
			//[RU] RCON адресс
			ip: '127.0.0.1',
			//[RU] RCON порт
			port:21144,
			//[RU] RCON пароль
			password:'s8K#dL9QwPz2Xy!',
			//[RU] Индекс сервера для интеграции с панелью
			name:'B',
			//[RU] Папка где лежит сервер
			path: '/home/squadserver/squad_server_b',
			//[RU] Скрипт запуска сервера
			sh: '/home/squadserver/start_b.sh',
			//[RU] Папка где будет лежать недельная ротация сервера
			rotation_path: '/home/squadserver/admins/rotation/b/',
			//[RU] Файл ротации
			rotation_file: 'LayerVoting.cfg',
			//[RU] Включает большинство логики, отключение подходит для эвент сервера
			control:true,
			//[RU] Запускать сервер когда он упал
			auto_up:true,
			//[RU] Выключать туман войны
			disable_fogofwar:false,
			//[RU] Часы когда будет рестарт
			hours:['03','04'],
			//[RU] Максимальное кол-во игроков при котором будет рестарт
			max_restart_players: 5,
			//[RU] Ставить Seed карты
			auto_seed: true,
			//[RU] Токен Discord для вывода онлайна
			discord_token: '',
		},
		{
			//[RU] RCON адресс
			ip: '127.0.0.1',
			//[RU] RCON порт
			port:21134,
			//[RU] RCON пароль
			password:'s8K#dL9QwPz2Xy!',
			//[RU] Индекс сервера для интеграции с панелью
			name:'C',
			//[RU] Папка где лежит сервер
			path: '/home/squadserver/squad_server_c',
			//[RU] Скрипт запуска сервера
			sh: '/home/squadserver/start_c.sh',
			//[RU] Папка где будет лежать недельная ротация сервера
			rotation_path: '/home/squadserver/admins/rotation/c/',
			//[RU] Файл ротации
			rotation_file: 'LayerVoting.cfg',
			//[RU] Включает большинство логики, отключение подходит для эвент сервера
			control:true,
			//[RU] Запускать сервер когда он упал
			auto_up:true,
			//[RU] Выключать туман войны
			disable_fogofwar:true,
			//[RU] Часы когда будет рестарт
			hours:['06','07'],
			//[RU] Максимальное кол-во игроков при котором будет рестарт
			max_restart_players: 5,
			//[RU] Ставить Seed карты
			auto_seed: false,
			//[RU] Токен Discord для вывода онлайна
			discord_token: '',
		},
		{
			//[RU] RCON адресс
			ip: '127.0.0.1',
			//[RU] RCON порт
			port:21154,
			//[RU] RCON пароль
			password:'s8K#dL9QwPz2Xy!',
			//[RU] Индекс сервера для интеграции с панелью
			name:'D',
			//[RU] Папка где лежит сервер
			path: '/home/squadserver/squad_server_d',
			//[RU] Скрипт запуска сервера
			sh: '/home/squadserver/start_d.sh',
			//[RU] Папка где будет лежать недельная ротация сервера
			rotation_path: '/home/squadserver/admins/rotation/d/',
			//[RU] Файл ротации
			rotation_file: 'LayerVoting.cfg',
			//[RU] Включает большинство логики, отключение подходит для эвент сервера
			control:true,
			//[RU] Запускать сервер когда он упал
			auto_up:true,
			//[RU] Выключать туман войны
			disable_fogofwar:false,
			//[RU] Часы когда будет рестарт
			hours:['03','04'],
			//[RU] Максимальное кол-во игроков при котором будет рестарт
			max_restart_players: 5,
			//[RU] Ставить Seed карты
			auto_seed: true,
			//[RU] Токен Discord для вывода онлайна
			discord_token: '',
		},
		{
			//[RU] RCON адресс
			ip: '127.0.0.1',
			//[RU] RCON порт
			port:21164,
			//[RU] RCON пароль
			password:'s8K#dL9QwPz2Xy!',
			//[RU] Индекс сервера для интеграции с панелью
			name:'E',
			//[RU] Папка где лежит сервер
			path: '/home/squadserver/squad_server_e',
			//[RU] Скрипт запуска сервера
			sh: '/home/squadserver/start_e.sh',
			//[RU] Папка где будет лежать недельная ротация сервера
			rotation_path: '/home/squadserver/admins/rotation/e/',
			//[RU] Файл ротации
			rotation_file: 'LayerVoting.cfg',
			//[RU] Включает большинство логики, отключение подходит для эвент сервера
			control:false,
			//[RU] Запускать сервер когда он упал
			auto_up:true,
			//[RU] Выключать туман войны
			disable_fogofwar:false,
			//[RU] Часы когда будет рестарт
			hours:['03','04'],
			//[RU] Максимальное кол-во игроков при котором будет рестарт
			max_restart_players: 5,
			//[RU] Ставить Seed карты
			auto_seed: false,
			//[RU] Токен Discord для вывода онлайна
			discord_token: '',
		},
		{
			//[RU] RCON адресс
			ip: '127.0.0.1',
			//[RU] RCON порт
			port:21174,
			//[RU] RCON пароль
			password:'s8K#dL9QwPz2Xy!',
			//[RU] Индекс сервера для интеграции с панелью
			name:'F',
			//[RU] Папка где лежит сервер
			path: '/home/squadserver/squad_server_f',
			//[RU] Скрипт запуска сервера
			sh: '/home/squadserver/start_f.sh',
			//[RU] Папка где будет лежать недельная ротация сервера
			rotation_path: '/home/squadserver/admins/rotation/f/',
			//[RU] Файл ротации
			rotation_file: 'LayerVoting.cfg',
			//[RU] Включает большинство логики, отключение подходит для эвент сервера
			control:false,
			//[RU] Запускать сервер когда он упал
			auto_up:true,
			//[RU] Выключать туман войны
			disable_fogofwar:false,
			//[RU] Часы когда будет рестарт
			hours:['03','04'],
			//[RU] Максимальное кол-во игроков при котором будет рестарт
			max_restart_players: 5,
			//[RU] Ставить Seed карты
			auto_seed: false,
			//[RU] Токен Discord для вывода онлайна
			discord_token: '',
		},
	],
};
