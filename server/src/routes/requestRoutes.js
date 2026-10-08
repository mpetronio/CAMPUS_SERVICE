import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import {
  validateCreateRequest,
  validateStatusUpdate,
} from '../middleware/validateRequest.js';
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus,
} from '../controllers/requestController.js';

const router = Router();

router.post('/', authenticate, requireRole('student'), validateCreateRequest, createRequest);
router.get('/', authenticate, requireRole('student', 'staff'), getRequests);
router.get('/:id', authenticate, requireRole('student', 'staff'), getRequestById);
router.patch(
  '/:id/status',
  authenticate,
  requireRole('staff'),
  validateStatusUpdate,
  updateRequestStatus
);

export default router;