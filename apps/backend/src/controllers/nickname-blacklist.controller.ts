import type { NextFunction, Request, Response } from 'express';

import {
    addNicknameToBlacklist,
    listNicknameBlacklist,
    removeNicknameFromBlacklist,
} from '../services/nickname-blacklist.service';

export async function listNicknameBlacklistController(
    _req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        res.json({ nicknames: await listNicknameBlacklist() });
    } catch (error) {
        next(error);
    }
}

export async function addNicknameBlacklistController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        res.status(201).json({ item: await addNicknameToBlacklist(req.body.nickname) });
    } catch (error) {
        next(error);
    }
}

export async function removeNicknameBlacklistController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        await removeNicknameFromBlacklist(String(req.params.id));
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
}
