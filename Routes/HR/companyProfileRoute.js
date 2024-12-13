const express = require("express");
const router = express.Router();
const multer = require("multer");
const companyController=require("../../Controller/HR/companyProfileController")
const auth = require("../../middlewares/auth")
const path = require("path");
const authorizeRole = require("../../middlewares/roleMiddleware")

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === ".pdf" || ext === ".docx") {
      cb(null, "Public/CompanyDocuments"); // Store PDF and DOCX in 'Public/Resume'
    } else if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
      cb(null, "Public/CompanyLogo"); // Store images in 'Public/Profilepic'
    } else {
      cb(new Error("Invalid file type!"), false); // Reject unsupported file types
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename file with timestamp
  },
});

const upload = multer({ storage: storage });

// Route to create a new vendor
router.post("/company-profile",upload.single('verificationDocument'),companyController.createcompanyProfile);

router.post("/login",companyController.login);

// Route for fetching company profile by company id
router.get("/company-profile/:id", auth,authorizeRole("HR","Admin"),companyController.getCompanyProfile);

// Route to update a Company profile
router.put('/company-profile/:id',upload.any(),auth,authorizeRole("HR"),companyController.updateCompanyProfile);

// Route to delete a company profile
router.delete('/company-profile/:id', auth,authorizeRole("HR","Admin"),companyController.deleteCompanyProfile);

// Route to update a Hr profile
router.put('/hr-profile/:id',auth,authorizeRole("HR"), companyController.updateHrProfile);

module.exports = router;
