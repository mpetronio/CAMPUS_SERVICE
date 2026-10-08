import { ApiError } from './ApiError.js';
import { REQUEST_STATUSES } from '../models/ServiceRequest.js';

export function parseRequestFilters(query) {
  const filter = {};
  if (query.status !== undefined) {
    if (typeof query.status !== 'string' || !REQUEST_STATUSES.includes(query.status)) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid status filter.');
    }
    filter.status = query.status;
  }
  if (query.categoryId !== undefined) {
    if (typeof query.categoryId !== 'string' || !/^[a-f\d]{24}$/i.test(query.categoryId)) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid category filter.');
    }
    filter.category = query.categoryId;
  }
  return filter;
}

export function parseCategoryFilter(query) {
  if (query.q === undefined) return {};
  if (typeof query.q !== 'string') throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid category search.');
  return { name: { $regex: query.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } };
}
