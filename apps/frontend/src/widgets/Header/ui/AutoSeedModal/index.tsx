'use client';

import Image from "next/image";
import { useAutoseedStatus } from "shared/hooks/useAutoseed";
import type { HeaderMenuItem } from "../../model";

export function AutoSeedModal({ item }: { item: HeaderMenuItem }) {
    const { data: session } = useAutoseedStatus();
    const hasActiveSession = session != null;

    return (
        <a
            href="/autoseed"
            className="flex items-center gap-8 p-8 transition-opacity hover:opacity-80"
        >
            <span className="relative h-24 w-24 shrink-0 overflow-hidden">
                <Image
                    src={item.icon}
                    alt={item.iconAlt}
                    width={20}
                    height={20}
                    className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2"
                />
            </span>
            <span className="font-manrope text-[16px] font-medium leading-22 whitespace-nowrap text-header-nav-text">
                {item.label}
            </span>
            {hasActiveSession && (
                <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: "#4ECB71" }}
                />
            )}
        </a>
    );
}
