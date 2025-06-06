//importing modules
import { Router } from 'express';
import userController from '../controllers/user';
import { saveUser } from '../middleware/auth';

const router = Router();
const { signup, login } = userController;

// Routes
// Pass the middleware function to the signup
router.post('/signup', saveUser, signup);
router.post('/login', login );

export default router;
