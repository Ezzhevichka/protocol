import { applyPlayerEvent } from 'services/server-info-snapshot.service';
import { PlayerEvent } from 'types/parserEvents';

export function playerSnapshotHandler(event: PlayerEvent) {
  applyPlayerEvent(event);
}
