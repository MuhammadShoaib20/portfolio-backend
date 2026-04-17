import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes
export const protect = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      return next();
    }
    return res.status(401).json({ message: 'Not authorized, no token' });
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};

// Role-based access – only for write operations
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

// Viewer can only GET data, not modify anything
export const allowViewerReadOnly = (req, res, next) => {
  if (req.user.role === 'viewer' && req.method !== 'GET') {
    return res.status(403).json({
      message: 'Viewer accounts cannot modify data. Only superadmin can perform this action.'
    });
  }
  next();
};