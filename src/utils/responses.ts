import { Response } from 'express';
import Joi from 'joi';

// Custom predefined API response format
interface IErrorDetail {
  message: string;
  field?: string | unknown;
  stack?: unknown;
}

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
  message: string,
): Response => {
  let errorDetails: IErrorDetail | IErrorDetail[] = {
    message: 'An unexpected error occurred',
  };

  if (process.env.NODE_ENV === 'development') {
    if (Joi.isError(errors)) {
      errorDetails = errors.details.map((error) => ({
        field: error.path.join(', ') || 'unknown',
        message: error.message || 'Invalid input',
      }));
    } else if (Array.isArray(errors)) {
      console.log('in');
      errorDetails = errors.map((error) => ({
        field: error.field || 'unknown',
        message: error.msg || error.message || 'Invalid input',
      }));
    } else if (errors instanceof Error) {
      errorDetails = {
        message: errors.message,
        stack: (errors as any).errors || errors.stack,
      };
    }
  }

  return res.status(statusCode).json({
    status: 'error',
    message,
    errors: errorDetails,
  });
};
