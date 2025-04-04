//importing modules
const express = require('express');
const userController = require('../controllers/user');
const auth = require('../middleware/auth');

const router = express.Router();
const { signup, login } = userController;

// Routes
// Pass the middleware function to the signup
router.post('/signup', auth.saveUser, signup);
router.post('/login', login );

module.exports = router;
