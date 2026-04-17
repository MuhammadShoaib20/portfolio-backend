const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage
} = require('../controllers/contactController');
const { protect, authorize, allowViewerReadOnly } = require('../middleware/authMiddleware');

// Public route
router.post('/', sendMessage);

// Protected routes – viewers can read, only superadmin can modify
router.get('/', protect, allowViewerReadOnly, getAllMessages);
router.get('/:id', protect, allowViewerReadOnly, getMessageById);
router.put('/:id', protect, authorize('superadmin'), updateMessageStatus);
router.delete('/:id', protect, authorize('superadmin'), deleteMessage);

module.exports = router;