import { Response } from 'express';

// Custom predefined API response format
interface IErrorDetail {
  message: string;
  field?: string | unknown;
  stack?: string;
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
    if (Array.isArray(errors)) {
      errorDetails = errors.map((error) => ({
        field: error.field || 'unknown',
        message: error.msg || error.message || 'Invalid input',
      }));
    }
    if (errors instanceof Error) {
      errorDetails = { message: errors.message, stack: errors.stack };
    }
  }

  return res.status(statusCode).json({
    status: 'error',
    message,
    errors: errorDetails,
  });
};
