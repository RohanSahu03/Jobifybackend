const User = require('../Models/Register')
const asynHandler = require("express-async-handler");
const {genToken} = require('../utils/generateToken')
const Token = require('../Models/Token')
const bcrypt = require("bcryptjs");

exports.register = asynHandler(async (req, res) => {
    const {
      firstname,
      lastname,
      email,
      password,
      phone,
     country,
     city,
     professionaltitle,
     summary,
    skills
    } = req.body;

    console.log('body',req.body)

    let existingUser = await User.findOne({ email });
  
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const bcryptSalt = 10;
    let encryptedPassword;
    await bcrypt
    .hash(password, bcryptSalt)
    .then((hash) => {
        encryptedPassword = hash;
    })
    .catch((error) => {
      console.log(error);
      return res
        .status(400)
        .json({ error: "password encryption problem..." });
    });

    let newUser = await User.create({
       firstname,
      lastname,
      email,
      password:encryptedPassword,
      phone,
     country,
     city,
     professionaltitle,
     summary,
    skills
    });


    let token = await genToken(newUser._id);
    if (!token) {
      await User.deleteOne({ _id: newUser._id });
    }
  
    newUser = await User.findById(newUser._id).select({ password: 0 });
    res.status(201).json({
      status: "Success",
      data: newUser,
      token,
    });
  });


  exports.login = asynHandler(async (req, res) => {
    const { email, password,professionaltitle } = req.body;
    let existingUser = await User.findOne({ email,professionaltitle });
  
    if (
      !existingUser ||
      !(await existingUser.comparePassword(password, existingUser.password))
    ) {
    return res.status(401).json({
      status: "User Not Found",
    })
    }
    existingUser = await User.findById(existingUser._id).select({ password: 0 });
let userobj={
  id:existingUser._id,
  email:existingUser.email,
  professionaltitle:existingUser.professionaltitle
}

    let token = await genToken(userobj);
   return res.status(200).json({
      status: "Success",
      data: existingUser,
      token,
    });
  });
  