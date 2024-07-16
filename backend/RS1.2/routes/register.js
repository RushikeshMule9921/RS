const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { generateToken } = require('../middleware/auth');

router.post('/', async (req, res) => {
    const { name, email, password, phoneNumber, role } = req.body;

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email is already registered' });
        }

        // Create a new user
        const newUser = new User({
            name,
            email,
            password,
            phoneNumber,
            role: role === 'admin' ? 'admin' : 'user' // This line allows setting the role to 'admin' if specified
        });

        await newUser.save();

        // Generate a token
        const token = generateToken(newUser);

        res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;