# Команды проекта

## Установка

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
```

```bash
cd bot
npm install
cp .env.example .env
npm run build
pm2 start ecosystem.config.cjs
```

## Prisma

Сгенерировать Prisma Client:

```bash
npx prisma generate
```

Создать и применить миграцию:

```bash
npx prisma migrate dev --name init
```

Применить миграции на сервере:

```bash
npx prisma migrate deploy
```

Открыть Prisma Studio:

```bash
npm run prisma:studio
```

Очистить таблицу банов:

```powershell
'TRUNCATE TABLE "Ban" RESTART IDENTITY CASCADE;' | npx prisma db execute --stdin
```

## Импорт

Импорт banlist из `Bans.cfg`:

```bash
npm run import:bans
```

Импорт групп и админов из `Admins.cfg`:

```bash
npm run import:admins
```

## Redis sessions

Посмотреть ключи сессий:

```bash
docker exec -it squad_admin_redis redis-cli KEYS "steam-auth:*"
```

Посмотреть конкретную сессию:

```bash
docker exec -it squad_admin_redis redis-cli GET "steam-auth:<session-id>"
```

TTL сессии:

```bash
docker exec -it squad_admin_redis redis-cli TTL "steam-auth:<session-id>"
```

Удалить одну сессию:

```bash
docker exec -it squad_admin_redis redis-cli DEL "steam-auth:<session-id>"
```

Очистить Redis целиком:

```bash
docker exec -it squad_admin_redis redis-cli FLUSHDB
```

## PM2

Запустить ботов:

```bash
cd bot
npm run build
pm2 start ecosystem.config.cjs
```

Перезапустить с обновлением env:

```bash
pm2 restart all --update-env
```

Посмотреть процессы:

```bash
pm2 list
```

Логи:

```bash
pm2 logs
pm2 logs 1-invasion --lines 100
```

## HTTP

Список серверов:

```bash
curl http://127.0.0.1:4000/servers
```

Игроки одного сервера:

```bash
curl http://127.0.0.1:4000/servers/protocol-1/players --cookie "sid=<cookie>"
```

Проверка бана ботом:

```bash
curl http://127.0.0.1:4000/internal/bans/check/76561198000000000 \
  -H "Authorization: Bearer <INTERNAL_BOT_TOKEN>"
```
