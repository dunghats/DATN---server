import { Router } from 'express';
import User from '../controllers/auth';
const router = Router();

router.post('/auth/register', User.validRegister, User.register);
router.post('/auth/login', User.validLogin, User.login);

export default router;
