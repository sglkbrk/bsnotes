import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, surname, email, password } = req.body;
      if (!name || !surname || !email || !password) {
        return res.status(400).json({ message: 'Tüm alanlar zorunludur.' });
      }

      await userService.register(req.body);
      return res.status(200).send();
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      return next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email ve şifre zorunludur.' });
      }

      const token = await userService.login(req.body);
      return res.status(200).json({ token });
    } catch (error: any) {
      if (error.status === 404) {
        return res.status(404).send(error.message);
      }
      if (error.status === 401) {
        return res.status(401).send(error.message);
      }
      return res.status(500).send('Internal server error.');
    }
  }

  async getUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await userService.getUsersById(userId);
      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  }

  async getUsersAsync(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const userDto = await userService.getUsersAsync(userId);
      return res.status(200).json(userDto);
    } catch (error) {
      return next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await userService.update(req.body);
      return res.status(200).send();
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      return next(error);
    }
  }

  async getUserImage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const image = await userService.getUserImage(userId);
      return res.status(200).send(image);
    } catch (error) {
      return next(error);
    }
  }
}

export const userController = new UserController();

