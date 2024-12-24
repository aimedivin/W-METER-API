import Joi from 'joi';
import { IdDocType } from '../models/user.model';

export const postRegisterUserSchema = Joi.object({
  email: Joi.object({
    email: Joi.string().email(),
    alert: Joi.boolean(),
  }),
  pin: Joi.string().length(4).pattern(/\d+$/).messages({
    'string.length': 'Pin must be exactly 4 digits.',
    'string.pattern.base': 'Pin must contain only numbers.',
  }),
  password: Joi.string().min(8).max(25).messages({
    'string.min': 'Password must be between 8 and 25 characters long.',
    'string.max': 'Password must be between 8 and 25 characters long.',
  }),
  phoneNumber: Joi.string()
    .length(10)
    .pattern(/^(079|078|072|073)\d{7}$/)
    .required()
    .messages({
      'string.pattern.base':
        'The input must be a 10-digit number starting with 079, 078, 072, or 073.',
    }),
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

export const postLoginUserSchema = Joi.object({
  email: Joi.string().email(),
  phoneNumber: Joi.string()
    .pattern(/^(079|078|072|073)\d{7}$/)
    .messages({
      'string.pattern.base':
        'The input must be a 10-digit number starting with 079, 078, 072, or 073.',
    }),
  pin: Joi.string().length(4).pattern(/\d+$/),
  password: Joi.string(),
})
  .xor('email', 'phoneNumber')
  .messages({
    'object.xor': 'email pin or phoneNumber must be provided, but not both.',
  })
  .xor('pin', 'password')
  .messages({
    'object.xor': 'Either pin or password must be provided, but not both.',
  });
