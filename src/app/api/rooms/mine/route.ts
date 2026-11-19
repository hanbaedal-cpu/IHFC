import { requireGuest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Room } from "@/models/Room";
import { jsonError } from "@/lib/utils";

export async function GET() {
  const guest = await requireGuest();
  if (!guest) return jsonError("권한이 없습니다.", 401);

  await connectDB();
  const room = await Room.findById(guest.roomId).lean();
  if (!room) return jsonError("빈소를 찾을 수 없습니다.", 404);

  return Response.json({
    item: {
      id: String(room._id),
      roomName: room.roomName,
      deceasedName: room.deceasedName,
      hostName: room.hostName,
      burialPlace: room.burialPlace,
      startAt: room.startAt,
      endAt: room.endAt,
      farewellAt: room.farewellAt,
      status: room.status,
    },
  });
}
