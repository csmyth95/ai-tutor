//importing modules
import { Router } from 'express';
import documentController from '../controllers/document';
import { authenticate } from '../middleware/auth';

const router = Router();

// Routes
router.post('/summarise', authenticate, documentController.summarise_document);
router.delete('/:documentId', authenticate, documentController.delete_document);
router.get("/", authenticate, documentController.get_user_documents);
router.get("/:documentId", authenticate, documentController.get_document);
router.get("/search", authenticate, documentController.search_documents);

export default router;
