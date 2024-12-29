import Joi from 'joi';

export const postUserProfileSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  photo: Joi.string(),
  dob: Joi.date().required(),
  address: Joi.object({
    streetNumber: Joi.string(),
    province: Joi.string(),
    district: Joi.string(),
    sector: Joi.string(),
    village: Joi.string(),
  }),
}).unknown(false);

export const putUserProfileSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  photo: Joi.string(),
  dob: Joi.date(),
  address: Joi.object({
    streetNumber: Joi.string(),
    province: Joi.string(),
    district: Joi.string(),
    sector: Joi.string(),
    village: Joi.string(),
  }),
})
  .min(1)
  .unknown(false);
