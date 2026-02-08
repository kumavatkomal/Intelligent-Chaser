import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    googleId: { type: String, default: "" },
    avatar: { type: String, default: "" },
    slackId: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    preferredChannel: {
      type: String,
      enum: ["email", "slack", "whatsapp"],
      default: "email"
    },
    responsePattern: { type: String, default: "" },
    avgResponseTime: { type: Number, default: 24 },
    responseRate: { type: Number, default: 0.6 }
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model("User", userSchema);
