import { Router } from 'express';
import User from '../controllers/auth';
import { setAuth } from '../middlewares/auth';
const router = Router();

router.post('/auth/register', User.validRegister, User.register);
router.post('/auth/login', User.validLogin, User.login);
router.get('/auth/profile', setAuth, User.profile);
export default router;
