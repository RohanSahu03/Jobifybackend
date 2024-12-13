const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const applicationSchema = new mongoose.Schema(
    {
      candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
      },
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jobs',
      },
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanyProfile',
      },
    applicationStatus:{
        type:String,
    }
    },
    {
      timestamps: true,
    }
  );

  let JobApplication = mongoose.model("JobApplication", applicationSchema);
  
  module.exports = JobApplication;