import { Schema, models, model } from "mongoose";

const ConsultationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    memo: { type: String, default: "" },
    privacyAgreed: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Consultation =
  models.Consultation || model("Consultation", ConsultationSchema);
