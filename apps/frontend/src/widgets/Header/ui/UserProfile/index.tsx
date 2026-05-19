'use client';

import Image from 'next/image';

import type { AuthUser } from 'shared/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type UserProfileProps = {
    user: AuthUser;
};

export const UserProfile = ({ user }: UserProfileProps) => {
    const handleLogout = async () => {
        await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
        window.location.reload();
    };

    return (
        <div className="flex items-center gap-8">
            {user.avatarUrl && (
                <Image
                    src={user.avatarUrl}
                    alt={user.displayName ?? 'avatar'}
                    width={32}
                    height={32}
                    className="rounded-full"
                />
            )}
            <span className="font-manrope text-[16px] font-medium leading-22 whitespace-nowrap text-header-nav-text">
                {user.displayName ?? user.steamId}
            </span>
            <button
                onClick={handleLogout}
                className="font-manrope text-[14px] font-medium leading-22 whitespace-nowrap text-header-nav-text opacity-50 transition-opacity hover:opacity-100"
            >
                Выйти
            </button>
        </div>
    );
};
