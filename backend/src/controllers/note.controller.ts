import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { noteService } from '../services/note.service';

export class NoteController {
  async getByWorkplace(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const workplaceId = Number(req.params.workplaceId);
      const notes = await noteService.getUserAndWorkspaceNotes(userId, workplaceId);
      return res.status(200).json(notes);
    } catch (error) {
      return next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = Number(req.params.id);
      const note = await noteService.getById(id, userId);
      return res.status(200).json(note);
    } catch (error) {
      return next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const created = await noteService.add(req.body, userId);
      return res.status(200).json(created);
    } catch (error) {
      return next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = Number(req.params.id);
      await noteService.update(id, req.body, userId);
      return res.status(200).send();
    } catch (error: any) {
      if (error.status === 401) {
        return res.status(401).send();
      }
      return next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const ids: number[] = req.body;
      await noteService.delete(ids, userId);
      return res.status(200).send();
    } catch (error) {
      return next(error);
    }
  }

  async export(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = Number(req.params.id);
      const data = await noteService.exportNote(id, userId);
      return res.status(200).json(data);
    } catch (error) {
      return next(error);
    }
  }

  async import(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const newNote = await noteService.importNote(req.body, userId);
      return res.status(200).json(newNote);
    } catch (error) {
      return next(error);
    }
  }
}

export const noteController = new NoteController();

