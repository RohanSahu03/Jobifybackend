const express = require("express");
const router = express.Router();
const enrolledCourseController = require("../../Controller/Course/enrolledCourseController");
const auth = require("../../middlewares/auth");
const authorizeRole = require("../../middlewares/roleMiddleware")

//----router to enroll on course----------
router.post(
    "/enroll",
    auth,
    authorizeRole(["Candidate","Freelancer","HR","admin"]),
    enrolledCourseController.createEnrolledCourse
  );

//----router to get all enrolled course by institute id----------
router.get(
    "/enrolled-courses/:id",
    auth,
    authorizeRole(["Institute","admin"]),
    enrolledCourseController.getAllEnrolledCourse
  );

module.exports = router