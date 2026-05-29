import { ArgumentsHost, Catch, HttpException, type ExceptionFilter } from '@nestjs/common';
import { z } from 'zod';

import { AppError } from '../errors/app-error';

import type { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (error instanceof z.ZodError) {
      return response.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Некорректные данные запроса',
        details: error.flatten(),
      });
    }

    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        error: error.code,
        message: error.message,
        details: error.details,
      });
    }

    if (error instanceof HttpException) {
      const status = error.getStatus();
      const body = error.getResponse();

      if (typeof body === 'object' && body !== null && 'error' in body) {
        return response.status(status).json(body);
      }

      return response.status(status).json({
        error: 'HTTP_ERROR',
        message: error.message,
      });
    }

    console.error('UNHANDLED_ERROR', error);

    return response.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Внутренняя ошибка сервера',
    });
  }
}
