const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  likeProject,
  toggleFeatured
} = require('../controllers/projectController');
const { protect, authorize, allowViewerReadOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.put('/:id/like', likeProject);

// Admin routes (viewers can list all projects but not modify)
router.get('/admin', protect, allowViewerReadOnly, async (req, res) => {
  // You may need to add a getAllProjects controller if not present
  // For now, we'll reuse getProjects with admin flag
  const Project = require('../models/Project');
  const projects = await Project.find().sort('-createdAt');
  res.json({ projects });
});

// Write operations – only superadmin
router.post('/', protect, authorize('superadmin'), createProject);
router.put('/:id', protect, authorize('superadmin'), updateProject);
router.delete('/:id', protect, authorize('superadmin'), deleteProject);
router.put('/:id/featured', protect, authorize('superadmin'), toggleFeatured);

module.exports = router;