const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const appliedJobSchema = new mongoose.Schema(
    {
    jobId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jobs',
    },
    candidateId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
    },
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'CompanyProfile'
      },
      status:{
        type:String,
        required:true
        // enum:["Applied","Rejected","Selected"],
      }  
    },
    {
      timestamps: true,
    }
  );

  let AppliedJobs = mongoose.model("AppliedJobs", appliedJobSchema);

module.exports = AppliedJobs;