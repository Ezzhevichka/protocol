import { BadRequestException, Injectable, type PipeTransform } from '@nestjs/common';

import type { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException({
        error: 'VALIDATION_ERROR',
        message: 'Некорректные данные запроса',
        details: result.error.flatten(),
      });
    }

    return result.data;
  }
}
