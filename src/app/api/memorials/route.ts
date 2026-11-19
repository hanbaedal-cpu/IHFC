import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { getSession, requireAdmin, requireGuest } from "@/lib/auth";
import { Memorial } from "@/models/Memorial";
import { Room } from "@/models/Room";
import { jsonError } from "@/lib/utils";

const createSchema = z.object({
  roomId: z.string().min(1),
  authorName: z.string().min(1).max(50),
  authorRelation: z.string().max(50).optional(),
  content: z.string().min(1).max(2000),
});

export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get("roomId");
  const session = await getSession();
  const admin = session && (session.role === "admin" || session.role === "staff");
  const guest = session?.role === "guest" ? session : null;

  if (!roomId && !admin && !guest) {
    return jsonError("roomId가 필요합니다.", 400);
  }

  const query: Record<string, unknown> = {};
  if (roomId) query.roomId = roomId;
  if (guest && !admin) query.roomId = guest.roomId;
  if (!admin && !(guest && guest.roomId === roomId)) {
    query.approved = true;
  }

  const items = await Memorial.find(query).sort({ createdAt: -1 }).lean();
  return Response.json({
    items: items.map((item) => ({
      id: String(item._id),
      roomId: String(item.roomId),
      authorName: item.authorName,
      authorRelation: item.authorRelation,
      content: item.content,
      approved: item.approved,
      createdAt: item.createdAt,
    })),
  });
}

export async function POST(request: Request) {
  try {
    const body = createSchema.parse(await request.json());
    await connectDB();
    const room = await Room.findById(body.roomId);
    if (!room) return jsonError("빈소를 찾을 수 없습니다.", 404);
    if (!room.allowPublicMemorial) {
      return jsonError("이 빈소는 현재 추모글 작성이 불가합니다.", 403);
    }
    if (room.status === "closed") {
      return jsonError("종료된 빈소에는 추모글을 남길 수 없습니다.", 403);
    }

    const item = await Memorial.create({
      roomId: body.roomId,
      authorName: body.authorName.trim(),
      authorRelation: body.authorRelation?.trim() || "",
      content: body.content.trim(),
      approved: true,
    });

    return Response.json({ ok: true, id: String(item._id) });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError("작성 내용을 확인해 주세요.");
    console.error(error);
    return jsonError("추모글 저장에 실패했습니다.", 500);
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  const guest = admin ? null : await requireGuest();
  if (!admin && !guest) return jsonError("권한이 없습니다.", 401);

  try {
    const body = z
      .object({
        id: z.string(),
        approved: z.boolean().optional(),
      })
      .parse(await request.json());

    await connectDB();
    const memorial = await Memorial.findById(body.id);
    if (!memorial) return jsonError("추모글을 찾을 수 없습니다.", 404);
    if (guest && String(memorial.roomId) !== guest.roomId) {
      return jsonError("권한이 없습니다.", 403);
    }

    if (body.approved !== undefined) memorial.approved = body.approved;
    await memorial.save();
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError("입력값을 확인해 주세요.");
    console.error(error);
    return jsonError("수정에 실패했습니다.", 500);
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  const guest = admin ? null : await requireGuest();
  if (!admin && !guest) return jsonError("권한이 없습니다.", 401);

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return jsonError("id가 필요합니다.");

  await connectDB();
  const memorial = await Memorial.findById(id);
  if (!memorial) return jsonError("추모글을 찾을 수 없습니다.", 404);
  if (guest && String(memorial.roomId) !== guest.roomId) {
    return jsonError("권한이 없습니다.", 403);
  }

  await memorial.deleteOne();
  return Response.json({ ok: true });
}
