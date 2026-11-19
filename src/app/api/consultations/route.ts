import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import { Consultation } from "@/models/Consultation";
import { jsonError, normalizePhone } from "@/lib/utils";

const createSchema = z.object({
  name: z.string().min(1).max(50),
  phone: z.string().min(9).max(20),
  privacyAgreed: z.literal(true),
  memo: z.string().max(500).optional(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return jsonError("권한이 없습니다.", 401);

  await connectDB();
  const list = await Consultation.find().sort({ createdAt: -1 }).lean();
  return Response.json({ items: list });
}

export async function POST(request: Request) {
  try {
    const body = createSchema.parse(await request.json());
    await connectDB();
    const item = await Consultation.create({
      name: body.name.trim(),
      phone: normalizePhone(body.phone),
      privacyAgreed: true,
      memo: body.memo?.trim() || "",
    });
    return Response.json({ ok: true, id: String(item._id) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError("이름, 연락처, 개인정보 동의가 필요합니다.");
    }
    console.error(error);
    return jsonError("상담 신청 저장에 실패했습니다.", 500);
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return jsonError("권한이 없습니다.", 401);

  try {
    const body = z
      .object({
        id: z.string(),
        status: z.enum(["new", "contacted", "closed"]).optional(),
        adminNote: z.string().max(1000).optional(),
        name: z.string().min(1).max(50).optional(),
        phone: z.string().min(9).max(20).optional(),
        memo: z.string().max(500).optional(),
      })
      .parse(await request.json());

    await connectDB();
    const item = await Consultation.findByIdAndUpdate(
      body.id,
      {
        ...(body.status ? { status: body.status } : {}),
        ...(body.adminNote !== undefined ? { adminNote: body.adminNote } : {}),
        ...(body.name ? { name: body.name.trim() } : {}),
        ...(body.phone ? { phone: normalizePhone(body.phone) } : {}),
        ...(body.memo !== undefined ? { memo: body.memo } : {}),
      },
      { new: true }
    );
    if (!item) return jsonError("상담 내역을 찾을 수 없습니다.", 404);
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
  await Consultation.findByIdAndDelete(id);
  return Response.json({ ok: true });
}
