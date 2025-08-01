//importing modules
import { hash, compare } from "bcrypt";
import db from "../models/index.js";
import jwt from "jsonwebtoken";


const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = {
        email,
        password: await hash(password, 10),
    };
    // Saving the user
    const user = await db.users.create(data);

    //if user details is captured:
    //  1. generate token with the user's id and a salt.
    //  2. set cookie with the token generated
    if (user) {
        let token = jwt.sign(
            { id: user.id }, 
            process.env.SECRET_KEY, 
            {expiresIn: 1 * 24 * 60 * 60 * 1000,}
        );
        // TODO will the cookie name be jwt? Review this
        res.cookie("jwt", token, {
            maxAge: 1 * 24 * 60 * 60, 
            httpOnly: true 
        });
        // Exclude the password from the response
        const { password, ...userWithoutPassword } = user.toJSON();
        // User details saved successfully.
        return res.status(201).send(userWithoutPassword);
    } else {
        return res.status(409).send("Details are not correct");
    }
  } catch (error) {
    console.log(error);
  }
};


//login authentication
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.users.findOne({
      where: {
        email: email
      }     
    });
    
    if (user) {
        const isSame = await compare(password, user.password);
        // if password is the same, then generate token with the user's id and a salt.
        if (isSame) {
          let token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
            expiresIn: 1 * 24 * 60 * 60 * 1000, // 24hr
          });
          //if password matches wit the one in the database, go ahead and generate a cookie for the user
          res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
           // Exclude the password from the response
          const { password, ...userWithoutPassword } = user.toJSON();
          // User logged in successfully.
          return res.status(201).send({ ...userWithoutPassword, token });
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
