const express = require('express');
const router = express.Router();
const UserDetails = require('../models/userinfo');
const User = require('../models/user');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, async (req, res) => {
  const { cgpa, branch, semester } = req.body;
  const rollNumber = req.user.rollNumber;

  try {
    const user = await User.findOne({ rollNumber });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    let userDetails = await UserDetails.findOne({ rollNumber });
    if (userDetails) {
      userDetails.cgpa = cgpa;
      userDetails.branch = branch;
      userDetails.semester = semester;
      userDetails = await userDetails.save();
    } else {
      userDetails = new UserDetails({
        rollNumber,
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