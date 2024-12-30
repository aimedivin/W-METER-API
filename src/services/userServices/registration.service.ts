import jwt from 'jsonwebtoken';
import User from '../../models/user.model';
import { AppError, ErrorCodes } from '../../utils/errors';
import generateOTP from '../../utils/generateOTP';
import sendSms from '../../utils/sendSms';
import Role from '../../models/role.model';

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

  const role = await Role.findOne({ isDefault: true });
  if (!role) {
    throw new AppError(
      'Role not found, Please contact support for further information.',
      404,
      true,
      ErrorCodes.RESOURCE_NOT_FOUND,
      {
        description: 'No default roles available to assign to the user.',
      },
    );
  }

  const otp = generateOTP();
  const jwtSecret = process.env.JWT_SECRET;
  const twoFAToken = jwt.sign({ otp }, jwtSecret!, { expiresIn: '30m' });

  const newUser = await User.create({
    'telephone.phoneNumber': phoneNumber,
    email: email,
    role: role._id,
    pin,
    password,
    idDoc: identificationDoc,
    twoFAToken,
    volume: 0,
  });

  const smsError = await sendSms(
    `+25${newUser.telephone.phoneNumber}`,
    `${process.env.BRAND_NAME || ''}, OTP: ${otp}. Expires in 30 minutes.`,
  );

  let message = 'User created successfully.';
  let statusCode = 201;
  let details:
    | Array<{ operation: string; status: string; message: string }>
    | undefined;

  if (smsError) {
    statusCode = 207;
    message =
      'User created successfully, but failed to send OTP to the provided phone number.';
    details = [
      {
        operation: 'user_creation',
        status: 'success',
        message: 'User created successfully.',
      },
      {
        operation: 'send_otp',
        status: 'failure',
        message:
          (smsError as Error).message ||
          'Failed to send OTP to the provided phone number.',
      },
    ];
  }

  const sanitizedUserInfo = newUser.toObject();
  delete sanitizedUserInfo.password;
  delete sanitizedUserInfo.pin;
  return { sanitizedUserInfo, statusCode, message, details };
};
