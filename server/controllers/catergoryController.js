import ServiceCategory from '../models/ServiceCategory.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { serializeCategory } from '../utils/serializers.js';

// GET /api/categories
// Access: any authenticated user (student or staff).
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await ServiceCategory.find({ isActive: true })
    .collation({ locale: 'en', strength: 2 })
    .sort({ name: 1 });

  res.status(200).json({
    success: true,
    data: categories.map(serializeCategory),
  });
});
