const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Only superadmin can upload files
router.post('/', protect, authorize('superadmin'), uploadFile);

module.exports = router;