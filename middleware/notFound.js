import { ApiError } from '../utils/ApiError.js';

// Register after all API routes, before errorHandler.
export function notFound(req, res, next) {
  next(new ApiError(404, 'NOT_FOUND', 'Route not found.'));
}
