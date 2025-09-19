import nodemailer from "nodemailer";
import { config } from "../config/config.js";

async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    auth: {
      user: config.mail.user,
      pass: config.mail.password,
    },
  });

  await transporter.sendMail({
    from: config.mail.user,
    to,
    subject,
    html,
  });
}

export default sendEmail;
