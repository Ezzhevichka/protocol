export enum MapImage {
    AlBasrah    = '/basemaps/albasrahBaseMap.webp',
    Anvil       = '/basemaps/anvilBaseMap.webp',
    Belaya      = '/basemaps/belayaBaseMap.webp',
    BlackCoast  = '/basemaps/blackcoastBaseMap.webp',
    Chora       = '/basemaps/choraBaseMap.webp',
    Fallujah    = '/basemaps/fallujahBaseMap.webp',
    FoolsRoad   = '/basemaps/foolsroadBaseMap.webp',
    GooseBay    = '/basemaps/goosebayBaseMap.webp',
    Gorodok     = '/basemaps/gorodokBaseMap.webp',
    Harju       = '/basemaps/harjuBaseMap.webp',
    Jensen      = '/basemaps/jensenBaseMap.webp',
    Kamdesh     = '/basemaps/kamdeshBaseMap.webp',
    Kohat       = '/basemaps/kohatBaseMap.webp',
    Kokan       = '/basemaps/kokanBaseMap.webp',
    Lashkar     = '/basemaps/lashkarBaseMap.webp',
    Logar       = '/basemaps/logarBaseMap.webp',
    Manicouagan = '/basemaps/manicouaganBaseMap.webp',
    Mestia      = '/basemaps/mestiaBaseMap.webp',
    Mutaha      = '/basemaps/mutahaBaseMap.webp',
    Narva       = '/basemaps/narvaBaseMap.webp',
    NarvaFlooded = '/basemaps/narva_fBaseMap.webp',
    Pacific     = '/basemaps/pacificBaseMap.webp',
    Sanxian     = '/basemaps/sanxianBaseMap.webp',
    Skorpo      = '/basemaps/skorpoBaseMap.webp',
    Sumari      = '/basemaps/sumariBaseMap.webp',
    Tallil      = '/basemaps/tallilBaseMap.webp',
    Yehorivka   = '/basemaps/yehorivkaBaseMap.webp'
}

const LAYER_TO_MAP: Array<[RegExp, MapImage]> = [
    [/al.?basrah/i,         MapImage.AlBasrah],
    [/anvil/i,              MapImage.Anvil],
    [/belaya/i,             MapImage.Belaya],
    [/black.?coast/i,       MapImage.BlackCoast],
    [/chora/i,              MapImage.Chora],
    [/fallujah/i,           MapImage.Fallujah],
    [/fools.?road/i,        MapImage.FoolsRoad],
    [/goose.?bay/i,         MapImage.GooseBay],
    [/gorodok/i,            MapImage.Gorodok],
    [/harju/i,              MapImage.Harju],
    [/jensen/i,             MapImage.Jensen],
    [/kamdesh/i,            MapImage.Kamdesh],
    [/kohat/i,              MapImage.Kohat],
    [/kokan/i,              MapImage.Kokan],
    [/lashkar/i,            MapImage.Lashkar],
    [/logar/i,              MapImage.Logar],
    [/manicouagan/i,        MapImage.Manicouagan],
    [/mestia/i,             MapImage.Mestia],
    [/mutaha/i,             MapImage.Mutaha],
    [/narva.*(flood|_f)/i,  MapImage.NarvaFlooded],
    [/narva/i,              MapImage.Narva],
    [/pacific/i,            MapImage.Pacific],
    [/san.?xian/i,          MapImage.Sanxian],
    [/skorpo/i,             MapImage.Skorpo],
    [/sumari/i,             MapImage.Sumari],
    [/tallil/i,             MapImage.Tallil],
    [/yehorivka/i,          MapImage.Yehorivka],
];

/**
 * Принимает название слоя с сервера (например "Harju_Invasion_v3")
 * и возвращает значение из MapImage или undefined если карта не найдена.
 */
export function resolveMapImage(layer: string | undefined | null): MapImage | undefined {
    if (!layer) return undefined;

    for (const [pattern, image] of LAYER_TO_MAP) {
        if (pattern.test(layer)) return image;
    }

    return undefined;
}
