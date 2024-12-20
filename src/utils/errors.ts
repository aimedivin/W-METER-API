export enum ErrorCodes {
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  INVALID_INPUT = 'ERR_INVALID_INPUT',
  RESOURCE_NOT_FOUND = 'ERR_RESOURCE_NOT_FOUND',
  UNAUTHORIZED = 'ERR_UNAUTHORIZED',
  INTERNAL_ERROR = 'ERR_INTERNAL_SERVER_ERROR',
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errorCode: ErrorCodes;
  public readonly details: unknown;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    errorCode: ErrorCodes,
    details?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorCode = errorCode;
    this.details = details;

    // Maintain proper stack trace for where the error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// export class DatabaseError extends AppError {
//   constructor(message = 'Database Error', details?: unknown) {
//     super(message, 500, true, details);
//   }
// }

// export class ValidationError extends AppError {
//   constructor(message: string, details?: unknown) {
//     super(message, 400, true, details);
//   }
// }
