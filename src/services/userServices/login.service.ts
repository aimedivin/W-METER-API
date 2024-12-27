import jwt from 'jsonwebtoken';
import User, { UserStatus } from '../../models/user.model';
import { AppError, AppFailure, ErrorCodes } from '../../utils/errors';

interface IUserLoginInput {
  email?: string;
  pin?: string;
  password?: string;
  phoneNumber?: string;
}
export interface IUserLoginResponse {
  statusCode: number;
  message: string;
  data: {
    token?: string;
    twoFactorAuthEnabled: boolean;
    email?: string;
    phoneNumber?: string;
  };
}

export const loginUser = async ({
  email,
  phoneNumber,
  password,
  pin,
}: IUserLoginInput): Promise<IUserLoginResponse | undefined> => {
  const user = await User.findOne({
    $or: [{ 'telephone.phoneNumber': phoneNumber }, { 'email.email': email }],
  });

  if (!user) {
    throw new AppError(
      'User not found.',
      404,
      true,
      ErrorCodes.RESOURCE_NOT_FOUND,
    );
  }

  const isValid = await user.compareSecret(password || pin!);
  if (isValid) {
    if (user.status.status === UserStatus.ACTIVE) {
      if (user.twoFAEnabled.email || user.twoFAEnabled.phoneNumber) {
        const channels = [
          user.twoFAEnabled.email && 'email',
          user.twoFAEnabled.phoneNumber && 'phone number',
        ].filter((value) => value);

        return {
          statusCode: 200,
          message: `Login successful! To proceed, verify the OTP sent to your ${channels.join(' or ')} for two-factor authentication.`,
          data: {
            email: user.email?.email,
            phoneNumber: user.telephone.phoneNumber,
            twoFactorAuthEnabled: true,
          },
        };
      }
      return {
        statusCode: 200,
        message: 'Login successful!',
        data: {
          token: jwt.sign(
            {
              userId: user._id,
              email: user.email?.email,
              phoneNumber: user.telephone.phoneNumber,
              role: user.role,
            },
            process.env.JWT_SECRET!,
            {
              expiresIn: process.env.JWT_TOKEN_EXPIRE || '2h',
            },
          ),
          twoFactorAuthEnabled: false,
        },
      };
    } else if (user.status.status === UserStatus.PENDING) {
      throw new AppFailure(
        'Your account has not been verified yet. Please check your email or use your phone number to complete the verification process.',
        403,
        {
          reason: 'Account verification is incomplete',
        },
      );
    } else if (user.status.status === UserStatus.LOCKED) {
      throw new AppFailure(
        `Your account is temporarily locked ${
          user.status.reason ? ` due to ${user.status.reason}` : ''
        }. Please try again later or contact support.`,
        403,
        {
          reason: user.status.reason,
        },
      );
    } else if (user.status.status === UserStatus.DEACTIVATED) {
      throw new AppFailure(
        `Your account has been deactivated ${
          user.status.reason ? ` due to ${user.status.reason}` : ''
        }. Please contact support for further assistance.`,
        403,
        {
          reason: user.status.reason,
        },
      );
    } else if (user.status.status === UserStatus.BANNED) {
      throw new AppFailure(
        `Your account has been permanently banned. Please contact support for further information.`,
        403,
        {
          reason: user.status.reason,
        },
      );
    }
  } else {
    throw new AppFailure('Invalid email or password.', 401);
  }
};
