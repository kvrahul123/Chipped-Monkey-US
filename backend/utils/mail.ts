import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export const sendForgotPasswordEmail = async (
  toEmail: string,
    resetLink: string,
  name:string
) => {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_EMAIL_PASSWORD,
        },
        tls: { rejectUnauthorized: false },
      });

  // Load HTML template
  const templatePath = path.join(
    __dirname,
    "../public/email/forgotPassword.html"
  );
  let htmlContent = fs.readFileSync(templatePath, "utf-8");

  // Replace reset link
  htmlContent = htmlContent.replace(
    "https://yourwebsite.com/reset-link",
    resetLink
  );
    
      htmlContent = htmlContent.replace(
    "customer_name",
    name
  );

  await transporter.sendMail({
    from: `"Chipped Monkey" <${process.env.SMTP_EMAIL_ID}>`,
    to: toEmail,
    subject: "Reset Your Password",
    html: htmlContent,
  });
};
