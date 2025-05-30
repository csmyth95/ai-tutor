//importing modules
const express = require('express');
const summariseController = require('../controllers/document');
const auth = require('../middleware/auth');

const router = express.Router();

// Routes
router.post('/summarise', auth.authenticate, summariseController.summarise_document);
router.delete('/delete/:documentId', auth.authenticate, summariseController.delete_document);
router.get("/", auth.authenticate, summariseController.get_user_documents);
router.get("/:documentId", auth.authenticate, summariseController.get_document);
router.get("/search", auth.authenticate, summariseController.search_documents);

module.exports = router;
