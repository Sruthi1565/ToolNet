const express = require('express');
const router = express.Router();
const multer = require('multer'); // For handling file uploads
const User = require('../models/User'); // Assuming you're using a User model
const path = require('path');

// Set up multer storage configuration (you can modify this to save files elsewhere)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save the files in an "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file to prevent conflicts
  }
});

// Create multer upload instance
const upload = multer({ storage });

// Update profile route (with file upload)
router.put('/update-profile', upload.single('profileImage'), async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('Uploaded File:', req.file);

  const { userId, name, bio } = req.body;
  let profileImage = '';

  if (req.file) {
    // Generate the full URL to access the profile image
    profileImage = `http://localhost:5000/${path.join('uploads', req.file.filename).replace(/\\/g, '/')}`;
  }

  try {
    // Update user profile with nested profile fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          name,
          'profile.bio': bio,  // Update bio inside the profile object
          'profile.profileImage': profileImage, // Update profileImage inside the profile object
        }
      },
      { new: true }
    );
    console.log(updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
