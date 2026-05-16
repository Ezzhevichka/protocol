# Squad Admin Monorepo

Монорепозиторий для платформы администрирования Squad.

## Структура

```text
apps/
  backend/   Express API, auth, bans, punishments, players, remote bot controls
  bot/       RCON agent, log tail, event parsers, event handlers
  frontend/  Next.js UI
packages/
  database/  Prisma schema, migrations, generated Prisma client, shared prisma instance
  shared/    Общие доменные типы для backend/bot/frontend
  config/    Общие helpers для env
```

## Установка

```bash
pnpm install
```

## Prisma

Prisma вынесена в `packages/database`.

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:studio
pnpm db:reset
```

## Запуск

```bash
pnpm backend:dev
pnpm bot:dev
pnpm frontend:dev
```

## Сборка

```bash
pnpm build
```

Если собираешь вручную без turbo:

```bash
pnpm --filter @squad-admin/database build
pnpm --filter @squad-admin/shared build
pnpm --filter @squad-admin/backend build
pnpm --filter @squad-admin/bot build
pnpm --filter @squad-admin/frontend build
```

## Env

- Backend env лежит в `apps/backend/.env`
- Bot env/common config можно держать в `apps/bot/ecosystem.config.cjs`
- Frontend env в `apps/frontend/.env.local`

Секреты не коммитить. Да, всё ещё приходится это писать, потому что история индустрии вся состоит из утёкших `.env`.

## DATABASE_URL

`packages/database/prisma.config.ts` загружает env из:

1. `packages/database/.env`
2. корневого `.env`
3. `apps/backend/.env`

То есть старый `DATABASE_URL` из backend продолжит работать. Магии меньше не стало, но хотя бы она задокументирована.
