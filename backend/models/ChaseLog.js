import mongoose from "mongoose";

const chaseLogSchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    channel: {
      type: String,
      enum: ["email", "slack", "whatsapp"],
      required: true
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent"
    },
    metadata: { type: Object, default: {} },
    sentAt: { type: Date, default: Date.now },
    responseAt: { type: Date }
  },
  { timestamps: true }
);

chaseLogSchema.index({ task: 1, sentAt: -1 });

export const ChaseLog = mongoose.model("ChaseLog", chaseLogSchema);
