//importing modules
import { Router } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';

import documentController from '../controllers/document.js';
import { authenticate } from '../middleware/auth.js';

// Multer docs: https://www.npmjs.com/package/multer
const upload = multer({ dest: 'uploads/' });

// Rate limiter for document summarisation to mitigate DoS via expensive file operations
const summariseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Routes
const router = Router();
// NOTE: Param 'document' here should be the same as in the calling request.
router.post('/summarise', authenticate, summariseLimiter, upload.single('document'), documentController.summarise_document);
router.get("/", authenticate, documentController.get_user_documents);

export default router;
