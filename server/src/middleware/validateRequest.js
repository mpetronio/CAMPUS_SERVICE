import { ApiError } from '../utils/ApiError.js';
import { REQUEST_STATUSES } from '../models/ServiceRequest.js';

const OBJECT_ID = /^[0-9a-fA-F]{24}$/;

const LIMITS = {
  title: { min: 5, max: 120 },
  description: { min: 10, max: 2000 },
  location: { min: 2, max: 150 },
};

function validationError(details) {
  return new ApiError(400, 'VALIDATION_ERROR', 'Validation failed', details);
}

export function validateCreateRequest(req, res, next) {
  const body = req.body || {};
  const details = [];

  const categoryId = typeof body.categoryId === 'string' ? body.categoryId.trim() : '';
  if (!OBJECT_ID.test(categoryId)) {
    details.push({ field: 'categoryId', message: 'categoryId must be a valid ID' });
  }

  const clean = { categoryId };

  for (const [field, { min, max }] of Object.entries(LIMITS)) {
    const value = typeof body[field] === 'string' ? body[field].trim() : '';
    if (!value) {
      details.push({ field, message: `${field} is required` });
    } else if (value.length < min || value.length > max) {
      details.push({ field, message: `${field} must be ${min}-${max} characters` });
    }
    clean[field] = value;
  }

  if (details.length) return next(validationError(details));

  // Only whitelisted fields continue; student and status can never come from the client
  req.body = clean;
  next();
}

export function validateStatusUpdate(req, res, next) {
  const details = [];

  if (!OBJECT_ID.test(req.params.id || '')) {
    details.push({ field: 'id', message: 'id must be a valid ID' });
  }

  const status = req.body && req.body.status;
  if (typeof status !== 'string' || !REQUEST_STATUSES.includes(status)) {
    details.push({
      field: 'status',
      message: `status must be one of: ${REQUEST_STATUSES.join(', ')}`,
    });
  }

  if (details.length) return next(validationError(details));

  req.body = { status };
  next();
}