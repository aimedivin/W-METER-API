import { Router } from 'express';
import verifyToken from '../middlewares/authorize';

const router = Router();

router.post('/send', verifyToken);
router.get('/verify');

export default router;
