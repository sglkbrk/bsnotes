import { Router } from 'express';
import { contentController } from '../controllers/content.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/Note/:noteId', authMiddleware, (req, res, next) => contentController.getByNote(req as any, res, next));
router.get('/:id', (req, res, next) => contentController.getById(req, res, next));
router.post('/', authMiddleware, (req, res, next) => contentController.create(req as any, res, next));
router.put('/:id', authMiddleware, (req, res, next) => contentController.update(req as any, res, next));
router.post('/Delete', authMiddleware, (req, res, next) => contentController.delete(req as any, res, next));
router.post('/SortBy', authMiddleware, (req, res, next) => contentController.sortBy(req as any, res, next));

export default router;

