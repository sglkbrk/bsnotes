import { Request, Response, NextFunction } from 'express';
import { fileService } from '../services/file.service';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export class FileController {
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).send('Dosya seçilmedi.');
      }

      const key = req.file.filename;
      const url = fileService.getFileUrl(key);

      return res.status(200).json({ key, url });
    } catch (error) {
      return next(error);
    }
  }

  async download(req: Request, res: Response, next: NextFunction) {
    try {
      const key = req.params.key;
      const filePath = fileService.getFilePath(key);

      if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
      }

      const stat = fs.statSync(filePath);
      const etag = crypto.createHash('md5').update(`${stat.mtimeMs}-${stat.size}`).digest('hex');

      res.setHeader('Cache-Control', 'public,max-age=2592000'); // 30 days
      const expireDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
      res.setHeader('Expires', expireDate);
      res.setHeader('ETag', etag);

      // Determine content type
      const ext = path.extname(key).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.pdf': 'application/pdf'
      };

      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);

      const stream = fs.createReadStream(filePath);
      return stream.pipe(res);
    } catch (error) {
      return next(error);
    }
  }

  async getUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const key = req.params.key;
      const url = fileService.getFileUrl(key);
      return res.status(200).json({ url });
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const key = req.params.key;
      fileService.deleteFile(key);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}

export const fileController = new FileController();

