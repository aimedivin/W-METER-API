import { NextFunction, Request, Response } from 'express';
import { postUserSchema } from '../validators/user.validator';
import { successResponse } from '../utils/responses';
import { createNewUser } from '../services/userServices/registration.service';

export const postUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error } = postUserSchema.validate(req.body, { abortEarly: false });
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
