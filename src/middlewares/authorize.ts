import { Request, Response, NextFunction } from 'express';
import { AppError, AppFailure, ErrorCodes } from '../utils/errors';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { userStatusChecker } from '../helpers/userStatusChecker';
import { IRole } from '../models/role.model';
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        role: IRole;
        phoneNumber: string;
      };
    }
  }
}
interface IJwtPayload extends jwt.JwtPayload {
  userId: string;
  email: string;
  phoneNumber: string;
  role: string;
  iat: number;
  exp: number;
}

const authorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Decoding Token
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new AppFailure('Access denied. No token provided.', 401);
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret)
      throw new AppError(
        'Missing secret key',
        500,
        false,
        ErrorCodes.INTERNAL_ERROR,
      );
    const decodedToken = jwt.verify(token, jwtSecret) as IJwtPayload;

    // User Authorization
    const user = await User.findById(decodedToken.userId).populate<{
      role: IRole;
    }>('role');

    if (!user) {
      throw new AppFailure('User not found.', 404, {
        cause: 'The user ID in the token does not exist.',
      });
    }
    if (userStatusChecker(user.status))
      req.user = {
        id: user.id,
        email: user.email?.email,
        phoneNumber: user.telephone.phoneNumber,
        role: user.role,
      };
    next();
  } catch (error) {
    next(error);
  }
};
export default authorize;
