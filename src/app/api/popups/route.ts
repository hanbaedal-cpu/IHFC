import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import { Popup } from "@/models/Popup";
import { jsonError } from "@/lib/utils";
import { parseKstDatetimeLocal } from "@/lib/time";

const schema = z.object({
  title: z.string().min(1),
  body: z.string().optional(),
  imageUrl: z.string().optional(),
  linkUrl: z.string().optional(),
  active: z.boolean().optional(),
  startAt: z.string().optional().nullable(),
  endAt: z.string().optional().nullable(),
  sortOrder: z.number().optional(),
});

export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get("active") === "1";
  const admin = await requireAdmin();

  if (activeOnly || !admin) {
    const now = new Date();
    const items = await Popup.find({
      active: true,
      $and: [
        { $or: [{ startAt: null }, { startAt: { $exists: false } }, { startAt: { $lte: now } }] },
        { $or: [{ endAt: null }, { endAt: { $exists: false } }, { endAt: { $gte: now } }] },
      ],
    })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();
    return Response.json({ items });
  }

  const items = await Popup.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  return Response.json({ items });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return jsonError("권한이 없습니다.", 401);
  try {
    const body = schema.parse(await request.json());
    await connectDB();
    const item = await Popup.create({
      ...body,
      startAt: body.startAt ? parseKstDatetimeLocal(body.startAt) : undefined,
      endAt: body.endAt ? parseKstDatetimeLocal(body.endAt) : undefined,
      active: body.active ?? true,
    });
    return Response.json({ ok: true, item });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError("입력값을 확인해 주세요.");
    console.error(error);
    return jsonError("등록에 실패했습니다.", 500);
  }
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return jsonError("권한이 없습니다.", 401);
  try {
    const body = schema.extend({ id: z.string() }).parse(await request.json());
    await connectDB();
    const item = await Popup.findByIdAndUpdate(
      body.id,
      {
        title: body.title,
        body: body.body || "",
        imageUrl: body.imageUrl || "",
        linkUrl: body.linkUrl || "",
        active: body.active ?? true,
        sortOrder: body.sortOrder ?? 0,
        startAt: body.startAt ? parseKstDatetimeLocal(body.startAt) : null,
        endAt: body.endAt ? parseKstDatetimeLocal(body.endAt) : null,
      },
      { new: true }
    );
    if (!item) return jsonError("팝업을 찾을 수 없습니다.", 404);
    return Response.json({ ok: true, item });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError("입력값을 확인해 주세요.");
    console.error(error);
    return jsonError("수정에 실패했습니다.", 500);
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return jsonError("권한이 없습니다.", 401);
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return jsonError("id가 필요합니다.");
  await connectDB();
  await Popup.findByIdAndDelete(id);
  return Response.json({ ok: true });
}
