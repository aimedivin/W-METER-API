import User from '../../models/user.model';
import { AppError, ErrorCodes } from '../../utils/errors';

interface IUserInput {
  pin?: string;
  password?: string;
  phoneNumber: string;
}

export const createNewUser = async ({
  phoneNumber,
  password,
  pin,
}: IUserInput) => {
  const existingUser = await User.findOne({
    'telephone.phoneNumber': phoneNumber,
  });
  if (!existingUser) {
    throw new AppError(
      'A user with this phone number already exists',
      409,
      true,
      ErrorCodes.CONFLICT_ERROR,
      { phoneNumber },
    );
  }
  const newUser = await User.create({
    'telephone.phoneNumber': phoneNumber,
    pin,
    password,
  });
  return newUser;
};
