const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const freelancerController = require("../../Controller/Freelancer/freelancerController");
const Freelancer = require("../../Models/Freelancer/freelancer");
const multer = require("multer");
const { sendMail } = require("../../middlewares/sendMail");
const path = require("path");
const auth = require("../../middlewares/auth")
const authorizeRole = require("../../middlewares/roleMiddleware")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
  
      if (ext === ".pdf" || ext === ".docx") {
        cb(null, "Public/Resume"); // Store PDF and DOCX in 'Public/Resume'
      } else if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
        cb(null, "Public/ProfilePic"); // Store images in 'Public/Profilepic'
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
router.post("/register", async (req, res) => {
    try {
      // -----------verification token--------------
      const verificationToken = crypto.randomBytes(32).toString("hex");
  
      const response = await freelancerController.register({
        ...req.body,
        verificationToken,
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
          status: "User already exists",
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
router.post("/login",freelancerController.login);

  // ---------update route---------------
router.put(
    "/edit-freelancer/:id",
    auth,
    authorizeRole("Freelancer"),
    upload.fields([
      { name: "profilepic", maxCount: 1 },
      { name: "resume", maxCount: 1 },
    ]),
    freelancerController.updateFreelancerProfile
  );

// ---------get freelance by freelancerid route---------------
router.get("/getFreelancer/:id",auth,authorizeRole("Freelancer"), freelancerController.getFreelancerById);

// ---------get all freelancer jobs ---------------
router.get("/get-freelancer-job",auth,authorizeRole("Freelancer"), freelancerController.getFreelancerJob);

module.exports = router;