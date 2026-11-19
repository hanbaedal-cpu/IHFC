import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { getSession, requireAdmin, requireSupervisor } from "@/lib/auth";
import { VisitLog } from "@/models/VisitLog";
import { jsonError } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = z.object({ path: z.string().min(1) }).parse(await request.json());
    const session = await getSession();
    let visitorType: "guest" | "host" | "admin" | "anonymous" = "anonymous";
    let username = "";
    if (session?.role === "guest") {
      visitorType = "host";
      username = session.username;
    } else if (session?.role === "admin" || session?.role === "staff") {
      visitorType = "admin";
      username = session.username;
    } else if (session?.role === "supervisor") {
      visitorType = "admin";
      username = session.username;
    } else {
      visitorType = "guest";
    }

    await connectDB();
    await VisitLog.create({
      path: body.path,
      visitorType,
      username,
      userAgent: request.headers.get("user-agent") || "",
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 200 });
  }
}

export async function GET(request: Request) {
  const supervisor = await requireSupervisor();
  const admin = supervisor ? null : await requireAdmin();
  if (!supervisor && !admin) return jsonError("권한이 없습니다.", 401);

  await connectDB();
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") || 100), 500);
  const items = await VisitLog.find().sort({ createdAt: -1 }).limit(limit).lean();
  return Response.json({ items });
}

export async function DELETE(request: Request) {
  const supervisor = await requireSupervisor();
  if (!supervisor) return jsonError("슈퍼바이저만 삭제할 수 있습니다.", 401);
  const id = new URL(request.url).searchParams.get("id");
  await connectDB();
  if (id) {
    await VisitLog.findByIdAndDelete(id);
  } else {
    await VisitLog.deleteMany({});
  }
  return Response.json({ ok: true });
}
