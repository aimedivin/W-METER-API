import { Request, Response, NextFunction } from 'express';
import { AppFailure } from '../utils/errors';
import fetchRolesAndPermissions from '../services/roleServices/fetchRolesAndPermissions.service';
import { successResponse } from '../utils/responses';
import {
  postRoleAndPermissionSchema,
  putRoleAndPermissionSchema,
} from '../validators/role.validator';
import createRolesAndPermissions, {
  IRolesInputs,
} from '../services/roleServices/createRolesAndPermissions.service';
import updateRolesAndPermissions from '../services/roleServices/updateRolesAndPermissions.service';

export const getRolesAndPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppFailure('Authorization required. Please log in.', 401);
    }

    const roles = await fetchRolesAndPermissions();

    successResponse(res, { roles }, 200, 'Roles retrieved successfully.');

    return;
  } catch (error) {
    next(error);
  }
};

export const postRolesAndPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppFailure('Authorization required. Please log in.', 401);
    }

    const { error } = postRoleAndPermissionSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) throw error;

    const roles = await createRolesAndPermissions(req.body);

    successResponse(
      res,
      { roles },
      201,
      `Role${(req.body as Array<IRolesInputs>).length > 1 ? 's' : ''} created successfully.`,
    );

    return;
  } catch (error) {
    next(error);
  }
};

export const putRolesAndPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppFailure('Authorization required. Please log in.', 401);
    }

    const roleId = req.params.id;

    if (!roleId) {
      throw new AppFailure(
        'Role ID is required. Please provide a valid role ID.',
        400,
      );
    }

    const { error } = putRoleAndPermissionSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) throw error;

    const role = await updateRolesAndPermissions(roleId, req.body);

    successResponse(res, { role }, 200, `Role updated successfully.`);

    return;
  } catch (error) {
    next(error);
  }
};
