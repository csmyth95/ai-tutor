import { Router } from 'express';

import quizController from '../controllers/quiz.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Quiz routes - mounted at /api/v1/quizzes
router.post('/documents/:documentId', authenticate, quizController.generate_quiz);
router.get('/documents/:documentId', authenticate, quizController.get_quiz);

export default router;
