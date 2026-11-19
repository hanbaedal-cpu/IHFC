import { Schema, models, model, Types } from "mongoose";

const ThankYouSchema = new Schema(
  {
    roomId: { type: Types.ObjectId, ref: "Room", required: true, index: true },
    title: { type: String, default: "답례의 말씀" },
    content: { type: String, required: true, maxlength: 3000 },
    authorName: { type: String, default: "상주" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ThankYou = models.ThankYou || model("ThankYou", ThankYouSchema);
