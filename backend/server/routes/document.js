//importing modules
import { Router } from 'express';
import multer from 'multer';

import documentController from '../controllers/document.js';
import { authenticate } from '../middleware/auth.js';

// Multer docs: https://www.npmjs.com/package/multer
const upload = multer({ dest: 'uploads/' });
// TODO Incorporate disk storage figure out how to use it as a  middleware.
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '/documents')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
// });
// const downloadToStorage = multer({ storage: storage });

// Routes
const router = Router();
// NOTE: Param 'document' here should be the same as in the calling request.
router.post('/summarise', authenticate, upload.single('document'), documentController.summarise_document);
router.delete('/:documentId', authenticate, documentController.delete_document);
router.get("/", authenticate, documentController.get_user_documents);
router.get("/:documentId", authenticate, documentController.get_document);
router.get("/search", authenticate, documentController.search_documents);

export default router;
