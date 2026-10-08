import ServiceRequest from '../models/ServiceRequest.js';
import ServiceCategory from '../models/ServiceCategory.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { serializeRequest } from '../utils/serializers.js';
import { parseRequestFilters } from '../utils/filters.js';

export const createRequest = asyncHandler(async (req, res) => {
  const { categoryId, title, description, location } = req.body;

  const category = await ServiceCategory.findById(categoryId);
  if (!category) {
    throw new ApiError(404, 'NOT_FOUND', 'Category not found');
  }
  if (!category.isActive) {
    throw new ApiError(400, 'CATEGORY_INACTIVE', 'Category is not active');
  }

  const created = await ServiceRequest.create({
    student: req.user._id, // from the JWT user, never from the body
    category: category._id,
    title,
    description,
    location,
  });

  await created.populate([
    { path: 'student', select: 'name email' },
    { path: 'category', select: 'name' },
  ]);

  res.status(201).json({ success: true, data: serializeRequest(created) });
});

const OBJECT_ID = /^[0-9a-fA-F]{24}$/;

const POPULATE = [
  { path: 'student', select: 'name email' },
  { path: 'category', select: 'name' },
];

export const getRequests = asyncHandler(async (req, res) => {
  // Students only ever see their own requests, whatever the query says
  const filter = { ...parseRequestFilters(req.query), ...(req.user.role === 'student' ? { student: req.user._id } : {}) };

  const requests = await ServiceRequest.find(filter)
    .populate(POPULATE)
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: requests.map(serializeRequest) });
});

export const getRequestById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!OBJECT_ID.test(id)) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Validation failed', [
      { field: 'id', message: 'id must be a valid ID' },
    ]);
  }

  const request = await ServiceRequest.findById(id).populate(POPULATE);
  if (!request) {
    throw new ApiError(404, 'NOT_FOUND', 'Request not found');
  }

  const isOwner = request.student && String(request.student._id) === String(req.user._id);
  if (req.user.role === 'student' && !isOwner) {
    throw new ApiError(403, 'FORBIDDEN', 'You cannot view this request');
  }

  res.status(200).json({ success: true, data: serializeRequest(request) });
});

const ALLOWED_TRANSITIONS = {
  submitted: ['in_progress', 'rejected'],
  in_progress: ['resolved', 'rejected'],
  resolved: [],
  rejected: [],
};

export const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const request = await ServiceRequest.findById(req.params.id);
  if (!request) {
    throw new ApiError(404, 'NOT_FOUND', 'Request not found');
  }

  if (!ALLOWED_TRANSITIONS[request.status].includes(status)) {
    throw new ApiError(
      400,
      'INVALID_STATUS_TRANSITION',
      `Cannot change status from ${request.status} to ${status}`
    );
  }

  const updated = await ServiceRequest.findOneAndUpdate(
    { _id: request._id, status: request.status },
    { $set: { status } },
    { new: true, runValidators: true }
  ).populate(POPULATE);
  if (!updated) throw new ApiError(409, 'INVALID_STATUS_TRANSITION', 'Status changed. Refresh and try again.');
  res.status(200).json({ success: true, data: serializeRequest(updated) });
});
