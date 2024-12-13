const Project = require("../../Models/Projects/project");
const asynHandler = require("express-async-handler");
const { genToken } = require("../../utils/generateToken");
const bcrypt = require("bcryptjs");
const HR = require("../../Models/HR/CompanyProfile")

exports.createProject = asynHandler(async (req,res) => {
     try{
  const {title,description,budget,deadline,companyId} = req.body

      // Validate HR ID
      const company = await HR.findById(companyId);
      if (!company) {
          return res.status(404).json({ message: 'HR not found' });
      }

      // Create the project
      const newProject = new Project({
          title,
          description,
          budget,
          deadline,
          companyId,
      });

      // Save the project
      const savedProject = await newProject.save();
      res.status(201).json({ message: 'Project created successfully', project: savedProject });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
    }
  );

//   ------------get  project by project id-------------
exports.getProjectById = async (req, res) => {
    const projecctId = req.params.id;
  
    try {
      // Find vendor by ID and delete
      const project = await Project.find({ _id: projecctId });
      if (!project) {
        return res.status(204).json({ message: "Project not found" });
      }
  else if(project){
    return res.status(200).json({ message: "Project found successfully", project });
  } 
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch a project", error: error.message });
    }
  };

//   ------------get all project by Company Id-------------
exports.getAllProject = async (req, res) => {
const companyId = req.params.id;
  try {
    // Find vendor by ID and delete
    const project = await Project.find({companyId});
    if (!project) {
      return res.status(204).json({ message: "Projects not found" });
    }
else if(project){
  return res.status(200).json({ message: "Projects found successfully", project });
} 
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch a project", error: error.message });
  }
};

// --------------delete projects---------------
exports.deleteProject = async (req, res) => {
    const projectId = req.params.id;
    try {
      // Find vendor by ID and delete
      const deletedProject = await Project.findByIdAndDelete(projectId);
  
      if (!deletedProject) {
        return res.status(204).json({ message: "Project not found" });
      }
  
      return res
        .status(200)
        .json({ message: "Project deleted successfully", data: deletedProject });
    } catch (error) {
     return res
        .status(500)
        .json({ message: "Failed to delete Project", error: error.message });
    }
  };

// --------------update project---------------
exports.updateProject = async (req, res) => {
    const projectId = req.params.id;
  
    try {
  
      let {
        title,description,budget,deadline,hrId
        } = req.body;
  
        let updateObj = {};
        if (title) {
          updateObj["title"] = title;
        }
        if (description) {
          updateObj["description"] = description;
        }
        if (budget) {
          updateObj["budget"] = budget;
        }
        if (deadline) {
          updateObj["deadline"] = deadline;
        }
        if (hrId) {
          updateObj["hrId"] = hrId;
        }
  
      // Save updated vendor to database
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { $set: updateObj },
        { new: true }
      );
  
      if (!updatedProject) {
        return res.status(204).json({ message: "Project not found" });
      }
  
     if(updatedProject){
      return res.status(200).json({ message: "Project Updated Successfully",data:updatedProject});
     }
  
    } catch (error) {
      return res.status(500).json({ message: "Failed to update Project", error: error.message });
    }
  };

