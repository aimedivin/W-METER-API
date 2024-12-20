import { Request, Response } from 'express';
import { postUserSchema } from '../validators/user.validator';
import { errorResponse, successResponse } from '../utils/responses';
import { createNewUser } from '../services/userServices/registration.service';
import errorHandler, { CustomDefinedErrors } from '../utils/errorHandler.util';

export const postUser = async (req: Request, res: Response) => {
  try {
    const { error } = postUserSchema.validate(req.body);
    if (error) {
      errorResponse(res, error, 400, 'Validation Error');
      return;
    }
    const user = await createNewUser(req.body);
    successResponse(res, { user }, 201);
    return;
  } catch (error) {
    console.log((error as any).errors);
    if (
      Object.values(CustomDefinedErrors).includes(
        (error as Error).name as CustomDefinedErrors,
      )
    ) {
      console.log('inn');
      const { statusCode, errorMessage } = errorHandler(error);
      errorResponse(res, error, statusCode, errorMessage);
    }
    errorResponse(res, error, 500, 'errorMessage');
    return;
  }
};
