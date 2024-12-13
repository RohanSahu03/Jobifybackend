const Admin = require("../../Models/Admin/admin");
const asynHandler = require("express-async-handler");
const { genToken } = require("../../utils/generateToken");
const Token = require("../../Models/Token");
const bcrypt = require("bcryptjs");
const { RiAdminFill } = require("react-icons/ri");
const JobPosting = require("../../Models/HR/JobPosting");
const CompanyProfile = require("../../Models/HR/CompanyProfile");
const Candidate = require("../../Models/Candidate/Candidate");
const Project = require("../../Models/Projects/project");
const AppliedJobs = require("../../Models/HR/AppliedJobs");
const Freelancer = require("../../Models/Freelancer/freelancer");
const crypto = require("crypto");
const { sendMail } = require("../../middlewares/sendMail");

exports.register = asynHandler(async (req, res) => {
  const { email, password, professionaltitle } = req.body;

  let existingUser = await Admin.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
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
      return res.status(400).json({ error: "password encryption problem..." });
    });

  let newUser = await Admin.create({
    email,
    password: encryptedPassword,
    professionaltitle,
  });

  let token = await genToken(newUser);
  if (!token) {
    await Admin.deleteOne({ _id: newUser._id });
  }

  newUser = await Admin.findById(newUser._id).select({ password: 0 });
  return res.status(201).json({ message: "Admin Registered Successfuly.." });
});

exports.login = asynHandler(async (req, res) => {
  const { email, password, professionaltitle } = req.body;
  let existingUser = await Admin.findOne({ email, professionaltitle });

  if (
    !existingUser ||
    !(await existingUser.comparePassword(password, existingUser.password))
  ) {
    return res.status(401).json({
      status: "Incorrect Id or Password",
    });
  }
  existingUser = await Admin.findById(existingUser._id).select({
    password: 0,
  });
  let userobj = {
    id: existingUser._id,
    email: existingUser.email,
    professionaltitle: existingUser.professionaltitle,
  };

  let token = await genToken(userobj);
  return res.status(200).json({
    status: "Welcome to Admin Panel..",
    data: existingUser,
    token,
  });
});

const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;
//----------send link to reset password------------
exports.requestPasswordReset = async (email) => {
  console.log(email);

  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const user = await Admin.findOne({ email });
  if (!user) {
    return {
      message: "Admin doesn't Exists",
      statuscode: 400,
    };
  }

  let token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();

  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${clientURL}/api/admin/resetpassword/${user._id}`;
  console.log("dfdff", link);

  const ack = sendMail(user.email, link); // Assuming sendMail function sends the reset email
  if (ack) {
    return {
      message: "Reset link sent..",
      statuscode: 200,
    };
  } else {
    return {
      message: "Reset link not sent..",
      statuscode: 303,
    };
  }

  return { link };
};

//----------set new password------------
exports.setNewPassword = async (req, res) => {
  const adminId = req.params.id;

  try {
    let { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "All fields are neccessary" });
    }

    // encrypting the password...
    const saltRounds = 10;
    await bcrypt
      .hash(password, saltRounds)
      .then((hash) => {
        password = hash;
      })
      .catch((error) => {
        console.log(error);
        return res
          .status(400)
          .json({ error: "password encryption problem..." });
      });
    const isLogin = await Admin.findOneAndUpdate(
      { _id: adminId },
      { $set: { password: password } },
      { new: true }
    );
    if (!isLogin) {
      return res
        .status(400)
        .json({ error: "The password is not being changed" });
    }
    return res.status(200).json({ success: "Your password has been changed." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: "Something went wrong", message: error.message });
  }
};

//------------get all job-------------
exports.getAllJob = async (req, res) => {
  try {
    // Find vendor by ID and delete
    const jobs = await JobPosting.find().populate("companyDetails");
    if (!jobs) {
      return res.status(204).json({ message: "Jobs not found" });
    } else if (jobs) {
      return res.status(200).json({ message: "Jobs found successfully", jobs });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch a jobs", error: error.message });
  }
};

//------------get all job-------------
exports.getAllCompany = async (req, res) => {
  try {
    // Find vendor by ID and delete
    const company = await CompanyProfile.find();
    if (!company) {
      return res.status(204).json({ message: "Companies not found" });
    } else if (company) {
      return res
        .status(200)
        .json({ message: "Companies found successfully", company });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch a companies", error: error.message });
  }
};

//------------get all jobseekers-------------
exports.getAllCandidate = async (req, res) => {
  try {
    // Find vendor by ID and delete
    const candidate = await Candidate.find();
    if (!candidate) {
      return res.status(204).json({ message: "Candidate not found" });
    } else if (candidate) {
      return res
        .status(200)
        .json({ message: "Candidates found successfully", candidate });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch a Candidates", error: error.message });
  }
};

//------------get all Projects-------------
exports.getAllProjects = async (req, res) => {
  try {
    // Find vendor by ID and delete
    const project = await Project.find();
    if (!project) {
      return res.status(204).json({ message: "Project not found" });
    } else if (project) {
      return res
        .status(200)
        .json({ message: "Project found successfully", project });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch a Project", error: error.message });
  }
};

//------------get all Projects-------------
exports.getAllAppliedJob = async (req, res) => {
  try {
    // Find vendor by ID and delete
    const appliedjob = await AppliedJobs.find();
    if (!appliedjob) {
      return res.status(204).json({ message: "Applied job not found" });
    } else if (appliedjob) {
      return res
        .status(200)
        .json({ message: "Applied Jobs found successfully", appliedjob });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch a Applied Jobs",
      error: error.message,
    });
  }
};

//------------get all Freelancer-------------
exports.getAllAppliedJob = async (req, res) => {
  try {
    // Find vendor by ID and delete
    const freelancer = await Freelancer.find();
    if (!freelancer) {
      return res.status(204).json({ message: "Freelancers not found" });
    } else if (freelancer) {
      return res
        .status(200)
        .json({ message: "Freelancers found successfully", freelancer });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch a Freelancers", error: error.message });
  }
};
