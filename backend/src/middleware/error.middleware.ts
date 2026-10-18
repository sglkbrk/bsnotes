import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Unhandled Error:', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error.';

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
}

