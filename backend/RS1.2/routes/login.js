const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Adjust the path as needed
const { generateToken } = require('../middleware/auth'); // Adjust the path as needed

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        console.log('User found:', user);
        
        if (!user) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }

        // Compare the password
        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }

        // Generate a token
        const token = generateToken(user);

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;