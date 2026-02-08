import mongoose from "mongoose";

const responsePatternSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  avgResponseTime: {
    type: Number, // in hours
    default: 24
  },
  preferredTone: {
    type: String,
    enum: ["formal", "friendly", "urgent", "casual"],
    default: "friendly"
  },
  bestSendTime: {
    hour: { type: Number, min: 0, max: 23, default: 9 },
    dayOfWeek: { type: Number, min: 0, max: 6 } // 0 = Sunday
  },
  responseRate: {
    type: Number, // percentage
    default: 0
  },
  totalTasksAssigned: {
    type: Number,
    default: 0
  },
  totalTasksCompleted: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

responsePatternSchema.index({ userId: 1 }, { unique: true });

export const ResponsePattern = mongoose.model("ResponsePattern", responsePatternSchema);
