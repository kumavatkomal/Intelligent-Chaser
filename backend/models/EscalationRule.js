import mongoose from "mongoose";

const escalationRuleSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true
  },
  maxAttempts: {
    type: Number,
    default: 3
  },
  currentAttempts: {
    type: Number,
    default: 0
  },
  escalateTo: {
    type: String, // email address
    required: true
  },
  escalationChannel: {
    type: String,
    enum: ["email", "slack", "both"],
    default: "email"
  },
  escalated: {
    type: Boolean,
    default: false
  },
  escalatedAt: {
    type: Date
  },
  autoEscalate: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

escalationRuleSchema.index({ taskId: 1 }, { unique: true });

export const EscalationRule = mongoose.model("EscalationRule", escalationRuleSchema);
