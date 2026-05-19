// TODO: заменить fill="var(--fill-0, #999999)" на fill="currentColor" во всех SVG в public/kits/ и public/general/
// чтобы цвет иконок управлялся через CSS, а не был захардкожен в самом файле
//TODO В будущем убрать этот блок. PS giro "это потом уберётся, когда докинем абстрактную компоненту иконки"
export type KitIconSize = { width: number; height: number };

export enum KitName {
    SL = 'SL',
    SQUAD_LEADER = 'SQUAD_LEADER',
    LEADER = 'LEADER',
    PILOT = 'PILOT',
    LEAD_PILOT = 'LEAD_PILOT',
    CREWMAN = 'CREWMAN',
    LEAD_CREWMAN = 'LEAD_CREWMAN',
    SCOUT = 'SCOUT',
    SNIPER = 'SNIPER',
    RAIDER = 'RAIDER',
    MEDIC = 'MEDIC',
    ENGINEER = 'ENGINEER',
    COMBAT_ENGINEER = 'COMBAT_ENGINEER',
    SAPPER = 'SAPPER',
    RECRUIT = 'RECRUIT',
    GRENADIER = 'GRENADIER',
    MARKSMAN = 'MARKSMAN',
    MACHINE_GUNNER = 'MACHINE_GUNNER',
    AUTOMATIC_RIFLEMAN = 'AUTOMATIC_RIFLEMAN',
    AUTOMATICS_RIFLEMAN = 'AUTOMATICS_RIFLEMAN',
    LIGHT_ANTI_TANK = 'LIGHT_ANTI_TANK',
    HEAVY_ANTI_TANK = 'HEAVY_ANTI_TANK',
    UNARMED = 'UNARMED',
    RIFLEMAN = 'RIFLEMAN',
    ASSAULT_RIFLEMAN = 'ASSAULT_RIFLEMAN',
    DEFAULT = 'DEFAULT'
}

const KIT_ICON_BY_NAME: Record<KitName, string> = {
    [KitName.SL]: '/roles/squad_leader.webp',
    [KitName.SQUAD_LEADER]: '/roles/squad_leader.webp',
    [KitName.LEADER]: '/roles/squad_leader.webp',
    [KitName.PILOT]: '/roles/pilot.webp',
    [KitName.LEAD_PILOT]: '/roles/lead_pilot.webp',
    [KitName.CREWMAN]: '/roles/crewman.webp',
    [KitName.LEAD_CREWMAN]: '/roles/lead_crewman.webp',
    [KitName.SCOUT]: '/roles/rifleman.webp',
    [KitName.SNIPER]: '/roles/sniper.webp',
    [KitName.RAIDER]: '/roles/rifleman.webp',
    [KitName.MEDIC]: '/roles/medic.webp',
    [KitName.ENGINEER]: '/roles/engineer.webp',
    [KitName.COMBAT_ENGINEER]: '/roles/engineer.webp',
    [KitName.SAPPER]: '/roles/engineer.webp',
    [KitName.RECRUIT]: '/roles/unarmed.webp',
    [KitName.GRENADIER]: '/roles/grenadier.webp',
    [KitName.MARKSMAN]: '/roles/marksman.webp',
    [KitName.MACHINE_GUNNER]: '/roles/machine_gunner.webp',
    [KitName.AUTOMATIC_RIFLEMAN]: '/roles/automatic_rifleman.webp',
    [KitName.AUTOMATICS_RIFLEMAN]: '/roles/automatic_rifleman.webp',
    [KitName.LIGHT_ANTI_TANK]: '/roles/lat.webp',
    [KitName.HEAVY_ANTI_TANK]: '/roles/hat.webp',
    [KitName.UNARMED]: '/roles/unarmed.webp',
    [KitName.RIFLEMAN]: '/roles/rifleman.webp',
    [KitName.ASSAULT_RIFLEMAN]: '/roles/rifleman.webp',
    [KitName.DEFAULT]: '/roles/unarmed.webp',
};

const DEFAULT_KIT_ICON = '/roles/unarmed.webp';
const DEFAULT_KIT_ICON_SIZE: KitIconSize = { width: 24, height: 24 };

const KIT_ICON_SIZE_BY_NAME: Partial<Record<KitName, KitIconSize>> = {};

const normalizeKitName = (kitName: string) => {
    return kitName
        .trim()
        .replace(/[\s-]+/g, '_')
        .toUpperCase();
};

export const resolveKitIcon = (kitName?: string) => {
    if (!kitName) {
        return DEFAULT_KIT_ICON;
    }

    const normalizedName = normalizeKitName(kitName);

    return KIT_ICON_BY_NAME[normalizedName as KitName] ?? DEFAULT_KIT_ICON;
};

export const resolveKitIconSize = (kitName?: string) => {
    if (!kitName) {
        return DEFAULT_KIT_ICON_SIZE;
    }

    const normalizedName = normalizeKitName(kitName);

    return KIT_ICON_SIZE_BY_NAME[normalizedName as KitName] ?? DEFAULT_KIT_ICON_SIZE;
};
