import { Response } from 'express';
import { ErrorCodes } from './errors';

// Custom predefined API responses format

export const successResponse = (
  res: Response,
  data: Record<string, object> | undefined,
  statusCode: number,
  message?: string,
): Response =>
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });

export const errorResponse = (
  res: Response,
  errors: unknown,
  statusCode: number,
  errorCode: ErrorCodes,
  message: string,
): Response => {
  return res.status(statusCode).json({
    status: 'error',
    errorCode,
    message,
    errors: errors,
  });
};
