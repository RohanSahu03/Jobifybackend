const CompanyProfile = require("../../Models/HR/CompanyProfile");
const asynHandler = require("express-async-handler");
const { genToken } = require("../../utils/generateToken");
const Token = require("../../Models/Token");
const bcrypt = require("bcryptjs");

// ------------register profile-----------
exports.createcompanyProfile = asynHandler(async (req, res) => {
  try {
    const {
      companyName,
      companyAddress,
      companyRegistrationNumber,
      hrDetails,
    } = req.body;

    let parsedHrDetails;
    if (typeof hrDetails === "string") {
      parsedHrDetails = JSON.parse(hrDetails); // Parse if it's a string
    } else {
      parsedHrDetails = hrDetails; // Otherwise, use it directly
    }
    

    let existingCompany = await CompanyProfile.findOne({
      companyRegistrationNumber,
    });

    if (existingCompany) {
      // If company exists, validate and push new HR details
      for (let hr of parsedHrDetails) {
        if (!hr.professionaltitle || !hr.email || !hr.password || !hr.phone) {
          return res
            .status(400)
            .json({ message: "All HR fields are required" });
        }
        hr.password = await bcrypt.hash(hr.password, 10);
      }

      existingCompany.hrDetails.push(...parsedHrDetails); // Use spread operator to add multiple HRs
      await existingCompany.save();
      //token generation

      let tokenObj = {
        _id: existingCompany._id,
        companyName: existingCompany.companyName,
        companyRegistrationNumber: existingCompany.companyRegistrationNumber,
      };

      let token = await genToken(tokenObj);
      return res.status(200).json({
        message: "HR details added to existing company",
        existingCompany,
        token,
      });
    } else {
      for (let hr of parsedHrDetails) {
        if (!hr.professionaltitle || !hr.email || !hr.password || !hr.phone) {
          return res
            .status(400)
            .json({ message: "All HR fields are required" });
        }
        hr.password = await bcrypt.hash(hr.password, 10);
      }


      company = new CompanyProfile({
        companyName,
        companyAddress,
        verificationDocument:req.file.filename,
        companyRegistrationNumber,
        hrDetails:parsedHrDetails, // Add HR details in an array
        companylogo:''
      });
      await company.save();

      let token = await genToken(company);
      if (!token) {
        await CompanyProfile.deleteOne({ _id: company._id });
      }

      return res.status(201).json({
        message: "New company registered with HR details",
        company,
        token,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something Went Wrong", error: error.message });
  }
});

exports.login = asynHandler(async (req, res) => {
  try {
    const { email, password, professionaltitle } = req.body;

    // Find the company with the HR email
    const company = await CompanyProfile.findOne({ "hrDetails.email": email });
    if (!company) {
      return res.status(404).json({ message: "HR not found" });
    }

    // Find the specific HR in the hrDetails array
    const hr = company.hrDetails.find((hr) => hr.email === email);

    // Check the professional title
    if (hr.professionaltitle !== professionaltitle) {
      return res.status(401).json({ message: "Invalid professional title" });
    }

    // Verify the password
    const isMatch = await company.comparePassword(password, hr.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If all checks pass, generate a token
    const tokenObj = {
      _id: hr._id,
      email: hr.email,
      professionaltitle: hr.professionaltitle,
    };

    const token = await genToken(tokenObj);

    return res.status(200).json({
      message: "Login successful",
      hr,
      token,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

//   ---------------get profile-----------------
exports.getCompanyProfile = asynHandler(async (req, res) => {
  const companyId = req.params.id;
  console.log("companyId", companyId);

  try {
    const profile = await CompanyProfile.find({ _id: companyId });
    console.log("profile", profile);
    if (!profile) {
      return res.status(204).json({
        status: "Profile not found",
      });
    }

    let token = await genToken(profile);

    return res.status(200).json({
      status: "Success",
      data: profile,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to retrieve data", error: error.message });
  }
});

// --------------delete profile---------------
exports.deleteCompanyProfile = asynHandler(async (req, res) => {
  const companyId = req.params.id;
  try {
    // Find vendor by ID and delete
    const deletedCompany = await CompanyProfile.findByIdAndDelete({
      _id: companyId,
    });

    if (!deletedCompany) {
      return res.status(204).json({ message: "Company not found" });
    }

    return res
      .status(200)
      .json({ message: "Company deleted successfully", data: deletedCompany });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete vendor", error: error.message });
  }
});

// ------------------edit company profile--------------------
exports.updateCompanyProfile = asynHandler(async (req, res) => {
  const companyId = req.params.id;

  try {
    let {
      companyName,
      companyAddress,
      companyRegistrationNumber,
      paymentStatus
    } = req.body;

    let updateObj = {};
    if (companyName) {
      updateObj["companyName"] = companyName;
    }
    if (companyAddress) {
      updateObj["companyAddress"] = companyAddress;
    }
    if (companyRegistrationNumber) {
      updateObj["companyRegistrationNumber"] = companyRegistrationNumber;
    }
    if (paymentStatus) {
      updateObj["paymentStatus"] = paymentStatus;
    }
    if (verificationStatus) {
      updateObj["verificationStatus"] = verificationStatus;
    }
 
    if (req.files && req.files.length != 0) {
      let arr = req.files;
      let i;
      for (i = 0; i < arr.length; i++) {
        if (arr[i].fieldname == "companylogo") {
          updateObj.companylogo = arr[i].filename;
        }
        if (arr[i].fieldname == "verificationDocument") {
          updateObj.verificationDocument = arr[i].filename;
        }
      }
    }

    // Save updated vendor to database
    const updatedProfile = await CompanyProfile.findByIdAndUpdate(
      companyId,
      { $set: updateObj },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(204).json({ message: "Company not found" });
    }

    if (updatedProfile) {
      return res.status(200).json({
        message: "Profile Updated Successfully",
        data: updatedProfile,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update Profile", error: error.message });
  }
});

exports.updateHrProfile = asynHandler(async (req, res) => {
  try {
    const hrId = req.params.id;
    const { contactPersonName, email, password, phone, professionaltitle } =
      req.body;
    const hrExist = await CompanyProfile.findOne({ "hrDetails._id": hrId });
    if (!hrExist) {
      return res.status(401).json({ message: "HR not found" });
    }
    const hr = hrExist.hrDetails.id(hrId);

    if (contactPersonName) hr.contactPersonName = contactPersonName;
    if (email) hr.email = email;
    if (password) hr.password = await bcrypt.hash(password, 10); 
    if (phone) hr.phone = phone;
    if (professionaltitle) hr.professionaltitle = professionaltitle;

    await hrExist.save();
    return res.status(200).json({
      message: "HR details updated successfully",
      hr,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});
