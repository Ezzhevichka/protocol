import { makeRconError } from './errors';

import type { DecodedRconPacket } from './types';

export const encodePacket = (input: { type: number; id: number; count: number; body: string; encoding?: BufferEncoding }) => {
  const encoding = input.encoding ?? 'utf8';
  const size = Buffer.byteLength(input.body, encoding) + 14;
  const buffer = Buffer.alloc(size);

  buffer.writeUInt32LE(size - 4, 0);
  buffer.writeUInt8(input.id, 4);
  buffer.writeUInt8(0, 5);
  buffer.writeUInt16LE(input.count, 6);
  buffer.writeUInt32LE(input.type, 8);
  buffer.write(input.body, 12, size - 2, encoding);
  buffer.writeUInt16LE(0, size - 2);

  return buffer;
};

export const decodePacket = (packet: Buffer): DecodedRconPacket => {
  if (packet.byteLength < 14) {
    throw makeRconError('RCON_PROTOCOL_ERROR', 'Packet is too small', { byteLength: packet.byteLength });
  }

  return {
    size: packet.readUInt32LE(0),
    id: packet.readUInt8(4),
    count: packet.readUInt16LE(6),
    type: packet.readUInt32LE(8),
    body: packet.toString('utf8', 12, packet.byteLength - 2),
  };
};

export const consumePackets = (input: Buffer) => {
  let incoming = input;
  const packets: DecodedRconPacket[] = [];

  while (incoming.byteLength >= 4) {
    const size = incoming.readInt32LE(0);
    const packetSize = size + 4;

    if (size < 10) {
      throw makeRconError('RCON_PROTOCOL_ERROR', 'Invalid packet size', { size });
    }

    if (incoming.byteLength < packetSize) {
      break;
    }

    const packet = incoming.subarray(0, packetSize);
    const decoded = decodePacket(packet);

    const probePacketSize = 21;
    if (size === 10 && incoming.byteLength >= probePacketSize) {
      const probe = incoming.subarray(0, probePacketSize);
      const decodedProbe = decodePacket(probe);

      if (decodedProbe.body === '\x00\x00\x00\x01\x00\x00\x00') {
        incoming = incoming.subarray(probePacketSize);
        continue;
      }
    }

    packets.push(decoded);
    incoming = incoming.subarray(packetSize);
  }

  return { packets, rest: incoming };
};
