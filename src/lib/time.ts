export const KST_TZ = "Asia/Seoul";

function toDate(value?: Date | string | number | null) {
  if (value == null) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getKstParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  return map;
}

/** 예: 2026년 11월 19일 */
export function formatKstDate(value?: Date | string | number | null) {
  const date = toDate(value);
  if (!date) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TZ,
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** 예: 11월 19일 15:30 */
export function formatKstMonthDayTime(value?: Date | string | number | null) {
  const date = toDate(value);
  if (!date) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TZ,
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/** 예: 2026. 11. 19. 오후 3:30:00 → ko-KR 기본 스타일 + KST */
export function formatKstDateTime(value?: Date | string | number | null) {
  const date = toDate(value);
  if (!date) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

/** 예: 2026년 11월 */
export function formatKstYearMonth(value?: Date | string | number | null) {
  const date = toDate(value);
  if (!date) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TZ,
    year: "numeric",
    month: "long",
  }).format(date);
}

/** 오늘 날짜 키 (KST) YYYY-MM-DD */
export function todayKstKey(date = new Date()) {
  const parts = getKstParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** datetime-local input 값 (KST 기준) */
export function toKstDatetimeLocal(value?: Date | string | number | null) {
  const date = toDate(value);
  if (!date) return "";
  const parts = getKstParts(date);
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

/**
 * datetime-local 문자열을 KST로 해석해 UTC Date로 변환
 * 예: "2026-11-19T15:00" → 2026-11-19 15:00 +09:00
 */
export function parseKstDatetimeLocal(value: string) {
  if (!value) return null;
  const normalized = value.length === 16 ? `${value}:00` : value;
  const date = new Date(`${normalized}+09:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** 현재 시각 기준 KST Date 객체(표시용 문자열은 format* 사용) */
export function nowInKst() {
  return new Date();
}
