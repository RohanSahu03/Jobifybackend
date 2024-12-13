const express = require("express");
const router = express.Router();
const courseController = require("../../Controller/Course/courseController");
const auth = require("../../middlewares/auth");
const authorizeRole = require("../../middlewares/roleMiddleware")

// Route to create a course
router.post(
  "/course",
  auth,
  authorizeRole(["admin", "Institute"]),
  courseController.createCourse
);

// Route for fetching all course by institute id 
router.get(
  "/course/:id",
  auth,
  authorizeRole(["admin", "Institute"]),
  courseController.getAllCourse
);

// Route for fetching course by course id
router.get(
  "/coursebyid/:id",
  auth,
  authorizeRole(["admin", "Institute"]),
  courseController.getCourseById
);

router.delete(
    "/course/:id",
    auth,
    authorizeRole(["admin", "Institute"]),
    courseController.deleteCourse
  );

  router.put(
    "/course/:id",
    auth,
    authorizeRole(["admin", "Institute"]),
    courseController.updateCourse
  );
  

module.exports = router;
