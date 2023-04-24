import { Router } from 'express';

const router = Router();
const supplementsController = require('../controllers/supplements');

router.get('/supplements/getListSupplementsById/:id', supplementsController.getListSupplementsById);
router.get('/supplements/getAllSupplements', supplementsController.getAllSupplements);
router.post('/supplements/addSupplements', supplementsController.addSupplements);
export default router;