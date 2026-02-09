import { Request, Response, NextFunction } from 'express';
import { requestStorage } from './request-context';

export function requestContextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  requestStorage.run(req, () => next());
}
