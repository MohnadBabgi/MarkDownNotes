import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as controller from '../controllers/notes.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
