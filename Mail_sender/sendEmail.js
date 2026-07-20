import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM || user;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for 587/2525
      auth: {
        user,
        pass,
      },
      tls:{
        rejectUnauthorized:false,
      },
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      attachments,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Error in sendEmail.js:", err);
    throw err; // re-throw so the calling route knows it failed
  }
};

export default sendEmail;