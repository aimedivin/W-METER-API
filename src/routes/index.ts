import { Router, Request, Response } from 'express';
import { successResponse } from '../utils/responses';
import accountRoutes from './account.routes';
import otpRoutes from './otp.routes';
import roleRoutes from './role.routes';

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

// Routes to handle users related requests
router.use('/users', accountRoutes);

// Routes to handle user ACCOUNT related requests
router.use('/account', accountRoutes);

// Routes to handle otp related requests
router.use('/otp', otpRoutes);

// Routes to handle platform roles
router.use('/roles', roleRoutes);

export default router;
