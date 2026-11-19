import { Schema, models, model } from "mongoose";

const TranslationCacheSchema = new Schema(
  {
    sourceHash: { type: String, required: true, index: true },
    source: { type: String, required: true },
    locale: { type: String, enum: ["en", "zh"], required: true },
    translated: { type: String, required: true },
  },
  { timestamps: true }
);

TranslationCacheSchema.index({ sourceHash: 1, locale: 1 }, { unique: true });

export const TranslationCache =
  models.TranslationCache || model("TranslationCache", TranslationCacheSchema);
