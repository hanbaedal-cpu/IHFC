import { Schema, models, model, Types } from "mongoose";

const SmsLogSchema = new Schema(
  {
    recipients: [{ type: String, required: true }],
    text: { type: String, required: true },
    sentBy: { type: String, required: true },
    consultationIds: [{ type: Types.ObjectId, ref: "Consultation" }],
    status: {
      type: String,
      enum: ["sent", "failed", "mocked"],
      default: "mocked",
    },
    providerMessage: { type: String, default: "" },
    successCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const SmsLog = models.SmsLog || model("SmsLog", SmsLogSchema);
