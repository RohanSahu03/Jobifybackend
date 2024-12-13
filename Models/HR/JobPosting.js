const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");


const jobPostingSchema = new mongoose.Schema(
    {
      jobTitle: {
        type: String,
        required: [true, "Job title is required"],
      },
      jobDescription: {
        type: String,
        required:true,
        trim: true,
      },
      jobCity: {
        type: String,
        required: true,
      },
      jobCountry: {
        type: String,
        required: true,
      },
      jobType: {
        type: String,
        required: true,
      },
      salaryRange: {
        min: {
          type: Number,
          required: true
      },
      max: {
          type: Number,
          required: true
      }
       
      },
      applicationDeadline: {
        type: Date,
        default: Date.now,
        required: true,
      },
      requiredQualification: {
        type: String,
        required: true,
      },
      experianceLevel:{
        type: String,
        required: true,
      },
      benifitOffered:{
        type: String
      },
      companyDetails:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanyProfile', 
      }
    },
    {
      timestamps: true,
    }
  );

  let Jobs = mongoose.model("Jobs", jobPostingSchema);

module.exports = Jobs;