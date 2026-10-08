import ServiceRequest from '../models/ServiceRequest.js';
import ServiceCategory from '../models/ServiceCategory.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { serializeRequest } from '../utils/serializers.js';

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