import { Router, Request, Response } from 'express';
import { successResponse } from '../utils/responses';
import userRoutes from './user.routes';
import otpRoutes from './otp.routes';

const router = Router();

// Endpoint for Health check
router.get('/', (req: Request, res: Response) => {
  successResponse(
    res,
    undefined,
    200,
    'The API is healthy and running smoothly.',
  );
  return;
});

// Routes to handle user related requests
router.use('/user', userRoutes);

// Routes to handle otp related requests
router.use('/otp', otpRoutes);

export default router;
