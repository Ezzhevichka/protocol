import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';

import { AppError } from '../errors/app-error';

import type { Request } from 'express';

@Injectable()
export class InternalTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (!token || token !== process.env.INTERNAL_BOT_TOKEN) {
      throw new AppError(401, 'UNAUTHORIZED', 'Неверный internal token');
    }

    return true;
  }
}
