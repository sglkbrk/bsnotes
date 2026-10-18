import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface AuthenticatedUser {
  userId: number;
  email: string;
  name: string;
  surname: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'UserId not found in token.' });
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    return res.status(401).json({ message: 'UserId not found in token.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.key) as any;
    const userId = Number(decoded.sub || decoded.userId || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);

    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'UserId not found in token.' });
    }

    req.user = {
      userId,
      email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
      name: decoded.name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
      surname: decoded.surname || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] || ''
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

