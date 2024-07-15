const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { generateToken, verifyToken, checkRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Register User
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body;
        const user = new User({ name, email, password, phoneNumber });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(400).send(error);
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid password');
    const token = generateToken(user);
    res.send({ token });
});

// Upload Resume (User Role)
router.post('/upload', verifyToken, checkRole('user'), upload.single('resume'), async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send('User not found');
    user.resume = req.file.path;
    await user.save();
    res.send('Resume uploaded successfully');
});

// Admin Route Example
router.get('/admin', verifyToken, checkRole('admin'), (req, res) => {
    res.send('Admin access granted');
});

module.exports = router;
