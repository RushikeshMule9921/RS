// routes/userInfo.js
const express = require('express');
const router = express.Router();
const UserInfo = require('../models/userinfo');
const { verifyToken } = require('../middleware/auth');

router.post('/additional-info', verifyToken, async (req, res) => {
  const { cgpa, branch, semester } = req.body;
  const userId = req.user.id; // Get user ID from token

  try {
    // Check if additional info already exists for this user
    const existingUserInfo = await UserInfo.findOne({ userId });
    if (existingUserInfo) {
      return res.status(400).json({ msg: 'Additional information already provided' });
    }

    // Create new additional information entry
    const userInfo = new UserInfo({
      userId,
      name: req.user.name,
      email: req.user.email,
      phoneNumber: req.user.phoneNumber,
      cgpa,
      branch,
      semester
    });

    await userInfo.save();
    res.status(201).json({ msg: 'Additional information saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
