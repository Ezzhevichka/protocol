import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { prisma } from '@squad-admin/database';

import { AppError } from '../errors/app-error';

import type { Request } from 'express';

type AuthenticatedRequest = Request & {
  isAuthenticated?: () => boolean;
  logout: (callback: () => void) => void;
  user?: { id?: string };
};

@Injectable()
export class SessionAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!req.isAuthenticated?.() || !req.user?.id) {
      throw new AppError(401, 'UNAUTHORIZED', 'Нужна авторизация');
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) {
      req.logout(() => undefined);
      throw new AppError(401, 'USER_NOT_FOUND', 'Пользователь не найден');
    }

    req.user = user;
    return true;
  }
}
