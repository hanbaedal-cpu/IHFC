export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function maskName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "";
  if (trimmed.length === 1) return trimmed;
  if (trimmed.length === 2) return `${trimmed[0]}○`;
  return `${trimmed[0]}${"○".repeat(Math.min(trimmed.length - 1, 2))}`;
}

export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export function formatPhone(phone: string) {
  const digits = normalizePhone(phone);
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function generateGuestCredentials(roomCode: string) {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  const username = `${roomCode.replace(/\s+/g, "").toUpperCase()}-${suffix}`;
  const password = Math.random().toString(36).slice(2, 10);
  return { username, password };
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
