import { Schema, models, model, Types } from "mongoose";

const MemorialSchema = new Schema(
  {
    roomId: { type: Types.ObjectId, ref: "Room", required: true, index: true },
    authorName: { type: String, required: true, trim: true },
    authorRelation: { type: String, default: "" },
    content: { type: String, required: true, trim: true, maxlength: 2000 },
    isPublic: { type: Boolean, default: true },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Memorial = models.Memorial || model("Memorial", MemorialSchema);
