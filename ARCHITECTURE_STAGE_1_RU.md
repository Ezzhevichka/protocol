# Stage 1: players, sessions, names, punishments

## Что добавлено

### Backend

- `Player` — игрок Squad, не связанный с логином в приложение.
- `PlayerName` — история ников игрока.
- `PlayerSession` — сессии входа/выхода по серверу.
- `PlayerExternalProfile` — кэш Steam API: аватар, текущий ник, часы Squad, суммарные часы.
- `Punishment` — сейчас используется для `WARN`.
- `NicknameBlacklist` — точный blacklist строк никнеймов без нормализации.

### Bot

Log tail теперь разделён на pipeline:

```text
log tail -> parser registry -> typed event -> handlers
```

Парсеры:

- `PLAYER_CONNECTED`
- `PLAYER_DISCONNECTED` базовый, формат Squad-логов может потребовать уточнения regex

Handlers:

- session handler отправляет события в backend
- ban enforcement handler проверяет Ban + NicknameBlacklist и кикает по SteamID

### Frontend

Добавлена FSD-структура:

```text
src/shared
src/entities
src/features
src/widgets
```

Страницы `/dashboard` и `/bans` переписаны на Tailwind.

## После распаковки

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name stage1_players_sessions_punishments
npm run build
```

```bash
cd ../frontend
npm run build
```

```bash
cd ../bot
npm run build
pm2 delete all
pm2 start ecosystem.config.cjs
```

## Важно

Если TypeScript показывает старый `BanTargetType.NICKNAME`, значит Prisma client не пересгенерирован.

```bash
cd backend
npx prisma generate
```

## Steam API

Для профиля игрока нужен:

```env
STEAM_API_KEY=...
```

Профиль обновляется не на каждый рендер, а через backend cache `PlayerExternalProfile`.

## Nickname blacklist

Это exact-match blacklist. Нормализации нет намеренно.

```text
P1V0
p1v0
P1V0_
P1V0ㅤ
```

Это разные записи.
