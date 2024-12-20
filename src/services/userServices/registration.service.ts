import User from '../../models/user.model';

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
  if (existingUser) {
    const error = new Error('Phone number already exists.');
    error.name = 'DataDuplicationError';
    throw error;
  }
  const newUser = await User.create({
    'telephone.phoneNumber': phoneNumber,
    pin,
    password,
  });
  return newUser;
};
