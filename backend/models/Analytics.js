import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    totalTasks: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    overdueTasks: { type: Number, default: 0 },
    avgResponseTime: { type: Number, default: 0 },
    chaseEffectiveness: { type: Number, default: 0 }
  },
  { timestamps: true }
);

analyticsSchema.index({ date: 1 }, { unique: true });

export const Analytics = mongoose.model("Analytics", analyticsSchema);
