const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const adminSchema = new mongoose.Schema(
    {

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
    
      professionaltitle: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
  
  adminSchema.methods.comparePassword = async function (pwd, pwdDB) {
    return await bcrypt.compare(pwd, pwdDB);
  };

  let Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;