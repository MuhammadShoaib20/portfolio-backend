const Blog = require('../models/Blog');

// @desc    Get all published blogs (public)
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = { isPublished: true };

    if (category && category !== 'all') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [search] } },
      ];
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments(query);

    res.json({ blogs, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all blogs (admin only, no published filter)
// @route   GET /api/blogs/admin
// @access  Private/Admin
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name').sort('-createdAt');
    res.json({ blogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single blog by slug (public, only if published)
// @route   GET /api/blogs/:slug
// @access  Public
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true })
      .populate('author', 'name');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    blog.views += 1;
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a blog (admin only)
// @route   POST /api/blogs
// @access  Private/Admin
exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, author: req.user._id });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a blog (admin only)
// @route   PUT /api/blogs/:id
// @access  Private/Admin
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const { title, excerpt, content, featuredImage, category, tags, isPublished, featured, metaDescription } = req.body;

    blog.title = title || blog.title;
    blog.excerpt = excerpt || blog.excerpt;
    blog.content = content || blog.content;
    blog.featuredImage = featuredImage || blog.featuredImage;
    blog.category = category || blog.category;
    blog.tags = tags || blog.tags;
    blog.isPublished = isPublished !== undefined ? isPublished : blog.isPublished;
    blog.featured = featured !== undefined ? featured : blog.featured;
    blog.metaDescription = metaDescription || blog.metaDescription;

    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a blog (admin only)
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    await blog.deleteOne();
    res.json({ message: 'Blog removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a blog (public)
// @route   PUT /api/blogs/:id/like
// @access  Public
exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    blog.likes += 1;
    await blog.save();
    res.json({ likes: blog.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle publish status (admin only)
// @route   PUT /api/blogs/:id/publish
// @access  Private/Admin
exports.togglePublish = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ isPublished: blog.isPublished });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};