//importing modules
const express = require("express");
const db = require("../models");
//Assigning db.users to User variable
const User = db.users;

// Function to check if username or email already exist in the database.
// Avoids having two users with the same username and email.
const saveUser = async (req, res, next) => {
 //search the database to see if user exist
  try {
    const username = await User.findOne({
        where: {
        userName: req.body.userName,
        },
    });
    // Username already exists in the database -> status 409.
    if (username) {
        return res.json(409).send("username already taken");
    }

    // check if email already exist
    const emailcheck = await User.findOne({
        where: {
        email: req.body.email,
        },
    });

    //if email exists in the database -> status of 409
    if (emailcheck) {
        return res.json(409).send("Authentication failed");
    }

    // Pass control to the next middleware function. Request 
    // will hang if not specified.
    next();
  } catch (error) {
    console.log(error);
  }
};

//exporting module
 module.exports = {
 saveUser,
};