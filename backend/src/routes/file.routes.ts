import { Router } from 'express';
import { fileController } from '../controllers/file.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.post('/upload', authMiddleware, upload.single('file'), (req, res, next) => fileController.upload(req, res, next));
router.get('/download/:key', (req, res, next) => fileController.download(req, res, next));
router.get('/url/:key', (req, res, next) => fileController.getUrl(req, res, next));
router.delete('/delete/:key', authMiddleware, (req, res, next) => fileController.delete(req, res, next));

export default router;

