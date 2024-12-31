import { IUser, UserStatus } from '../models/user.model';
import { AppFailure } from '../utils/errors';

export const userStatusChecker = (userStatus: IUser['status']) => {
  if (userStatus.status === UserStatus.ACTIVE) {
    return true;
  } else if (userStatus.status === UserStatus.PENDING) {
    throw new AppFailure(
      'Your account has not been verified yet. Please check your email or use your phone number to complete the verification process.',
      403,
      {
        reason: 'Account verification is incomplete',
      },
    );
  } else if (userStatus.status === UserStatus.LOCKED) {
    throw new AppFailure(
      `Your account is temporarily locked ${
        userStatus.reason ? ` due to ${userStatus.reason}` : ''
      }. Please try again later or contact support.`,
      403,
      {
        reason: userStatus.reason,
      },
    );
  } else if (userStatus.status === UserStatus.DEACTIVATED) {
    throw new AppFailure(
      `Your account has been deactivated ${
        userStatus.reason ? ` due to ${userStatus.reason}` : ''
      }. Please contact support for further assistance.`,
      403,
      {
        reason: userStatus.reason,
      },
    );
  } else if (userStatus.status === UserStatus.BANNED) {
    throw new AppFailure(
      `Your account has been permanently banned. Please contact support for further information.`,
      403,
      {
        reason: userStatus.reason,
      },
    );
  }
};
