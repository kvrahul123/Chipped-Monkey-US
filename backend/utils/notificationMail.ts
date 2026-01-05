import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

type MailPayload = {
  to: string;
  subject: string;
  petParentName: string;
  petName: string;
  completeProfileUrl: string;
  unsubscribeUrl: string;
};

export const sendNotificationMail = async (payload: MailPayload) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_EMAIL_PASSWORD,
    },
  });

  const templatePath = path.join(
    __dirname,
    "../public/email/paymentNotificationMail.html"
  );

  let html = fs.readFileSync(templatePath, "utf-8");

  const replacements: Record<string, string> = {
    "{{SUBJECT}}": payload.subject,
    "{{PET_PARENT_NAME}}": payload.petParentName || "Pet Parent",
    "{{PET_NAME}}": payload.petName || "your pet",
    "{{COMPLETE_PROFILE_URL}}": payload.completeProfileUrl,
    "{{UNSUBSCRIBE_URL}}": payload.unsubscribeUrl,
    "{{YEAR}}": new Date().getFullYear().toString(),
    "{{LOGO_URL}}": "https://chippedmonkey.com/assets/images/logo-inside.png",
  };

  for (const key in replacements) {
    html = html.replace(new RegExp(key, "g"), replacements[key]);
  }

  await transporter.sendMail({
    from: `"Chipped Monkey" <${process.env.SMTP_EMAIL_ID}>`,
    to: payload.to,
    subject: payload.subject,
    html,
  });
};
