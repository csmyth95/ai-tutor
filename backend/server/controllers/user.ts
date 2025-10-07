import { hash, compare } from "bcrypt-ts";
import db from "../models/index.js";
import jwt from 'jsonwebtoken';   
import { Secret } from "jsonwebtoken";
import { User, RegisterResponse } from "../types/user.types.js";
import { NextFunction, Request, Response } from "express";

// Globals
const SECRET_KEY = process.env.SECRET_KEY;
const { sign } = jwt;


const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const data = {
        email,
        password: await hash(password, 10),
    };
    // Saving the user
    const user = await db.users.create(
      {
        email: email,
        password: await hash(password, 10),
      },
      {
        include: [
          {
            association: db.userDocuments,
            as: 'userDocuments', 
          }
        ],
      }
    );

    //if user details is captured:
    //  1. generate token with the user's id and a salt.
    //  2. set cookie with the token generated
    if (user) {
        if (!SECRET_KEY) {
            throw new Error('JWT secret key is not configured');
        }
        const secret: Secret = SECRET_KEY;
        let token = sign(
            { id: user.id }, 
            secret,
            {expiresIn: 1 * 24 * 60 * 60 * 1000}
        );
        res.cookie("jwt", token, {
            maxAge: 1 * 24 * 60 * 60, 
            httpOnly: true 
        });
        // Exclude the password from the response
        const { password, ...userWithoutPassword } = user.toJSON();
        const userModel: User = userWithoutPassword;
        const response: RegisterResponse = {
          user: userModel,
          message: 'User registered successfully'
        };
        return res.status(201).json(response);
    } else {
        return res.status(409).send("Details are not correct");
    }
  } catch (error) {
    console.log(error);
    next(error);  // How does this forward the error?
  }
};


//login authentication
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await db.users.findOne({
      where: {
        email: email
      }     
    });
    
    if (user) {
        const isSame = await compare(password, user.password);
        if (!SECRET_KEY) {
            throw new Error('JWT secret key is not configured');
        }
        // if password is the same, then generate token with the user's id and a salt.
        if (isSame) {
          let token = sign({ id: user.id }, SECRET_KEY, {
            expiresIn: 1 * 24 * 60 * 60 * 1000, // 24hr
          });
          //if password matches wit the one in the database, go ahead and generate a cookie for the user
          res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
           // Exclude the password from the response
          const { password, ...userWithoutPassword } = user.toJSON();
          const response = {
            user: userWithoutPassword,
            token: token,
            message: 'User logged in successfully'
          };
          return res.status(201).json(response);
        } else {
          // Password not the same as stored.
          const auth_fail_message = "Authentication failed: incorrect email or password.";
          console.log(auth_fail_message)
          return res.status(401).send({"error": auth_fail_message});
        }
    } else {
      // User not found
      return res.status(401).send("Authentication failed: User not found.");
    }
  } catch (error) {
    console.log(error);
  }
};
   
export default {
    register,
    login,
};
