const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { generateToken } = require('../middleware/auth');

router.post('/', async (req, res) => {
    const { name, email, password, phoneNumber, rollNumber, role } = req.body;

    try {
        const existingUser = await User.findOne({ rollNumber });
        if (existingUser) {
            return res.status(400).json({ msg: 'Roll number is already registered' });
        }

        const newUser = new User({
            name,
            email,
            password,
            phoneNumber,
            rollNumber,
            role: role === 'admin' ? 'admin' : 'user'
        });

        await newUser.save();

        const token = generateToken(newUser);

        res.status(201).json({ token, user: { rollNumber: newUser.rollNumber, name: newUser.name, email: newUser.email, role: newUser.role } });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;