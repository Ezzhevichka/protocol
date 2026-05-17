//TODO добавить TanStack Query для получения данных о пользователе и управления состоянием аутентификации.
'use client';

import Image from "next/image";

import { useLogout, useMe } from "shared/hooks/useMe";

import type { AuthUser } from "shared/types";

type UserProfileProps = {
    initialUser: AuthUser;
};

export const UserProfile = ({ initialUser }: UserProfileProps) => {
    const { data: user } = useMe(initialUser);
    const logout = useLogout();

    if (!user) return null;

    return (
        <div className="flex items-center gap-8">
            {user.avatarUrl && (
                <Image
                    src={user.avatarUrl}
                    alt={user.displayName ?? "avatar"}
                    width={32}
                    height={32}
                    className="rounded-full"
                />
            )}
            <span className="font-manrope text-[16px] font-medium leading-22 whitespace-nowrap text-header-nav-text">
                {user.displayName ?? user.steamId}
            </span>
            <button
                onClick={logout}
                className="font-manrope text-[14px] font-medium leading-22 whitespace-nowrap text-header-nav-text opacity-50 transition-opacity hover:opacity-100"
            >
                Выйти
            </button>
        </div>
    );
};
