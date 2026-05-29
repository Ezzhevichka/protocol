import { Controller, Get, Next, Post, Req, Res } from '@nestjs/common';

import { env } from '../config/env';
import passport from '../passport';

import type { NextFunction, Request, Response } from 'express';

type PassportRequest = Request & {
  logIn: (user: unknown, callback: (error?: unknown) => void) => void;
  logout: (callback: (error?: unknown) => void) => void;
  session: { destroy: (callback: () => void) => void };
};

@Controller('auth')
export class AuthController {
  @Get('steam')
  steam(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    return passport.authenticate('steam')(req, res, next);
  }

  @Get('steam/return')
  steamReturn(@Req() req: PassportRequest, @Res() res: Response, @Next() next: NextFunction) {
    const failureRedirect = `${env.frontendUrl}/?auth=failed`;

    return passport.authenticate('steam', (error: unknown, user: unknown) => {
      if (error) { return void next(error); }
      if (!user) { return void res.redirect(failureRedirect); }

      return void req.logIn(user, (loginError?: unknown) => {
        if (loginError) { return void next(loginError); }
        return void res.redirect(env.frontendUrl);
      });
    })(req, res, next);
  }

  @Post('logout')
  logout(@Req() req: PassportRequest, @Res() res: Response) {
    req.logout((error?: unknown) => {
      if (error) {
        return res.status(500).json({
          error: 'LOGOUT_FAILED',
          message: 'Не удалось выйти',
        });
      }

      req.session.destroy(() => {
        res.clearCookie('sid');
        res.json({ ok: true });
      });
    });
  }
}
