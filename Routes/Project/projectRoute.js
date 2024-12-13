const express = require("express");
const router = express.Router();
const projectController = require("../../Controller/Project/projectController");
const auth = require("../../middlewares/auth");
const authorizeRole = require("../../middlewares/roleMiddleware")

// Route to create a new vendor
router.post(
  "/project",
  auth,
  authorizeRole("HR"),
  projectController.createProject
);

// Route for fetching all project by company id 
router.get(
  "/projects/:id",
  auth,
  authorizeRole("HR"),
  projectController.getAllProject
);

// Route for fetching project by  id
router.get(
  "/project/:id",
  auth,
  authorizeRole("HR"),
  projectController.getProjectById
);

router.delete(
    "/project/:id",
    auth,
    authorizeRole("HR"),
    projectController.deleteProject
  );

  router.put(
    "/project/:id",
    auth,
    authorizeRole("HR"),
    projectController.updateProject
  );
  

module.exports = router;
