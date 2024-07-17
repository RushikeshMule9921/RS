const jwt = require('jsonwebtoken');
const { secretOrKey } = require('../config/keys');

function generateToken(user) {
    return jwt.sign({ rollNumber: user.rollNumber, role: user.role }, secretOrKey, { expiresIn: '1h' });
}

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token is required');

    jwt.verify(token.replace('Bearer ', ''), secretOrKey, (err, decoded) => {
        if (err) return res.status(500).send('Failed to authenticate token');
        req.user = decoded;
        next();
    });
}

function checkRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) return res.status(403).send('Access denied');
        next();
    };
}

module.exports = { generateToken, verifyToken, checkRole };