const express = require("express");
const router = express.Router();
const resumeController=require("../../Controller/AIResume/ResumeController")
const auth = require("../../middlewares/auth");
// const path = require('path');
// const multer = require("multer");


router.get("/generateContent",auth, resumeController.generateResumeContent);

router.post("/parseResume",auth,resumeController.parseResume)

module.exports = router;