import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import quizController from '../controllers/quiz.js';
import { authenticate } from '../middleware/auth.js';

// Rate limiter for quiz routes - 100 requests per 15 minutes per IP
const quizRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { error: 'Too many requests, please try again later.' },
});

const router = Router();

// Quiz routes - mounted at /api/v1/quizzes
router.post('/documents/:documentId', quizRateLimiter, authenticate, quizController.generate_quiz);
router.get('/documents/:documentId', quizRateLimiter, authenticate, quizController.get_quiz);

export default router;
