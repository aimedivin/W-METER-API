import { Router } from 'express';
import {
  postRegisterUser,
  postLoginUser,
  getUser,
} from '../controllers/user.controller';
import authorization from '../middlewares/authorization';
import {
  getUserProfile,
  postUserProfile,
  putUserProfile,
} from '../controllers/profile.controller';

const router = Router();

router.post('/register', postRegisterUser);

router.post('/login', postLoginUser);
// USER INFO
router.get('/', authorization, getUser);

// USER PROFILE ROUTES
router.post('/profile', authorization, postUserProfile);
router.put('/profile', authorization, putUserProfile);
router.get('/profile', authorization, getUserProfile);

export default router;
