# API backend

Все публичные методы, кроме `/auth/*`, `/health` и `/internal/*`, требуют http-only cookie `sid`.

## Auth

`GET /auth/steam` — вход через Steam.

`GET /auth/steam/return` — callback Steam.

`POST /auth/logout` — удалить сессию.

## Me

`GET /me`

Ответ:

```json
{ "user": { "id": "...", "steamId": "...", "displayName": "..." } }
```

## Servers

`GET /servers` — список серверов.

`GET /servers/:serverId/players` — игроки и сквады конкретного сервера.

## Bans

`GET /bans` — список банов.

`GET /bans/check/:steamId` — проверка SteamID.

`POST /bans` — создать бан.

Тело:

```json
{
  "targets": [
    { "targetType": "STEAM_ID", "targetValue": "76561198000000000" },
    { "targetType": "EOS_ID", "targetValue": "0002..." },
    { "targetType": "NICKNAME", "targetValue": "Player" }
  ],
  "reason": "Cheating",
  "expiresAt": null
}
```

`POST /bans/:banId/revoke` — снять бан.

## Privileges

`GET /privileges/groups` — группы из `Admins.cfg`.

`PATCH /privileges/groups/:id` — редактировать группу.

`GET /privileges/players` — список игроков с привилегиями.

`POST /privileges/players` — выдать группу игроку.

`PATCH /privileges/players/:id` — изменить запись.

`DELETE /privileges/players/:id` — удалить запись.

## Internal для ботов

`GET /internal/bans/check/:steamId?eosId=...&name=...`

Требует:

```text
Authorization: Bearer <INTERNAL_BOT_TOKEN>
```
