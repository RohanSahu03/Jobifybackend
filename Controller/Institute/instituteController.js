const Institute = require("../../Models/EducationCenter/Institute");
const asynHandler = require("express-async-handler");
const { genToken } = require("../../utils/generateToken");
const bcrypt = require("bcryptjs");
const Token = require("../../Models/Token");
const crypto = require("crypto");
const { sendMail } = require("../../middlewares/sendMail");

// ------------register profile-----------

exports.register = asynHandler(
    async (
      {
        instituteName,
        contactPersonName,
        email,
        password,
        institutionAddress,
        institutionType,
        phone,
        professionaltitle,
        logo,
        document
      },
      res
    ) => {
      console.log("body", {
        instituteName,
        contactPersonName,
        email,
        password,
        institutionAddress,
        institutionType,
        phone,
        professionaltitle,
        logo,
        document
      });
  
      let existingInstitute = await Institute.findOne({ email });
  
      if (existingInstitute) {
        return { status: 409, message: "Institute already exists" };
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
  
      let newInstitute = await Institute.create({
        instituteName,
        contactPersonName,
        email,
        password:encryptedPassword,
        institutionAddress,
        institutionType,
        phone,
        professionaltitle,
        logo,
        document
      });
  
      let token = await genToken(newInstitute);
      if (!token) {
        await Institute.deleteOne({ _id: newInstitute._id });
      }
  
      newInstitute = await Institute.findById(newInstitute._id).select({ password: 0 });
      return { status: 201, data: newInstitute,token};
    }
  );


  exports.login = asynHandler(async (req, res) => {
    const { email, password, professionaltitle } = req.body;
    let existingUser = await Institute.findOne({ email, professionaltitle });
  
    if (
      !existingUser ||
      !(await existingUser.comparePassword(password, existingUser.password))
    ) {
      return res.status(401).json({
        status: "Institute Not Found",
      });
    }
    existingUser = await Institute.findById(existingUser._id).select({
      password: 0,
    });
    let userobj = {
      id: existingUser._id,
      email: existingUser.email,
      professionaltitle: existingUser.professionaltitle,
    };
  
    let token = await genToken(userobj);
    return res.status(200).json({
      status: "Welcome to Dashboard...",
      data: existingUser,
      token,
    });
  });

  const bcryptSalt = process.env.BCRYPT_SALT;
  const clientURL = process.env.CLIENT_URL;
  //----------send link to reset password------------
  exports.requestPasswordReset = async (email) => {
  
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
  
    const user = await Institute.findOne({ email });
    if (!user) {
      return {
        message: "Institute doesn't Exists",
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
  
    const link = `${clientURL}/api/institue/resetpassword/${user._id}`;

  
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
    const instituteId = req.params.id;
  
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
      const isLogin = await Institute.findOneAndUpdate(
        { _id: instituteId },
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
  
//--------------update institute profile---------
exports.updateInstituteProfile = async (req, res) => {
    const instituteId = req.params.id;
  
    try {
      let {
        instituteName,
        contactPersonName,
        email,
        institutionAddress,
        institutionType,
        phone,
        professionaltitle,
        logo,
        document
      } = req.body;
  
      let updateObj = {};
      if (instituteName) {
        updateObj["instituteName"] = instituteName;
      }
      if (contactPersonName) {
        updateObj["contactPersonName"] = contactPersonName;
      }
      if (email) {
        updateObj["email"] = email;
      }
      if (phone) {
        updateObj["phone"] = phone;
      }
  
      if (institutionAddress) {
        updateObj["institutionAddress"] = institutionAddress;
      }
      if (institutionType) {
        updateObj["institutionType"] = institutionType;
      }
      if (professionaltitle) {
        updateObj["professionaltitle"] = professionaltitle;
      }
  
      if (req.files) {
        if (req.files["logo"] && req.files["logo"].length > 0) {
          updateObj.logo = req.files["logo"][0].filename;
        }
        if (req.files["document"] && req.files["document"].length > 0) {
          updateObj.document = req.files["document"][0].filename;
        }
      }
      // Save updated vendor to database
      const updatedProfile = await Institute.findByIdAndUpdate(
        instituteId,
        { $set: updateObj },
        { new: true }
      );
  
      if (!updatedProfile) {
        return res.status(204).json({ message: "Institute not found" });
      }
  
      if (updatedProfile) {
        return res
          .status(200)
          .json({
            message: "Institute Updated Successfully",
            data: updatedProfile,
          });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to update Profile", error: error.message });
    }
  };
  
// --------------delete Institute by id---------------
exports.deleteInstituteById = async (req, res) => {
    const instituteId = req.params.id;
    try {
      // Find vendor by ID and delete
      const deletedInstitute = await Institute.findByIdAndDelete(instituteId);
  
      if (!deletedInstitute) {
        return res.status(204).json({ message: "Institute not found" });
      }
  
      return res
        .status(200)
        .json({ message: "Institute deleted successfully", data: deletedInstitute });
    } catch (error) {
     return res
        .status(500)
        .json({ message: "Failed to delete Institute", error: error.message });
    }
  };

 