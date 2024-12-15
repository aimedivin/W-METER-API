import { Model, model, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SUBSCRIBER = 'SUBSCRIBER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE', // Account is fully functional
  PENDING = 'PENDING', // The account is awaiting verification
  DEACTIVATED = 'DEACTIVATED', // Account has been intentionally disabled
  BANNED = 'BANNED', // Permanently blocked from accessing the platform
  LOCKED = 'LOCKED', //  Temporarily inaccessible due to too many failed login attempts or a security issue
}

export interface IUser {
  email: {
    email: string;
    alerts: boolean;
  };
  password: string;
  role: UserRole;
  status: {
    status: UserStatus;
    reason?: string;
  };
  telephone: {
    phoneNumber: string;
    verified: boolean;
    sms: boolean;
  };
  inAppNotification: boolean;
  twoFAEnabled: boolean;
  twoFAToken: string;
  volume: number;
  _id?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserModelType = Model<IUser>;

const userSchema = new Schema<IUser, UserModelType>(
  {
    email: new Schema<IUser['email']>({
      email: {
        type: String,
        index: true,
        unique: true,
        immutable: true,
        required: true,
      },
      alerts: {
        type: Boolean,
        default: false,
      },
    }),
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: Object.values(UserRole),
        message: '{VALUE} is not supported',
      },
    },
    status: new Schema<IUser['status'], Model<IUser['status']>>({
      status: {
        type: String,
        required: true,
        enum: {
          values: Object.values(UserStatus),
          message: '{VALUE} is not supported',
        },
      },
      reason: String,
    }),
    telephone: new Schema<IUser['telephone']>({
      phoneNumber: {
        type: String,
        required: true,
      },
      verified: {
        type: Boolean,
        default: false,
      },
      sms: {
        type: Boolean,
        default: true,
      },
    }),
    inAppNotification: {
      type: Boolean,
      default: true,
    },
    twoFAEnabled: {
      type: Boolean,
      default: true,
    },
    twoFAToken: {
      type: String,
      required: true,
    },
    volume: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password || '', 12);
  return next();
});

const User = model<IUser, UserModelType>('User', userSchema);

export default User;
