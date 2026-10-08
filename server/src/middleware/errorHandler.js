import { ApiError } from '../utils/ApiError.js';

/**
 * Integration order in app.js (errorHandler MUST be last):
 *   app.use(express.json()); app.use(cors(...));
 *   app.use('/api/auth', ...); app.use('/api/categories', ...); app.use('/api/requests', ...);
 *   app.use(notFound);
 *   app.use(errorHandler);
 *
 * Envelope: { success: false, error: { code, message, details? } }
 * Stack traces and raw database errors are never sent to clients.
 */
function normalizeError(err) {
  if (err instanceof ApiError) return err;

  if (err?.type === 'entity.parse.failed') {
    return new ApiError(400, 'VALIDATION_ERROR', 'Malformed JSON request body.');
  }

  if (err?.name === 'ValidationError' && err.errors) {
    const details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return new ApiError(400, 'VALIDATION_ERROR', 'Validation failed.', details);
  }

  if (err?.name === 'CastError') {
    return new ApiError(400, 'VALIDATION_ERROR', 'Invalid identifier or value.', [
      { field: err.path, message: 'Invalid value' },
    ]);
  }

  if (err?.code === 11000) {
    return new ApiError(409, 'DUPLICATE_RESOURCE', 'A resource with that value already exists.');
  }

  if (['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(err?.name)) {
    return new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired token.');
  }

  return new ApiError(500, 'INTERNAL_ERROR', 'Internal server error.');
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const apiError = normalizeError(err);

  if (apiError.status === 500 && process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  const error = { code: apiError.code, message: apiError.message };
  if (apiError.details) error.details = apiError.details;

  return res.status(apiError.status).json({ success: false, error });
}
