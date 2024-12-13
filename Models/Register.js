const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const registerSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Name field is required"],
      trim: true,
    },
    lastname: {
      type: String,
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
  },
  {
    timestamps: true,
  }
);

//pre hook
// userSchema.pre("save",async function(next){
// let salt=await bcrypt.genSalt(10)
// this.password=await bcrypt.hash(this.password,salt)
// next()
// })

//methods

registerSchema.methods.comparePassword = async function (pwd, pwdDB) {
  return await bcrypt.compare(pwd, pwdDB);
};

let User = mongoose.model("User", registerSchema);

module.exports = User;
