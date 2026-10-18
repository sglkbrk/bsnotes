import crypto from 'crypto';

export function hashPasswordMD5(password: string): string {
  if (password === null || password === undefined) {
    throw new Error('Password cannot be null');
  }
  return crypto.createHash('md5').update(password, 'utf8').digest('hex').toUpperCase();
}

