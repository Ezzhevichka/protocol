import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { AuthUser } from "shared/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function fetchMe(): Promise<AuthUser | null> {
    const res = await fetch(`${API_URL}/me`, { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json() as { user: AuthUser | null };
    return data.user;
}

export const ME_QUERY_KEY = ["me"] as const;

export function useMe(initialData?: AuthUser | null) {
    return useQuery({
        queryKey: ME_QUERY_KEY,
        queryFn: fetchMe,
        initialData: initialData ?? undefined,
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return async () => {
        await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
        await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
    };
}
