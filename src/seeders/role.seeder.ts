import Role, { IRole, Permissions } from '../models/role.model';
import logger from '../utils/logger';

const rolesSeed: Array<IRole> = [
  {
    name: 'ADMIN',
    permission: [
      Permissions.ADMIN,
      Permissions.READ,
      Permissions.WRITE,
      Permissions.UPDATE,
      Permissions.DELETE,
    ].join('-'),
  },
  {
    name: 'SUBSCRIBER',
    permission: Permissions.CLIENT,
    isDefault: true,
  },
];

const seedRoles = async () => {
  try {
    //Clear Existing data
    await Role.deleteMany({});

    // Insert Predefined roles and permissions
    await Role.insertMany(rolesSeed);

    // Log successful message to terminal
    logger.info('Roles seeded successfully');
  } catch (err) {
    logger.error('Error seeding user Roles:', err);
  }
};
export default seedRoles;
