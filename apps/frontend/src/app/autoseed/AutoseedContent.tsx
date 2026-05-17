'use client';

import { useState, useEffect } from "react";
import { Text } from "shared/ui";
import {
    useAutoseedServers,
    useAutoseedStatus,
    useStartAutoseed,
    useStopAutoseed,
    type SeedServer,
} from "shared/hooks/useAutoseed";

// ─── Shared styles ────────────────────────────────────────────────────────────

const card = {
    background: "#0D1119",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "20px",
} satisfies React.CSSProperties;

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon() {
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
            background: "rgba(78,203,113,0.15)", border: "1px solid rgba(78,203,113,0.3)",
        }}>
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="#4ECB71" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </span>
    );
}

function InfoIcon() {
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
        }}>
            <svg width="3" height="9" viewBox="0 0 3 9" fill="none">
                <path d="M1.5 1V1.5M1.5 3.5V8" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        </span>
    );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

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
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            borderRadius: "999px", padding: "4px 10px",
            background: isActive ? "rgba(78,203,113,0.15)" : "rgba(255,255,255,0.07)",
            color: isActive ? "#4ECB71" : "#808080",
            fontSize: 12, fontWeight: 500,
        }}>
            {isActive && (
                <span style={{
                    display: "inline-block", width: 6, height: 6,
                    borderRadius: "50%", background: "#4ECB71",
                    animation: "pulse 2s infinite",
                }} />
            )}
            {STATUS_LABELS[status] ?? status}
        </span>
    );
}

// ─── Server card ──────────────────────────────────────────────────────────────

function ServerCard({ server, selected, selectable, onToggle }: {
    server: SeedServer;
    selected: boolean;
    selectable: boolean;
    onToggle: () => void;
}) {
    const players = server.lastPlayers ?? 0;
    const pct = server.seedThreshold > 0 ? Math.min((players / server.seedThreshold) * 100, 100) : 0;
    const isSeeded = players >= server.seedThreshold;
    const hasError = Boolean(server.lastQueryError);

    return (
        <button
            type="button"
            onClick={selectable ? onToggle : undefined}
            style={{
                width: "100%", textAlign: "left", borderRadius: 12, padding: 12,
                background: selected ? "rgba(78,203,113,0.10)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${selected ? "rgba(78,203,113,0.35)" : "rgba(255,255,255,0.07)"}`,
                cursor: selectable ? "pointer" : "default",
                transition: "all 0.15s",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    {selectable && (
                        <div style={{
                            flexShrink: 0, width: 16, height: 16, borderRadius: 4,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: selected ? "#4ECB71" : "transparent",
                            border: `1.5px solid ${selected ? "#4ECB71" : "rgba(255,255,255,0.25)"}`,
                            transition: "all 0.15s",
                        }}>
                            {selected && (
                                <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                                    <path d="M1 3L4 6L9 1" stroke="#070B12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                    )}
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#F6F6FE", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {server.name}
                    </span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, flexShrink: 0, color: hasError ? "#808080" : isSeeded ? "#4ECB71" : "#F6F6FE" }}>
                    {hasError ? "недоступен" : `${players}/${server.seedThreshold}`}
                </span>
            </div>
            <div style={{ height: 4, borderRadius: 999, overflow: "hidden", background: "rgba(255,255,255,0.08)" }}>
                <div style={{
                    height: "100%", borderRadius: 999, transition: "width 0.5s",
                    width: `${pct}%`,
                    background: isSeeded ? "#4ECB71" : hasError ? "#444" : "linear-gradient(90deg,#1D4AFF,#4ECB71)",
                }} />
            </div>
        </button>
    );
}

// ─── Active session panel ─────────────────────────────────────────────────────

function ActiveSessionPanel({ session, onStop, stopping }: {
    session: NonNullable<ReturnType<typeof useAutoseedStatus>["data"]>;
    onStop: () => void;
    stopping: boolean;
}) {
    const current = session.currentServer;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Text as="span" size="sm" weight="semibold" style={{ color: "#F6F6FE" }}>Текущая сессия</Text>
                <SessionStatusBadge status={session.status} />
            </div>

            {current && (
                <div style={{ borderRadius: 12, padding: 12, background: "rgba(78,203,113,0.07)", border: "1px solid rgba(78,203,113,0.2)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: "#4ECB71" }}>Сейчас сидит:</span>
                        <span style={{ fontSize: 12, color: "#808080" }}>{current.lastPlayers ?? 0}/{current.seedThreshold} игроков</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#F6F6FE" }}>{current.name}</span>
                    {current.lastMap && <div style={{ fontSize: 12, marginTop: 2, color: "#808080" }}>{current.lastMap}</div>}
                </div>
            )}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "#808080" }}>
                <span>Посеяно серверов: <b style={{ color: "#F6F6FE" }}>{session.seededCount}</b></span>
                <span>+{session.ratingPointsEarned} очков</span>
            </div>

            <button
                type="button" onClick={onStop} disabled={stopping}
                style={{
                    width: "100%", borderRadius: 12, padding: "12px 0",
                    fontSize: 14, fontWeight: 600, cursor: stopping ? "not-allowed" : "pointer",
                    background: "rgba(235,16,16,0.12)", border: "1px solid rgba(235,16,16,0.25)",
                    color: "#EB1010", opacity: stopping ? 0.5 : 1, transition: "opacity 0.15s",
                }}
            >
                {stopping ? "Останавливаю..." : "Остановить AutoSeed"}
            </button>
        </div>
    );
}

// ─── AutoSeed connect card ────────────────────────────────────────────────────

function AutoseedConnectCard() {
    const [mode, setMode] = useState<"AUTO_ALL" | "SELECTED_SERVERS">("AUTO_ALL");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: servers = [], isLoading: serversLoading } = useAutoseedServers();
    const { data: session } = useAutoseedStatus();
    const { mutate: startSession, isPending: starting } = useStartAutoseed();
    const { mutate: stopSession, isPending: stopping } = useStopAutoseed();

    const hasActiveSession = session != null;

    useEffect(() => {
        if (mode === "AUTO_ALL") setSelectedIds(new Set());
    }, [mode]);

    const toggleServer = (id: string) =>
        setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

    const canStart = agreed && !starting && (mode === "AUTO_ALL" || selectedIds.size > 0);

    const handleStart = () => {
        setError(null);
        startSession(
            { mode, selectedServerIds: mode === "SELECTED_SERVERS" ? [...selectedIds] : undefined },
            { onError: (err) => setError(err.message) }
        );
    };

    const handleStop = () => {
        if (!session) return;
        stopSession(session.id, { onError: (err) => setError(err.message) });
    };

    return (
        <div style={card}>
            <div style={{ marginBottom: 20 }}>
                <Text as="h3" size="base" weight="semibold" style={{ color: "#F6F6FE" }}>
                    Подключиться к Seed'у
                </Text>
                <Text size="sm" style={{ color: "#808080", marginTop: 6 }}>
                    AutoSeed автоматически подключит вас к серверу и будет переключать между серверами до их заполнения.
                </Text>
            </div>

            {hasActiveSession ? (
                <ActiveSessionPanel session={session} onStop={handleStop} stopping={stopping} />
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Mode selector */}
                    <div>
                        <p style={{ fontSize: 12, color: "#808080", marginBottom: 8 }}>Режим сидинга</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            {(["AUTO_ALL", "SELECTED_SERVERS"] as const).map((m) => (
                                <button
                                    key={m} type="button" onClick={() => setMode(m)}
                                    style={{
                                        borderRadius: 12, padding: "10px 12px",
                                        fontSize: 14, fontWeight: 500, cursor: "pointer",
                                        background: mode === m ? "rgba(78,203,113,0.15)" : "rgba(255,255,255,0.05)",
                                        border: `1px solid ${mode === m ? "rgba(78,203,113,0.4)" : "rgba(255,255,255,0.07)"}`,
                                        color: mode === m ? "#4ECB71" : "#808080",
                                        transition: "all 0.15s",
                                    }}
                                >
                                    {m === "AUTO_ALL" ? "Все серверы" : "Выбрать серверы"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Server list */}
                    <div>
                        <p style={{ fontSize: 12, color: "#808080", marginBottom: 8 }}>
                            {mode === "AUTO_ALL" ? "Серверы (автовыбор по приоритету)" : "Выберите серверы для сидинга"}
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {serversLoading ? (
                                <div style={{ textAlign: "center", padding: "16px 0", fontSize: 14, color: "#808080" }}>
                                    Загрузка...
                                </div>
                            ) : servers.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "16px 0", fontSize: 14, color: "#808080" }}>
                                    Серверы не настроены
                                </div>
                            ) : (
                                servers.map((srv) => (
                                    <ServerCard
                                        key={srv.id} server={srv}
                                        selected={mode === "SELECTED_SERVERS" && selectedIds.has(srv.id)}
                                        selectable={mode === "SELECTED_SERVERS"}
                                        onToggle={() => toggleServer(srv.id)}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Consent */}
                    <label style={{
                        display: "flex", alignItems: "flex-start", gap: 12,
                        cursor: "pointer", borderRadius: 12, padding: 12,
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                    }}>
                        <div style={{
                            flexShrink: 0, width: 16, height: 16, borderRadius: 4, marginTop: 2,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: agreed ? "#4ECB71" : "transparent",
                            border: `1.5px solid ${agreed ? "#4ECB71" : "rgba(255,255,255,0.25)"}`,
                            transition: "all 0.15s",
                        }}>
                            {agreed && (
                                <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                                    <path d="M1 3L4 6L9 1" stroke="#070B12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                        <input type="checkbox" className="sr-only" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                        <span style={{ fontSize: 12, lineHeight: 1.6, color: "#808080" }}>
                            Я понимаю, что AutoSeed автоматически подключит меня к серверу и будет
                            переключать между серверами до их заполнения. Игра запустится на моём
                            компьютере автоматически.
                        </span>
                    </label>

                    {/* Error */}
                    {error && (
                        <div style={{ borderRadius: 12, padding: "8px 12px", fontSize: 14, background: "rgba(235,16,16,0.1)", color: "#EB1010", border: "1px solid rgba(235,16,16,0.2)" }}>
                            {error}
                        </div>
                    )}

                    {/* Start button */}
                    <button
                        type="button" onClick={handleStart} disabled={!canStart}
                        style={{
                            width: "100%", borderRadius: 12, padding: "14px 0",
                            fontSize: 14, fontWeight: 600, cursor: canStart ? "pointer" : "not-allowed",
                            background: canStart ? "#1D4AFF" : "#1E1E1E",
                            border: `1px solid ${canStart ? "#1D4AFF" : "rgba(255,255,255,0.07)"}`,
                            color: canStart ? "#fff" : "#4D4D4D",
                            opacity: canStart ? 1 : 0.7,
                            transition: "all 0.15s",
                        }}
                    >
                        {starting ? "Запускаю..." : "Подключиться к Seed'у"}
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Permission checklist card ────────────────────────────────────────────────

function PermissionCard() {
    return (
        <div style={card}>
            <Text as="h3" size="base" weight="semibold" style={{ color: "#F6F6FE", marginBottom: 16 }}>
                Разрешения
            </Text>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <CheckIcon />
                    <span style={{ fontSize: 14, color: "#B0B0B0" }}>Разрешить автоматические всплывающие окна</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <CheckIcon />
                    <span style={{ fontSize: 14, color: "#B0B0B0" }}>Авторизация через Steam выполнена</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <InfoIcon />
                    <span style={{ fontSize: 14, color: "#B0B0B0", lineHeight: 1.5 }}>
                        Перейдите в настройки Squad и разрешите подключение к серверам сообщества
                    </span>
                </div>
            </div>
            <button
                type="button"
                style={{
                    width: "100%", borderRadius: 12, padding: "12px 0",
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                    background: "#1D4AFF", border: "none", color: "#fff",
                    transition: "opacity 0.15s",
                }}
            >
                Настроить разрешения
            </button>
        </div>
    );
}

// ─── How it works section ─────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p style={{ fontSize: 11, fontWeight: 600, color: "#808080", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
            {children}
        </p>
    );
}

// ─── Main page content ────────────────────────────────────────────────────────

export function AutoseedContent() {
    return (
        <main style={{ minHeight: "100vh", background: "#04070B" }}>
            <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 16px 80px", display: "flex", flexDirection: "column", gap: 32 }}>

                {/* Heading */}
                <div>
                    <h1 style={{ fontFamily: "var(--font-manrope, Manrope, sans-serif)", fontSize: 26, fontWeight: 600, color: "#F6F6FE", margin: 0 }}>
                        Привет,{" "}
                        <span style={{ color: "#4ECB71" }}>Seeder</span>
                    </h1>
                    <p style={{ fontSize: 14, color: "#808080", marginTop: 8, lineHeight: 1.6 }}>
                        Помогай серверам наполняться игроками и зарабатывай рейтинговые очки автоматически.
                    </p>
                </div>

                {/* How it works */}
                <section>
                    <SectionLabel>Как это работает?</SectionLabel>
                    <div style={card}>
                        <p style={{ fontSize: 14, color: "#B0B0B0", lineHeight: 1.7, margin: 0, marginBottom: 12 }}>
                            AutoSeed — система автоматического сидинга серверов. Ваш агент (клиентское приложение)
                            подключается к игровым серверам и помогает им набирать игроков.
                        </p>
                        <p style={{ fontSize: 14, color: "#B0B0B0", lineHeight: 1.7, margin: 0 }}>
                            Система отслеживает количество игроков в реальном времени и автоматически переключает
                            вас между серверами, которые нуждаются в помощи. Когда сервер заполнен — переходите к следующему.
                        </p>
                    </div>
                </section>

                {/* What's required */}
                <section>
                    <SectionLabel>Что требуется от вас?</SectionLabel>
                    <div style={card}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {[
                                "Установить и запустить клиентское приложение AutoSeed Agent на вашем компьютере",
                                "Иметь установленную игру Squad и активный аккаунт Steam",
                                "Находиться онлайн и не использовать игру в это время — AutoSeed управляет ей автоматически",
                            ].map((text, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                    <span style={{
                                        flexShrink: 0, width: 22, height: 22, borderRadius: "50%",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 11, fontWeight: 700, marginTop: 1,
                                        background: "rgba(29,74,255,0.15)", color: "#1D4AFF",
                                        border: "1px solid rgba(29,74,255,0.3)",
                                    }}>
                                        {i + 1}
                                    </span>
                                    <span style={{ fontSize: 14, color: "#B0B0B0", lineHeight: 1.6 }}>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Permissions */}
                <PermissionCard />

                {/* AutoSeed connect */}
                <AutoseedConnectCard />

            </div>
        </main>
    );
}
