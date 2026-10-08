import ServiceCategory from '../models/ServiceCategory.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { serializeCategory } from '../utils/serializers.js';
import { parseCategoryFilter } from '../utils/filters.js';

// GET /api/categories
// Access: any authenticated user (student or staff).
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await ServiceCategory.find({ isActive: true, ...parseCategoryFilter(req.query) })
    .collation({ locale: 'en', strength: 2 })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: categories.map(serializeCategory),
  });
});
