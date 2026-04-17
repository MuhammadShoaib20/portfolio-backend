// ============================================
// IMPORT PACKAGES
// ============================================
const mongoose = require('mongoose');

// ============================================
// PROJECT SCHEMA
// ============================================
const projectSchema = new mongoose.Schema(
  {
    // Project title
    title: {
      type: String,
      required: [true, 'Please add a project title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },

    // Short description (for cards)
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [200, 'Description cannot be more than 200 characters']
    },

    // Full project details (supports HTML/Markdown)
    fullDescription: {
      type: String,
      required: [true, 'Please add full description']
    },

    // Project thumbnail/featured image
    image: {
      type: String,
      default: 'https://via.placeholder.com/600x400'
    },

    // Additional images (gallery)
    images: {
      type: [String],
      default: []
    },

    // Technologies used (array)
    technologies: {
      type: [String],
      required: [true, 'Please add at least one technology']
    },

    // Project category
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'Web Development',
        'Mobile App',
        'Desktop App',
        'UI/UX Design',
        'Full Stack',
        'Frontend',
        'Backend',
        'Game Development',
        'AI/ML',
        'Other'
      ]
    },

    // Live demo URL
    liveUrl: {
      type: String,
      default: ''
    },

    // GitHub repository URL
    githubUrl: {
      type: String,
      default: ''
    },

    // Project status
    status: {
      type: String,
      enum: ['Completed', 'In Progress', 'Planned'],
      default: 'Completed'
    },

    // Is this a featured project?
    featured: {
      type: Boolean,
      default: false
    },

    // Display order (for sorting)
    order: {
      type: Number,
      default: 0
    },

    // Project start date
    startDate: {
      type: Date,
      default: null
    },

    // Project completion date
    completionDate: {
      type: Date,
      default: null
    },

    // Client name (if freelance project)
    client: {
      type: String,
      default: ''
    },

    // View count (for analytics)
    views: {
      type: Number,
      default: 0
    },

    // Likes count
    likes: {
      type: Number,
      default: 0
    },

    // Is project published?
    isPublished: {
      type: Boolean,
      default: true
    },

    // Created by (reference to User)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt
  }
);

// ============================================
// INDEX for faster searches
// ============================================
projectSchema.index({ title: 'text', description: 'text' });

// ============================================
// EXPORT MODEL
// ============================================
module.exports = mongoose.model('Project', projectSchema);