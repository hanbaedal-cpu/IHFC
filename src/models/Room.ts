import { Schema, models, model } from "mongoose";

const RoomSchema = new Schema(
  {
    roomCode: { type: String, required: true, trim: true },
    roomName: { type: String, required: true, trim: true },
    deceasedName: { type: String, required: true, trim: true },
    hostName: { type: String, required: true, trim: true },
    burialPlace: { type: String, default: "" },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    farewellAt: { type: Date },
    status: {
      type: String,
      enum: ["preparing", "active", "closed"],
      default: "preparing",
    },
    publicNote: { type: String, default: "" },
    guestUsername: { type: String, required: true, unique: true },
    guestPasswordHash: { type: String, required: true },
    guestPasswordPlain: { type: String, required: true },
    allowPublicMemorial: { type: Boolean, default: true },
  },
  { timestamps: true }
);

RoomSchema.index({ startAt: 1, endAt: 1 });
RoomSchema.index({ status: 1 });

export const Room = models.Room || model("Room", RoomSchema);
