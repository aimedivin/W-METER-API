import Role from '../../models/role.model';

const fetchRolesAndPermissions = async () => {
  const roles = await Role.find();
  return roles;
};

export default fetchRolesAndPermissions;
