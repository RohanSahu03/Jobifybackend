const EnrolledCourse = require("../../Models/Course/enrolledCourse");
const asynHandler = require("express-async-handler");
const { genToken } = require("../../utils/generateToken");
const bcrypt = require("bcryptjs");


exports.createEnrolledCourse = asynHandler(async (req, res) => {
    try {
      const { courseId, studentDetails} = req.body
      
      if(!studentDetails){
        return res.status(401).json({message:"Please enter all the details"})
      }
     
      // Create the project
      const newEnrolledCourse = new EnrolledCourse({
        courseId, studentDetails
      });
  
      // Save the project
      const enrolledCourse = await newEnrolledCourse.save();
      res
        .status(201)
        .json({ message: "You Are Enrolled for This Course"+courseId, enrolledCourse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

 //-------get enrolled course by Institution id------
exports.getAllEnrolledCourse = async(req,res)=>{
    const institutionId = req.params.id
  try{
    const enrolledCourses = await EnrolledCourse.find({})
            .populate({
                path: 'courseId',
                match: { instituteDetails: institutionId }, // Filter by institution ID
            });

        // Filter out null courseIds (not matching the institute)
        const courses = enrolledCourses
        .map(ec => ec.courseId) // Extract the courseId
        .filter(course => course !== null); // Remove any null entries

    // Check if courses were found
    if (courses.length === 0) {
        return res.status(404).json({ message: 'No enrolled courses found for this institution.' });
    }

    return res.status(200).json({ courses });
  }
  catch(error){

  }
}