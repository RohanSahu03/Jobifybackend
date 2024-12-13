const express = require("express");
const router = express.Router();
const multer = require("multer");
const jobController = require("../../Controller/HR/jobPostingController");
const auth = require("../../middlewares/auth");
const authorizeRole = require("../../middlewares/roleMiddleware")

// Route to create a new jon
router.post("/job/:id",auth,authorizeRole("HR"), jobController.createJob);

// Route for fetching job
router.get("/job/:id", auth,authorizeRole("HR"), jobController.getJobById);

// Route to update a job
router.put("/job/:id", auth,authorizeRole("HR"), jobController.updateJob);

// Route to delete a job
router.delete("/job/:id",auth,authorizeRole("HR","Admin"), jobController.deleteJob);

// ---------get job by designation---------------
router.get("/search",auth,authorizeRole("HR","Candidate"), jobController.getJobByKeywords);

// ---------get job by company name---------------
router.get("/by-company",auth,authorizeRole("HR","Candidate"), jobController.getJobByCompany);

module.exports = router;
