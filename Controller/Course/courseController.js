const Course = require("../../Models/Course/course");
const asynHandler = require("express-async-handler");
const { genToken } = require("../../utils/generateToken");
const bcrypt = require("bcryptjs");
const Institute = require("../../Models/EducationCenter/Institute");

exports.createCourse = asynHandler(async (req, res) => {
  try {
    const { courseTitle, description, category, duration, schedule,fee,instructorName,instituteDetails } =
      req.body;

    // Validate HR ID
    const institute = await Institute.findById(instituteDetails);
    if (!institute) {
      return res.status(404).json({ message: "Institute not found" });
    }

    // Create the project
    const newCourse = new Course({
        courseTitle, description, category, duration, schedule,fee,instructorName,instituteDetails
    });

    // Save the project
    const savedCourse = await newCourse.save();
    res
      .status(201)
      .json({ message: "Course created successfully", course: savedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//   ------------get  course by course id-------------
exports.getCourseById = async (req, res) => {
    const courseId = req.params.id;
  
    try {
      // Find vendor by ID and delete
      const course = await Course.find({ _id: courseId }).populate("instituteDetails");
      if (!course) {
        return res.status(204).json({ message: "Course not found" });
      }
  else if(course){
    return res.status(200).json({ message: "Course found successfully", course });
  } 
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch a Course", error: error.message });
    }
  };


  //   ------------get all course by institute Id-------------
exports.getAllCourse = async (req, res) => {
    const institueId = req.params.id;
      try {
        // Find vendor by ID and delete
        const institute = await Institute.find({institueId});
        if (!institute) {
          return res.status(204).json({ message: "Institute not found" });
        }
    else if(institute){

        const courses = await Course.find({instituteDetails:institueId}).populate("instituteDetails");
      return res.status(200).json({ message: "Courses found successfully", courses });
    } 
      } catch (error) {
        return res.status(500).json({ message: "Failed to fetch a Courses", error: error.message });
      }
    };

// --------------delete course by courseid---------------
exports.deleteCourse = async (req, res) => {
    const courseId = req.params.id;
    try {
      // Find vendor by ID and delete
      const deletedCourse = await Course.findByIdAndDelete(courseId);
  
      if (!deletedCourse) {
        return res.status(204).json({ message: "Course not found" });
      }
  
      return res
        .status(200)
        .json({ message: "Course deleted successfully", data: deletedCourse });
    } catch (error) {
     return res
        .status(500)
        .json({ message: "Failed to delete Course", error: error.message });
    }
  };

  // --------------update course---------------
exports.updateCourse = async (req, res) => {
    const courseId = req.params.id;
  
    try {
  
      let {
        courseTitle, description, category, duration, schedule,fee,instructorName,savedStatus,progress
        } = req.body;
  
        let updateObj = {};
        if (courseTitle) {
          updateObj["courseTitle"] = courseTitle;
        }
        if (description) {
          updateObj["description"] = description;
        }
        if (category) {
          updateObj["category"] = category;
        }
        if (duration) {
          updateObj["duration"] = duration;
        }
        if (schedule) {
          updateObj["schedule"] = schedule;
        }
        if (fee) {
            updateObj["fee"] = fee;
          }
          if (instructorName) {
            updateObj["instructorName"] = instructorName;
          }
          if (savedStatus) {
            updateObj["savedStatus"] = savedStatus;
          }
          if (progress) {
            updateObj["progress"] = progress;
          }
  
      // Save updated vendor to database
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { $set: updateObj },
        { new: true }
      );
  
      if (!updatedCourse) {
        return res.status(204).json({ message: "Course not found" });
      }
  
     if(updatedCourse){
      return res.status(200).json({ message: "Course Updated Successfully",data:updatedCourse});
     }
  
    } catch (error) {
      return res.status(500).json({ message: "Failed to update Course", error: error.message });
    }
  };


