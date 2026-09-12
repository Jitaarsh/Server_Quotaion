import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  const from = "onboarding@resend.dev";

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: false,
      tls: { rejectUnauthorized: false },
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
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