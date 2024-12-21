import User from '../../models/user.model';
import { AppError, ErrorCodes } from '../../utils/errors';

interface IUserInput {
  email?: {
    email: string;
    alert: boolean;
  };
  pin?: string;
  password?: string;
  phoneNumber: string;
  identificationDoc: {
    docType: string;
    docNumber: string;
  };
}

export const createNewUser = async ({
  email,
  phoneNumber,
  password,
  pin,
  identificationDoc,
}: IUserInput) => {
  const existingUser = await User.findOne({
    $or: [
      { 'telephone.phoneNumber': phoneNumber },
      { 'email.email': email?.email },
      { 'idDoc.docNumber': identificationDoc.docNumber },
    ],
  });
  if (existingUser) {
    throw new AppError(
      'User with provided details already exists.',
      409,
      true,
      ErrorCodes.DATA_CONFLICT,
      {},
    );
  }
  const newUser = await User.create({
    'telephone.phoneNumber': phoneNumber,
    email: email,
    pin,
    password,
    idDoc: identificationDoc,
    volume: 0,
  });
  const sanitizedUserInfo = newUser.toObject();
  delete sanitizedUserInfo.password;
  delete sanitizedUserInfo.pin;
  return sanitizedUserInfo;
};
