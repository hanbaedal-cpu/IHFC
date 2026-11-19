import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import { Gallery } from "@/models/Gallery";
import { jsonError } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1),
  imageUrl: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const publicOnly = searchParams.get("public") === "1";
  const admin = await requireAdmin();
  const query = publicOnly || !admin ? { active: true } : {};
  const items = await Gallery.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
  return Response.json({ items });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return jsonError("권한이 없습니다.", 401);
  try {
    const body = schema.parse(await request.json());
    await connectDB();
    const item = await Gallery.create({
      ...body,
      description: body.description || "",
      category: body.category || "시설",
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
    const item = await Gallery.findByIdAndUpdate(
      body.id,
      {
        title: body.title,
        imageUrl: body.imageUrl,
        description: body.description || "",
        category: body.category || "시설",
        active: body.active ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
      { new: true }
    );
    if (!item) return jsonError("항목을 찾을 수 없습니다.", 404);
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
  await Gallery.findByIdAndDelete(id);
  return Response.json({ ok: true });
}
