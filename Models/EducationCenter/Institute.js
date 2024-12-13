const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const instituteSchema = new mongoose.Schema(
    {
      instituteName: {
        type: String,
        required: [true, "Name field is required"],
        trim: true,
      },
      contactPersonName: {
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
      institutionAddress: {
        type: String,
        required: true,
      },
      institutionType: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
        trim: true,
        minLength: [10, "Minimum characters should be 10"],
      },
      professionaltitle: {
        type: String,
        required: true,
      },
      logo:{
        type: String,
      },
      document: {
        type: String,
        required: true,
      },
      isVerified: { type: Boolean, default: false },
      verificationToken: { type: String },
  
    
    },

    {
      timestamps: true,
    }
  );

  instituteSchema.methods.comparePassword = async function (pwd, pwdDB) {
    return await bcrypt.compare(pwd, pwdDB);
  };
  
  let Institute = mongoose.model("Institute", instituteSchema);
  
  module.exports = Institute;
  