import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || user;

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: port === 465,
    auth: {
      user: "fbb1f304d77358",
      pass: "bc02c3412fda4b",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
    attachments,
  });
};

export default sendEmail;