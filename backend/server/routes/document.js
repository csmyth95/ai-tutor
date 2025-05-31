//importing modules
const express = require('express');
const documentController = require('../controllers/document');
const auth = require('../middleware/auth');

const router = express.Router();

// Routes
router.post('/summarise', auth.authenticate, documentController.summarise_document);
router.delete('/:documentId', auth.authenticate, documentController.delete_document);
router.get("/", auth.authenticate, documentController.get_user_documents);
router.get("/:documentId", auth.authenticate, documentController.get_document);
router.get("/search", auth.authenticate, documentController.search_documents);

module.exports = router;
