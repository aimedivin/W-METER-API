import { NextFunction, Request, Response } from 'express';
import {
  postRegisterUserSchema,
  postLoginUserSchema,
} from '../validators/user.validator';
import { successResponse } from '../utils/responses';
import { createNewUser } from '../services/userServices/registration.service';

export const postRegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error } = postRegisterUserSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) throw error;

    const { sanitizedUserInfo, statusCode, message, details } =
      await createNewUser(req.body);

    successResponse(
      res,
      { user: sanitizedUserInfo },
      statusCode,
      message,
      details,
    );
    return;
  } catch (error) {
    return next(error);
  }
};
export const postLoginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error } = postLoginUserSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) throw error;

    const { sanitizedUserInfo, statusCode, message, details } =
      await createNewUser(req.body);

    successResponse(
      res,
      { user: sanitizedUserInfo },
      statusCode,
      message,
      details,
    );
    return;
  } catch (error) {
    return next(error);
  }
};
