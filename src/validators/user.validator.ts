import Joi from 'joi';
import { IdDocType } from '../models/user.model';

export const postUserSchema = Joi.object({
  email: Joi.object({
    email: Joi.string().email(),
    alert: Joi.boolean(),
  }),
  pin: Joi.string().length(4).pattern(/\d+$/).messages({
    'string.length': 'Pin must be exactly 4 digits.',
    'string.pattern.base': 'Pin must contain only numbers.',
  }),
  password: Joi.string().min(8).messages({
    'string.min': 'Password must be at least 8 characters long.',
  }),
  phoneNumber: Joi.string().length(10).required(),
  identificationDoc: Joi.object({
    docType: Joi.string()
      .valid(...Object.values(IdDocType))
      .required(),
    docNumber: Joi.string().length(16).required(),
  }).required(),
})
  .xor('pin', 'password')
  .messages({
    'object.xor': 'Either pin or password must be provided, but not both.',
  });
