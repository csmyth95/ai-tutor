//importing modules
const express = require('express')
const userController = require('../controllers/user')
const { signup, login } = userController
const auth = require('../middleware/auth')

const router = express.Router()

// Routes
// Pass the middleware function to the signup
router.post('/signup', auth.saveUser, signup)
router.post('/login', login )

module.exports = router
