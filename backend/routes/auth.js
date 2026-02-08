import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { requireAuth } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { generateOTP, storeOTP, verifyOTP } from "../utils/otpManager.js";
import { sendGmailEmail } from "../services/gmailService.js";

const router = Router();

// Email/OTP Login Routes
router.post("/send-otp", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    console.log(`📧 Processing OTP request for: ${email}`);
    
    const otp = generateOTP();
    storeOTP(email, otp);
    console.log(`✔️  OTP generated and stored: ${otp}`);

    // Send OTP via email
    let emailSent = false;
    try {
      await sendGmailEmail({
        to: email,
        subject: "Your Intelligent Chaser Login OTP",
        text: `Your OTP is: ${otp}\n\nValid for 10 minutes.`,
        html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your Login OTP</h2>
          <p style="font-size: 32px; font-weight: bold; color: #0a6b6b;">${otp}</p>
          <p>Valid for 10 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore.</p>
        </div>`
      });
      emailSent = true;
      console.log(`✅ Email sent successfully to ${email}`);
    } catch (emailError) {
      console.error(`❌ Email send failed for ${email}:`, emailError.message);
      console.error("Full error:", emailError);
      // In development, still allow login with OTP
      if (process.env.NODE_ENV !== "development") {
        return res.status(500).json({ message: "Failed to send OTP email. Please try again.", error: emailError.message });
      }
      console.warn(`⚠️  Continuing in development mode without email. OTP: ${otp}`);
    }

    res.json({ 
      message: "OTP sent successfully", 
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
      emailSent 
    });
  } catch (error) {
    console.error("Unexpected error in /send-otp:", error);
    next(error);
  }
});

router.post("/verify-otp", async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const isValid = verifyOTP(email, otp);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name: email.split("@")[0], email });
    }

    const token = jwt.sign(
      { sub: user._id, email: user.email },
      process.env.JWT_SECRET || "",
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (error) {
    next(error);
  }
});

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account"
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/api/auth/failed" }),
  (req, res) => {
    const token = jwt.sign(
      { sub: req.user._id, email: req.user.email },
      process.env.JWT_SECRET || "",
      { expiresIn: "7d" }
    );

    const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
    const redirectUrl = new URL("/auth/callback", origin);
    redirectUrl.searchParams.set("token", token);

    res.redirect(redirectUrl.toString());
  }
);

router.get("/failed", (req, res) => {
  res.status(401).json({ message: "Google authentication failed" });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
