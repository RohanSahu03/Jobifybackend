const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const courseSchema = new mongoose.Schema(
    {
      courseTitle: {
        type: String,
        required: [true, "Name field is required"],
        trim: true,
      },
      description: {
        type: String,
        required: [true, "Name field is required"],
      },
  
      category: {
        type: String,
        required: true,
      },
      duration: {
        type: String,
        required: true,
      },
      schedule: {
        type: String,
        required: true,
      },
      fee: {
        type: Number,
        required: true,
      },
      instructorName:{
        type: String,
        required:true
      },
      instituteDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Institute",
        required:true
      },
      savedStatus:{
        type:String,
        default:"Draft"
      },
      progress:{
                type:String,
        default:"0%"
      }
  
    },

    {
      timestamps: true,
    }
  );

  
  let Courses = mongoose.model("Courses", courseSchema);
  
  module.exports = Courses;
  