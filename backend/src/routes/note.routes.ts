import { Router } from 'express';
import { noteController } from '../controllers/note.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/Workplace/:workplaceId', (req, res, next) => noteController.getByWorkplace(req as any, res, next));
router.get('/export/:id', (req, res, next) => noteController.export(req as any, res, next));
router.post('/import', (req, res, next) => noteController.import(req as any, res, next));
router.post('/Delete', (req, res, next) => noteController.delete(req as any, res, next));
router.get('/:id', (req, res, next) => noteController.getById(req as any, res, next));
router.post('/', (req, res, next) => noteController.create(req as any, res, next));
router.put('/:id', (req, res, next) => noteController.update(req as any, res, next));

export default router;

