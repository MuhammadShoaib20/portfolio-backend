const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  changePassword, 
  getUsers, 
  createUser, 
  deleteUser 
} = require('../controllers/userController');

// All routes below require authentication
router.use(protect);

// Password change (any authenticated user – but viewers cannot access this page, so it's fine)
router.put('/password', changePassword);

// Superadmin only
router.get('/', authorize('superadmin'), getUsers);
router.post('/', authorize('superadmin'), createUser);
router.delete('/:id', authorize('superadmin'), deleteUser);

module.exports = router;