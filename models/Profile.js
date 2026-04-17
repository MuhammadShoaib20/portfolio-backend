const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: { type: String, trim: true },
    title: { type: String, trim: true, default: 'Full Stack Developer' },
    bio: { type: String, trim: true },
    profileImage: { type: String, default: '' },
    // Contact info
    contactEmail: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    // Social links
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      website: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);