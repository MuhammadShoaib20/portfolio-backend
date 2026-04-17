const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc    Get public profile
// @route   GET /api/profile
// @access  Public
const getProfile = async (req, res) => {
  try {
    const adminUser = await User.findOne({ role: { $in: ['superadmin'] } }); // changed
    if (!adminUser) return res.status(404).json({ message: 'Admin not found' });

    let profile = await Profile.findOne({ user: adminUser._id });

    if (!profile) {
      profile = new Profile({
        user: adminUser._id,
        name: adminUser.name,
        title: 'Full Stack Developer',
        bio: '',
        profileImage: '',
        contactEmail: adminUser.email,
        phone: '',
        address: '',
        socialLinks: {},
      });
      await profile.save();
    }

    res.json({
      _id: profile._id,
      name: profile.name || adminUser.name,
      title: profile.title,
      bio: profile.bio,
      profileImage: profile.profileImage,
      contactEmail: profile.contactEmail || adminUser.email,
      phone: profile.phone,
      address: profile.address,
      socialLinks: profile.socialLinks,
      email: adminUser.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update admin profile
// @route   PUT /api/profile
// @access  Private/Admin
const updateProfile = async (req, res) => {
  try {
    const adminUser = req.user;
    if (adminUser.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let profile = await Profile.findOne({ user: adminUser._id });
    if (!profile) profile = new Profile({ user: adminUser._id });

    const { name, title, bio, profileImage, contactEmail, phone, address, socialLinks } = req.body;

    if (name !== undefined) profile.name = name;
    if (title !== undefined) profile.title = title;
    if (bio !== undefined) profile.bio = bio;
    if (profileImage !== undefined) profile.profileImage = profileImage;
    if (contactEmail !== undefined) profile.contactEmail = contactEmail;
    if (phone !== undefined) profile.phone = phone;
    if (address !== undefined) profile.address = address;

    if (socialLinks) {
      profile.socialLinks = {
        ...profile.socialLinks,
        ...socialLinks,
      };
    }

    await profile.save();

    if (name !== undefined && name !== adminUser.name) {
      adminUser.name = name;
      await adminUser.save();
    }

    res.json({
      message: 'Profile updated successfully',
      profile: {
        name: profile.name || adminUser.name,
        title: profile.title,
        bio: profile.bio,
        profileImage: profile.profileImage,
        contactEmail: profile.contactEmail || adminUser.email,
        phone: profile.phone,
        address: profile.address,
        socialLinks: profile.socialLinks,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProfile, updateProfile };