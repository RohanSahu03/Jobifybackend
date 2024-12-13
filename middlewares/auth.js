const jwt = require("jsonwebtoken");
// const User=require("../Models/User");
const Candidate = require("../Models/Candidate/Candidate");
const HR = require("../Models/HR/CompanyProfile");
const Freelancer = require("../Models/Freelancer/freelancer");
const Admin = require("../Models/Admin/admin");
const Institute = require("../Models/EducationCenter/Institute")
const asyncHandler = require("express-async-handler");

const auth = asyncHandler(async (req, res, next) => {
  const testToken = req.headers.authorization || req.headers.Authorization;

  let token;
  if (
    testToken ||
    testToken?.startsWith("Bearer") ||
    testToken?.startsWith("bearer")
  ) {
    token = testToken.split(" ")[1];
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
  //verify token
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (decodedToken.data.professionaltitle === "Candidate") {
    const candidate = await Candidate.findById(decodedToken.data.id);
    if (!candidate) {
      let err = new Error("No user found please Register");
      next(err);
    }
    req.candidateId = candidate._id;
    next();
  }

  if (decodedToken.data.professionaltitle === "HR") {
    const hr = await HR.findById(decodedToken.data.id);
    if (!hr) {
      let err = new Error("No user found please Register");
      next(err);
    }
    req.companyId = hr._id;
    next();
  }

  
  if (decodedToken.data.professionaltitle === "Freelancer") {
    const freelancer = await Freelancer.findById(decodedToken.data.id);
    if (!freelancer) {
      let err = new Error("No user found please Register");
      next(err);
    }
    req.freelancerId = freelancer._id;
    next();
  }

  if (decodedToken.data.professionaltitle === "Admin") {
    const admin = await Admin.findById(decodedToken.data.id);
    if (!admin) {
      let err = new Error("No Admin found please Register");
      next(err);
    }
    req.adminId = admin._id;
    next();
  }

  if (decodedToken.data.professionaltitle === "Institute") {
    const institute = await Institute.findById(decodedToken.data.id);
    if (!institute) {
      let err = new Error("No Institute found please Register");
      next(err);
    }
    req.instituteId = institute._id;
    next();
  }

});



module.exports = auth;
