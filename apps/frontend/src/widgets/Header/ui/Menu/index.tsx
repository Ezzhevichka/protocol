import Image from 'next/image';

import type { AuthUser } from 'shared/types';

import { UserProfile } from '../UserProfile';

import type { HeaderMenuItem } from '../../model';

type MenuProps = {
    items: HeaderMenuItem[];
    user?: AuthUser | null;
    isAdmin?: boolean;
};

const Icon = ({ item }: { item: HeaderMenuItem }) => {
    if (item.id === 'events') {
        return (
            <span className="relative h-24 w-24 shrink-0 overflow-hidden">
                <Image
                    src={item.icon}
                    alt={item.iconAlt}
                    width={22}
                    height={22}
                    className="absolute left-1/2 top-1/2 h-22 w-22 -translate-x-1/2 -translate-y-1/2"
                />
            </span>
        );
    }

    if (item.id === 'autoSeed') {
        return (
            <span className="relative h-24 w-24 shrink-0 overflow-hidden">
                <Image
                    src={item.icon}
                    alt={item.iconAlt}
                    width={20}
                    height={20}
                    className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2"
                />
            </span>
        );
    }

    return (
        <span className="relative h-24 w-24 shrink-0 overflow-hidden">
            <Image
                src={item.icon}
                alt={item.iconAlt}
                width={20}
                height={20}
                className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2"
            />
            {item.iconOverlay ? (
                <Image
                    src={item.iconOverlay}
                    alt=""
                    aria-hidden="true"
                    width={17}
                    height={13}
                    className="absolute left-2 top-[5.6px] h-13 w-17"
                />
            ) : null}
        </span>
    );
};

export const Menu = ({ items, user, isAdmin }: MenuProps) => {
    return (
        <nav aria-label="Основное меню" className="shrink-0">
            <ul className="flex items-center justify-end gap-12">
                {isAdmin && (
                    <li>
                        <a
                            href="/admin"
                            className="flex items-center gap-8 rounded-lg border border-amber-500/30 bg-amber-500/10 px-12 py-6 font-manrope text-[14px] font-semibold text-amber-400 transition-all hover:border-amber-500/60 hover:bg-amber-500/20"
                        >
                            Admin Tools
                        </a>
                    </li>
                )}
                {items.map((item) => (
                    <li key={item.id}>
                        {item.id === 'login' && user ? (
                            <UserProfile user={user} />
                        ) : (
                            <a
                                href={item.href}
                                target={item.external ? '_blank' : undefined}
                                rel={item.external ? 'noreferrer noopener' : undefined}
                                className="flex items-center gap-8 p-8 transition-opacity hover:opacity-80"
                            >
                                <Icon item={item} />
                                <span className="font-manrope text-[16px] font-medium leading-22 whitespace-nowrap text-header-nav-text">
                                    {item.label}
                                </span>
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};
