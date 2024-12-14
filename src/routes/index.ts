import { Router, Request, Response } from 'express';
import { successResponse } from '../utils/responses';

const router = Router();

// API Health check route
router.get('/', (req: Request, res: Response) => {
  successResponse(
    res,
    undefined,
    200,
    'The API is healthy and running smoothly.',
  );
  return;
});

export default router;
