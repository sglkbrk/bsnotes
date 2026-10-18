import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { contentService } from '../services/content.service';

export class ContentController {
  async getByNote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const noteId = Number(req.params.noteId);
      const contents = await contentService.getContents(noteId);
      return res.status(200).json(contents);
    } catch (error) {
      return next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const content = await contentService.getById(id);
      return res.status(200).json(content);
    } catch (error) {
      return next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const created = await contentService.add(req.body, userId);
      return res.status(200).json(created);
    } catch (error) {
      return next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = Number(req.params.id);
      await contentService.update(id, req.body, userId);
      return res.status(200).send();
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const ids: number[] = req.body;
      await contentService.delete(ids, userId);
      return res.status(200).send();
    } catch (error) {
      return next(error);
    }
  }

  async sortBy(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await contentService.updateOrder(req.body);
      return res.status(200).send();
    } catch (error) {
      return next(error);
    }
  }
}

export const contentController = new ContentController();

