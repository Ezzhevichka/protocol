/**
 * Парсит кит из строки роли вида "AFU_Rifleman_13", "RGF_SL_03", "RGF_LAT_01"
 * Убирает префикс фракции и числовой суффикс, возвращает название кита.
 */
export function parseKitFromRole(role: string | undefined | null): string {
    if (!role) return '';
    const parts = role.split('_');
    if (parts.length < 2) return role;
    const withoutFaction = parts.slice(1);
    const last = withoutFaction[withoutFaction.length - 1];
    const kitParts = /^\d+$/.test(last) ? withoutFaction.slice(0, -1) : withoutFaction;
    return kitParts.join('_');
}
