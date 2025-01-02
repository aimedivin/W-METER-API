import Joi from 'joi';
import { Permissions } from '../models/role.model';

export const postRoleAndPermissionSchema = Joi.array().items(
  Joi.object({
    name: Joi.string().min(3).required(),
    permission: Joi.array()
      .items(
        Joi.string()
          .valid(...Object.keys(Permissions))
          .required(),
      )
      .unique()
      .custom((val: string[], helpers) => {
        const validPermissions = (
          ['ADMIN', 'CLIENT', 'STAFF'] as Array<keyof typeof Permissions>
        ).filter((perm) => val.includes(perm));
        if (!validPermissions.length || validPermissions.length > 1) {
          return helpers.message({
            custom: `"permission" must contain one of ${(['ADMIN', 'CLIENT', 'STAFF'] as Array<keyof typeof Permissions>).join(', ')} but not both `,
          });
        }
        return val;
      })
      .required(),
  })
    .unknown(false)
    .required(),
);

export const putRoleAndPermissionSchema = Joi.object({
  name: Joi.string().min(3),
  permission: Joi.array()
    .items(
      Joi.string()
        .valid(...Object.keys(Permissions))
        .required(),
    )
    .unique()
    .custom((val: string[], helpers) => {
      const validPermissions = (
        ['ADMIN', 'CLIENT', 'STAFF'] as Array<keyof typeof Permissions>
      ).filter((perm) => val.includes(perm));
      if (!validPermissions.length || validPermissions.length > 1) {
        return helpers.message({
          custom: `"permission" must contain one of ${(['ADMIN', 'CLIENT', 'STAFF'] as Array<keyof typeof Permissions>).join(', ')} but not both `,
        });
      }
      return val;
    }),
}).unknown(false);
