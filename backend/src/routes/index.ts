import { Router } from 'express';
import userRoutes from './user.routes';
import workplaceRoutes from './workplace.routes';
import noteRoutes from './note.routes';
import contentRoutes from './content.routes';
import fileRoutes from './file.routes';
import trashRoutes from './trash.routes';

const router = Router();

// Mount routes with PascalCase matching original .NET routes
router.use('/User', userRoutes);
router.use('/Workplace', workplaceRoutes);
router.use('/Note', noteRoutes);
router.use('/Content', contentRoutes);
router.use('/File', fileRoutes);
router.use('/Trash', trashRoutes);

// Also mount lowercase equivalents for modern REST conventions
router.use('/user', userRoutes);
router.use('/workplace', workplaceRoutes);
router.use('/note', noteRoutes);
router.use('/content', contentRoutes);
router.use('/file', fileRoutes);
router.use('/trash', trashRoutes);

export default router;

