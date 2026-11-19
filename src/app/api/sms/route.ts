import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Consultation } from "@/models/Consultation";
import { SmsLog } from "@/models/SmsLog";
import { sendSms } from "@/lib/sms";
import { jsonError } from "@/lib/utils";

const sendSchema = z.object({
  text: z.string().min(1).max(1000),
  phones: z.array(z.string()).optional(),
  consultationIds: z.array(z.string()).optional(),
  sendAllNew: z.boolean().optional(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return jsonError("권한이 없습니다.", 401);
  await connectDB();
  const logs = await SmsLog.find().sort({ createdAt: -1 }).limit(50).lean();
  return Response.json({ items: logs });
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return jsonError("권한이 없습니다.", 401);
  const id = new URL(request.url).searchParams.get("id");
  await connectDB();
  if (id) await SmsLog.findByIdAndDelete(id);
  else await SmsLog.deleteMany({});
  return Response.json({ ok: true });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return jsonError("권한이 없습니다.", 401);

  try {
    const body = sendSchema.parse(await request.json());
    await connectDB();

    let phones = body.phones || [];
    let consultationIds = body.consultationIds || [];

    if (body.sendAllNew) {
      const list = await Consultation.find({ status: "new" }).lean();
      phones = list.map((item) => item.phone);
      consultationIds = list.map((item) => String(item._id));
    } else if (consultationIds.length) {
      const list = await Consultation.find({ _id: { $in: consultationIds } }).lean();
      phones = list.map((item) => item.phone);
    }

    const result = await sendSms({
      to: phones,
      text: body.text,
      sentBy: admin.username,
      consultationIds,
    });

    return Response.json({ ok: true, result });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError("입력값을 확인해 주세요.");
    console.error(error);
    return jsonError(
      error instanceof Error ? error.message : "문자 발송에 실패했습니다.",
      500
    );
  }
}
