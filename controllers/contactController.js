// ============================================
// IMPORT PACKAGES & MODELS
// ============================================
const Message = require('../models/Message');

// ============================================
// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
// ============================================
exports.sendMessage = async (req, res) => {
  try {
    // Get IP address
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Create message
    const message = await Message.create({
      ...req.body,
      ipAddress
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! I will get back to you soon.',
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// @desc    Get all messages
// @route   GET /api/contact
// @access  Private (Admin only)
// ============================================
exports.getAllMessages = async (req, res) => {
  try {
    // Filter by status
    let query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Exclude spam
    if (req.query.hideSpam === 'true') {
      query.isSpam = false;
    }

    const messages = await Message.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// @desc    Get single message
// @route   GET /api/contact/:id
// @access  Private (Admin only)
// ============================================
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Mark as read
    if (message.status === 'unread') {
      message.status = 'read';
      await message.save();
    }

    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// @desc    Update message status
// @route   PUT /api/contact/:id
// @access  Private (Admin only)
// ============================================
exports.updateMessageStatus = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// @desc    Delete message
// @route   DELETE /api/contact/:id
// @access  Private (Admin only)
// ============================================
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};