import type { NextFunction, Request, Response } from 'express';

import {
    createPrivilege,
    deletePrivilege,
    listPrivilegeGroups,
    listPrivileges,
    updatePrivilege,
    updatePrivilegeGroup,
} from '../services/privileges.service';

export async function listPrivilegeGroupsController(
    _req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        res.json({ groups: await listPrivilegeGroups() });
    } catch (error) {
        next(error);
    }
}

export async function updatePrivilegeGroupController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        res.json({ group: await updatePrivilegeGroup(String(req.params.id), req.body) });
    } catch (error) {
        next(error);
    }
}

export async function listPrivilegesController(_req: Request, res: Response, next: NextFunction) {
    try {
        res.json({ privileges: await listPrivileges() });
    } catch (error) {
        next(error);
    }
}

export async function createPrivilegeController(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(201).json({ privilege: await createPrivilege(req.body) });
    } catch (error) {
        next(error);
    }
}

export async function updatePrivilegeController(req: Request, res: Response, next: NextFunction) {
    try {
        res.json({ privilege: await updatePrivilege(String(req.params.id), req.body) });
    } catch (error) {
        next(error);
    }
}

export async function deletePrivilegeController(req: Request, res: Response, next: NextFunction) {
    try {
        await deletePrivilege(String(req.params.id));
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
}
