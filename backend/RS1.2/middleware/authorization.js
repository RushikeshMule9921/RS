const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');

// Example protected route for admin
router.get('/admin', verifyToken, checkRole('admin'), (req, res) => {
    res.send('Welcome Admin');
});

// Example protected route for regular users
router.get('/user', verifyToken, checkRole('user'), (req, res) => {
    res.send('Welcome User');
});

module.exports = router;
