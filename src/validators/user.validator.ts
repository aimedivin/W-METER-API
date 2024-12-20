import Joi from 'joi';

export const postUserSchema = Joi.object({
  pin: Joi.string().length(4).pattern(/\d+$/).messages({
    'string.length': 'Pin must be exactly 4 digits.',
    'string.pattern.base': 'Pin must contain only numbers.',
  }),
  password: Joi.string().min(8).messages({
    'string.min': 'Password must be at least 8 characters long.',
  }),
  phoneNumber: Joi.string().length(10).required(),
})
  .xor('pin', 'password')
  .messages({
    'object.xor': 'Either pin or password must be provided, but not both.',
  });
