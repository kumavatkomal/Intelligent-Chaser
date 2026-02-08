import mongoose from "mongoose";

const riskScoreSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
    unique: true
  },
  score: {
    type: Number, // 0-100, higher = more risk
    required: true,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    required: true
  },
  factors: {
    timeUntilDeadline: Number,
    assigneeResponseRate: Number,
    taskPriority: String,
    chaseCount: Number,
    noResponse: Boolean,
    overdue: Boolean
  },
  calculatedAt: {
    type: Date,
    default: Date.now
  },
  recommendations: [String]
}, {
  timestamps: true
});

riskScoreSchema.index({ score: -1 });
riskScoreSchema.index({ riskLevel: 1 });

export const RiskScore = mongoose.model("RiskScore", riskScoreSchema);
