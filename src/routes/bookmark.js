import { Router } from 'express';
import controllerBookmark from '../controllers/bookmark';

const router = Router();
router.route('/bookmark').post(controllerBookmark.addBookmark);
router.route('/bookmark/getListBookmarkByUserId/:id').get (controllerBookmark.listBookmarkById);
router.route('/bookmark/:idUser/:idPost').get(controllerBookmark.getBookmarkByIdUserAndIdPost).delete(controllerBookmark.deleteBookmark);

export default router;