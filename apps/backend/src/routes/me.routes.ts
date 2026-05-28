import { Router } from 'express';

import { isAdminSteamId } from '../services/admins.service';

const router = Router();

router.get('/', (req, res) => {
    const user = req.user ?? null;
    const isAdmin = user ? isAdminSteamId(user.steamId) : false;

    res.json({ user, isAdmin });
});

export default router;
