import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface SeedServer {
    id: string;
    serverId: number;
    name: string;
    lastPlayers: number | null;
    lastMaxPlayers: number | null;
    lastMap: string | null;
    lastQueryAt: string | null;
    lastQueryError: string | null;
    seedThreshold: number;
    priority: number;
}

export interface SeedSession {
    id: string;
    status: string;
    mode: string;
    seededCount: number;
    ratingPointsEarned: number;
    currentServer: SeedServer | null;
    targets: { id: string; serverId: string; status: string; server: SeedServer }[];
    agentDevice: { id: string; name: string; status: string; lastHeartbeatAt: string | null };
}

async function fetchServers(): Promise<SeedServer[]> {
    const res = await fetch(`${API_URL}/autoseed/servers`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json() as { servers: SeedServer[] };
    return data.servers;
}

async function fetchStatus(): Promise<SeedSession | null> {
    const res = await fetch(`${API_URL}/autoseed/status`, { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json() as { session: SeedSession | null };
    return data.session;
}

export const AUTOSEED_SERVERS_KEY = ["autoseed", "servers"] as const;
export const AUTOSEED_STATUS_KEY = ["autoseed", "status"] as const;

export function useAutoseedServers() {
    return useQuery({
        queryKey: AUTOSEED_SERVERS_KEY,
        queryFn: fetchServers,
        staleTime: 15_000,
        refetchInterval: 20_000,
    });
}

export function useAutoseedStatus() {
    return useQuery({
        queryKey: AUTOSEED_STATUS_KEY,
        queryFn: fetchStatus,
        staleTime: 5_000,
        refetchInterval: 10_000,
    });
}

export function useStartAutoseed() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (options: {
            mode: "AUTO_ALL" | "SELECTED_SERVERS";
            selectedServerIds?: string[];
        }) => {
            const res = await fetch(`${API_URL}/autoseed/start`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(options),
            });
            if (!res.ok) {
                const err = await res.json() as { message?: string };
                throw new Error(err.message ?? "Ошибка запуска");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: AUTOSEED_STATUS_KEY });
        },
    });
}

export function useStopAutoseed() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (sessionId: string) => {
            const res = await fetch(`${API_URL}/autoseed/stop`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId }),
            });
            if (!res.ok) {
                const err = await res.json() as { message?: string };
                throw new Error(err.message ?? "Ошибка остановки");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: AUTOSEED_STATUS_KEY });
        },
    });
}
