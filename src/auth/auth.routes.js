const express = require('express');
const router = express.Router();

const authController = require('./auth.controllers');

// domain/auth/...

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);

module.exports = router;
