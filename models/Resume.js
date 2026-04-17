const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'Please provide a file URL'],
    },
    fileType: {
      type: String,
      enum: ['pdf', 'doc', 'docx'],
      default: 'pdf',
    },
    fileSize: {
      type: Number, // in bytes
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', resumeSchema);