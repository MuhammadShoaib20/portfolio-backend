const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  togglePublish
} = require('../controllers/blogController');
const { protect, authorize, allowViewerReadOnly } = require('../middleware/authMiddleware');

// PUBLIC
router.get('/', getBlogs);

// ADMIN – list all blogs (viewer allowed)
router.get(
  '/admin',
  protect,
  allowViewerReadOnly,
  getAllBlogs
);

// PUBLIC (dynamic)
router.get('/:slug', getBlogBySlug);

// ADMIN ACTIONS (write only for superadmin)
router.post('/', protect, authorize('superadmin'), createBlog);
router.put('/:id', protect, authorize('superadmin'), updateBlog);
router.delete('/:id', protect, authorize('superadmin'), deleteBlog);
router.put('/:id/like', protect, authorize('superadmin'), likeBlog);
router.put('/:id/publish', protect, authorize('superadmin'), togglePublish);

module.exports = router;