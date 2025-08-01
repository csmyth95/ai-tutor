//importing modules
import db from "../models/index.js";
import jwt from "jsonwebtoken";

// Globals
const User = db.users;

// Function to check if username or email already exist in the database.
// Avoids having two users with the same username and email.
export const saveUser = async (req, res, next) => {
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
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};
