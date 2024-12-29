import User from '../../models/user.model';
import { AppFailure } from '../../utils/errors';

export const fetchUserById = async (userId: string) => {
  const user = await User.findById(userId).populate('profile');
  if (!user) {
    throw new AppFailure('User not found', 404);
  }
  return user;
};
