import { Schema, models, model } from "mongoose";

const VisitLogSchema = new Schema(
  {
    path: { type: String, required: true },
    visitorType: {
      type: String,
      enum: ["guest", "host", "admin", "anonymous"],
      default: "anonymous",
    },
    username: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true }
);

VisitLogSchema.index({ createdAt: -1 });
VisitLogSchema.index({ visitorType: 1, createdAt: -1 });

export const VisitLog = models.VisitLog || model("VisitLog", VisitLogSchema);
