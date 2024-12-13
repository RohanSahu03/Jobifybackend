const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const adminController = require("../../Controller/Admin/adminController");
const path = require("path");
const auth = require("../../middlewares/auth");
const authorizeRole = require("../../middlewares/roleMiddleware");

// ---------register route---------------
router.post("/register", adminController.register);

// ---------login route---------------
router.post("/login", adminController.login);

// Route to request password reset
router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  try {
    // Request password reset (assuming requestPasswordReset function handles this logic)
    const link = await adminController.requestPasswordReset(email);

    if (link.statuscode === 200) {
      res.status(200).json({
        status: "Success",
        message: "Password reset link sent successfully",
        link: link,
      });
    } else {
      res.status(303).json({
        status: "Failed",
        message: "Password reset link not sent",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Password reset request failed" });
  }
});

// Route to reset password
router.put("/resetpassword/:id",auth,authorizeRole("Admin"), adminController.setNewPassword);

// ---------get all job route---------------
router.get("/jobs", auth, authorizeRole("Admin"), adminController.getAllJob);

// ---------get all company route---------------
router.get(
  "/companies",
  auth,
  authorizeRole("Admin"),
  adminController.getAllCompany
);

// ---------get all jobseekers---------------
router.get(
  "/jobseekers",
  auth,
  authorizeRole("Admin"),
  adminController.getAllCandidate
);

// ---------get all projects---------------
router.get(
  "/projects",
  auth,
  authorizeRole("Admin"),
  adminController.getAllProjects
);

// ---------get all applied jobs---------------
router.get(
  "/appliedjobs",
  auth,
  authorizeRole("Admin"),
  adminController.getAllAppliedJob
);

module.exports = router;
