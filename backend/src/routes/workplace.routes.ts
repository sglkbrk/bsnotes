import { Router } from 'express';
import { workplaceController } from '../controllers/workplace.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => workplaceController.getAll(req as any, res, next));
router.get('/:id', (req, res, next) => workplaceController.getById(req as any, res, next));
router.post('/', (req, res, next) => workplaceController.create(req as any, res, next));
router.put('/:id', (req, res, next) => workplaceController.update(req as any, res, next));
router.delete('/permanent/:id', (req, res, next) => workplaceController.hardDelete(req as any, res, next));
router.delete('/:id', (req, res, next) => workplaceController.softDelete(req as any, res, next));
router.post('/Delete', (req, res, next) => workplaceController.deleteMany(req as any, res, next));

export default router;

