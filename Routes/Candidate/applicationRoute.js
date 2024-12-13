const express = require("express");
const router = express.Router();
const applicationController = require("../../Controller/Candidate/applicationController");
const auth = require("../../middlewares/auth");
const authorizeRole = require("../../middlewares/roleMiddleware")

// Route to create a new vendor
router.post(
  "/job-application",
  auth,
  authorizeRole("Candidate"),
  applicationController.createJobApplication
);

// Route for fetching all vendors
router.get(
  "/job-application/:id",
  auth,
  authorizeRole("Candidate"),
  applicationController.getJobApplicationByCandidateId
);

module.exports = router;
