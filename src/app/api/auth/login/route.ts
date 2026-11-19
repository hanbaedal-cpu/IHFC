import { z } from "zod";
import { ensureAdminSeed, loginAdmin, loginGuest } from "@/lib/auth";
import { jsonError } from "@/lib/utils";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  type: z.enum(["admin", "guest"]).default("admin"),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());

    if (body.type === "admin") {
      await ensureAdminSeed();
      const user = await loginAdmin(body.username, body.password);
      if (!user) return jsonError("아이디 또는 비밀번호가 올바르지 않습니다.", 401);
      return Response.json({
        ok: true,
        role: user.role,
        username: user.username,
        name: user.name,
      });
    }

    const room = await loginGuest(body.username, body.password);
    if (!room) return jsonError("아이디 또는 비밀번호가 올바르지 않습니다.", 401);
    return Response.json({
      ok: true,
      role: "guest",
      username: room.guestUsername,
      roomId: String(room._id),
      roomName: room.roomName,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError("입력값을 확인해 주세요.");
    }
    console.error(error);
    return jsonError("로그인 처리 중 오류가 발생했습니다.", 500);
  }
}
