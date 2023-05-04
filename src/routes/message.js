import { Router } from 'express';

import controllerMessage from '../controllers/message';

const router = Router();
router.get('/getmsg', controllerMessage.findMessage);

router.get('/getUser/', controllerMessage.findUser);
router.post('/statusMessage', controllerMessage.statusMessage);

router.post('/addmsg', controllerMessage.addMessage);
router.get('/getmsg/:send&:sendTo', controllerMessage.findMessageUser);
router.get('/getMessage/:send', controllerMessage.findMessageId);
router.get('/getHost/:id', controllerMessage.findHost);
router.get('/getMessageSendTo/:sendTo', controllerMessage.findMessageIdSendTo);

export default router;