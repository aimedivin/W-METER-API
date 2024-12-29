import { Request } from 'express';
import Profile from '../../models/profile.model';
import { AppFailure } from '../../utils/errors';

export const addProfile = async ({ user, body: profileData }: Request) => {
  const userProfile = await Profile.findOne({ user: user!.id });
  if (userProfile) {
    throw new AppFailure(
      'Profile already exists. You cannot create it again.',
      409,
    );
  }
  const profile = await Profile.create({ ...profileData, user: user!.id });

  return profile;
};

export const updateProfile = async ({ user, body: profileData }: Request) => {
  const userProfile = await Profile.findOne({ user: user!.id });
  if (!userProfile) {
    throw new AppFailure(
      'Profile does not exist. Please create a profile before updating.',
      404,
    );
  }
  const updatedProfile = await Profile.findByIdAndUpdate(
    userProfile._id,
    {
      ...profileData,
    },
    { new: true },
  );

  return updatedProfile!;
};

export const fetchProfile = async ({ user }: Request) => {
  const userProfile = await Profile.findOne({ user: user!.id });
  return userProfile || {};
};
