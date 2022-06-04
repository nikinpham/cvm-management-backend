const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.delete('/remove', authController.removeUser);

module.exports = router;
