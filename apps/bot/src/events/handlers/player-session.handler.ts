import { sendPlayerDisconnected, sendPlayerConnected } from 'services/backend-service';
import { PlayerEvent, PlayerEventType } from 'types/parserEvents';

export async function playerSessionHandler(event: PlayerEvent) {
  if (event.type === PlayerEventType.PLAYER_CONNECTED) {
    await sendPlayerConnected({
      serverId: Number(process.env.SERVER_ID),
      steamId: event.steamId,
      eosId: event.eosId,
      name: event.name,
    });
  }

  if (event.type === 'PLAYER_DISCONNECTED') {
    await sendPlayerDisconnected({
      serverId: Number(process.env.SERVER_ID),
      steamId: event.steamId,
    });
  }
}
