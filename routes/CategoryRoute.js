import express from 'express';
import categoriesController from '../controllers/categoriesController.js';

const router = express();

router.post('/category', categoriesController.createCategory);
router.post('/category/promotion', categoriesController.createPromotion);
router.get('/categories', categoriesController.getAllCategories);
router.put('/categories/:id', categoriesController.updateCategory);

export default router;
