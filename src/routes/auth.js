import { Router } from 'express';
import User from '../controllers/auth';
import { setAuth } from '../middlewares/auth';

const router = Router();
const userController = require('../controllers/user');
router.post('/auth/register',/* User.validRegister,*/ User.register);

router.get('/auth/profile', setAuth, User.profile);

router.post('/auth/login', /*User.validLogin,*/ User.login); // đăng nhập đây
router.get('/auth/getUserByToken', [userController.verifyToken, userController.isModerator], userController.moderatorBoard);
router.get('/auth/getUserById/:id', userController.getUserById);
router.post('/auth/checkEmailForgot', userController.sendMailForgotPass);
router.post('/auth/validateUserPass', userController.validateUserPass);
router.post('/auth/newPass', userController.newPass);

router.post('/auth/updateCheckTokenDevice', userController.updateCheckTokenDevice);
router.route('/getCash/:id').get(userController.getCash);
router.route('/getCountPost/:id').get(userController.getCountPost);

router.route('/updateAccount/:id').post(userController.updateAccount);
router.route('/changeInFo/').post(userController.changeInFo);
router.route('/updatePassword').patch(userController.updatePassword);
router.route('/getListNotificationByIdUser/:id').get(userController.getListNotificationByIdUser);
router.route('/updateNotificationSeen/:id').patch(userController.updateNotificationSeen)

// admin
router.get('/accountAdmin/getAllAccount' , userController.getAllListAccount)
router.patch('/accountAdmin/updateStatusAccountByAdmin' , userController.updateStatusAccountByAdmin)// thằng này là ban acc và cấp lại acc luôn

export default router;
