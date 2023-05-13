import { Router } from 'express';

const router = Router();
const postController = require('../controllers/post');

// postUser
router.route('/post').post(postController.addPost);
router.route('/post/:id').patch(postController.updatePost).delete(postController.deletePost).get(postController.getPostById);

//post home
router.get('/postHome', postController.getListPostByUser);// danh sách tât cả bài viết luôn bao gồm chưa phê duyệt và đã phê duyệt
router.get('/postHomeAds', postController.getListHomeAds); // danh sách quảng cáo

router.route('/postByIdUser/:id').get(postController.getListPostByMyself);

//postAdmin
router.patch('/confirmPostByAdmin/:id', postController.confirmPostByAdmin);// phê duyệt bài viêt id là id bài đăng
router.patch('/cancelPostByAdmin', postController.cancelPostByAdmin); /// từ chối không phê duyệt
router.get('/postAdmin', postController.getListPostNoConfirmByAdmin); /// list danh sách chưa phê duyệt


router.patch('/ads/updatePostAds', postController.updatePostAds);

router.route('/post/postUpdateStatusRoom').post(postController.updateStatusRoom);
router.route('/post/getStatusPost/:id').get(postController.getStatusPost);
router.route('/post/getStatusAds/:id').get(postController.getStatusAds);

router.post('/post/updateView', postController.userViewPost);

router.get('/searchLocationAndPost/:textLocation', postController.searchLocationAndPost);
router.get('/searchLocationCty/:textLocation', postController.searchLocationCty);
router.get('/searchLocationCtyAndPrice/:textLocation&startPrice=:startPrice&endPrice=:endPrice', postController.getFilterTextLocationAndPrice);

router.get('/searchPrice/startPrice=:startPrice&endPrice=:endPrice', postController.getFilterPrice);
router.get ('/postAdmin/statistical/startDate=:startDate&endDate=:endDate' , postController.statistical)// thông kê từ ngày đến ngày nào timelong

router.post('/updateAds/idPost=:id&dayAds=:day' , postController.updateDataAfterDays)
export default router;