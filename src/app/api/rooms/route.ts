import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { hashPassword, requireAdmin } from "@/lib/auth";
import { Room } from "@/models/Room";
import { generateGuestCredentials, jsonError, maskName } from "@/lib/utils";
import { parseKstDatetimeLocal } from "@/lib/time";

const createSchema = z.object({
  roomCode: z.string().min(1),
  roomName: z.string().min(1),
  deceasedName: z.string().min(1),
  hostName: z.string().min(1),
  burialPlace: z.string().optional(),
  startAt: z.string(),
  endAt: z.string(),
  farewellAt: z.string().optional(),
  status: z.enum(["preparing", "active", "closed"]).optional(),
  publicNote: z.string().optional(),
  allowPublicMemorial: z.boolean().optional(),
});

function serializeRoom(room: Record<string, unknown>, includeSecrets = false) {
  const base = {
    id: String(room._id),
    roomCode: room.roomCode,
    roomName: room.roomName,
    deceasedName: room.deceasedName,
    deceasedNameMasked: `故 ${maskName(String(room.deceasedName || ""))}`,
    hostName: room.hostName,
    hostNameMasked: `상주 ${maskName(String(room.hostName || ""))}`,
    burialPlace: room.burialPlace,
    startAt: room.startAt,
    endAt: room.endAt,
    farewellAt: room.farewellAt,
    status: room.status,
    publicNote: room.publicNote,
    allowPublicMemorial: room.allowPublicMemorial,
  };

  if (!includeSecrets) return base;
  return {
    ...base,
    guestUsername: room.guestUsername,
    guestPasswordPlain: room.guestPasswordPlain,
  };
}

export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const admin = await requireAdmin();
  const calendar = searchParams.get("calendar") === "1";
  const publicOnly = searchParams.get("public") === "1";

  const query: Record<string, unknown> = {};
  if (publicOnly || !admin) {
    query.status = { $in: ["preparing", "active"] };
  }

  const rooms = await Room.find(query).sort({ startAt: -1 }).lean();

  if (calendar && admin) {
    return Response.json({
      items: rooms.map((room) => ({
        ...serializeRoom(room as Record<string, unknown>, true),
        title: `${room.roomName} · ${room.deceasedName}`,
      })),
    });
  }

  return Response.json({
    items: rooms.map((room) => {
      const serialized = serializeRoom(
        room as Record<string, unknown>,
        Boolean(admin)
      );
      if (admin) return serialized;
      return {
        ...serialized,
        deceasedName: undefined,
        hostName: undefined,
      };
    }),
  });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return jsonError("권한이 없습니다.", 401);

  try {
    const body = createSchema.parse(await request.json());
    const startAt = parseKstDatetimeLocal(body.startAt);
    const endAt = parseKstDatetimeLocal(body.endAt);
    if (!startAt || !endAt) {
      return jsonError("일정 날짜가 올바르지 않습니다.");
    }
    if (endAt < startAt) return jsonError("종료일은 시작일 이후여야 합니다.");

    const credentials = generateGuestCredentials(body.roomCode);
    await connectDB();
    const room = await Room.create({
      ...body,
      startAt,
      endAt,
      farewellAt: body.farewellAt
        ? parseKstDatetimeLocal(body.farewellAt) || endAt
        : endAt,
      status: body.status || "preparing",
      guestUsername: credentials.username,
      guestPasswordHash: await hashPassword(credentials.password),
      guestPasswordPlain: credentials.password,
      allowPublicMemorial: body.allowPublicMemorial ?? true,
    });

    return Response.json({
      ok: true,
      item: serializeRoom(room.toObject() as Record<string, unknown>, true),
    });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError("필수 항목을 확인해 주세요.");
    console.error(error);
    return jsonError("빈소 등록에 실패했습니다.", 500);
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return jsonError("권한이 없습니다.", 401);

  try {
    const body = createSchema
      .partial()
      .extend({ id: z.string(), regenerateGuest: z.boolean().optional() })
      .parse(await request.json());

    await connectDB();
    const room = await Room.findById(body.id);
    if (!room) return jsonError("빈소를 찾을 수 없습니다.", 404);

    if (body.roomCode !== undefined) room.roomCode = body.roomCode;
    if (body.roomName !== undefined) room.roomName = body.roomName;
    if (body.deceasedName !== undefined) room.deceasedName = body.deceasedName;
    if (body.hostName !== undefined) room.hostName = body.hostName;
    if (body.burialPlace !== undefined) room.burialPlace = body.burialPlace;
    if (body.status !== undefined) room.status = body.status;
    if (body.publicNote !== undefined) room.publicNote = body.publicNote;
    if (body.allowPublicMemorial !== undefined) {
      room.allowPublicMemorial = body.allowPublicMemorial;
    }
    if (body.startAt) {
      const parsed = parseKstDatetimeLocal(body.startAt);
      if (!parsed) return jsonError("시작일이 올바르지 않습니다.");
      room.startAt = parsed;
    }
    if (body.endAt) {
      const parsed = parseKstDatetimeLocal(body.endAt);
      if (!parsed) return jsonError("종료일이 올바르지 않습니다.");
      room.endAt = parsed;
    }
    if (body.farewellAt) {
      const parsed = parseKstDatetimeLocal(body.farewellAt);
      if (!parsed) return jsonError("발인일시가 올바르지 않습니다.");
      room.farewellAt = parsed;
    }

    if (body.regenerateGuest) {
      const credentials = generateGuestCredentials(room.roomCode);
      room.guestUsername = credentials.username;
      room.guestPasswordPlain = credentials.password;
      room.guestPasswordHash = await hashPassword(credentials.password);
    }

    await room.save();
    return Response.json({
      ok: true,
      item: serializeRoom(room.toObject() as Record<string, unknown>, true),
    });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError("입력값을 확인해 주세요.");
    console.error(error);
    return jsonError("빈소 수정에 실패했습니다.", 500);
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return jsonError("권한이 없습니다.", 401);

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return jsonError("id가 필요합니다.");

  await connectDB();
  await Room.findByIdAndDelete(id);
  return Response.json({ ok: true });
}
