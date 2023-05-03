import { Router } from 'express';
import controllerFavourite from '../controllers/favourite';

const router = Router();
router.route('/favourite').post(controllerFavourite.addFavourite);
router.route('/getCountFavourite/:idPost').get(controllerFavourite.getCountFavouriteByIdPost);
router.route('/favourite/:idUser/:idPost').get(controllerFavourite.getFavouriteByIdUserAndIdPost).delete(controllerFavourite.deleteFavourite);

export default router;