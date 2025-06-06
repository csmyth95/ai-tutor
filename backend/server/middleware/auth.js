//importing modules
const db = require("../models").default;

// Globals
const User = db.users;

// Function to check if username or email already exist in the database.
// Avoids having two users with the same username and email.
const saveUser = async (req, res, next) => {
 //search the database to see if user exist
  try {
    // check if email already exists
    const emailcheck = await User.findOne({
        where: {
        email: req.body.email,
        },
    });

    //if email exists in the database -> status of 409
    if (emailcheck) {
        return res.json(409).send("Authentication failed");
    }

    // Pass control to the next middleware function. Request will hang if not specified.
    next();
  } catch (error) {
    console.log(error);
  }
};

// Authentication Middleware - TODO Test
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};


//exporting module
module.exports = {
  saveUser,
  authenticate
};
