const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  changePassword,
  registerViewer, // <-- new import
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/changepassword', protect, changePassword);
router.post('/register-viewer', registerViewer); // <-- new route

module.exports = router;