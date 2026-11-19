import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import { PageContent, getPageContent } from "@/models/PageContent";
import { jsonError } from "@/lib/utils";

const keys = ["about", "facilities", "guide", "status", "location"] as const;

export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  if (key) {
    if (!keys.includes(key as (typeof keys)[number])) {
      return jsonError("잘못된 페이지 키입니다.");
    }
    const page = await getPageContent(key as (typeof keys)[number]);
    return Response.json({ item: page });
  }
  const admin = await requireAdmin();
  if (!admin) return jsonError("권한이 없습니다.", 401);
  const items = await Promise.all(keys.map((k) => getPageContent(k)));
  return Response.json({ items });
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return jsonError("권한이 없습니다.", 401);
  try {
    const body = z
      .object({
        key: z.enum(keys),
        title: z.string().min(1),
        subtitle: z.string().optional(),
        body: z.string().optional(),
        extraJson: z.string().optional(),
      })
      .parse(await request.json());
    await connectDB();
    const item = await PageContent.findOneAndUpdate(
      { key: body.key },
      {
        $set: {
          title: body.title,
          subtitle: body.subtitle || "",
          body: body.body || "",
          extraJson: body.extraJson || "",
        },
      },
      { upsert: true, new: true }
    );
    return Response.json({ ok: true, item });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError("입력값을 확인해 주세요.");
    console.error(error);
    return jsonError("저장에 실패했습니다.", 500);
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return jsonError("권한이 없습니다.", 401);
  const key = new URL(request.url).searchParams.get("key");
  if (!key || !keys.includes(key as (typeof keys)[number])) {
    return jsonError("key가 필요합니다.");
  }
  await connectDB();
  await PageContent.deleteOne({ key });
  return Response.json({ ok: true });
}
