const Candidate = require("../../Models/Candidate/Candidate");
const Job = require("../../Models/HR/JobPosting");
const asynHandler = require("express-async-handler");
const { genToken } = require("../../utils/generateToken");
const Token = require("../../Models/Token");
const bcrypt = require("bcryptjs");


exports.register = asynHandler(
  async (
    {
      firstname,
      lastname,
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
    },
    res
  ) => {
    console.log("body", {
      firstname,
      lastname,
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
    });

    let existingUser = await Candidate.findOne({ email });

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

    let newUser = await Candidate.create({
      firstname,
      lastname,
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
    });

    let token = await genToken(newUser);
    if (!token) {
      await Candidate.deleteOne({ _id: newUser._id });
    }

    newUser = await Candidate.findById(newUser._id).select({ password: 0 });
    return { status: 201, data: newUser, token };
  }
);

exports.login = asynHandler(async (req, res) => {
  const { email, password, professionaltitle } = req.body;
  let existingUser = await Candidate.findOne({ email, professionaltitle });

  if (
    !existingUser ||
    !(await existingUser.comparePassword(password, existingUser.password))
  ) {
    return res.status(401).json({
      status: "User Not Found",
    });
  }
  existingUser = await Candidate.findById(existingUser._id).select({
    password: 0,
  });
  let userobj = {
    id: existingUser._id,
    email: existingUser.email,
    professionaltitle: existingUser.professionaltitle,
  };

  let token = await genToken(userobj);
  return res.status(200).json({
    status: "Success",
    data: existingUser,
    token,
  });
});

//   ------------get candidate by candidate id-------------
exports.getCandidateById = async (req, res) => {
  const candidateId = req.params.id;
  console.log("candidateid", candidateId);

  try {
    // Find vendor by ID and delete
    const candidate = await Candidate.findById(candidateId).select({
      password: 0,
    });

    if (!candidate) {
      return res.status(204).json({ message: "Candidate not found" });
    } else if (candidate) {
      let token = await genToken(candidate);
      return res
        .status(200)
        .json({ message: "Candidate found successfully", candidate, token });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch a Candidate", error: error.message });
  }
};

// ----------update candidate profile------------
exports.updateCandidateProfile = async (req, res) => {
  const candidateId = req.params.id;

  try {
    let {
      firstname,
      lastname,
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
      paymentStatus
    } = req.body;

    let updateObj = {};
    if (firstname) {
      updateObj["firstname"] = firstname;
    }
    if (lastname) {
      updateObj["lastname"] = lastname;
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

    if (profilepic) {
      updateObj["profilepic"] = profilepic;
    }
    if (resume) {
      updateObj["resume"] = resume;
    }
    if (paymentStatus) {
      updateObj["paymentStatus"] = paymentStatus;
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
    const updatedProfile = await Candidate.findByIdAndUpdate(
      candidateId,
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


