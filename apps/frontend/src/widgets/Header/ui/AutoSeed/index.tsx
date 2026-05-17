'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button, Text } from "shared/ui";
import {
    useAutoseedServers,
    useAutoseedStatus,
    useStartAutoseed,
    useStopAutoseed,
    type SeedServer,
} from "shared/hooks/useAutoseed";
import type { HeaderNavigationWithoutComponent } from "../../model";

// ─── Status badge ────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
    QUEUED: "В очереди",
    ASSIGNED: "Назначен",
    LAUNCHING: "Запуск...",
    SEEDING: "Сидит",
    SWITCHING: "Переключение",
    AGENT_OFFLINE: "Агент оффлайн",
};

function SessionStatusBadge({ status }: { status: string }) {
    const isActive = ["QUEUED", "ASSIGNED", "LAUNCHING", "SEEDING", "SWITCHING"].includes(status);
    return (
        <span
            className="inline-flex items-center gap-x-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{
                background: isActive ? "rgba(78,203,113,0.15)" : "rgba(255,255,255,0.07)",
                color: isActive ? "#4ECB71" : "#808080",
            }}
        >
            {isActive && (
                <span
                    className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: "#4ECB71" }}
                />
            )}
            {STATUS_LABELS[status] ?? status}
        </span>
    );
}

// ─── Server card ─────────────────────────────────────────────────────────────

function ServerCard({
    server,
    selected,
    selectable,
    onToggle,
}: {
    server: SeedServer;
    selected: boolean;
    selectable: boolean;
    onToggle: () => void;
}) {
    const players = server.lastPlayers ?? 0;
    const maxPlayers = server.lastMaxPlayers ?? server.seedThreshold;
    const pct = maxPlayers > 0 ? Math.min((players / server.seedThreshold) * 100, 100) : 0;
    const isSeeded = players >= server.seedThreshold;
    const hasError = Boolean(server.lastQueryError);

    return (
        <button
            type="button"
            onClick={selectable ? onToggle : undefined}
            className="w-full text-left rounded-xl p-3 transition-all"
            style={{
                background: selected
                    ? "rgba(78,203,113,0.10)"
                    : "rgba(255,255,255,0.04)",
                border: `1px solid ${selected ? "rgba(78,203,113,0.35)" : "rgba(255,255,255,0.07)"}`,
                cursor: selectable ? "pointer" : "default",
            }}
        >
            <div className="flex items-center justify-between gap-x-2 mb-2">
                <div className="flex items-center gap-x-2 min-w-0">
                    {selectable && (
                        <div
                            className="shrink-0 w-4 h-4 rounded flex items-center justify-center transition-all"
                            style={{
                                background: selected ? "#4ECB71" : "transparent",
                                border: `1.5px solid ${selected ? "#4ECB71" : "rgba(255,255,255,0.25)"}`,
                            }}
                        >
                            {selected && (
                                <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                                    <path d="M1 3L4 6L9 1" stroke="#070B12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                    )}
                    <span className="text-sm font-medium truncate" style={{ color: "#F6F6FE" }}>
                        {server.name}
                    </span>
                </div>
                <div className="flex items-center gap-x-2 shrink-0">
                    {hasError ? (
                        <span className="text-xs" style={{ color: "#808080" }}>недоступен</span>
                    ) : (
                        <span className="text-xs font-medium" style={{ color: isSeeded ? "#4ECB71" : "#F6F6FE" }}>
                            {players}/{server.seedThreshold}
                        </span>
                    )}
                </div>
            </div>

            {/* Player bar */}
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                        width: `${pct}%`,
                        background: isSeeded
                            ? "#4ECB71"
                            : hasError
                                ? "#444"
                                : "linear-gradient(90deg, #1D4AFF, #4ECB71)",
                    }}
                />
            </div>
        </button>
    );
}

// ─── Active session panel ─────────────────────────────────────────────────────

function ActiveSessionPanel({
    session,
    onStop,
    stopping,
}: {
    session: NonNullable<ReturnType<typeof useAutoseedStatus>["data"]>;
    onStop: () => void;
    stopping: boolean;
}) {
    const current = session.currentServer;

    return (
        <div className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
                <Text as="span" size="sm" weight="medium" style={{ color: "#F6F6FE" }}>
                    Текущая сессия
                </Text>
                <SessionStatusBadge status={session.status} />
            </div>

            {current && (
                <div
                    className="rounded-xl p-3"
                    style={{ background: "rgba(78,203,113,0.07)", border: "1px solid rgba(78,203,113,0.2)" }}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium" style={{ color: "#4ECB71" }}>Сейчас сидит:</span>
                        <span className="text-xs" style={{ color: "#808080" }}>
                            {current.lastPlayers ?? 0}/{current.seedThreshold} игроков
                        </span>
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#F6F6FE" }}>{current.name}</span>
                    {current.lastMap && (
                        <div className="text-xs mt-0.5" style={{ color: "#808080" }}>{current.lastMap}</div>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between text-xs" style={{ color: "#808080" }}>
                <span>Посеяно серверов: <b style={{ color: "#F6F6FE" }}>{session.seededCount}</b></span>
                <span>+{session.ratingPointsEarned} очков</span>
            </div>

            <button
                type="button"
                onClick={onStop}
                disabled={stopping}
                className="w-full rounded-xl py-2.5 text-sm font-medium transition-all disabled:opacity-50"
                style={{
                    background: "rgba(235,16,16,0.12)",
                    border: "1px solid rgba(235,16,16,0.25)",
                    color: "#EB1010",
                }}
            >
                {stopping ? "Останавливаю..." : "Остановить AutoSeed"}
            </button>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export const AutoSeed = ({ label, icon }: HeaderNavigationWithoutComponent) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [mode, setMode] = useState<"AUTO_ALL" | "SELECTED_SERVERS">("AUTO_ALL");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: servers = [], isLoading: serversLoading } = useAutoseedServers();
    const { data: session } = useAutoseedStatus();
    const { mutate: startSession, isPending: starting } = useStartAutoseed();
    const { mutate: stopSession, isPending: stopping } = useStopAutoseed();

    const hasActiveSession = session != null;

    const openModal = () => {
        setError(null);
        dialogRef.current?.showModal();
    };

    const closeModal = () => {
        dialogRef.current?.close();
    };

    // Close on backdrop click
    const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === dialogRef.current) closeModal();
    };

    // Reset selection when switching modes
    useEffect(() => {
        if (mode === "AUTO_ALL") setSelectedIds(new Set());
    }, [mode]);

    const toggleServer = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const canStart =
        agreed &&
        !starting &&
        (mode === "AUTO_ALL" || selectedIds.size > 0);

    const handleStart = () => {
        setError(null);
        startSession(
            {
                mode,
                selectedServerIds: mode === "SELECTED_SERVERS" ? [...selectedIds] : undefined,
            },
            {
                onSuccess: closeModal,
                onError: (err) => setError(err.message),
            }
        );
    };

    const handleStop = () => {
        if (!session) return;
        stopSession(session.id, { onError: (err) => setError(err.message) });
    };

    return (
        <>
            <Button
                className="flex items-center justify-center gap-x-8 p-8"
                onClick={openModal}
            >
                <Image width={24} height={24} src={icon} alt={label} />
                <Text className="text-white-primary" as="span" weight="normal" size="base">
                    {label}
                </Text>
                {hasActiveSession && (
                    <span
                        className="w-2 h-2 rounded-full animate-pulse ml-1"
                        style={{ background: "#4ECB71" }}
                    />
                )}
            </Button>

            {/* Modal */}
            <dialog
                ref={dialogRef}
                onClick={handleDialogClick}
                className="m-auto rounded-2xl p-0 outline-none"
                style={{
                    background: "#0D1119",
                    border: "1px solid rgba(255,255,255,0.08)",
                    width: "min(420px, 95vw)",
                    maxHeight: "90vh",
                    // backdrop
                }}
            >
                <style>{`
                    dialog::backdrop {
                        background: rgba(0,0,0,0.7);
                        backdrop-filter: blur(4px);
                    }
                `}</style>

                <div className="flex flex-col p-5 gap-y-4 overflow-y-auto" style={{ maxHeight: "90vh" }}>

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Image width={22} height={22} src={icon} alt="autoseed" />
                            <span className="text-base font-semibold" style={{ color: "#F6F6FE" }}>
                                AutoSeed
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                            style={{ color: "#808080" }}
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="h-px" style={{ background: "rgba(255,255,255,0.07)" }} />

                    {/* Active session or setup */}
                    {hasActiveSession ? (
                        <ActiveSessionPanel
                            session={session}
                            onStop={handleStop}
                            stopping={stopping}
                        />
                    ) : (
                        <>
                            {/* Mode selector */}
                            <div>
                                <p className="text-xs mb-2" style={{ color: "#808080" }}>Режим сидинга</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {(["AUTO_ALL", "SELECTED_SERVERS"] as const).map((m) => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => setMode(m)}
                                            className="rounded-xl py-2.5 px-3 text-sm font-medium transition-all"
                                            style={{
                                                background: mode === m ? "rgba(78,203,113,0.15)" : "rgba(255,255,255,0.05)",
                                                border: `1px solid ${mode === m ? "rgba(78,203,113,0.4)" : "rgba(255,255,255,0.07)"}`,
                                                color: mode === m ? "#4ECB71" : "#808080",
                                            }}
                                        >
                                            {m === "AUTO_ALL" ? "Все серверы" : "Выбрать серверы"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Server list */}
                            <div>
                                <p className="text-xs mb-2" style={{ color: "#808080" }}>
                                    {mode === "AUTO_ALL"
                                        ? "Серверы (автовыбор по приоритету)"
                                        : "Выберите серверы для сидинга"}
                                </p>
                                <div className="flex flex-col gap-y-2">
                                    {serversLoading ? (
                                        <div className="text-center py-4 text-sm" style={{ color: "#808080" }}>
                                            Загрузка...
                                        </div>
                                    ) : servers.length === 0 ? (
                                        <div className="text-center py-4 text-sm" style={{ color: "#808080" }}>
                                            Серверы не настроены
                                        </div>
                                    ) : (
                                        servers.map((srv) => (
                                            <ServerCard
                                                key={srv.id}
                                                server={srv}
                                                selected={mode === "SELECTED_SERVERS" && selectedIds.has(srv.id)}
                                                selectable={mode === "SELECTED_SERVERS"}
                                                onToggle={() => toggleServer(srv.id)}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Consent */}
                            <label
                                className="flex items-start gap-x-3 cursor-pointer rounded-xl p-3"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                }}
                            >
                                <div
                                    className="shrink-0 w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-all"
                                    style={{
                                        background: agreed ? "#4ECB71" : "transparent",
                                        border: `1.5px solid ${agreed ? "#4ECB71" : "rgba(255,255,255,0.25)"}`,
                                    }}
                                >
                                    {agreed && (
                                        <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                                            <path d="M1 3L4 6L9 1" stroke="#070B12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                />
                                <span className="text-xs leading-relaxed" style={{ color: "#808080" }}>
                                    Я понимаю, что AutoSeed автоматически подключит меня к серверу
                                    и будет переключать между серверами до их заполнения.
                                    Игра запустится на моём компьютере автоматически.
                                </span>
                            </label>

                            {/* Error */}
                            {error && (
                                <div
                                    className="rounded-xl px-3 py-2 text-sm"
                                    style={{ background: "rgba(235,16,16,0.1)", color: "#EB1010", border: "1px solid rgba(235,16,16,0.2)" }}
                                >
                                    {error}
                                </div>
                            )}

                            {/* Start button */}
                            <button
                                type="button"
                                onClick={handleStart}
                                disabled={!canStart}
                                className="w-full rounded-xl py-3 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{
                                    background: canStart
                                        ? "linear-gradient(135deg, #4ECB71, #2DA84E)"
                                        : "#262626",
                                    color: canStart ? "#070B12" : "#737373",
                                }}
                            >
                                {starting ? "Запускаю..." : "Начать AutoSeed"}
                            </button>
                        </>
                    )}
                </div>
            </dialog>
        </>
    );
};
