import type { ServerLevelInfo, ServerLevelType } from '../model';

export const serverLevelData: Record<ServerLevelType, ServerLevelInfo> = {
    empty: {
        label: 'Сервер пустой',
        icon: '/general/server_level_empty.svg',
        titleClassName: 'server-level-empty',
        infoClassName: 'server-level-empty-muted',
    },
    frog: {
        label: 'Лягушатник',
        icon: '/general/server_level_frog.svg',
        titleClassName: 'server-level-frog',
        infoClassName: 'server-level-frog-muted',
    },
    casual: {
        label: 'Казуально',
        icon: '/general/server_level_casual.svg',
        titleClassName: 'server-level-casual',
        infoClassName: 'server-level-casual-muted',
    },
    sweaty: {
        label: 'Потно',
        icon: '/general/server_level_sweaty.svg',
        titleClassName: 'server-level-sweaty',
        infoClassName: 'server-level-sweaty-muted',
    },
    nightmare: {
        label: 'Сущий кошмар',
        icon: '/general/server_level_nightmare.svg',
        titleClassName: 'server-level-nightmare',
        infoClassName: 'server-level-nightmare-muted',
    },
};

export const formatHours = (hoursAmount: number | string) => {
    if (typeof hoursAmount === 'number') {
        if (hoursAmount >= 1000) {
            const k = hoursAmount / 1000;
            const formatted = k % 1 === 0 ? k.toFixed(0) : k.toFixed(1).replace(/\.0$/, '');
            return `${formatted}к ч.`;
        }
        return `${hoursAmount}ч`;
    }

    return hoursAmount;
};

export const formatPercentages = (openProfilePercentages: number | string) => {
    if (typeof openProfilePercentages === 'number') {
        return `${openProfilePercentages}%`;
    }

    return openProfilePercentages;
};
