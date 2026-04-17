const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get all users (superadmin only)
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new viewer user (superadmin only)
// @route   POST /api/users
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Only allow creating 'viewer' accounts (no admin or superadmin)
    const allowedRole = 'viewer';
    if (role && role !== allowedRole) {
      return res.status(400).json({ message: 'Only viewer accounts can be created' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: allowedRole,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user (superadmin only)
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Change password (authenticated user)
// @route   PUT /api/users/password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both passwords' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  changePassword,
};