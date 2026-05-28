const FACTION_FLAG_MAP: Record<string, string> = {
    RGF:    '/flags/RGFFlag.webp',
    VDV:    '/flags/VDVFlag.webp',
    AFU:    '/flags/AFUFlag.webp',
    USA:    '/flags/USAFlag.webp',
    USMC:   '/flags/USMCFlag.webp',
    BAF:    '/flags/BAFFlag.webp',
    CAF:    '/flags/CAFFlag.webp',
    ADF:    '/flags/ADFFlag.webp',
    MEI:    '/flags/MEIFlag.webp',
    IMF:    '/flags/IMFFlag.webp',
    PLA:    '/flags/PLAFlag.webp',
    PLANMC: '/flags/PLANMCFlag.webp',
    PLAAGF: '/flags/PLAAGFFlag.webp',
    WPMC:   '/flags/WPMCFlag.webp',
    CRF:    '/flags/CRFFlag.webp',
    GFI:    '/flags/GFIFlag.webp',
    TLF:    '/flags/TLFFlag.webp',
};

/**
 * Принимает идентификатор фракции с сервера (например "RGF_S_CombinedArms_Seed")
 * и возвращает путь к флагу или undefined.
 */
export function resolveFactionFlag(teamId: string | undefined | null): string | undefined {
    if (!teamId) return undefined;
    const prefix = teamId.split('_')[0].toUpperCase();
    return FACTION_FLAG_MAP[prefix];
}

/**
 * Возвращает читаемое название фракции.
 */
export function resolveFactionName(teamId: string | undefined | null): string {
    if (!teamId) return '—';
    const prefix = teamId.split('_')[0].toUpperCase();
    const NAMES: Record<string, string> = {
        RGF:    'Russian Ground Forces',
        VDV:    'Russian Airborne Forces',
        AFU:    'Armed Forces of Ukraine',
        USA:    'United States Army',
        USMC:   'US Marine Corps',
        BAF:    'British Armed Forces',
        CAF:    'Canadian Armed Forces',
        ADF:    'Australian Defence Force',
        MEI:    'Middle Eastern Insurgents',
        IMF:    'Irregular Militia Forces',
        PLA:    'People\'s Liberation Army',
        PLANMC: 'PLA Navy Marine Corps',
        PLAAGF: 'PLA Air Ground Forces',
        WPMC:   'Western PMC',
        CRF:    'Conqueror\'s Rangers',
        GFI:    'Global Free Initiative',
        TLF:    'Turkmenistan Liberation Forces',
    };
    return NAMES[prefix] ?? teamId;
}
