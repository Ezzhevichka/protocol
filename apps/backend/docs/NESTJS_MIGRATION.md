# Backend migration to NestJS

## Что изменено

Backend больше не собирает HTTP API вручную через Express Router. Точка входа `src/index.ts` теперь поднимает Nest-приложение через `NestFactory`, подключает CORS, Redis-backed session, Passport Steam и глобальный фильтр ошибок.

Старые express routes удалены. Их заменили NestJS controllers:

- `AuthController` — Steam login, Steam callback, logout.
- `HealthController` — `/health`.
- `MeController` — `/me`.
- `BansController` — `/bans`.
- `PlayersController` — `/players` и `/servers/:serverId/players`.
- `ServersController` — `/servers`.
- `PrivilegesController` — `/privileges`.
- `NicknameBlacklistController` — `/nickname-blacklist`.
- `PunishmentsController` — `/punishments`.
- `RemoteBotController` — `/remote-bot`.
- `InternalController` — `/internal`.

Бизнес-сервисы сохранены почти без изменений. Это намеренно: миграция меняет HTTP-слой, а не доменную логику. Prisma-запросы, Steam profile refresh, ban logic, bot calls, SSH restart, warn delivery и player sync остались в сервисах.

## Почему так

Express Router хорошо работает на маленьком API, но по мере роста начинает размазывать ответственность: route файлы знают middleware, контроллеры знают `Request`/`Response`, ошибки передаются через `next`, валидация сидит отдельным middleware. NestJS убирает этот ручной слой:

- маршруты объявлены рядом с обработчиком через decorators;
- авторизация вынесена в guards;
- валидация тела запроса вынесена в pipe;
- ошибки централизованы в exception filter;
- bootstrap приложения стал явным и компактным;
- добавление новых модулей теперь не требует ручной склейки router-дерева.

## Что сохранено

API paths сохранены совместимыми с текущим frontend и bot-интеграциями:

- `GET /health`
- `GET /auth/steam`
- `GET /auth/steam/return`
- `POST /auth/logout`
- `GET /me`
- `GET /bans`
- `GET /bans/check/:steamId`
- `POST /bans`
- `POST /bans/:banId/revoke`
- `GET /players/known`
- `GET /players/:steamId/profile`
- `GET /servers`
- `GET /servers/:serverId/players`
- `GET /privileges/groups`
- `PATCH /privileges/groups/:id`
- `GET /privileges/players`
- `POST /privileges/players`
- `PATCH /privileges/players/:id`
- `DELETE /privileges/players/:id`
- `GET /nickname-blacklist`
- `POST /nickname-blacklist`
- `DELETE /nickname-blacklist/:id`
- `GET /punishments/warns`
- `POST /punishments/warns`
- `POST /remote-bot/restart`
- `GET /internal/bans/check/:steamId`
- `POST /internal/events/player-connected`
- `POST /internal/events/player-disconnected`

## Новые инфраструктурные файлы

- `src/app.module.ts` — корневой Nest module.
- `src/common/zod-validation.pipe.ts` — адаптер Zod-схем под Nest pipe.
- `src/guards/session-auth.guard.ts` — session auth вместо Express middleware `requireAuth`.
- `src/guards/internal-token.guard.ts` — Bearer token auth для internal endpoints.
- `src/filters/all-exceptions.filter.ts` — единый формат ошибок.

## Зависимости

В `apps/backend/package.json` добавлены:

- `@nestjs/common`
- `@nestjs/core`
- `@nestjs/platform-express`
- `reflect-metadata`
- `rxjs`

Express, Passport, express-session и connect-redis оставлены, потому что текущая Steam-auth схема использует Passport session поверх Express adapter. Удалять их сейчас было бы не миграцией, а бесплатным генератором багов.

## Важная заметка

`pnpm-lock.yaml` не был пересобран в этой среде: pnpm не установлен, а Corepack не смог скачать pnpm без доступа к registry. После получения проекта нужно выполнить:

```bash
corepack enable
pnpm install
pnpm --filter @squad-admin/backend typecheck
pnpm --filter @squad-admin/backend build
```
