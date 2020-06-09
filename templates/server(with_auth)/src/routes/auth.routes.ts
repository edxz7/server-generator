import { Router } from 'express';

import { 
  getSignup, 
  postSignup, 
  getLogin, 
  postLogin, 
  logout, 
} from '../controllers/auth.controller';

const router = Router();

router.post('/signup', postSignup);
router.get('/signup', getSignup );
router.post('/login', postLogin);
router.get('/login', getLogin);
router.get('/logout', logout);

export default router;