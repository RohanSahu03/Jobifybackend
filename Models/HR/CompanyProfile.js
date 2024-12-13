const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");


const companyProfileSchema = new mongoose.Schema(
    {
      companyName: {
        type: String,
        required: [true, "Name field is required"],
      },
      hrDetails:[
        {
          contactPersonName: {
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
          phone: {
            type: Number,
            required: true,
            trim: true,
            minLength: [10, "Minimum characters should be 10"],
          },
          professionaltitle:{
            type:String,
            required:true
          },
        }
      ],
      companyAddress: {
        type: String,
        required: true,
      },
      companyRegistrationNumber: {
        type: String,
        required: true,
      },
      verificationDocument: {
        type: String,
        required: true,
      },
      verificationStatus:{
        type:String,
        default:"Not Approved"
      },
      companylogo:{
        type:String
      },
      paymentStatus:{
        type:String,
        default:"Unpaid"
      }
   
    },
    {
      timestamps: true,
    }
  );
  companyProfileSchema.methods.comparePassword = async function (pwd, pwdDB) {
    return await bcrypt.compare(pwd, pwdDB);
  };

  let CompanyProfile = mongoose.model("CompanyProfile", companyProfileSchema);

module.exports = CompanyProfile;