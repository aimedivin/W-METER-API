import { Response, Request, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError, AppFailure, ErrorCodes } from '../utils/errors';
import Joi from 'joi';
import { errorResponse, failureResponse } from '../utils/responses';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let customError: Error | AppFailure = err;

  // Mongoose errors
  if (err instanceof mongoose.Error.ValidationError) {
    customError = new AppError(
      err.message,
      420,
      true,
      ErrorCodes.DATA_CONFLICT,
      err.errors,
    );
  }
  if (err instanceof mongoose.Error.CastError) {
    customError = new AppError(
      `Invalid ${err.path}: ${err.value}`,
      400,
      true,
      ErrorCodes.INVALID_INPUT,
    );
  }
  if (err.name === 'MongoServerError') {
    customError = new AppError(err.message, 400, true, ErrorCodes.DATABASE);
  }

  if (Joi.isError(err)) {
    const errorDetails = err.details.map((error) => ({
      field: error.path.join(', ') || 'unknown',
      message: error.message || 'Invalid input',
    }));
    customError = new AppFailure(
      'Validation Error: Please ensure your input is correct.',
      400,
      // ErrorCodes.INVALID_INPUT,
      errorDetails,
    );
  }

  // unknown errors
  if (
    !(customError instanceof AppError) &&
    !(customError instanceof AppFailure)
  ) {
    customError = new AppError(
      'Internal Server Error',
      500,
      false,
      ErrorCodes.INTERNAL_ERROR,
    );
  }

  if (customError instanceof AppFailure) {
    const { statusCode, message, details } = customError as AppFailure;
    failureResponse(res, statusCode, message, details);
  } else {
    const { statusCode, message, errorCode, details } = customError as AppError;
    errorResponse(res, details, statusCode, errorCode, message);
  }

  return;
};

export default errorHandler;
