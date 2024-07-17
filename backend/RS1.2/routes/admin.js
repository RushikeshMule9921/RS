const express = require('express');
const router = express.Router();
const User = require('../models/user');
const UserDetails = require('../models/userinfo');
const { verifyToken, checkRole } = require('../middleware/auth');

router.get('/students', verifyToken, checkRole('admin'), async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    const userDetails = await UserDetails.find();

    const studentsData = users.map(user => {
      const details = userDetails.find(detail => detail.rollNumber === user.rollNumber);
      return {
        ...user.toObject(),
        ...(details ? details.toObject() : {})
      };
    });

    console.log('Fetched student data:', studentsData);  // Debugging statement
    res.json(studentsData);
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
