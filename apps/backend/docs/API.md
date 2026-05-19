# Backend API Documentation

## Авторизация

| Тип | Описание |
|-----|----------|
| **Session** | Steam OAuth сессия. Cookie `sid` + Redis. Применяется ко всем `/me`, `/bans`, `/players`, `/servers`, `/privileges`, `/punishments`, `/nickname-blacklist`, `/remote-bot` |
| **InternalToken** | Bearer токен в заголовке `Authorization`. Значение из `INTERNAL_BOT_TOKEN`. Применяется к `/internal/*` |
| **Нет** | `/auth/*`, `/health` |

---

## `/health`

| Метод | Путь | Авторизация |
|-------|------|-------------|
| GET | `/health` | Нет |

**Ответ:**
```json
{ "ok": true }
```

---

## `/auth` — Steam OAuth

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/auth/steam` | Редирект на Steam login |
| GET | `/auth/steam/return` | Callback от Steam. Создаёт/обновляет `User` в БД |
| POST | `/auth/logout` | Выход. Уничтожает сессию, очищает cookie `sid` |

**`/auth/steam/return` → БД:**
- `User` — upsert по `steamId`. Поля: `steamId`, `displayName`, `avatarUrl`, `profileUrl`

**`/auth/logout` → Ответ:**
```json
{ "ok": true }
```

---

## `/me`

| Метод | Путь | Авторизация |
|-------|------|-------------|
| GET | `/me` | Session |

**Ответ:**
```json
{
  "user": {
    "id": "uuid",
    "steamId": "76561198000000000",
    "displayName": "Nickname",
    "avatarUrl": "https://avatars.steamstatic.com/...",
    "profileUrl": "https://steamcommunity.com/id/...",
    "role": "ADMINISTRATOR | MODERATOR | VIP | ...",
    "createdAt": "ISO",
    "updatedAt": "ISO"
  }
}
```

---

## `/servers`

| Метод | Путь | Авторизация |
|-------|------|-------------|
| GET | `/servers` | Session |
| GET | `/servers/:serverId/players` | Session |

**`GET /servers` → Ответ:**
```json
{
  "servers": [
    { "id": 1, "name": "#1 INVASION", "botUrl": "http://..." }
  ]
}
```

**`GET /servers/:serverId/players` → Ответ:**
```json
{
  "serverId": 1,
  "serverName": "#1 INVASION",
  "playersCount": 72,
  "squadsCount": 14,
  "players": [...],
  "squads": [...],
  "teams": [
    {
      "teamId": "1",
      "squads": [
        {
          "squad": { "squadId": "1", "teamId": "1", "name": "CMD" },
          "players": [...]
        }
      ],
      "unassigned": [...]
    }
  ]
}
```

**`GET /servers/:serverId/players` → БД:**
- `Player` — upsert по `steamId`
- `PlayerName` — upsert по `(playerId, nickname)`

---

## `/players`

| Метод | Путь | Авторизация |
|-------|------|-------------|
| GET | `/players/known` | Session |
| GET | `/players/:steamId/profile` | Session |

**`GET /players/known`** — поиск по нику. Query: `?q=строка`

**Ответ:**
```json
{
  "players": [
    {
      "id": "uuid",
      "steamId": "...",
      "lastName": "Nickname",
      "names": [...],
      "sessions": [...],
      "externalProfile": {...},
      "punishments": [...]
    }
  ]
}
```

**`GET /players/:steamId/profile` → Ответ:**
```json
{
  "player": { ... },
  "steamProfile": {
    "personaName": "...",
    "avatarUrl": "...",
    "profileUrl": "...",
    "countryCode": "RU",
    "isPrivate": false
  }
}
```

**`GET /players/:steamId/profile` → БД:**
- `PlayerExternalProfile` — upsert Steam данных

---

## `/bans`

| Метод | Путь | Авторизация |
|-------|------|-------------|
| GET | `/bans` | Session |
| GET | `/bans/check/:steamId` | Session |
| POST | `/bans` | Session |
| POST | `/bans/:banId/revoke` | Session |

**`GET /bans`** — Query: `?status=ACTIVE|REVOKED|EXPIRED`

**`GET /bans/check/:steamId` → Ответ:**
```json
{
  "steamId": "76561198000000000",
  "isBanned": true,
  "activeBan": { ... },
  "nicknameBlacklisted": false
}
```

**`POST /bans` — Тело запроса:**
```json
{
  "targets": [
    { "targetType": "STEAM_ID", "targetValue": "76561198000000000" },
    { "targetType": "EOS_ID",   "targetValue": "0002..." }
  ],
  "reason": "Cheating",
  "expiresAt": "2026-06-01T00:00:00Z",
  "createdById": "uuid",
  "createdByName": "Admin"
}
```

**`POST /bans` → Ответ:**
```json
{
  "ban": { ... },
  "bans": [...],
  "kickResults": [{ "serverId": 1, "ok": true }]
}
```

**`POST /bans` → БД:**
- `Ban` — создание: `targetType`, `targetValue`, `normalizedTargetValue`, `reason`, `status=ACTIVE`, `expiresAt`, `createdById`, `createdByName`

**`POST /bans/:banId/revoke` — Тело:**
```json
{
  "revokedById": "uuid",
  "revokedByName": "Admin",
  "revokeReason": "Причина отмены"
}
```

**`POST /bans/:banId/revoke` → БД:**
- `Ban` — обновление: `status=REVOKED`, `revokedAt`, `revokedById`, `revokedByName`, `revokeReason`

---

## `/privileges`

| Метод | Путь | Авторизация |
|-------|------|-------------|
| GET | `/privileges/groups` | Session |
| PATCH | `/privileges/groups/:id` | Session |
| GET | `/privileges/players` | Session |
| POST | `/privileges/players` | Session |
| PATCH | `/privileges/players/:id` | Session |
| DELETE | `/privileges/players/:id` | Session |

**`POST /privileges/players` — Тело:**
```json
{
  "steamId": "76561198000000000",
  "eosId": "...",
  "nickname": "...",
  "groupKey": "admin",
  "comment": "...",
  "prefix": "[ADMIN]",
  "prefixColor": "#FF0000",
  "imageUrl": "..."
}
```

**`POST /privileges/players` → БД:**
- `PlayerPrivilege` — создание с `active=true`

**`PATCH /privileges/groups/:id` → БД:**
- `PrivilegeGroup` — обновление: `key`, `label`, `color`, `permissions[]`

---

## `/punishments`

| Метод | Путь | Авторизация |
|-------|------|-------------|
| GET | `/punishments/warns` | Session |
| POST | `/punishments/warns` | Session |

**`GET /punishments/warns`** — Query: `?q=поиск`

**`POST /punishments/warns` — Тело:**
```json
{
  "steamId": "76561198000000000",
  "eosId": "...",
  "nickname": "...",
  "reason": "Причина варна",
  "serverId": 1,
  "createdById": "uuid",
  "createdByName": "Admin"
}
```

**`POST /punishments/warns` → Ответ:**
```json
{
  "punishment": { ... },
  "delivery": { "ok": true, "result": "..." }
}
```

**`POST /punishments/warns` → БД:**
- `Punishment` — создание: `type=WARN`, `steamId`, `eosId`, `nickname`, `reason`, `createdById`, `createdByName`
- `Player` — upsert по `steamId`

---

## `/nickname-blacklist`

| Метод | Путь | Авторизация |
|-------|------|-------------|
| GET | `/nickname-blacklist` | Session |
| POST | `/nickname-blacklist` | Session |
| DELETE | `/nickname-blacklist/:id` | Session |

**`POST /nickname-blacklist` — Тело:**
```json
{ "nickname": "запрещённый_ник" }
```

**→ БД:** `NicknameBlacklist` — upsert по `nickname`

---

## `/remote-bot`

| Метод | Путь | Авторизация |
|-------|------|-------------|
| POST | `/remote-bot/restart` | Session |

**Ответ:**
```json
{ "ok": true, "stdout": "...", "stderr": "..." }
```

Выполняет SSH команду перезапуска бота. БД не затрагивает.

---

## `/internal` — Bot → Backend

Все маршруты требуют заголовок: `Authorization: Bearer <INTERNAL_BOT_TOKEN>`

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/internal/bans/check/:steamId` | Проверка бана при подключении игрока |
| POST | `/internal/events/player-connected` | Игрок зашёл на сервер |
| POST | `/internal/events/player-disconnected` | Игрок вышел с сервера |

**`GET /internal/bans/check/:steamId`** — Query: `?eosId=...&name=...`

**Ответ:**
```json
{
  "isBanned": true,
  "activeBan": { ... },
  "nicknameBlacklisted": false
}
```

**`POST /internal/events/player-connected` — Тело:**
```json
{
  "serverId": 1,
  "steamId": "76561198000000000",
  "eosId": "...",
  "name": "Nickname",
  "raw": "строка из лога"
}
```

**→ БД:**
- `Player` — upsert по `steamId`
- `PlayerName` — upsert по `(playerId, nickname)`
- `PlayerSession` — создание: `status=ONLINE`, `connectedAt=now`
- Предыдущие `ONLINE` сессии игрока → `status=STALE`

**`POST /internal/events/player-disconnected` — Тело:**
```json
{
  "serverId": 1,
  "steamId": "76561198000000000",
  "raw": "строка из лога"
}
```

**→ БД:**
- `PlayerSession` — обновление активной сессии: `status=CLOSED`, `disconnectedAt=now`, `disconnectRaw`

---

## Сводная таблица: кто пишет в БД

| Таблица | Эндпоинты |
|---------|-----------|
| `User` | `GET /auth/steam/return` |
| `Ban` | `POST /bans`, `POST /bans/:id/revoke` |
| `Player` | `GET /servers/:id/players`, `POST /internal/events/player-connected`, `POST /punishments/warns` |
| `PlayerName` | `GET /servers/:id/players`, `POST /internal/events/player-connected` |
| `PlayerSession` | `POST /internal/events/player-connected`, `POST /internal/events/player-disconnected` |
| `PlayerExternalProfile` | `GET /players/:steamId/profile` |
| `PlayerPrivilege` | `POST /privileges/players`, `PATCH /privileges/players/:id`, `DELETE /privileges/players/:id` |
| `PrivilegeGroup` | `PATCH /privileges/groups/:id` |
| `Punishment` | `POST /punishments/warns` |
| `NicknameBlacklist` | `POST /nickname-blacklist`, `DELETE /nickname-blacklist/:id` |
