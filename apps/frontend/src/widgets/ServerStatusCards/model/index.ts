import type { ServerData } from 'shared/types';

export type { ServerStatusState, ServerData as ServerStatusServer } from 'shared/types';

export type ServerStatusCardsProps = {
    title?: string;
    servers?: ServerData[];
    className?: string;
};
