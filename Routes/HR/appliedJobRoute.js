const express = require("express");
const router = express.Router();
const appliedjobController=require("../../Controller/HR/appliedJobsController")
const auth = require("../../middlewares/auth")
const authorizeRole = require("../../middlewares/roleMiddleware")

// Route to create a new vendor
// router.post("/applied-job",appliedjobController.createAppliedJob);

// Route for fetching all applied job by id
router.get("/applied-job/:id", auth,authorizeRole("HR"),appliedjobController.getAppliedJob);

// Route to delete a applied job
router.delete('/applied-job/:id',auth, authorizeRole("HR"),appliedjobController.deleteCompanyAppliedJob);

// Route to update a applied job 
router.put('/applied-job/:id',auth, authorizeRole("HR"), appliedjobController.updateAppliedJob);

module.exports = router;