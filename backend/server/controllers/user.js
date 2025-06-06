//importing modules
import { hash, compare } from "bcrypt";
import { users } from "../models";
import { sign } from "jsonwebtoken";

const User = users;

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    //hashing users password before its saved to the database with bcrypt.
    const data = {
        email,
        password: await hash(password, 10),
    };
    // Saving the user
    const user = await User.create(data);

    //if user details is captured:
    //  1. generate token with the user's id and a salt.
    //  2. set cookie with the token generated
    if (user) {
        let token = sign(
            { id: user.id }, 
            process.env.SECRET_KEY, 
            {expiresIn: 1 * 24 * 60 * 60 * 1000,}
        );

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
   
    const user = await User.findOne({
      where: {
        email: email
      }     
    });
   
    //if user email is found, compare password with bcrypt
    if (user) {
        const isSame = await compare(password, user.password);
   
        // if password is the same, then generate token with the user's id and a salt.
        if (isSame) {
          let token = sign({ id: user.id }, process.env.SECRET_KEY, {
            expiresIn: 1 * 24 * 60 * 60 * 1000, // 24hr
          });
   
          //if password matches wit the one in the database, go ahead and generate a cookie for the user
          res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
            
           // Exclude the password from the response
          const { password, ...userWithoutPassword } = user.toJSON();
          // User logged in successfully.
          return res.status(201).send(userWithoutPassword);
        } else {
          // Password not the same as stored.
          return res.status(401).send("Authentication failed: incorrect email or password.");
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
    signup,
    login,
};
