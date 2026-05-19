import type { HeaderMenuItem } from '../model';

export const navigation: HeaderMenuItem[] = [
    {
        id: 'events',
        label: 'Ивенты',
        href: '/',
        icon: '/general/events_header.svg',
        iconAlt: 'Иконка раздела Ивенты',
    },
    {
        id: 'autoSeed',
        label: 'AutoSeed',
        href: '/',
        icon: '/general/seed_header.svg',
        iconAlt: 'Иконка раздела AutoSeed',
    },
    {
        id: 'login',
        label: 'Войти',
        href: `${process.env.NEXT_PUBLIC_API_URL}/auth/steam`,
        icon: '/general/steam.svg',
        iconOverlay: '/general/steam_overlay.svg',
        iconAlt: 'Иконка входа через Steam',
    },
];
