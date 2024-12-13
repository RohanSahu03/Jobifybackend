const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
// const morgan = require("morgan");
const bodyParser = require("body-parser");
const DB = require("./DB");

// importing the Routers
const userRouter = require("./Routes/userRoute");
const jobRouter = require("./Routes/HR/jobPostingRoute");
const companyRouter = require("./Routes/HR/companyProfileRoute");
const appliedJobRouter = require("./Routes/HR/appliedJobRoute");
const candidateRouter = require("./Routes/Candidate/candidateRoute");
const applicationRouter = require("./Routes/Candidate/applicationRoute");
const airesumeRouter = require("./Routes/AIResume/resumeRoute");
const communityRouter = require("./Routes/Community/communityRoute");
const freelancerRouter = require("./Routes/Freelancer/freelancerRoute");
const projectRouter = require("./Routes/Project/projectRoute");
const adminRouter = require("./Routes/Admin/adminRoute")
const instituteRouter = require("./Routes/EducationCenter/instituteRoute")
const courseRouter = require("./Routes/Course/courseRoute")
const enrolledCourseRouter = require("./Routes/Course/enrolledCourseRoute")

dotenv.config();

//Middleware
app.use(cors());
// app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));

//routes
app.use("/api/user", userRouter);
app.use("/api/hr", jobRouter);
app.use("/api/hr", companyRouter);
app.use("/api/hr", appliedJobRouter);
app.use("/api/hr", projectRouter);
app.use("/api/candidate", candidateRouter);
app.use("/api/candidate", applicationRouter);
app.use("/api/resume", airesumeRouter);
app.use("/api/community", communityRouter);
app.use("/api/freelancer", freelancerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/institute", instituteRouter);
app.use("/api/courses", courseRouter);
app.use("/api/courses", enrolledCourseRouter);


let PORT = 6084;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`server is running on ${PORT}`);
});
