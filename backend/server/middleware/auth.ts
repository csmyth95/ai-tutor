// Importing modules
import { Request, Response, NextFunction } from 'express';
import db from "../models/index.js";
import jwt from "jsonwebtoken";
import { User as UserType } from '../types/user.types.js';

// Globals
const User = db.users;

// Function to check if username or email already exist in the database.
// Avoids having two users with the same username and email.
// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}

export const saveUser = async (req: Request, res: Response, next: NextFunction) => {
 //search the database to see if user exist
  try {
    // check if email already exists
    const emailExists = await User.findOne({
        where: {
        email: req.body.email,
        },
    });

    if (emailExists) {
      const message = "User email exists already!"; 
      console.log(message); 
      const responseJson = {  
          error: message,
      };
      return res.json(403).send(responseJson);
    }
    // Pass control to the next middleware function. Request will hang if not specified.
    next();
  } catch (error) {
    console.log(error);
  }
};

// Authentication Middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.SECRET_KEY || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user as UserType;
    next();
  });
};
