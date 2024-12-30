// RBAC Middleware
import { Request, Response, NextFunction } from 'express';
import { AppFailure } from '../utils/errors';
import { Permissions } from '../models/role.model';

const accessController =
  (permissions: Array<Permissions>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppFailure('Authorization required. Please log in.', 401);
    }

    const isAllowed = permissions.reduce(
      (acc, val) => acc && req.user!.role.permission.includes(val),
      true,
    );
    if (!isAllowed)
      next(
        new AppFailure('User does not have the required permissions.', 403, {
          description: 'Permission denied',
        }),
      );

    next();
  };

export default accessController;
