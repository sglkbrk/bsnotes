import fs from 'fs';
import path from 'path';
import { config } from '../config/env';

export class FileService {
  getFileUrl(fileName: string): string {
    return fileName;
  }

  getFilePath(fileName: string): string {
    // Sanitize to prevent path traversal
    const safeName = path.basename(fileName);
    return path.join(config.uploadsDir, safeName);
  }

  fileExists(fileName: string): boolean {
    const filePath = this.getFilePath(fileName);
    return fs.existsSync(filePath);
  }

  deleteFile(fileName: string): void {
    const filePath = this.getFilePath(fileName);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Failed to delete file:', filePath, err);
      }
    }
  }
}

export const fileService = new FileService();

