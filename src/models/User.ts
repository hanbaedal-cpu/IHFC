import { Schema, models, model } from "mongoose";

export type UserRole = "admin" | "staff";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["admin", "staff"], default: "admin" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
