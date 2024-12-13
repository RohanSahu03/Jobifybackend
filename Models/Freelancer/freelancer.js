const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const freelancerSchema = new mongoose.Schema(
    {
      fullname: {
        type: String,
        required: [true, "Name field is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email field is required"],
        trim: true,
        validate: [validator.isEmail, "Enter proper Email"],
      },
      password: {
        type: String,
        required: [true, "Password field is required"],
        trim: true,
        minLength: [8, "Minimum characters are 8"],
      },
      country: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
        trim: true,
        minLength: [10, "Minimum characters should be 10"],
      },
      city: {
        type: String,
        required: true,
      },
      professionaltitle: {
        type: String,
        required: true,
      },
      summary: {
        type: String,
        required: true,
      },
      skills: {
        type: String,
        required: true,
      },
      profilepic:{
        type: String,
      },
      isVerified: { type: Boolean, default: false },
      verificationToken: { type: String },
      resume:{
        type: String,
      },
    
    },

    {
      timestamps: true,
    }
  );

  freelancerSchema.methods.comparePassword = async function (pwd, pwdDB) {
    return await bcrypt.compare(pwd, pwdDB);
  };
  
  let Freelancer = mongoose.model("Freelancer", freelancerSchema);
  
  module.exports = Freelancer;
  