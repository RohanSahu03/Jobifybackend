const nodemailer = require("nodemailer");

const sendMail = async (email, verificationLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_SENDER_MAIL,
        pass: process.env.NODE_SENDGRID_KEY,
      },
      port: 465,
      host: "gsmtp.gmail.com",
      secure: true,
    });

    let mailoptions = {
      from: process.env.NODE_SENDER_MAIL,
      to: email,
      subject: "Email Verification",
      text: `Please verify your email by clicking the link: ${verificationLink}`,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailoptions, function (error, info) {
        if (error) {
          console.error("Error sending email:", error);
          reject(false); // Reject with false
        } else {
          console.log("Email sent:" + info.response);
          resolve(true); // Resolve with true
        }
      });
    });
    
  } catch (error) {
    console.error("Error in sendMail function:", error);
  }
};

module.exports = { sendMail };
