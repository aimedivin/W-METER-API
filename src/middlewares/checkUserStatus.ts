import { Request, Response, NextFunction } from 'express';
import { AppFailure } from '../utils/errors';
import User from '../models/user.model';
import { userStatusChecker } from '../helpers/userStatusChecker';

const checkUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppFailure('Authorization required. Please log in.', 401);
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppFailure('User not found.', 404);
    }
    if (userStatusChecker(user.status)) {
      next();
    }
  } catch (error) {
    next(error);
  }
};

export default checkUserStatus;
