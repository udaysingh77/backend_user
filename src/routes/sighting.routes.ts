import { Router } from 'express';
import * as sightingController from '../controllers/sighting.controller';

const router = Router();

router.get('/', sightingController.getAll);
router.get('/:id', sightingController.getOne);
router.post('/', sightingController.create);
router.put('/:id', sightingController.update);
router.delete('/:id', sightingController.remove);

export default router;
