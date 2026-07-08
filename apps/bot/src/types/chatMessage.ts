import { BaseEvent, EventType } from './baseEvent';

export enum ChatMessageType {
	ALL = 'ChatAll',
	SQUAD = 'ChatSquad',
	TEAM = 'ChatTeam',
	ADMIN = 'ChatAdmin'
}

export interface ChatMessageEvent extends BaseEvent {
	type: EventType.CHAT_MESSAGE;
	chat: ChatMessageType;
	eosID: string;
	steamID: string;
	name: string;
	message: string;
}

export interface RawChatMessageEvent extends Omit<ChatMessageEvent, 'timestamp'> {
	time: Date | string;
}
