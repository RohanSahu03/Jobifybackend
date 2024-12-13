const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const enrolledCourseSchema = new mongoose.Schema(
    {
        courseId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Courses",
            required:true
          },
          studentDetails:{

          studentId: {
            type:String,
            required:true
           },
           professionalTitle:{
            type:String,
            required:true
           }
        }
        },
        {
            timestamps: true,
          }
  );

  
  let EnrolledCourses = mongoose.model("EnrolledCourses", enrolledCourseSchema);
  
  module.exports = EnrolledCourses;
  