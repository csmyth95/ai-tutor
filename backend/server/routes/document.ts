//importing modules
import { Router } from 'express';
import multer from 'multer';

import documentController from '../controllers/document';
import { authenticate } from '../middleware/auth';

// Multer docs: https://www.npmjs.com/package/multer
const upload = multer({ dest: 'uploads/' });

// Routes
const router = Router();
// NOTE: Param 'document' here should be the same as in the calling request.
router.post('/summarise', authenticate, upload.single('document'), documentController.summarise_document);
router.get("/", authenticate, documentController.get_user_documents);


export default router;
