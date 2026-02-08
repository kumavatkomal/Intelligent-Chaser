import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dueDate: { type: Date, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium"
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "overdue"],
      default: "pending"
    },
    chaseCount: { type: Number, default: 0 },
    lastChasedAt: { type: Date }
  },
  { timestamps: true }
);

taskSchema.index({ dueDate: 1, status: 1 });

export const Task = mongoose.model("Task", taskSchema);
