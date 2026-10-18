import { Router } from 'express';
import { trashController } from '../controllers/trash.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => trashController.getTrash(req as any, res, next));
router.post('/restore', (req, res, next) => trashController.restore(req as any, res, next));
router.post('/permanent-delete', (req, res, next) => trashController.permanentDelete(req as any, res, next));
router.post('/empty', (req, res, next) => trashController.empty(req as any, res, next));

export default router;

