const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { generateToken } = require('../middleware/auth');

router.post('/', async (req, res) => {
    const { rollNumber, password } = req.body;

    try {
        const user = await User.findOne({ rollNumber });
        
        if (!user) {
            return res.status(400).json({ msg: 'Invalid roll number or password' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid roll number or password' });
        }

        const token = generateToken(user);

        res.status(200).json({ token, user: { rollNumber: user.rollNumber, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;