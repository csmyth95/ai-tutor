//importing modules
import { Router } from 'express';
import userController from '../controllers/user.js';
import { saveUser } from '../middleware/auth.js';  

const router = Router();
const { register, login } = userController;

// Routes
// Pass the middleware function to the signup
router.post('/register', saveUser, register);
router.post('/login', login );

export default router;
