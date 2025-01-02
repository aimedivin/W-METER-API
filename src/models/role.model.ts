import { Model, model, Schema, Types } from 'mongoose';

export enum Permissions {
  ADMIN = 'A',
  STAFF = 'S',
  CLIENT = 'C',
  READ = 'R',
  WRITE = 'W',
  UPDATE = 'U',
  DELETE = 'D',
}

export interface IRole {
  _id?: Types.ObjectId;
  name: string;
  permission: string;
  isDefault?: boolean;
}

type RoleModelType = Model<IRole>;

const roleSchema = new Schema<IRole, RoleModelType>({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  permission: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

roleSchema.pre('save', function (next) {
  this.name = this.name.toUpperCase();
  return next();
});
roleSchema.pre('insertMany', function (next, docs: IRole[]) {
  docs.forEach(function (doc) {
    doc.name = doc.name.toUpperCase();
  });
  return next();
});

const Role = model<IRole>('Role', roleSchema);

export default Role;
