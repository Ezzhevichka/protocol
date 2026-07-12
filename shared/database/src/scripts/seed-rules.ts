import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: resolve(process.cwd(), '.env') });

const RULES: {
	name: string;
	publicName: string;
	warnDescription: string | null;
	duration: string | null;
	description: string | null;
}[] = [
	{
		name: '0 Незнание русского языка',
		publicName: "I'm sorry, but you need to know Russian to play on this server",
		warnDescription: null,
		duration: 'Perm',
		description: null,
	},
	{
		name: '1.1 Никнейм',
		publicName: 'Смените никнейм и перезайдите на сервер',
		warnDescription: null,
		duration: 'Perm по нику',
		description: 'Нечитаемые ники; ники с явно агрессивным политическим посылом.',
	},
	{
		name: '1.2 Реклама',
		publicName: 'Реклама без разрешения администрации п.п. 1.2',
		warnDescription: null,
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '1.2 Реклама (ник)',
		publicName: 'Реклама в нике, смените никнейм п.п. 1.2',
		warnDescription: null,
		duration: 'Perm по нику',
		description: 'Разрешена реклама своих каналов с контентом по игре.',
	},
	{
		name: '1.3 Флуд (текст)',
		publicName: 'Флуд в текстовом чате п.п. 1.3',
		warnDescription: 'Прекратите флуд в чате.',
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '1.3 Флуд (голос)',
		publicName: 'Флуд в голосовом чате п.п. 1.3',
		warnDescription: null,
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '1.4 Soundpad',
		publicName: 'Soundpad п.п. 1.4',
		warnDescription: null,
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '1.5 Токсичность и провокации',
		publicName: 'Токсичное поведение и провокации п.п. 1.5',
		warnDescription: null,
		duration: 'До 100ч/30ч: личн. оскорб. — 1ч, оскорб. родни/угрозы — 2д. От 100/30ч: 1д / 4д.',
		description: 'При повторном нарушении — ×2 срок. Оскорбление модератора в процессе работы — ×2 срок.',
	},
	{
		name: '1.6 Слив информации',
		publicName: 'Слив информации п.п. 1.6',
		warnDescription: null,
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '1.7 Руин',
		publicName: 'Руин п.п. 1.7',
		warnDescription: null,
		duration: 'На усмотрение администрации (агитация — def)',
		description: 'При массовом ТК убедиться, что не случайность. Перед баном проверять твинки и баны на других серверах.',
	},
	{
		name: '1.8 Использование багов',
		publicName: 'Использование багов п.п. 1.8',
		warnDescription: null,
		duration: 'На усмотрение администрации',
		description: null,
	},
	{
		name: '1.8 Стороннее ПО (чит)',
		publicName: 'Использование стороннего ПО п.п. 1.8',
		warnDescription: null,
		duration: 'Perm',
		description: null,
	},
	{
		name: '1.9 Мультиаккаунт',
		publicName: 'Мультиаккаунт для обхода бана п.п. 1.9',
		warnDescription: null,
		duration: 'Perm на второй аккаунт | Удвоение срока на основном',
		description: null,
	},
	{
		name: '2.2.1 Уничтожение техники у мейна',
		publicName: 'Уничтожение техники у мейна п.п. 2.2.1',
		warnDescription: 'Мейнкемп запрещён, отойдите от мейна.',
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '2.2.1 Установка мин у мейна',
		publicName: 'Установка мин на выезде с мейна п.п. 2.2.1',
		warnDescription: 'Мейнкемп запрещён, уберите мины.',
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '2.2.1 Блокирование мейна техникой',
		publicName: 'Блокирование мейна техникой п.п. 2.2.1',
		warnDescription: null,
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '2.2.2 Засады',
		publicName: 'Создание засад у мейна п.п. 2.2.2',
		warnDescription: 'Не рекомендуем проявлять боевую активность в данном месте. Сместитесь ближе к зоне боевой задачи.',
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '2.2.3 Злоупотребление границей мейнкемпа',
		publicName: 'Злоупотребление мейнкемпом п.п. 2.2.3',
		warnDescription: null,
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '3.1 СЛ без микрофона',
		publicName: 'Сквад-лидер без микрофона п.п. 3.1',
		warnDescription: 'Командир обязан иметь микрофон и выходить на связь в CMD чате (клавиша G).',
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: 'Если в скваде нет человека с микрофоном — роспуск отряда.',
	},
	{
		name: '3.2 Передача сквадного без согласия',
		publicName: 'Передача сквадного без согласия п.п. 3.2',
		warnDescription: null,
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '3.4 Соло-закрытый отряд',
		publicName: 'Закрытый соло-пех отряд п.п. 3.4',
		warnDescription: 'Откройте отряд или зайдите в открытый.',
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '4.1 Невыполнение приказов CMD',
		publicName: 'Невыполнение приказов CMD п.п. 4.1',
		warnDescription: 'Игнорирование приказов CMD запрещено.',
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '4.2 Запрещённый приказ CMD',
		publicName: 'Выдача приказа, нарушающего правила п.п. 4.2',
		warnDescription: 'Выдан приказ, противоречащий правилам.',
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '5.1 Превышение кол-ва спецотрядов',
		publicName: 'Превышено количество спецотрядов п.п. 5.1',
		warnDescription: 'Превышено количество специализированных отрядов, расформируйте отряд.',
		duration: 'Первый бан — 1 час / роспуск отряда. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '5.2 Превышение лимита в спецотряде',
		publicName: 'Превышение лимита людей в спецотряде п.п. 5.2',
		warnDescription: 'Превышение лимита людей в спецотряде (максимум 6 человек).',
		duration: 'Первый бан — 1 час / роспуск отряда. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '5.2 Тандем в стройбате',
		publicName: '(Тандему) Тандем в стройбате п.п. 5.2',
		warnDescription: '(Тандему) В отряде стройбата тандему запрещено находиться вне актуала.',
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '6.1 Переклейм техники',
		publicName: 'Переклейм техники без разрешения п.п. 6.1',
		warnDescription: 'Переклейм техники запрещён.',
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: 'Если предупреждение игнорируется — сначала убить игрока, потом банить. Если техника в бою — подождать.',
	},
	{
		name: '6.2 Нарушение приоритета на технику',
		publicName: 'Нарушение приоритета на технику п.п. 6.2',
		warnDescription: 'Верните технику отряду с приоритетом.',
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '6.3 Нарушение правил !roll',
		publicName: 'Нарушение правил !roll п.п. 6.3',
		warnDescription: 'Спор за технику решается за 1 минуту до её появления.',
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '6.4 Игнорирование приоритета на старте',
		publicName: 'Игнорирование приоритета на старте п.п. 6.4',
		warnDescription: 'Верните технику отряду с приоритетом.',
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '6.5 Приоритет пех. отряда',
		publicName: 'Игнорирование приоритета пех. отряда п.п. 6.5',
		warnDescription: null,
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '6.6 Соло-техника',
		publicName: 'Соло-использование техники п.п. 6.6',
		warnDescription: 'Использование тяжёлой техники в соло запрещено.',
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
	{
		name: '6.7 Управление вертолётом без опыта',
		publicName: 'Управление вертолётом без опыта п.п. 6.7',
		warnDescription: null,
		duration: 'Первый бан — 1 час. Последующие — скалирование по def',
		description: null,
	},
];

const main = async () => {
	const { prisma } = await import('../client');

	console.log(`Seeding ${RULES.length} rules...`);

	for (const rule of RULES) {
		await prisma.rule.upsert({
			where: { name: rule.name },
			update: {
				publicName: rule.publicName,
				warnDescription: rule.warnDescription,
				duration: rule.duration,
				description: rule.description,
			},
			create: rule,
		});
	}

	console.log('Done.');
	await prisma.$disconnect();
};

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
