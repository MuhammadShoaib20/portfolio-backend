const express = require('express');
const router = express.Router();
const {
  getAllResumes,
  getActiveResumes,
  createResume,
  updateResume,
  deleteResume,
  toggleResumeActive,
  downloadResume,
} = require('../controllers/resumeController');
const { protect, authorize, allowViewerReadOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/active', getActiveResumes);
router.get('/download/:id', downloadResume);

// Admin routes – viewers can see list, only superadmin can modify
router.get('/', protect, allowViewerReadOnly, getAllResumes);
router.post('/', protect, authorize('superadmin'), createResume);
router.put('/:id', protect, authorize('superadmin'), updateResume);
router.delete('/:id', protect, authorize('superadmin'), deleteResume);
router.put('/:id/toggle', protect, authorize('superadmin'), toggleResumeActive);

module.exports = router;