// RBAC Middleware
import { Request, Response, NextFunction } from 'express';
import { AppFailure } from '../utils/errors';
import { Permissions } from '../models/role.model';

type RolePermissions = {
  [role in Permissions.ADMIN | Permissions.STAFF]?: Array<
    | Permissions.READ
    | Permissions.WRITE
    | Permissions.UPDATE
    | Permissions.DELETE
  >;
} & {
  [Permissions.CLIENT]?: boolean;
};
const accessController =
  (permissions: RolePermissions) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppFailure('Authorization required. Please log in.', 401);
      }

      let isAllowed: boolean | undefined = false;

      for (const role of Object.keys(permissions)) {
        if (role === Permissions.CLIENT) {
          isAllowed =
            permissions[role as keyof RolePermissions] &&
            req.user!.role.permission.includes(role);
          if (isAllowed) break;
        } else {
          isAllowed =
            isAllowed ||
            (req.user!.role.permission.includes(role) &&
              (
                permissions[role as keyof RolePermissions] as Array<
                  | Permissions.READ
                  | Permissions.WRITE
                  | Permissions.UPDATE
                  | Permissions.DELETE
                >
              )?.reduce(
                (acc, val) => acc && req.user!.role.permission.includes(val),
                true,
              ));
        }
      }

      if (!isAllowed)
        throw new AppFailure('Permission denied', 403, {
          description: 'User does not have the required permissions.',
        });
      next();
    } catch (error) {
      next(error);
    }
  };

export default accessController;
