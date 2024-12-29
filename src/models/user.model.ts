import { Model, model, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { IProfile } from './profile.model';

export enum IdDocType {
  ID_CARD = 'ID_CARD',
  PASSPORT = 'PASSPORT',
}

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
  _id?: Types.ObjectId;
  email?: {
    email: string;
    alerts: boolean;
  };
  password?: string;
  pin?: string;
  role: UserRole;
  idDoc: {
    docType: IdDocType;
    docNumber: string;
  };
  status: {
    status: UserStatus;
    reason?: string;
  };
  telephone: {
    phoneNumber: string;
    verified: boolean;
    sms: boolean;
  };
  profile: IProfile;
  inAppNotification: boolean;
  twoFAEnabled: {
    email: boolean;
    phoneNumber: boolean;
  };
  twoFAToken: string;
  volume: number;
  isDeleted: {
    isDeleted: boolean;
    deletedAt: Date | null;
  };
  createdAt?: Date;
  updatedAt?: Date;
  compareSecret(candidatePassword: string): Promise<boolean>;
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
      },
      alerts: {
        type: Boolean,
        default: false,
      },
    }),
    password: {
      type: String,
      select: false,
      required: function (this: IUser): boolean {
        return !this.pin;
      },
    },
    pin: {
      type: String,
      select: false,
      required: function (this: IUser): boolean {
        return !this.password;
      },
    },
    role: {
      type: String,
      enum: {
        values: Object.values(UserRole),
        message: '{VALUE} is not supported',
      },
      default: UserRole.SUBSCRIBER,
    },
    status: {
      type: new Schema<IUser['status']>({
        status: {
          type: String,
          required: true,
          enum: {
            values: Object.values(UserStatus),
            message: '{VALUE} is not supported',
          },
          default: UserStatus.PENDING,
        },
        reason: {
          type: String,
          required: function () {
            return (
              this.status !== UserStatus.ACTIVE &&
              this.status !== UserStatus.PENDING
            );
          },
        },
      }),
      default: () => ({}),
    },
    idDoc: {
      type: new Schema<IUser['idDoc'], Model<IUser['idDoc']>>({
        docType: {
          type: String,
          enum: {
            values: Object.values(IdDocType),
            message: '{VALUE} is not supported',
          },
          required: true,
        },
        docNumber: {
          type: String,
          required: true,
        },
      }),
      required: true,
    },
    telephone: {
      type: new Schema<IUser['telephone']>({
        phoneNumber: {
          type: String,
          index: true,
          unique: true,
          required: true,
          immutable: true,
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
      required: true,
    },
    inAppNotification: {
      type: Boolean,
      default: true,
    },
    twoFAEnabled: {
      type: new Schema<IUser['twoFAEnabled']>({
        email: { type: Boolean, default: false },
        phoneNumber: { type: Boolean, default: false },
      }),
      default: () => ({}),
    },
    twoFAToken: {
      type: String,
      select: false,
    },
    volume: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: new Schema<IUser['isDeleted']>({
        isDeleted: {
          type: Boolean,
          default: false,
        },
        deletedAt: {
          type: Date,
          default: function () {
            return this.isDeleted ? new Date() : null;
          },
        },
      }),
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.methods.compareSecret = async function (
  candidateSecret: string,
): Promise<boolean> {
  return await bcrypt.compare(candidateSecret, this.password || this.pin);
};

userSchema.pre('save', async function (next) {
  this[this.password ? 'password' : 'pin'] = await bcrypt.hash(
    this.password || this.pin || '',
    12,
  );
  return next();
});

userSchema.virtual('profile', {
  ref: 'Profile',
  foreignField: 'user',
  localField: '_id',
  justOne: true,
});

const User = model<IUser, UserModelType>('User', userSchema);

export default User;
