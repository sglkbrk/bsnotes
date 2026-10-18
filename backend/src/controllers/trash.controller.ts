import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { trashService } from '../services/trash.service';

export class TrashController {
  async getTrash(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const data = await trashService.getTrash(userId);
      return res.status(200).json(data);
    } catch (error) {
      return next(error);
    }
  }

  async restore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { type, id, targetWorkplaceId } = req.body;

      if (!type || !id) {
        return res.status(400).json({ message: 'Type and id are required' });
      }

      const restored = await trashService.restoreItem(type, Number(id), userId, targetWorkplaceId ? Number(targetWorkplaceId) : undefined);
      return res.status(200).json(restored);
    } catch (error) {
      return next(error);
    }
  }

  async permanentDelete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { type, id } = req.body;

      if (!type || !id) {
        return res.status(400).json({ message: 'Type and id are required' });
      }

      await trashService.permanentDelete(type, Number(id), userId);
      return res.status(200).send();
    } catch (error) {
      return next(error);
    }
  }

  async empty(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      await trashService.emptyTrash(userId);
      return res.status(200).send();
    } catch (error) {
      return next(error);
    }
  }
}

export const trashController = new TrashController();

