import { Router } from 'express';
import controllerCashFlow from '../controllers/cashFlow';

const router = Router();

router.post('/createCashFlow' ,controllerCashFlow.createCashFlow)
router.get('/listCashFlow/:id' ,controllerCashFlow.listCashFlow )

export default router;