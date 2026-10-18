import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { workplaceService } from '../services/workplace.service';

export class WorkplaceController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const workplaces = await workplaceService.getUserWorkplace(userId);
      return res.status(200).json(workplaces);
    } catch (error) {
      return next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = Number(req.params.id);
      const workplace = await workplaceService.getById(id, userId);
      return res.status(200).json(workplace);
    } catch (error) {
      return next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const created = await workplaceService.add(req.body, userId);
      return res.status(200).json(created);
    } catch (error) {
      return next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await workplaceService.update(id, req.body);
      return res.status(200).send();
    } catch (error) {
      return next(error);
    }
  }

  async softDelete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = Number(req.params.id);
      await workplaceService.delete(id, userId);
      return res.status(200).send();
    } catch (error) {
      return next(error);
    }
  }

  async hardDelete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = Number(req.params.id);
      await workplaceService.permanentDelete(id, userId);
      return res.status(200).send();
    } catch (error) {
      return next(error);
    }
  }

  async deleteMany(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const ids: number[] = req.body;
      await workplaceService.deleteMany(ids, userId);
      return res.status(200).send();
    } catch (error) {
      return next(error);
    }
  }
}

export const workplaceController = new WorkplaceController();

