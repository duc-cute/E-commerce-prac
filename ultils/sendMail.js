/** @format */

const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

const sendMail = asyncHandler(async ({ email, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: '"Duccute shop " <no-reply@example.com>', // sender address
    to: email,
    subject: "Forgot password",
    html: html,
  });

  return info;
});

module.exports = sendMail;
