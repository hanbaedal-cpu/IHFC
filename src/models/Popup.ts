import { Schema, models, model } from "mongoose";

const PopupSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    linkUrl: { type: String, default: "" },
    active: { type: Boolean, default: true },
    startAt: { type: Date },
    endAt: { type: Date },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Popup = models.Popup || model("Popup", PopupSchema);
