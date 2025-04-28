//importing modules
const express = require('express');
const summariseController = require('../controllers/summarise');
const auth = require('../middleware/auth');

const router = express.Router();

// TODO Get functions from summarise Controller & remove userController
const { signup, login } = userController;

// Routes
// Pass the middleware function to the signup
// router.post('/signup', auth.saveUser, signup);

// app.post("/api/summarize", authenticate, upload.single("pdf"), async (req, res) => {
router.post('/summarise', auth.authenticate, upload.single("pdf"))

module.exports = router;
