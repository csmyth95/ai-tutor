import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
}


// Error handler middleware:
// catches errors thrown in your routes/controllers 
// and sends a consistent, type-safe JSON error response.
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
