const express = require('express');
const router = express.Router();
const UserDetails = require('../models/userinfo');
const User = require('../models/user');
const { verifyToken } = require('../middleware/auth'); // Import verifyToken instead of authMiddleware

// Route to save additional user details
router.post('/', verifyToken, async (req, res) => {
  const { cgpa, branch, semester } = req.body;
  const userId = req.user.id; // Extract userId from the JWT token

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if additional details already exist for the user
    let userDetails = await UserDetails.findOne({ userId });
    if (userDetails) {
      // Update existing details
      userDetails.cgpa = cgpa;
      userDetails.branch = branch;
      userDetails.semester = semester;
      userDetails = await userDetails.save();
    } else {
      // Create new additional details
      userDetails = new UserDetails({
        userId,
        cgpa,
        branch,
        semester
      });
      await userDetails.save();
    }

    res.status(200).json({ msg: 'Additional information saved successfully', userDetails });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;