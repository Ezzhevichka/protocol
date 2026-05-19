import type { JSX } from 'react';

// Legacy types kept for old header item components.
export type HeaderNavigation = {
    icon: string;
    url?: string;
    label: string;
    id: string;
    Component: (props: HeaderNavigationWithoutComponent) => JSX.Element;
};

export type HeaderNavigationWithoutComponent = Omit<HeaderNavigation, 'Component' | 'id'>;

export type HeaderMenuItem = {
    id: string;
    label: string;
    href: string;
    icon: string;
    iconAlt: string;
    iconOverlay?: string;
    external?: boolean;
};
