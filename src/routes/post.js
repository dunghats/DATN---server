import { Router } from 'express';

const router = Router();
const postController = require('../controllers/post');

// postUser
router.route('/post').post(postController.addPost).get(postController.getListPostByMyself);
router.route('/post/:id').patch(postController.updatePost).delete(postController.deletePost).get(postController.getPostById);

//post home
router.get('/postHome', postController.getListPostByUser);

//postAdmin
router.patch('/confirmPostByAdmin/:id', postController.confirmPostByAdmin);
router.patch('/cancelPostByAdmin', postController.cancelPostByAdmin);
router.get('/postAdmin', postController.getListPostNoConfirmByAdmin);
export default router;