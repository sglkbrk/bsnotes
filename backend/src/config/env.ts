import dotenv from 'dotenv';
import path from 'path';

// Load .env from root if available, otherwise current directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // fallback to local .env

export const config = {
  port: Number(process.env.PORT || process.env.BACKEND_PORT || 5002),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    key: process.env.JWT_KEY || 'default_jwt_secret_key_change_in_production_123456!',
    issuer: process.env.JWT_ISSUER || 'BsNotesServices',
    audience: process.env.JWT_AUDIENCE || 'BsNotesClient',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  },
  uploadsDir: path.resolve(process.cwd(), 'uploads')
};

