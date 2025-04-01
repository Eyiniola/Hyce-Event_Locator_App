const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin-only routes
router.post('/', authenticateUser, authorizeRoles('admin'), categoryController.createCategory);
router.put('/:id', authenticateUser, authorizeRoles('admin'), categoryController.updateCategory);
router.delete('/:id', authenticateUser, authorizeRoles('admin'), categoryController.deleteCategory);

module.exports = router;
