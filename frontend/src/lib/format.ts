export const TZ = "Africa/Cairo";

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  day: "2-digit",
  month: "short",
  year: "numeric",
});
const timeFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const ymdFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** ISO UTC -> "04 Oct 2026" in Cairo time */
export function fmtDate(iso?: string) {
  if (!iso) return "—";
  return dateFmt.format(new Date(iso));
}
/** ISO UTC -> "14:30" in Cairo time */
export function fmtTime(iso?: string) {
  if (!iso) return "—";
  return timeFmt.format(new Date(iso));
}
export function fmtDateTime(iso?: string) {
  if (!iso) return "—";
  return `${fmtDate(iso)}, ${fmtTime(iso)}`;
}
/** Plain yyyy-MM-dd -> "04 Oct 2026" (no timezone shift) */
export function fmtPlainDate(ymd?: string) {
  if (!ymd) return "—";
  const [y, m, d] = ymd.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}
export function fmtEGP(n: number) {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n)}\u2009EGP`;
}
/** Date instance -> yyyy-MM-dd in Cairo */
export function cairoYmd(d: Date = new Date()) {
  return ymdFmt.format(d);
}
export function addDaysYmd(ymd: string, days: number) {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}
/** Offset of Cairo from UTC in minutes at given instant */
function cairoOffset(at: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(at);
  const g = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute"));
  return Math.round((asUtc - at.getTime()) / 60000);
}
/** Cairo wall time -> ISO UTC */
export function cairoToIso(ymd: string, hhmm: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  const [h, mi] = hhmm.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, h, mi);
  const off = cairoOffset(new Date(guess));
  return new Date(guess - off * 60000).toISOString();
}
export function ageFrom(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  const now = new Date();
  let a = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) a--;
  return a;
}
export const bloodTypeLabel: Record<string, string> = {
  APositive: "A+",
  ANegative: "A−",
  BPositive: "B+",
  BNegative: "B−",
  ABPositive: "AB+",
  ABNegative: "AB−",
  OPositive: "O+",
  ONegative: "O−",
};
