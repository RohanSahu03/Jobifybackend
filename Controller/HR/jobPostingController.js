const JobPosting = require("../../Models/HR/JobPosting");
const asynHandler = require("express-async-handler");
const { genToken } = require("../../utils/generateToken");
const Token = require("../../Models/Token");
const bcrypt = require("bcryptjs");
const CompanyProfile = require("../../Models/HR/CompanyProfile");


// ------------create job-----------
exports.createJob = asynHandler(async (req, res) => {
  const companyId = req.params.id;
    const {
      jobTitle,
      jobDescription,
      jobCountry,
      jobCity,
      jobType,
      salaryRange,
      applicationDeadline,
      requiredQualification,
      experianceLevel,
      benifitOffered,
    
    } = req.body;
  
    console.log("body", req.body);

    if (!salaryRange || typeof salaryRange.min !== 'number' || typeof salaryRange.max !== 'number') {
        return res.status(400).json({ message: 'Invalid salary range' });
    }
  
    // let existingJob = await JobPosting.findOne({ email });
  
    // if (existingCompany) {
    //   return res.status(409).json({
    //     message: "Company already registered",
    //   });
    // }
  
    let newJob = await JobPosting.create({
        jobTitle,
        jobDescription,
        jobCountry,
        jobCity,
        jobType,
        salaryRange:{
            min:salaryRange.min,
            max:salaryRange.max,
        },
        applicationDeadline,
        requiredQualification,
        experianceLevel,
        benifitOffered,
        companyDetails:companyId
    });
  
    let token = await genToken(newJob._id);
    if (!token) {
      await JobPosting.deleteOne({ _id: newJob._id });
    }
  
    newJob = await JobPosting.findById(newJob._id);
    res.status(201).json({
      status: "Success",
      data: newJob,
      token,
    });
  });

//   ------------get all job by company id-------------
exports.getJobById = async (req, res) => {
    const companyId = req.params.id;
  
    try {
      // Find vendor by ID and delete
      const jobs = await JobPosting.find({ companyDetails: companyId }).populate('companyDetails');
  
      if (!jobs) {
        return res.status(204).json({ message: "Jobs not found" });
      }
  else if(jobs){
    return res.status(200).json({ message: "Jobs found successfully", jobs });
  }
    
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch a jobs", error: error.message });
    }
  };

// --------------delete jobs---------------
exports.deleteJob = async (req, res) => {
    const jobId = req.params.id;
    try {
      // Find vendor by ID and delete
      const deletedJob = await JobPosting.findByIdAndDelete(jobId);
  
      if (!deletedJob) {
        return res.status(204).json({ message: "Job not found" });
      }
  
      return res
        .status(200)
        .json({ message: "Job deleted successfully", data: deletedJob });
    } catch (error) {
     return res
        .status(500)
        .json({ message: "Failed to delete Job", error: error.message });
    }
  };
  
// --------------update jobs---------------
  exports.updateJob = async (req, res) => {
    const jobId = req.params.id;
  
    try {
  
      let {
        jobTitle,
        jobDescription,
        jobCountry,
        jobCity,
        jobType,
        salaryRange,
        applicationDeadline,
        requiredQualification,
        experianceLevel,
        benifitOffered,
        companyDetails
        } = req.body;
  
  
  
        let updateObj = {};
        if (jobTitle) {
          updateObj["jobTitle"] = jobTitle;
        }
        if (jobDescription) {
          updateObj["jobDescription"] = jobDescription;
        }
        if (jobCountry) {
          updateObj["jobCountry"] = jobCountry;
        }
        if (jobCity) {
          updateObj["jobCity"] = jobCity;
        }
        if (jobType) {
          updateObj["jobType"] = jobType;
        }
        if (salaryRange) {
          updateObj["salaryRange"] = salaryRange;
        }
        if (applicationDeadline) {
          updateObj["applicationDeadline"] = applicationDeadline;
        }
        if (requiredQualification) {
          updateObj["requiredQualification"] = requiredQualification;
        }
        if (experianceLevel) {
            updateObj["experianceLevel"] = experianceLevel;
          }
          if (benifitOffered) {
            updateObj["benifitOffered"] = benifitOffered;
          }
          if (companyDetails) {
            updateObj["companyDetails"] = companyDetails;
          }
    
      // Save updated vendor to database
      const updatedJob = await JobPosting.findByIdAndUpdate(
        jobId,
        { $set: updateObj },
        { new: true }
      );
  
      if (!updatedJob) {
        return res.status(204).json({ message: "Job not found" });
      }
  
     if(updatedJob){
      return res.status(200).json({ message: "Job Updated Successfully",data:updatedJob});
     }
  
    } catch (error) {
      return res.status(500).json({ message: "Failed to update Job", error: error.message });
    }
  };
  

  //   ------------get job by designation -------------
exports.getJobByKeywords = async (req, res) => {

  try {
    const {keyword}=req.body;
    // Find vendor by ID and delete
    const existingJobs = await JobPosting.find({
      "$or":[
        { "jobTitle":{$regex:".*"+keyword+".*",$options:"i"}},
        { "jobType":{$regex:".*"+keyword+".*",$options:"i"}},
        { "jobCity":{$regex:".*"+keyword+".*",$options:"i"}}
      ]
    });

    if (existingJobs.length === 0) {
      return res.status(204).json({ message: "Jobs not found" });
    } else {
      return res.status(200).json({ message: "Jobs found successfully", data: existingJobs });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch Jobs", error: error.message });
  }
};


//   ------------get job by designation -------------
exports.getJobByCompany = async (req, res) => {

  try {
    const {companyName}=req.body;
    // Find vendor by ID and delete
    const companies = await CompanyProfile.find({ "companyName":{$regex:".*"+companyName+".*",$options:"i"}});
    console.log("companies",companies)
    if (!companies) {
      return res.status(401).json({message:"No Company Found with Name "+companyName})
    }

    const jobQuery = { companyDetails: { $in: companies.map(company => company._id) } };
    console.log("Job query:", jobQuery);

    const jobs =  await JobPosting.find(jobQuery);
    return res.status(200).json({ message: "Company found successfully", data: jobs });
    
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch Company", error: error.message });
  }
};

