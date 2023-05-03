import { Router } from 'express';
import controllerComment from '../controllers/comment';

const router = Router();

router.route('/comment').post(controllerComment.addComment);
router.route('/getListCommentParentByIdPost/:idPost').get(controllerComment.getListCommentParentByIdPost)
router.route('/getListCommentChildrenByIdPost/:parentCommentId').get(controllerComment.getListCommentChildrenByIdPost)

export default router;