import nodemailer from "nodemailer";

let transporter = null;

export const initializeGmailTransport = () => {
  const user = process.env.GMAIL_USER || "";
  const pass = process.env.GMAIL_APP_PASSWORD || "";

  if (!user || !pass) {
    console.warn("⚠️  Gmail credentials not configured (GMAIL_USER or GMAIL_APP_PASSWORD missing)");
    console.warn("   OTP emails will fail in production mode. Set them in .env");
    return;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: pass.replace(/\s/g, "") }
  });
  
  console.log(`✅ Gmail transport initialized for ${user}`);
};

export const sendGmailEmail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    throw new Error("Gmail transport not initialized. Check GMAIL_USER and GMAIL_APP_PASSWORD in .env");
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
      html: html || text
    });
    console.log(`📧 Email sent to ${to}:`, info.response);
    return info;
  } catch (error) {
    console.error("❌ Mail send error:", error.message);
    throw error;
  }
};

