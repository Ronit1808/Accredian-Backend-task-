require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});


const sendReferralemail = async (referrerName, referrerEmail, refereeName, refereeEmail, courseName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: refereeEmail, // Sending email to the referee
      subject: "You've been referred for a course!",
      text: `Hello ${refereeName},\n\n${referrerName} (${referrerEmail}) has referred you for the course: "${courseName}".\n\nBest Regards,\nYour Team`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, message: "Failed to send email" };
  }
};


module.exports = { sendReferralemail };
