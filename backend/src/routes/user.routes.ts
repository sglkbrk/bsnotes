import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', (req, res, next) => userController.register(req, res, next));
router.post('/login', (req, res, next) => userController.login(req, res, next));
router.get('/user', authMiddleware, (req, res, next) => userController.getUser(req as any, res, next));
router.get('/users-async', authMiddleware, (req, res, next) => userController.getUsersAsync(req as any, res, next));
router.put('/update', authMiddleware, (req, res, next) => userController.update(req as any, res, next));
router.get('/user-image', authMiddleware, (req, res, next) => userController.getUserImage(req as any, res, next));

export default router;

