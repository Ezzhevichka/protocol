import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.json({ user: req.user ?? null });
});

export default router;
