import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings, SiteSettings } from "@/models/SiteSettings";
import { jsonError } from "@/lib/utils";

export async function GET() {
  await connectDB();
  const settings = await getSiteSettings();
  return Response.json({ settings });
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return jsonError("권한이 없습니다.", 401);

  try {
    const body = z
      .object({
        siteName: z.string().optional(),
        phone: z.string().optional(),
        hospitalPhone: z.string().optional(),
        address: z.string().optional(),
        heroEyebrow: z.string().optional(),
        heroTitle: z.string().optional(),
        heroSubtitle: z.string().optional(),
        notice: z.string().optional(),
        aboutTitle: z.string().optional(),
        aboutBody: z.string().optional(),
        facebookUrl: z.string().optional(),
        instagramUrl: z.string().optional(),
        youtubeUrl: z.string().optional(),
        naverBlogUrl: z.string().optional(),
      })
      .parse(await request.json());

    await connectDB();
    const settings = await SiteSettings.findOneAndUpdate(
      { key: "main" },
      { $set: body },
      { upsert: true, new: true }
    );
    return Response.json({ ok: true, settings });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError("입력값을 확인해 주세요.");
    console.error(error);
    return jsonError("설정 저장에 실패했습니다.", 500);
  }
}

export async function DELETE() {
  const admin = await requireAdmin();
  if (!admin) return jsonError("권한이 없습니다.", 401);
  await connectDB();
  await SiteSettings.deleteOne({ key: "main" });
  const settings = await getSiteSettings();
  return Response.json({ ok: true, settings });
}
