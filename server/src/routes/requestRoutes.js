import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validateCreateRequest } from '../middleware/validateRequest.js';
import { createRequest } from '../controllers/requestController.js';

const router = Router();

router.post('/', authenticate, requireRole('student'), validateCreateRequest, createRequest);

export default router;