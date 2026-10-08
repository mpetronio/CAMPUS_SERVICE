import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getCategories } from '../controllers/categoryController.js';

const categoryRoutes = Router();

categoryRoutes.get('/', authenticate, getCategories);

export default categoryRoutes;
