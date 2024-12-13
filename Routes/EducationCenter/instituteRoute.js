const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const instituteController = require("../../Controller/Institute/instituteController");
const multer = require("multer");
const { sendMail } = require("../../middlewares/sendMail");
const path = require("path");
const auth = require("../../middlewares/auth")
const authorizeRole = require("../../middlewares/roleMiddleware")



// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
  
      if (ext === ".pdf" || ext === ".docx") {
        cb(null, "Public/InstituteDocuments"); // Store PDF and DOCX in 'Public/Resume'
      } else if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
        cb(null, "Public/InstituteLogo"); // Store images in 'Public/Profilepic'
      } else {
        cb(new Error("Invalid file type!"), false); // Reject unsupported file types
      }
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname); // Rename file with timestamp
    },
  });
  
  const upload = multer({ storage: storage });
  
  // ---------register route---------------
  router.post("/register", upload.any(), async (req, res) => {
    try {
      // -----------verification token--------------
      const verificationToken = crypto.randomBytes(32).toString("hex");
        
      const document = req.files && req.files.length > 0 ? req.files[0] : null;

      const response = await instituteController.register({
        ...req.body,
        verificationToken,
        document: document ? document.path : null,
      });
      console.log("response", response);
  
      if (response.status === 201) {
        // ---------send vefification email------------
        const verificationLink = `http://localhost:6084/verify/${verificationToken}`;
        const ack = await sendMail(req.body.email, verificationLink)
  
        if (ack) {
          return res.status(200).json({
            message: "Registered Successfully...Verification link sent..",
            statuscode: 200,
            token:response.token
          });
        } else {
        
          return res.status(303).json({
            message: "Verification link not sent..",
            statuscode: 303,
          });
        }
      } else if (response.status === 409) {
        return res.status(409).json({
          status: "Institute already exists",
        });
      } else {
        console.error("Registration error:", error);
        return res
          .status(500)
          .json({ message: "Failed to Register", error: error.message });
      }
    } catch (error) {
      console.error("Registration error:", error);
      return res
        .status(500)
        .json({ message: "Failed to Register", error: error.message });
    }
  });
  

// ---------login route---------------
router.post("/login",instituteController.login);


// Route to request password reset
router.post("/forgotpassword", async (req, res) => {
    const { email } = req.body;
  
    try {
      // Request password reset (assuming requestPasswordReset function handles this logic)
      const link = await instituteController.requestPasswordReset(email);
  
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
router.put("/resetpassword/:id", instituteController.setNewPassword);

router.put(
    "/edit/:id",
    auth,
    authorizeRole(["Institute","Admin"]),
    upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "document", maxCount: 1 },
    ]),
    instituteController.updateInstituteProfile
  );

// Route to delete a institute
router.delete("/delete-institute/:id",    auth,
  authorizeRole(["Institute","Admin"]), instituteController.deleteInstituteById);

module.exports = router;