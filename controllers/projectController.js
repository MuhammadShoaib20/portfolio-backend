const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 9 } = req.query;
    const query = {};

    if (category && category !== 'all') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { technologies: { $in: [search] } },
      ];
    }

    const projects = await Project.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    res.json({ projects, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.views += 1;
    await project.save();
    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a project (admin only)
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res) => {
  try {
    // ✅ Attach the authenticated user's ID to the project data
    req.body.createdBy = req.user._id;

    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    // Better error handling: send validation errors as 400
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a project (admin only)
// @route   PUT /api/projects/:id
// @access  Private/Admin
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { title, description, fullDescription, image, technologies, category, liveUrl, githubUrl, status, featured } = req.body;

    project.title = title || project.title;
    project.description = description || project.description;
    project.fullDescription = fullDescription || project.fullDescription;
    project.image = image || project.image;
    project.technologies = technologies || project.technologies;
    project.category = category || project.category;
    project.liveUrl = liveUrl || project.liveUrl;
    project.githubUrl = githubUrl || project.githubUrl;
    project.status = status || project.status;
    project.featured = featured !== undefined ? featured : project.featured;

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a project (admin only)
// @route   DELETE /api/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a project (public)
// @route   PUT /api/projects/:id/like
// @access  Public
exports.likeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.likes += 1;
    await project.save();
    res.json({ likes: project.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle featured status (admin only)
// @route   PUT /api/projects/:id/featured
// @access  Private/Admin
exports.toggleFeatured = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.featured = !project.featured;
    await project.save();
    res.json({ featured: project.featured });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};