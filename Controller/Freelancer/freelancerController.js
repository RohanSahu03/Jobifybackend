const Freelancer = require("../../Models/Freelancer/freelancer");
const asynHandler = require("express-async-handler");
const { genToken } = require("../../utils/generateToken");
const bcrypt = require("bcryptjs");
const Project = require("../../Models/Projects/project")

exports.register = asynHandler(
    async (
      {
        fullname,
        email,
        password,
        phone,
        country,
        city,
        professionaltitle,
        summary,
        skills,
        verificationToken,
        profilepic,
        resume
      },
      res
    ) => {
      console.log("body", {
       fullname,
        email,
        password,
        phone,
        country,
        city,
        professionaltitle,
        summary,
        skills,
        verificationToken,
        profilepic,
        resume
      });
  
      let existingUser = await Freelancer.findOne({ email });
  
      if (existingUser) {
        return { status: 409, message: "User already exists" };
      }
  
      const bcryptSalt = 10;
      let encryptedPassword;
      await bcrypt
        .hash(password, bcryptSalt)
        .then((hash) => {
          encryptedPassword = hash;
        })
        .catch((error) => {
          console.log(error);
          return res
            .status(400)
            .json({ error: "password encryption problem..." });
        });
  
      let newUser = await Freelancer.create({
        fullname,
        email,
        password: encryptedPassword,
        phone,
        country,
        city,
        professionaltitle,
        summary,
        skills,
        profilepic,
        verificationToken,
        resume
      });
  
      let token = await genToken(newUser);
      if (!token) {
        await Freelancer.deleteOne({ _id: newUser._id });
      }
  
      newUser = await Freelancer.findById(newUser._id).select({ password: 0 });
      return { status: 201, data: newUser, token };
    }
  );

  exports.login = asynHandler(async (req, res) => {
    const { email, password, professionaltitle } = req.body;
    let existingUser = await Freelancer.findOne({ email, professionaltitle });
  
    if (
      !existingUser ||
      !(await existingUser.comparePassword(password, existingUser.password))
    ) {
      return res.status(401).json({
        status: "User Not Found",
      });
    }
    existingUser = await Freelancer.findById(existingUser._id).select({
      password: 0,
    });
    let userobj = {
      id: existingUser._id,
      email: existingUser.email,
      professionaltitle: existingUser.professionaltitle,
    };
  
    let token = await genToken(userobj);
    return res.status(200).json({
      status: "Successfully logged in..",
      data: existingUser,
      token,
    });
  });

// ----------update candidate profile------------
exports.updateFreelancerProfile = async (req, res) => {
    const freelancerId = req.params.id;
  
    try {
      let {
       fullname,
        email,
        password,
        phone,
        country,
        city,
        professionaltitle,
        summary,
        skills,
        profilepic,
        resume,
      } = req.body;
  
      let updateObj = {};
     
      if (fullname) {
        updateObj["fullname"] = fullname;
      }
      if (email) {
        updateObj["email"] = email;
      }
      if (phone) {
        updateObj["phone"] = phone;
      }
  
      if (password) {
        updateObj["password"] = password;
      }
      if (country) {
        updateObj["country"] = country;
      }
      if (city) {
        updateObj["city"] = city;
      }
      if (professionaltitle) {
        updateObj["professionaltitle"] = professionaltitle;
      }
      if (summary) {
        updateObj["summary"] = summary;
      }
      if (skills) {
        updateObj["skills"] = skills;
      }
      if (skills) {
        updateObj["skills"] = skills;
      }
      if (profilepic) {
        updateObj["profilepic"] = profilepic;
      }
      if (resume) {
        updateObj["resume"] = resume;
      }
  
      if (req.files) {
        if (req.files["profilepic"] && req.files["profilepic"].length > 0) {
          updateObj.profilepic = req.files["profilepic"][0].filename;
        }
        if (req.files["resume"] && req.files["resume"].length > 0) {
          updateObj.resume = req.files["resume"][0].filename;
        }
      }
      // Save updated vendor to database
      const updatedProfile = await Freelancer.findByIdAndUpdate(
        freelancerId,
        { $set: updateObj },
        { new: true }
      );
  
      if (!updatedProfile) {
        return res.status(204).json({ message: "Candidate not found" });
      }
  
      if (updatedProfile) {
        return res
          .status(200)
          .json({
            message: "Profile Updated Successfully",
            data: updatedProfile,
          });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to update Profile", error: error.message });
    }
  };

  //   ------------get freelancer by freelancer id-------------
exports.getFreelancerById = async (req, res) => {
    const freelancerId = req.params.id;
    try {
      const freelancer = await Freelancer.findById(freelancerId).select({
        password: 0,
      });
  
      if (!freelancer) {
        return res.status(204).json({ message: "freelancer not found" });
      } else if (freelancer) {
        let token = await genToken(freelancer);
        return res
          .status(200)
          .json({ message: "freelancer found successfully", freelancer });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to fetch a freelancer", error: error.message });
    }
  };

    //   ------------get all freelancer job-------------
exports.getFreelancerJob = async (req, res) => {
  try {
    const projects = await Project.find();
    if (!projects) {
      return res.status(204).json({ message: "Projects not found" });
    } else if (projects) {
      return res
        .status(200)
        .json({ message: "Projects found successfully", projects });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch a projects", error: error.message });
  }
};

