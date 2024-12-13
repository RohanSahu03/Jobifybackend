const asynHandler = require("express-async-handler");
const { AIchatSession } = require("../../Services/AiModal");
const pdfparse = require("pdf-parse");
const fs = require("fs");
const { console } = require("inspector");
const { Certificate } = require("crypto");

exports.generateResumeContent = asynHandler(async (req, res) => {
  const prompt =
    "Summary:Depend on the JobTitle and WorkExperiance give me Summary,Education:Depends on Degree and University give me resume content,Skills:Depends on Skills give me content for resume,WorkExperiance:Depends on exJobTitle,exCompany,KeyResponsibilities,Achievements give me resume content,Certification:Depends on Certificate give content to write on resume,Projects:Depends on projectTitle,TechnologyUsed,YourRole give me description for resume";

  const {
    jobTitle,
    skills,
    degree,
    university,
    exjobtitle,
    excompany,
    keyresponsibility,
    achievements,
    certificate,
    projecttitle,
    technologyUsed,
    yourRole,
  } = req.body;

  const replacements = {
    JobTitle: jobTitle,
    Degree: degree,
    Skills: skills,
    University: university,
    exJobTitle: exjobtitle,
    exCompany: excompany,
    KeyResponsibilities: keyresponsibility,
    Achievements: achievements,
    Certificate: certificate,
    projectTitle: projecttitle,
    TechnologyUsed: technologyUsed,
    YourRole: yourRole,
  };

  let newString = prompt;
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(key, "gi"); // Create a regex for each word
    newString = newString.replace(regex, value);
  }

  try {
    const result = await AIchatSession.sendMessage(newString);
    return res.json({
      message: result.response.text(),
    });
  } catch (error) {
    console.error("Error generating resume content:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

exports.parseResume = asynHandler(async (req, res) => {
  const { resume, jobDescription } = req.body;

  const pdffile = fs.readFileSync("./Public/Resume/" + resume);
  try {
    // Parse the PDF and wait for it to resolve
    const data = await pdfparse(pdffile);
    const resumeContent = data.text; // Now we have the content of the resume
    console.log(resumeContent);

    // const relevantKeywords = ['project', 'teamwork', 'leadership']; // Normalize keywords too
    const normalizedText = resumeContent
      .toLowerCase()
      .replace(/[.,!?;()]/g, "");

    // Split the resume text into words
    const words = normalizedText.split(/\s+/);
    const foundKeywords = new Set();

    // Check for each word in the relevant keywords list
    words.forEach((word) => {
      if (jobDescription.toLowerCase().includes(word)) {
        if (word.length > 3) {
          foundKeywords.add(word);
        }
      }
    });

    return res.json({
      keywords: Array.from(foundKeywords),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error parsing the resume", error: error.message });
  }
});
