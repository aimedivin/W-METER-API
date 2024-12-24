import { Router } from 'express';
import {
  postRegisterUser,
  postLoginUser,
} from '../controllers/user.controller';

const router = Router();

router.post('/register', postRegisterUser);
router.post('/login', postLoginUser);

export default router;
