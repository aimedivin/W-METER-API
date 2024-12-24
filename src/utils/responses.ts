import { Response } from 'express';
import { ErrorCodes } from './errors';

// Custom predefined API responses format

export const successResponse = (
  res: Response,
  data: Record<string, object> | undefined,
  statusCode: number,
  message?: string,
  details?: unknown,
): Response =>
  res.status(statusCode).json({
    status: statusCode === 207 ? 'multi_status' : 'success',
    message,
    details,
    data,
  });

export const failureResponse = (
  res: Response,
  statusCode: number,
  // failureCode: string,
  message: string,
  details?: unknown,
): Response => {
  return res.status(statusCode).json({
    status: 'failure',
    // failureCode,
    message,
    details: details || null,
  });
};

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
