import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { User, type UserRole } from "@/models/User";
import { Room } from "@/models/Room";

const COOKIE_NAME = "ihfc_session";

export type SessionPayload = {
  sub: string;
  role: UserRole | "guest";
  username: string;
  roomId?: string;
  name?: string;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET 환경변수가 필요합니다.");
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "staff")) {
    return null;
  }
  return session;
}

export async function requireGuest() {
  const session = await getSession();
  if (!session || session.role !== "guest" || !session.roomId) {
    return null;
  }
  return session;
}

export async function loginAdmin(username: string, password: string) {
  await connectDB();
  const user = await User.findOne({ username, active: true });
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;

  const token = await createSessionToken({
    sub: String(user._id),
    role: user.role,
    username: user.username,
    name: user.name,
  });
  await setSessionCookie(token);
  return user;
}

export async function loginGuest(username: string, password: string) {
  await connectDB();
  const room = await Room.findOne({ guestUsername: username, status: { $ne: "closed" } });
  if (!room) return null;
  const ok = await verifyPassword(password, room.guestPasswordHash);
  if (!ok) return null;

  const token = await createSessionToken({
    sub: String(room._id),
    role: "guest",
    username: room.guestUsername,
    roomId: String(room._id),
    name: room.hostName,
  });
  await setSessionCookie(token);
  return room;
}

export async function ensureAdminSeed() {
  await connectDB();
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin1234";
  const existing = await User.findOne({ username });
  if (existing) return existing;

  const passwordHash = await hashPassword(password);
  return User.create({
    username,
    passwordHash,
    name: "관리자",
    role: "admin",
    active: true,
  });
}
