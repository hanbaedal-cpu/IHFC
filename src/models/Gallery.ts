import { Schema, models, model } from "mongoose";

const GallerySchema = new Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "시설" },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Gallery = models.Gallery || model("Gallery", GallerySchema);
