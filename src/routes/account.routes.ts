import { Router } from 'express';
import {
  postRegisterUser,
  postLoginUser,
  getUser,
} from '../controllers/user.controller';
import authorization from '../middlewares/authorize';
import {
  getUserProfile,
  postUserProfile,
  putUserProfile,
} from '../controllers/profile.controller';

const router = Router();

// CREATE NEW USER
router.post('/register', postRegisterUser);

// LOGIN AS USER
router.post('/login', postLoginUser);

// USER INFO
router.get('/', authorization, getUser);

// USER PROFILE ROUTES
router.post('/profile', authorization, postUserProfile);
router.put('/profile', authorization, putUserProfile);
router.get('/profile', authorization, getUserProfile);

export default router;
