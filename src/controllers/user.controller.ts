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
    const { error } = postUserSchema.validate(req.body);

    if (error) throw error;

    const user = await createNewUser(req.body);
    successResponse(res, { user }, 201);
    return;
  } catch (error) {
    return next(error);
  }
};