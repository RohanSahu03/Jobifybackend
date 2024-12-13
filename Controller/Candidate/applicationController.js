// const Application = require("../../Models/Candidate/Application");
const AppliedJobs = require("../../Models/HR/AppliedJobs");
const asynHandler = require("express-async-handler");
const { genToken } = require("../../utils/generateToken");
const Token = require("../../Models/Token");
const bcrypt = require("bcryptjs");


exports.createJobApplication = asynHandler(async (req, res) => {
    const {
        jobId,
        candidateId,
        companyId,
        status,
    } = req.body;
  
    console.log("body", req.body);
    let existingApplication = await AppliedJobs.findOne({
        jobId: jobId,
        candidateId: candidateId,
        companyId:companyId
    });
  
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job.",
      });
    }
  
    let newAppliedJob = await AppliedJobs.create({
        jobId,
        candidateId: candidateId,
        companyId,
        status:'Applied'

    });
  
    let token = await genToken(newAppliedJob._id);
    if (!token) {
      await AppliedJobs.deleteOne({ _id: newAppliedJob._id });
    }
  
    newAppliedJob = await AppliedJobs.findById(newAppliedJob._id);
    res.status(201).json({
      status: "Success",
      data: newAppliedJob,
      token,
    });
  });

// ------------get applied jobs-----------
exports.getJobApplicationByCandidateId = async (req, res) => {
    const candidateId = req.params.id;
    try {
      const jobapplication = await AppliedJobs.find({candidateId}).populate('candidateId').populate('jobId').populate('companyId');
      if (!jobapplication) {
        return res.status(204).json({
          status: "Application  Not Found",
        });
      }
  
      let token = await genToken(jobapplication);

      return res.status(200).json({
        status: "Success",
        data: jobapplication,
        token,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to retrieve Application", error: error.message });
    }
  };





