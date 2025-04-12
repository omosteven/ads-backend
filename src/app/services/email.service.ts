// src/utils/email.ts
import nodemailer from "nodemailer";

export const sendContactEmail = async (
  toEmail: string,
  subject: string,
  message: string
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: "hello@buythus.com", // your Zoho Mail
      pass: "BXBVLFxsiVTw"
    },
  });

  const mailOptions = {
    from: '"BuyThis" <hello@buythus.com>',
    to: toEmail, // customer email
    subject: subject,
    html: `<p>${message}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
