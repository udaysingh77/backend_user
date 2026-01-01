import { Router } from 'express';
import * as userController from '../controllers/user.controller';

const router = Router();

router.get('/', userController.getAll);
router.post('/', userController.create);
router.get('/:id', userController.getOne);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);

export default router;
