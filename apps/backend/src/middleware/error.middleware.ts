import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../errors/app-error";

export function errorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Некорректные данные запроса",
      details: error.flatten(),
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.code,
      message: error.message,
      details: error.details,
    });
  }

  console.error("UNHANDLED_ERROR", error);

  return res.status(500).json({
    error: "INTERNAL_ERROR",
    message: "Внутренняя ошибка сервера",
  });
}
