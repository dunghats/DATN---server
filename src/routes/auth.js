import { Router } from 'express';
import User from '../controllers/auth';
import { setAuth } from '../middlewares/auth';

const router = Router();
const userController = require('../controllers/user');
router.post('/auth/register',/* User.validRegister,*/ User.register);

router.get('/auth/profile', setAuth, User.profile);

router.post('/auth/login', /*User.validLogin,*/ User.login);
router.get('/auth/getUserByToken', [userController.verifyToken, userController.isModerator], userController.moderatorBoard);
router.get('/auth/getUserById/:id' , userController.getUserById);
router.post('/auth/checkEmailForgot', userController.sendMailForgotPass);
router.post('/auth/validateUserPass', userController.validateUserPass);
router.post('/auth/newPass', userController.newPass);

router.post('/auth/updateCheckTokenDevice', userController.updateCheckTokenDevice);

export default router;
