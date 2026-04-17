// ============================================
// IMPORT PACKAGES
// ============================================
const mongoose = require('mongoose');

// ============================================
// MESSAGE SCHEMA
// ============================================
const messageSchema = new mongoose.Schema(
  {
    // Sender's name
    name: {
      type: String,
      required: [true, 'Please add your name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },

    // Sender's email
    email: {
      type: String,
      required: [true, 'Please add your email'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },

    // Subject of message
    subject: {
      type: String,
      required: [true, 'Please add a subject'],
      trim: true,
      maxlength: [100, 'Subject cannot be more than 100 characters']
    },

    // Message content
    message: {
      type: String,
      required: [true, 'Please add a message'],
      maxlength: [1000, 'Message cannot be more than 1000 characters']
    },

    // Phone number (optional)
    phone: {
      type: String,
      default: ''
    },

    // Company/Organization (optional)
    company: {
      type: String,
      default: ''
    },

    // Message status
    status: {
      type: String,
      enum: ['unread', 'read', 'replied', 'archived'],
      default: 'unread'
    },

    // Is this a spam message?
    isSpam: {
      type: Boolean,
      default: false
    },

    // IP address (for security)
    ipAddress: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt
  }
);

// ============================================
// EXPORT MODEL
// ============================================
module.exports = mongoose.model('Message', messageSchema);