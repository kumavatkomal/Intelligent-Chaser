import mongoose from "mongoose";

const emailEventSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true
  },
  chaseLogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChaseLog"
  },
  eventType: {
    type: String,
    enum: ["sent", "delivered", "opened", "clicked", "replied", "bounced", "failed"],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    linkClicked: String,
    replyContent: String,
    errorMessage: String
  }
}, {
  timestamps: true
});

emailEventSchema.index({ taskId: 1, eventType: 1 });
emailEventSchema.index({ timestamp: -1 });

export const EmailEvent = mongoose.model("EmailEvent", emailEventSchema);
