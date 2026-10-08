import { ApiError } from '../utils/ApiError.js';

const VALID_ROLES = ['student', 'staff'];

/**
 * Role-based access control. Must run AFTER `authenticate`, which sets req.user
 * from the verified JWT and the database record (never from client input).
 *
 * Required usage:
 *   router.get('/', authenticate, requireRole('staff'), controller);
 *
 * Staff-only:   GET /api/requests, PATCH /api/requests/:id/status
 * Student-only: requireRole('student')   (e.g. POST /api/requests)
 * Both roles:   authenticate alone, or requireRole('student', 'staff')
 *
 * Responses (via the global errorHandler):
 *   401 UNAUTHORIZED - req.user is missing (authenticate did not run / failed)
 *   403 FORBIDDEN    - authenticated, but role is not allowed
 */
export function requireRole(...allowedRoles) {
  if (allowedRoles.length === 0 || !allowedRoles.every((r) => VALID_ROLES.includes(r))) {
    throw new Error(`requireRole expects one or more of: ${VALID_ROLES.join(', ')}`);
  }

  return function roleGuard(req, res, next) {
    if (!req.user) {
      return next(new ApiError(401, 'UNAUTHORIZED', 'Authentication required.'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'FORBIDDEN', 'You do not have permission to perform this action.'));
    }
    return next();
  };
}
