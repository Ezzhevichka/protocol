import { Router } from "express";
import passport from "../passport";
import { env } from "../config/env";

const router = Router();

router.get("/steam", passport.authenticate("steam"));

router.get(
  "/steam/return",
  passport.authenticate("steam", { failureRedirect: `${env.frontendUrl}/?auth=failed` }),
  (_req, res) => res.redirect(`${env.frontendUrl}`)
);

router.post("/logout", (req, res) => {
  req.logout((error) => {
    if (error) return res.status(500).json({ error: "LOGOUT_FAILED", message: "Не удалось выйти" });

    req.session.destroy(() => {
      res.clearCookie("sid");
      res.json({ ok: true });
    });
  });
});

export default router;
