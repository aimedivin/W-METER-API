import Role, { IRole, Permissions } from '../../models/role.model';
import { AppFailure } from '../../utils/errors';
import { IRolesInputs } from './createRolesAndPermissions.service';

const updateRolesAndPermissions = async (
  roleId: string,
  roleData: Partial<IRolesInputs>,
) => {
  const sanitizedData: Partial<IRole> = {};

  const existingRole = await Role.findById(roleId);

  if (!existingRole) {
    throw new AppFailure('Role does not exist.', 404);
  }

  if (roleData.permission) {
    if (roleData.permission.includes('CLIENT')) {
      roleData.permission = ['CLIENT'];
    }
    sanitizedData.permission = roleData.permission
      .map((key) => Permissions[key])
      .join('-');
  }
  if (roleData.name) {
    sanitizedData.name = roleData.name.toUpperCase();
  }

  const role = await Role.findByIdAndUpdate(existingRole._id, sanitizedData, {
    new: true,
  });
  return role || {};
};

export default updateRolesAndPermissions;
