const AppliedJob = require("../../Models/HR/AppliedJobs");
const asynHandler = require("express-async-handler");
const { genToken } = require("../../utils/generateToken");
const Token = require("../../Models/Token");
const bcrypt = require("bcryptjs");


// ------------create applied jobs-----------
// exports.createAppliedJob = asynHandler(async (req, res) => {
//     const {
//         jobId,
//         candidateDetails,
//         jobDetails,
//         status,
//     } = req.body;
  
//     console.log("body", req.body);
//     let existingappliedJob = await AppliedJob.findOne({
//         candidateDetails: candidateDetails,
//         jobDetails: jobDetails
//     });
  
//     if (existingappliedJob) {
//       return res.status(400).json({
//         message: "You have already applied for this job.",
//       });
//     }
  
//     let newAppliedJob = await AppliedJob.create({
//         jobId,
//         candidateDetails,
//         jobDetails,
//         status:'Applied'
//     });
  
//     let token = await genToken(newAppliedJob._id);
//     if (!token) {
//       await AppliedJob.deleteOne({ _id: newAppliedJob._id });
//     }
  
//     newAppliedJob = await AppliedJob.findById(newAppliedJob._id);
//     res.status(201).json({
//       status: "Success",
//       data: newAppliedJob,
//       token,
//     });
//   });

// ------------get applied jobs-----------
  exports.getAppliedJob = async (req, res) => {
    const companyId=req.params.id;

    try {
      const appliedjobs = await AppliedJob.find({companyId}).populate('companyId');
      if (!appliedjobs) {
        return res.status(204).json({
          status: "Applied Jobs Not Found",
        });
      }
  
      let token = await genToken(appliedjobs);
  
      return res.status(200).json({
        status: "Success",
        data: appliedjobs,
        token,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to retrieve data", error: error.message });
    }
  };

  // --------------delete applied job---------------
exports.deleteCompanyAppliedJob = async (req, res) => {
    const jobId = req.params.id;
    try {
      // Find vendor by ID and delete
      const deletedAppliedJob = await AppliedJob.findByIdAndDelete(jobId);
  
      if (!deletedAppliedJob) {
        return res.status(204).json({ message: "Job not found" });
      }
  
      return res
        .status(200)
        .json({ message: "Job deleted successfully", data: deletedAppliedJob });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to delete Job", error: error.message });
    }
  };

exports.updateAppliedJob = async (req, res) => {
    const appliedJobId = req.params.id
    try {
  
      let {
      status
        } = req.body;

        let updateObj = {};
      
        if (status) {
          updateObj["status"] = status;
        }
  
  
      // Save updated vendor to database
      const updatedProfile = await AppliedJob.findByIdAndUpdate(
        appliedJobId,
        { $set: updateObj },
        { new: true }
      );
  
      if (!updatedProfile) {
        return res.status(204).json({ message: "Job not found" });
      }
  
     if(updatedProfile){
      return res.status(200).json({ message: "Status Updated Successfully",data:updatedProfile});
     }
  
    } catch (error) {
      return res.status(500).json({ message: "Failed to update Status", error: error.message });
    }
  };

