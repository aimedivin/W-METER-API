import { Request, Response, NextFunction } from 'express';
import {
  postUserProfileSchema,
  putUserProfileSchema,
} from '../validators/profile.validator';
import {
  addProfile,
  fetchProfile,
  updateProfile,
} from '../services/userServices/profile.service';
import { successResponse } from '../utils/responses';
import { AppFailure } from '../utils/errors';

export const postUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error } = postUserProfileSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) throw error;

    if (!req.user) {
      throw new AppFailure('Authorization required. Please log in.', 401);
    }

    const profile = await addProfile(req);

    successResponse(res, { profile }, 201, 'Profile created successfully.');
    return;
  } catch (error) {
    return next(error);
  }
};

export const putUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error } = putUserProfileSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) throw error;

    if (!req.user) {
      throw new AppFailure('Authorization required. Please log in.', 401);
    }

    const profile = await updateProfile(req);

    successResponse(res, { profile }, 200, 'Profile updated successfully.');
    return;
  } catch (error) {
    return next(error);
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppFailure('Authorization required. Please log in.', 401);
    }

    const profile = await fetchProfile(req);
    const message = Object.entries(profile).length
      ? 'Profile retrieved successfully.'
      : 'Your profile is currently empty. Please complete your profile info.';

    successResponse(res, { profile }, 200, message);
    return;
  } catch (error) {
    return next(error);
  }
};
