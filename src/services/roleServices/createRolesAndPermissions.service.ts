import Role, { Permissions } from '../../models/role.model';
import { AppFailure } from '../../utils/errors';

export interface IRolesInputs {
  name: string;
  permission: Array<keyof typeof Permissions>;
}

const createRolesAndPermissions = async (roleData: Array<IRolesInputs>) => {
  const existingRoles: Array<string> = [];
  const sanitizedData = [];
  for (const role of roleData) {
    const existingRole = await Role.findOne({
      name: role.name.toUpperCase(),
    });

    if (existingRole) {
      existingRoles.push(role.name);
      continue;
    }

    if (role.permission.includes('CLIENT')) {
      role.permission = ['CLIENT'];
    }
    sanitizedData.push({
      name: role.name.toUpperCase(),
      permission: role.permission.map((key) => Permissions[key]).join('-'),
    });
  }

  if (existingRoles.length) {
    throw new AppFailure('Roles provided details already exists.', 409, {
      description: `These role(s): ${existingRoles.join(', ')} already exist`,
    });
  }

  const role = await Role.insertMany(sanitizedData);
  return role;
};

export default createRolesAndPermissions;
