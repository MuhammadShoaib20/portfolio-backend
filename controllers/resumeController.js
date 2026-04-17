const Resume = require('../models/Resume');

// @desc    Get all resumes (admin only)
// @route   GET /api/resumes
// @access  Private/Admin
const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().sort('-createdAt');
    res.json({ resumes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active resumes (public)
// @route   GET /api/resumes/active
// @access  Public
const getActiveResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ isActive: true }).sort('-createdAt');
    res.json({ resumes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a resume
// @route   POST /api/resumes
// @access  Private/Admin
const createResume = async (req, res) => {
  try {
    const { title, fileUrl, fileType, fileSize } = req.body;
    const resume = await Resume.create({ title, fileUrl, fileType, fileSize });
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a resume
// @route   PUT /api/resumes/:id
// @access  Private/Admin
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    const { title, fileUrl, fileType, fileSize, isActive } = req.body;
    if (title !== undefined) resume.title = title;
    if (fileUrl !== undefined) resume.fileUrl = fileUrl;
    if (fileType !== undefined) resume.fileType = fileType;
    if (fileSize !== undefined) resume.fileSize = fileSize;
    if (isActive !== undefined) resume.isActive = isActive;

    await resume.save();
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private/Admin
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    await resume.deleteOne();
    res.json({ message: 'Resume removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle active status
// @route   PUT /api/resumes/:id/toggle
// @access  Private/Admin
const toggleResumeActive = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    resume.isActive = !resume.isActive;
    await resume.save();
    res.json({ isActive: resume.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download a resume file by ID
// @route   GET /api/resumes/download/:id
// @access  Public
const downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    // Fetch the file from Cloudinary
    const response = await fetch(resume.fileUrl);
    if (!response.ok) {
      console.error(`Cloudinary fetch failed: ${response.status} ${response.statusText}`);
      return res.status(502).json({ message: 'Failed to fetch file from Cloudinary' });
    }

    // Set headers for download
    const contentType = resume.fileType === 'pdf' ? 'application/pdf' : 'application/octet-stream';
    const filename = resume.title.replace(/\s+/g, '_') + '.' + resume.fileType;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Get file as Buffer and send
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllResumes,
  getActiveResumes,
  createResume,
  updateResume,
  deleteResume,
  toggleResumeActive,
  downloadResume,
};