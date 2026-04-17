const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true },
    featuredImage: { type: String, default: '' },
    category: { type: String, required: true },
    tags: [String],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    readingTime: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    metaDescription: { type: String, maxlength: 160 },
  },
  { timestamps: true }
);

blogSchema.pre('save', async function () {
  if (!this.isModified('title') && this.slug) return;

  let slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  if (!slug) slug = 'post';

  const existing = await this.constructor.findOne({ slug, _id: { $ne: this._id } });
  if (existing) {
    let counter = 1;
    let newSlug;
    do {
      newSlug = `${slug}-${counter}`;
      const exists = await this.constructor.findOne({ slug: newSlug, _id: { $ne: this._id } });
      if (!exists) break;
      counter++;
    } while (counter < 100);
    slug = newSlug || `${slug}-${Date.now()}`;
  }

  this.slug = slug;
});

blogSchema.pre('save', function () {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  this.readingTime = Math.ceil(wordCount / wordsPerMinute);
});

module.exports = mongoose.model('Blog', blogSchema);