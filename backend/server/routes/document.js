//importing modules
const express = require('express');
const summariseController = require('../controllers/document');
const auth = require('../middleware/auth');

const router = express.Router();

// Routes
router.post('/summarise_document', auth.authenticate, summariseController.summarise_document);
router.delete('/delete_document', auth.authenticate, summariseController.delete_document);
router.get("/documents", auth.authenticate, summariseController.get_user_documents);
router.get("/documents/:documentId", auth.authenticate, summariseController.get_document);
router.get("/documents/search", auth.authenticate, summariseController.search_documents);

module.exports = router;
