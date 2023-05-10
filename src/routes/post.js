import { Router } from 'express';

const router = Router();
const postController = require('../controllers/post');

// postUser
router.route('/post').post(postController.addPost);
router.route('/post/:id').patch(postController.updatePost).delete(postController.deletePost).get(postController.getPostById);

//post home
router.get('/postHome', postController.getListPostByUser);
router.get('/postHomeAds', postController.getListHomeAds);

router.route('/postByIdUser/:id').get(postController.getListPostByMyself);

//postAdmin
router.patch('/confirmPostByAdmin/:id', postController.confirmPostByAdmin);
router.patch('/cancelPostByAdmin', postController.cancelPostByAdmin);
router.get('/postAdmin', postController.getListPostNoConfirmByAdmin);


router.patch('/ads/updatePostAds', postController.updatePostAds);

router.route('/post/postUpdateStatusRoom').post(postController.updateStatusRoom);
router.route('/post/getStatusPost/:id').get(postController.getStatusPost);
router.route('/post/getStatusAds/:id').get(postController.getStatusAds);

router.post('/post/updateView', postController.userViewPost);

router.get('/searchLocationAndPost/:textLocation', postController.searchLocationAndPost);
router.get('/searchLocationCty/:textLocation', postController.searchLocationCty);
router.get('/searchLocationCtyAndPrice/:textLocation&startPrice=:startPrice&endPrice=:endPrice', postController.getFilterTextLocationAndPrice);

router.get('/searchPrice/startPrice=:startPrice&endPrice=:endPrice', postController.getFilterPrice);
export default router;