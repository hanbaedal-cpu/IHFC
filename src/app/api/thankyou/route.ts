import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { getSession, requireAdmin, requireGuest } from "@/lib/auth";
import { ThankYou } from "@/models/ThankYou";
import { jsonError } from "@/lib/utils";

const schema = z.object({
  roomId: z.string().min(1),
  title: z.string().optional(),
  content: z.string().min(1).max(3000),
  authorName: z.string().optional(),
  published: z.boolean().optional(),
});

export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get("roomId");
  const session = await getSession();
  const admin = session && (session.role === "admin" || session.role === "staff" || session.role === "supervisor");
  const guest = session?.role === "guest" ? session : null;

  const query: Record<string, unknown> = {};
  if (roomId) query.roomId = roomId;
  if (guest && !admin) query.roomId = guest.roomId;
  if (!admin && !(guest && (!roomId || guest.roomId === roomId))) {
    query.published = true;
  }

  const items = await ThankYou.find(query).sort({ createdAt: -1 }).lean();
  return Response.json({
    items: items.map((item) => ({
      id: String(item._id),
      roomId: String(item.roomId),
      title: item.title,
      content: item.content,
      authorName: item.authorName,
      published: item.published,
      createdAt: item.createdAt,
    })),
  });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  const guest = admin ? null : await requireGuest();
  if (!admin && !guest) return jsonError("권한이 없습니다.", 401);

  try {
    const body = schema.parse(await request.json());
    if (guest && body.roomId !== guest.roomId) {
      return jsonError("권한이 없습니다.", 403);
    }
    await connectDB();
    const item = await ThankYou.create({
      roomId: body.roomId,
      title: body.title || "답례의 말씀",
      content: body.content,
      authorName: body.authorName || guest?.name || "상주",
      published: body.published ?? true,
    });
    return Response.json({ ok: true, id: String(item._id) });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError("입력값을 확인해 주세요.");
    console.error(error);
    return jsonError("등록에 실패했습니다.", 500);
  }
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  const guest = admin ? null : await requireGuest();
  if (!admin && !guest) return jsonError("권한이 없습니다.", 401);

  try {
    const body = schema
      .partial()
      .extend({ id: z.string() })
      .parse(await request.json());
    await connectDB();
    const item = await ThankYou.findById(body.id);
    if (!item) return jsonError("답례글을 찾을 수 없습니다.", 404);
    if (guest && String(item.roomId) !== guest.roomId) {
      return jsonError("권한이 없습니다.", 403);
    }
    if (body.title !== undefined) item.title = body.title;
    if (body.content !== undefined) item.content = body.content;
    if (body.authorName !== undefined) item.authorName = body.authorName;
    if (body.published !== undefined) item.published = body.published;
    await item.save();
    return Response.json({ ok: true, item });
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
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return jsonError("id가 필요합니다.");
  await connectDB();
  const item = await ThankYou.findById(id);
  if (!item) return jsonError("답례글을 찾을 수 없습니다.", 404);
  if (guest && String(item.roomId) !== guest.roomId) {
    return jsonError("권한이 없습니다.", 403);
  }
  await item.deleteOne();
  return Response.json({ ok: true });
}
