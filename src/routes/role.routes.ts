import { Router } from 'express';
import accessController from '../middlewares/accessController';
import {
  getRolesAndPermissions,
  postRolesAndPermissions,
  putRolesAndPermissions,
} from '../controllers/roles.controller';
import { Permissions } from '../models/role.model';
import authorize from '../middlewares/authorize';

const router = Router();

router.get(
  '/',
  authorize,
  accessController({
    [Permissions.ADMIN]: [Permissions.READ],
  }),
  getRolesAndPermissions,
);

router.post(
  '/',
  authorize,
  accessController({
    [Permissions.ADMIN]: [Permissions.WRITE],
  }),
  postRolesAndPermissions,
);

router.put(
  '/:id',
  authorize,
  accessController({
    [Permissions.ADMIN]: [Permissions.UPDATE],
  }),
  putRolesAndPermissions,
);

router.delete(
  '/',
  authorize,
  accessController({
    [Permissions.ADMIN]: [Permissions.DELETE],
  }),
  getRolesAndPermissions,
);

export default router;
