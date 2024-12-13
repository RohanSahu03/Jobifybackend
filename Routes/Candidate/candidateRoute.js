const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const candidateController = require("../../Controller/Candidate/candidateController");
const Candidate = require("../../Models/Candidate/Candidate");
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
router.post("/register", upload.any(), async (req, res) => {
  try {
    // -----------verification token--------------
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const response = await candidateController.register({
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
router.post("/login",candidateController.login);

// ---------get candidate by id route---------------
router.get("/getCandidate/:id",auth,authorizeRole("Candidate"), candidateController.getCandidateById);

router.put(
  "/edit-candidate/:id",
  auth,
  authorizeRole("Candidate"),
  upload.fields([
    { name: "profilepic", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  candidateController.updateCandidateProfile
);



// ----------email verification route----------------
router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;

  const candidate = await Candidate.findOne({ verificationToken: token });
  if (!candidate) {
    return res.status(400).json({ message: "Invalid token" });
  }

  candidate.isVerified = true;
  candidate.verificationToken = undefined; // Optionally clear the token
  await candidate.save();

  return res.status(200).json({ message: "Email verified successfully!" });
});

module.exports = router;
