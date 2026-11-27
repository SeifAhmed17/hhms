/* In-browser mock backend. Mirrors the HHMS API shapes so every page works without a server.
   State persists in localStorage under "hhms.mockdb". Every seeded account uses password "Password1". */
import { addDaysYmd, cairoToIso, cairoYmd } from "@/lib/format";
import type {
  AppointmentStatus,
  AppointmentSummary,
  AuthUser,
  Background,
  ContactPatient,
  DayOfWeek,
  Department,
  Doctor,
  Medicine,
  Paged,
  PaymentMethod,
  PersonFields,
  Prescription,
  Receipt,
  Role,
  ScheduleDay,
  StaffDetail,
  StaffRow,
} from "./types";

interface MUser {
  id: string;
  email: string;
  password: string;
  role: Role;
  profileId: string;
  mustChangePassword: boolean;
}
interface MPatient extends PersonFields {
  id: string;
  email: string;
  background: Background;
  rowVersion: string;
}
interface MStaff extends PersonFields {
  id: string;
  role: Role;
  email: string;
  salary: number;
  departmentId?: string;
  appointmentDurationMinutes?: number;
  isActive: boolean;
}
interface MAppt {
  id: string;
  doctorId: string;
  patientId: string;
  dt: string;
  status: AppointmentStatus;
  complaint?: string;
  diagnosis?: string;
  notes?: string;
  isPaid: boolean;
  prescriptionId?: string;
  rowVersion: string;
}
interface MRx {
  id: string;
  appointmentId: string;
  createdAt: string;
  status: "Pending" | "Dispensed";
  additionalNotes?: string;
  items: { id: string; medicineId: string; dosage: string; quantity: number }[];
  dispensedAt?: string;
  dispensedBy?: string;
  rowVersion: string;
}
interface MMed {
  id: string;
  name: string;
  price: number;
  expiryDate: string;
  quantity: number;
  lowStockThreshold: number;
  rowVersion: string;
}
interface MReceipt {
  id: string;
  appointmentId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  paidAt: string;
  receptionistId: string;
}
interface DB {
  version: number;
  users: MUser[];
  patients: MPatient[];
  staff: MStaff[];
  departments: Department[];
  schedules: Record<string, ScheduleDay[]>;
  appointments: MAppt[];
  prescriptions: MRx[];
  medicines: MMed[];
  receipts: MReceipt[];
}

const KEY = "hhms.mockdb";
const DB_VERSION = 1;
let db: DB | null = null;
let seq = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}${(seq++).toString(36)}`;
const rv = () => Math.random().toString(36).slice(2, 10);
const DAYS: DayOfWeek[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function seed(): DB {
  const today = cairoYmd();
  const departments: Department[] = [
    { id: "dep-cardio", name: "Cardiology", consultationFee: 450 },
    { id: "dep-peds", name: "Pediatrics", consultationFee: 300 },
    { id: "dep-ortho", name: "Orthopedics", consultationFee: 400 },
    { id: "dep-gp", name: "General Medicine", consultationFee: 200 },
  ];
  const person = (
    firstName: string,
    lastName: string,
    gender: "Male" | "Female",
    dob: string,
    extra: Partial<PersonFields> = {},
  ): PersonFields => ({
    firstName,
    lastName,
    gender,
    dateOfBirth: dob,
    country: "Egypt",
    governorate: "Red Sea",
    nationalId: extra.passportNumber ? undefined : `2${dob.replace(/-/g, "").slice(2)}3100${Math.floor(Math.random() * 900 + 100)}`,
    phoneNumbers: ["+20 100 555 " + Math.floor(Math.random() * 9000 + 1000)],
    ...extra,
  });
  const staff: MStaff[] = [
    { id: "doc-1", role: "Doctor", email: "doctor@hhms.test", salary: 42000, departmentId: "dep-cardio", appointmentDurationMinutes: 30, isActive: true, ...person("Omar", "Farouk", "Male", "1978-03-14") },
    { id: "doc-2", role: "Doctor", email: "salma.nabil@hhms.test", salary: 38000, departmentId: "dep-peds", appointmentDurationMinutes: 20, isActive: true, ...person("Salma", "Nabil", "Female", "1985-07-02") },
    { id: "doc-3", role: "Doctor", email: "karim.adel@hhms.test", salary: 40000, departmentId: "dep-ortho", appointmentDurationMinutes: 30, isActive: true, ...person("Karim", "Adel", "Male", "1981-11-21") },
    { id: "doc-4", role: "Doctor", email: "mona.said@hhms.test", salary: 30000, departmentId: "dep-gp", appointmentDurationMinutes: 15, isActive: true, ...person("Mona", "Said", "Female", "1990-01-09") },
    { id: "rec-1", role: "Receptionist", email: "reception@hhms.test", salary: 12000, isActive: true, ...person("Nour", "Hassan", "Female", "1996-05-30") },
    { id: "pha-1", role: "Pharmacist", email: "pharmacy@hhms.test", salary: 16000, isActive: true, ...person("Youssef", "Ali", "Male", "1992-09-17") },
    { id: "adm-1", role: "Admin", email: "admin@hhms.test", salary: 50000, isActive: true, ...person("Hala", "Mansour", "Female", "1980-12-04") },
  ];
  const week = (days: DayOfWeek[], s: string, e: string) => days.map((d) => ({ dayOfWeek: d, startTime: s, endTime: e }));
  const allWeek: DayOfWeek[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"];
  const schedules: Record<string, ScheduleDay[]> = {
    "doc-1": week(allWeek, "09:00", "14:00"),
    "doc-2": week(["Sunday", "Tuesday", "Wednesday", "Thursday", "Saturday"], "10:00", "16:00"),
    "doc-3": week(["Monday", "Tuesday", "Wednesday", "Saturday"], "12:00", "18:00"),
    "doc-4": week([...allWeek, "Friday"], "08:00", "13:00"),
  };
  const patients: MPatient[] = [
    { id: "pat-1", email: "patient@hhms.test", rowVersion: rv(), ...person("Ahmed", "Hassan", "Male", "1988-04-12"),
      background: { allergies: "Penicillin", chronicDiseases: "Type 2 diabetes", bloodType: "OPositive", pastSurgeries: "Appendectomy (2012)", familyHistory: "Father: hypertension", rowVersion: rv() } },
    { id: "pat-2", email: "laila.mostafa@example.com", rowVersion: rv(), ...person("Laila", "Mostafa", "Female", "1995-08-23"),
      background: { bloodType: "APositive", rowVersion: rv() } },
    { id: "pat-3", email: "anna.schmidt@example.de", rowVersion: rv(), ...person("Anna", "Schmidt", "Female", "1972-02-17", { country: "Germany", governorate: undefined, passportNumber: "C01X00T47" }),
      background: { allergies: "Shellfish", rowVersion: rv() } },
    { id: "pat-4", email: "mahmoud.ibrahim@example.com", rowVersion: rv(), ...person("Mahmoud", "Ibrahim", "Male", "2016-06-05"),
      background: { rowVersion: rv() } },
  ];
  const users: MUser[] = [
    ...staff.map((s) => ({ id: `u-${s.id}`, email: s.email, password: "Password1", role: s.role, profileId: s.id, mustChangePassword: false })),
    ...patients.map((p) => ({ id: `u-${p.id}`, email: p.email, password: "Password1", role: "Patient" as Role, profileId: p.id, mustChangePassword: false })),
  ];
  const medicines: MMed[] = [
    { id: "med-1", name: "Paracetamol 500 mg", price: 25, expiryDate: "2027-12-31", quantity: 400, lowStockThreshold: 50, rowVersion: rv() },
    { id: "med-2", name: "Amoxicillin 500 mg", price: 68, expiryDate: "2027-06-30", quantity: 120, lowStockThreshold: 30, rowVersion: rv() },
    { id: "med-3", name: "Metformin 850 mg", price: 42, expiryDate: "2028-01-31", quantity: 18, lowStockThreshold: 25, rowVersion: rv() },
    { id: "med-4", name: "Atorvastatin 20 mg", price: 110, expiryDate: "2027-09-30", quantity: 75, lowStockThreshold: 20, rowVersion: rv() },
    { id: "med-5", name: "Ibuprofen 400 mg", price: 30, expiryDate: "2026-08-31", quantity: 60, lowStockThreshold: 30, rowVersion: rv() },
    { id: "med-6", name: "Omeprazole 20 mg", price: 55, expiryDate: "2027-11-30", quantity: 8, lowStockThreshold: 20, rowVersion: rv() },
    { id: "med-7", name: "Salbutamol inhaler", price: 95, expiryDate: "2027-04-30", quantity: 34, lowStockThreshold: 10, rowVersion: rv() },
    { id: "med-8", name: "Amlodipine 5 mg", price: 38, expiryDate: "2028-03-31", quantity: 210, lowStockThreshold: 40, rowVersion: rv() },
  ];
  const appt = (id: string, doctorId: string, patientId: string, day: number, time: string, status: AppointmentStatus, extra: Partial<MAppt> = {}): MAppt => ({
    id, doctorId, patientId, dt: cairoToIso(addDaysYmd(today, day), time), status, isPaid: false, rowVersion: rv(), ...extra,
  });
  const appointments: MAppt[] = [
    appt("apt-1", "doc-1", "pat-1", -40, "10:00", "Completed", { complaint: "Chest tightness on exertion", diagnosis: "Stable angina", notes: "ECG normal at rest. Stress test ordered.", isPaid: true, prescriptionId: "rx-1" }),
    appt("apt-2", "doc-4", "pat-1", -12, "09:15", "Completed", { complaint: "Sore throat, fever", diagnosis: "Acute pharyngitis", notes: "Avoid penicillin (allergy).", isPaid: true, prescriptionId: "rx-2" }),
    appt("apt-3", "doc-1", "pat-1", 0, "10:30", "Scheduled", { complaint: "Follow-up on stress test" }),
    appt("apt-4", "doc-1", "pat-2", 0, "09:00", "CheckedIn", { complaint: "Palpitations", isPaid: true }),
    appt("apt-5", "doc-1", "pat-3", 0, "11:00", "Scheduled", { complaint: "Shortness of breath" }),
    appt("apt-6", "doc-2", "pat-4", 0, "10:00", "Scheduled", { complaint: "Persistent cough" }),
    appt("apt-7", "doc-4", "pat-2", 0, "08:30", "Completed", { complaint: "Headache", diagnosis: "Tension headache", isPaid: false, prescriptionId: "rx-3" }),
    appt("apt-8", "doc-3", "pat-1", 6, "13:00", "Scheduled", { complaint: "Knee pain" }),
    appt("apt-9", "doc-2", "pat-3", -3, "11:00", "Cancelled", {}),
  ];
  const prescriptions: MRx[] = [
    { id: "rx-1", appointmentId: "apt-1", createdAt: appointments[0].dt, status: "Dispensed", additionalNotes: "Take with food.", items: [{ id: "rxi-1", medicineId: "med-4", dosage: "1 tablet at night", quantity: 30 }], dispensedAt: appointments[0].dt, dispensedBy: "Youssef Ali", rowVersion: rv() },
    { id: "rx-2", appointmentId: "apt-2", createdAt: appointments[1].dt, status: "Pending", items: [{ id: "rxi-2", medicineId: "med-1", dosage: "1 tablet every 6 hours", quantity: 20 }, { id: "rxi-3", medicineId: "med-5", dosage: "1 tablet twice daily after meals", quantity: 10 }], rowVersion: rv() },
    { id: "rx-3", appointmentId: "apt-7", createdAt: appointments[6].dt, status: "Pending", items: [{ id: "rxi-4", medicineId: "med-1", dosage: "1 tablet when needed", quantity: 10 }], rowVersion: rv() },
  ];
  const receipts: MReceipt[] = [
    { id: "rcp-1", appointmentId: "apt-1", paymentMethod: "Card", amount: 450, paidAt: appointments[0].dt, receptionistId: "rec-1" },
    { id: "rcp-2", appointmentId: "apt-2", paymentMethod: "Cash", amount: 200, paidAt: appointments[1].dt, receptionistId: "rec-1" },
    { id: "rcp-3", appointmentId: "apt-4", paymentMethod: "Cash", amount: 450, paidAt: appointments[3].dt, receptionistId: "rec-1" },
  ];
  return { version: DB_VERSION, users, patients, staff, departments, schedules, appointments, prescriptions, medicines, receipts };
}

function load(): DB {
  if (db) return db;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DB;
      if (parsed.version === DB_VERSION) return (db = parsed);
    }
  } catch {
    /* ignore */
  }
  db = seed();
  save();
  return db;
}
function save() {
  if (db) localStorage.setItem(KEY, JSON.stringify(db));
}
export function resetMockDb() {
  db = seed();
  save();
}

// ---------- helpers ----------
type Res = { status: number; body?: unknown };
const ok = (body?: unknown, status = 200): Res => ({ status, body });
const err = (status: number, title: string, detail?: string, extra: Record<string, unknown> = {}): Res => ({
  status,
  body: { status, title, detail, ...extra },
});
const fullName = (p: { firstName: string; lastName: string }) => `${p.firstName} ${p.lastName}`;
function paginate<T>(items: T[], q: Record<string, unknown>): Paged<T> {
  const page = Math.max(1, Number(q.page) || 1);
  const pageSize = Math.max(1, Number(q.pageSize) || 20);
  return { items: items.slice((page - 1) * pageSize, page * pageSize), page, pageSize, totalCount: items.length };
}
const has = (s: string | undefined, term: string) => (s ?? "").toLowerCase().includes(term.toLowerCase());
const truthy = (v: unknown) => v === true || v === "true";

function toDoctor(d: DB, s: MStaff): Doctor {
  const dep = d.departments.find((x) => x.id === s.departmentId);
  return { id: s.id, fullName: `Dr. ${fullName(s)}`, departmentId: s.departmentId ?? "", departmentName: dep?.name ?? "", consultationFee: dep?.consultationFee ?? 0, appointmentDurationMinutes: s.appointmentDurationMinutes ?? 30 };
}
function toSummary(d: DB, a: MAppt): AppointmentSummary {
  const doc = d.staff.find((s) => s.id === a.doctorId)!;
  const pat = d.patients.find((p) => p.id === a.patientId)!;
  const doctor = toDoctor(d, doc);
  return { id: a.id, appointmentDateTime: a.dt, status: a.status, complaint: a.complaint, isPaid: a.isPaid,
    doctor: { id: doc.id, fullName: doctor.fullName, departmentName: doctor.departmentName },
    patient: { id: pat.id, fullName: fullName(pat) }, prescriptionId: a.prescriptionId, rowVersion: a.rowVersion };
}
function toContact(p: MPatient): ContactPatient {
  const { background: _b, email: _e, ...rest } = p;
  return { ...rest, fullName: fullName(p) };
}
function toMedicine(m: MMed): Medicine {
  return { ...m, isLowStock: m.quantity <= m.lowStockThreshold, isExpired: m.expiryDate < cairoYmd() };
}
function toRx(d: DB, r: MRx, forPharmacist = false): Prescription {
  const a = d.appointments.find((x) => x.id === r.appointmentId)!;
  const s = toSummary(d, a);
  return { id: r.id, appointmentId: r.appointmentId, createdAt: r.createdAt, status: r.status, additionalNotes: r.additionalNotes,
    doctor: { id: s.doctor.id, fullName: s.doctor.fullName }, patient: s.patient,
    items: r.items.map((i) => {
      const m = d.medicines.find((x) => x.id === i.medicineId)!;
      const base = { id: i.id, medicineId: i.medicineId, medicineName: m?.name ?? "Unknown", dosage: i.dosage, quantity: i.quantity, unitPrice: m?.price ?? 0 };
      return forPharmacist ? { ...base, stockQuantity: m?.quantity ?? 0, isExpired: m ? toMedicine(m).isExpired : true } : base;
    }),
    dispensedAt: r.dispensedAt, dispensedBy: r.dispensedBy, rowVersion: r.rowVersion };
}
function toReceipt(d: DB, r: MReceipt): Receipt {
  const s = toSummary(d, d.appointments.find((a) => a.id === r.appointmentId)!);
  const rec = d.staff.find((x) => x.id === r.receptionistId);
  return { id: r.id, appointmentId: r.appointmentId, patientName: s.patient.fullName, doctorName: s.doctor.fullName, departmentName: s.doctor.departmentName,
    appointmentDateTime: s.appointmentDateTime, paymentMethod: r.paymentMethod, amount: r.amount, paidAt: r.paidAt, receptionistName: rec ? fullName(rec) : "" };
}
function toAuthUser(d: DB, u: MUser): AuthUser {
  const prof = u.role === "Patient" ? d.patients.find((p) => p.id === u.profileId) : d.staff.find((s) => s.id === u.profileId);
  const name = prof ? fullName(prof) : u.email;
  return { id: u.id, email: u.email, role: u.role, displayName: u.role === "Doctor" ? `Dr. ${name}` : name, profileId: u.profileId, mustChangePassword: u.mustChangePassword };
}
function history(d: DB, p: MPatient, doctorFilter?: string) {
  const visits = d.appointments
    .filter((a) => a.patientId === p.id && a.status !== "Cancelled" && (!doctorFilter || true))
    .sort((a, b) => b.dt.localeCompare(a.dt))
    .map((a) => ({ appointmentId: a.id, appointmentDateTime: a.dt, doctorName: toDoctor(d, d.staff.find((s) => s.id === a.doctorId)!).fullName,
      status: a.status, complaint: a.complaint, diagnosis: a.diagnosis, notes: a.notes, prescriptionId: a.prescriptionId, rowVersion: a.rowVersion }));
  return { patient: { id: p.id, fullName: fullName(p), dateOfBirth: p.dateOfBirth, gender: p.gender }, background: p.background, visits };
}
function validatePerson(b: Partial<PersonFields>): Record<string, string[]> | null {
  const e: Record<string, string[]> = {};
  if (!b.firstName?.trim()) e.firstName = ["First name is required."];
  if (!b.lastName?.trim()) e.lastName = ["Last name is required."];
  if (!b.nationalId?.trim() && !b.passportNumber?.trim()) e.nationalId = ["National ID or passport number is required."];
  if (!b.dateOfBirth) e.dateOfBirth = ["Date of birth is required."];
  if (!b.country?.trim()) e.country = ["Country is required."];
  if (!b.phoneNumbers?.filter((x) => x.trim()).length) e.phoneNumbers = ["At least one phone number is required."];
  return Object.keys(e).length ? e : null;
}
function slotsFor(d: DB, doctorId: string, date: string, ignoreAppt?: string) {
  const doc = d.staff.find((s) => s.id === doctorId);
  const dur = doc?.appointmentDurationMinutes ?? 30;
  const [y, m, dd] = date.split("-").map(Number);
  const dow = DAYS[new Date(Date.UTC(y, m - 1, dd)).getUTCDay()];
  const sched = (d.schedules[doctorId] ?? []).find((s) => s.dayOfWeek === dow);
  const slots: { start: string; isAvailable: boolean }[] = [];
  if (sched) {
    const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
    const now = Date.now();
    for (let t = toMin(sched.startTime); t + dur <= toMin(sched.endTime); t += dur) {
      const hh = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
      const iso = cairoToIso(date, hh);
      const taken = d.appointments.some((a) => a.id !== ignoreAppt && a.doctorId === doctorId && a.dt === iso && a.status !== "Cancelled");
      slots.push({ start: iso, isAvailable: !taken && new Date(iso).getTime() > now });
    }
  }
  return { date, slotMinutes: dur, slots };
}

// ---------- router ----------
interface Ctx {
  d: DB;
  user: MUser | null;
  q: Record<string, string>;
  body: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  p: string[];
}
type Handler = (c: Ctx) => Res;
const routes: [string, RegExp, Role[] | "public" | "any", Handler][] = [];
const on = (method: string, pattern: string, roles: Role[] | "public" | "any", h: Handler) =>
  routes.push([method, new RegExp("^" + pattern.replace(/:[a-zA-Z]+/g, "([^/]+)") + "$"), roles, h]);

// Auth
on("POST", "/auth/login", "public", ({ d, body }) => {
  const u = d.users.find((x) => x.email.toLowerCase() === String(body?.email ?? "").toLowerCase() && x.password === body?.password);
  if (!u) return err(401, "Unauthorized", "Wrong email or password");
  const s = d.staff.find((x) => x.id === u.profileId);
  if (s && !s.isActive) return err(401, "Unauthorized", "Wrong email or password");
  return ok({ token: `mock.${u.id}`, expiresAt: new Date(Date.now() + 8 * 3600e3).toISOString(), user: toAuthUser(d, u) });
});
on("POST", "/auth/register", "public", ({ d, body }) => {
  const e = validatePerson(body) ?? {};
  if (!body?.email) e.email = ["Email is required."];
  if (!body?.password || String(body.password).length < 8) e.password = ["Password must be at least 8 characters."];
  if (Object.keys(e).length) return err(400, "Validation failed", undefined, { errors: e });
  if (d.users.some((u) => u.email.toLowerCase() === body.email.toLowerCase()) || d.patients.some((p) => (body.nationalId && p.nationalId === body.nationalId) || (body.passportNumber && p.passportNumber === body.passportNumber)))
    return err(409, "Conflict", "Account exists");
  const { email, password, ...person } = body;
  const id = uid("pat");
  d.patients.push({ ...person, id, email, background: { rowVersion: rv() }, rowVersion: rv() });
  d.users.push({ id: `u-${id}`, email, password, role: "Patient", profileId: id, mustChangePassword: false });
  return ok(undefined, 201);
});
on("GET", "/auth/me", "any", ({ d, user }) => ok(toAuthUser(d, user!)));
on("POST", "/auth/change-password", "any", ({ user, body }) => {
  if (user!.password !== body?.currentPassword) return err(400, "Validation failed", undefined, { errors: { currentPassword: ["Current password is incorrect."] } });
  if (!body?.newPassword || body.newPassword.length < 8) return err(400, "Validation failed", undefined, { errors: { newPassword: ["Password must be at least 8 characters."] } });
  user!.password = body.newPassword;
  user!.mustChangePassword = false;
  return ok(undefined, 204);
});

// Departments
on("GET", "/departments", "any", ({ d }) => ok(d.departments));
on("POST", "/departments", ["Admin"], ({ d, body }) => {
  if (!body?.name?.trim()) return err(400, "Validation failed", undefined, { errors: { name: ["Name is required."] } });
  const dep = { id: uid("dep"), name: body.name, consultationFee: Number(body.consultationFee) };
  d.departments.push(dep);
  return ok(dep, 201);
});
on("PUT", "/departments/:id", ["Admin"], ({ d, body, p }) => {
  const dep = d.departments.find((x) => x.id === p[0]);
  if (!dep) return err(404, "Not found");
  dep.name = body.name;
  dep.consultationFee = Number(body.consultationFee);
  return ok(dep);
});
on("DELETE", "/departments/:id", ["Admin"], ({ d, p }) => {
  if (d.staff.some((s) => s.departmentId === p[0] && s.role === "Doctor")) return err(409, "Conflict", "The department still has doctors.");
  d.departments = d.departments.filter((x) => x.id !== p[0]);
  return ok(undefined, 204);
});

// Doctors
on("GET", "/doctors", "any", ({ d, q }) =>
  ok(d.staff.filter((s) => s.role === "Doctor" && s.isActive && (!q.departmentId || s.departmentId === q.departmentId)).map((s) => toDoctor(d, s))));
on("GET", "/doctors/me/appointments", ["Doctor"], ({ d, user, q }) =>
  ok(d.appointments.filter((a) => a.doctorId === user!.profileId && cairoYmd(new Date(a.dt)) === q.date).sort((a, b) => a.dt.localeCompare(b.dt)).map((a) => toSummary(d, a))));
on("GET", "/doctors/me/patients", ["Doctor"], ({ d, user, q }) => {
  const mine = d.appointments.filter((a) => a.doctorId === user!.profileId && a.status !== "Cancelled");
  const ids = [...new Set(mine.map((a) => a.patientId))];
  const rows = ids.map((id) => {
    const p = d.patients.find((x) => x.id === id)!;
    const last = mine.filter((a) => a.patientId === id && a.status !== "Scheduled").map((a) => a.dt).sort().pop() ?? mine.filter((a) => a.patientId === id).map((a) => a.dt).sort().pop()!;
    return { ...toContact(p), lastVisitAt: last };
  }).filter((r) => !q.search || has(r.fullName, q.search)).sort((a, b) => b.lastVisitAt.localeCompare(a.lastVisitAt));
  return ok(paginate(rows, q));
});
on("GET", "/doctors/:id/availability", "any", ({ d, p, q }) => ok(slotsFor(d, p[0], q.date)));
on("GET", "/doctors/:id/schedule", "any", ({ d, p }) => ok(d.schedules[p[0]] ?? []));
on("PUT", "/doctors/:id/schedule", ["Admin"], ({ d, p, body }) => {
  const next = body as ScheduleDay[];
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  const conflicts = d.appointments.filter((a) => {
    if (a.doctorId !== p[0] || a.status !== "Scheduled" || new Date(a.dt).getTime() < Date.now()) return false;
    const ymd = cairoYmd(new Date(a.dt));
    const [y, m, dd] = ymd.split("-").map(Number);
    const dow = DAYS[new Date(Date.UTC(y, m - 1, dd)).getUTCDay()];
    const day = next.find((s) => s.dayOfWeek === dow);
    if (!day) return true;
    const hhmm = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Cairo", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(a.dt));
    const dur = d.staff.find((s) => s.id === p[0])?.appointmentDurationMinutes ?? 30;
    return toMin(hhmm) < toMin(day.startTime) || toMin(hhmm) + dur > toMin(day.endTime);
  });
  if (conflicts.length) return err(409, "Conflict", "Existing appointments fall outside the new hours.", { appointments: conflicts.map((a) => toSummary(d, a)) });
  d.schedules[p[0]] = next;
  return ok(next);
});

// Patients
on("GET", "/patients/me", ["Patient"], ({ d, user }) => {
  const pt = d.patients.find((x) => x.id === user!.profileId)!;
  return ok({ ...toContact(pt), email: pt.email });
});
on("PUT", "/patients/me", ["Patient"], ({ d, user, body }) => {
  const pt = d.patients.find((x) => x.id === user!.profileId)!;
  if (body.rowVersion !== pt.rowVersion) return err(409, "Conflict", "Someone else changed this record.");
  const e = validatePerson({ ...body, nationalId: pt.nationalId, passportNumber: pt.passportNumber });
  if (e) return err(400, "Validation failed", undefined, { errors: e });
  Object.assign(pt, { firstName: body.firstName, lastName: body.lastName, gender: body.gender, dateOfBirth: body.dateOfBirth, country: body.country, governorate: body.governorate, phoneNumbers: body.phoneNumbers, rowVersion: rv() });
  return ok({ ...toContact(pt), email: pt.email });
});
on("GET", "/patients/me/medical-history", ["Patient"], ({ d, user }) => ok(history(d, d.patients.find((x) => x.id === user!.profileId)!)));
on("GET", "/patients", ["Receptionist", "Admin"], ({ d, q }) => {
  const t = q.search ?? "";
  const rows = d.patients.filter((p) => !t || has(fullName(p), t) || has(p.nationalId, t) || has(p.passportNumber, t) || p.phoneNumbers.some((n) => has(n.replace(/\s/g, ""), t.replace(/\s/g, "")))).map(toContact);
  return ok(paginate(rows, q));
});
on("POST", "/patients", ["Receptionist"], ({ d, body }) => {
  const e = validatePerson(body) ?? {};
  if (!body?.email) e.email = ["Email is required."];
  if (Object.keys(e).length) return err(400, "Validation failed", undefined, { errors: e });
  const dup = d.patients.find((p) => p.email.toLowerCase() === body.email.toLowerCase() || (body.nationalId && p.nationalId === body.nationalId) || (body.passportNumber && p.passportNumber === body.passportNumber));
  if (dup) return err(409, "Conflict", "This person is already registered.", { patientId: dup.id });
  const { email, ...person } = body;
  const id = uid("pat");
  const pt: MPatient = { ...person, id, email, background: { rowVersion: rv() }, rowVersion: rv() };
  d.patients.push(pt);
  const temporaryPassword = "Tmp-" + Math.random().toString(36).slice(2, 8);
  d.users.push({ id: `u-${id}`, email, password: temporaryPassword, role: "Patient", profileId: id, mustChangePassword: true });
  return ok({ ...toContact(pt), temporaryPassword }, 201);
});
on("GET", "/patients/:id/medical-history", ["Doctor", "Admin"], ({ d, user, p }) => {
  const pt = d.patients.find((x) => x.id === p[0]);
  if (!pt) return err(404, "Not found");
  if (user!.role === "Doctor" && !d.appointments.some((a) => a.patientId === pt.id && a.doctorId === user!.profileId)) return err(403, "Forbidden");
  return ok(history(d, pt));
});
on("PUT", "/patients/:id/background", ["Doctor"], ({ d, p, body }) => {
  const pt = d.patients.find((x) => x.id === p[0]);
  if (!pt) return err(404, "Not found");
  if (body.rowVersion !== pt.background.rowVersion) return err(409, "Conflict", "Someone else changed this record.");
  pt.background = { allergies: body.allergies, chronicDiseases: body.chronicDiseases, bloodType: body.bloodType || undefined, pastSurgeries: body.pastSurgeries, familyHistory: body.familyHistory, rowVersion: rv() };
  return ok(pt.background);
});
on("GET", "/patients/:id", ["Receptionist", "Admin"], ({ d, p }) => {
  const pt = d.patients.find((x) => x.id === p[0]);
  return pt ? ok(toContact(pt)) : err(404, "Not found");
});
on("PUT", "/patients/:id", ["Receptionist"], ({ d, p, body }) => {
  const pt = d.patients.find((x) => x.id === p[0]);
  if (!pt) return err(404, "Not found");
  if (body.rowVersion !== pt.rowVersion) return err(409, "Conflict", "Someone else changed this record.");
  const e = validatePerson(body);
  if (e) return err(400, "Validation failed", undefined, { errors: e });
  const { rowVersion: _r, ...rest } = body;
  Object.assign(pt, rest, { rowVersion: rv() });
  return ok(toContact(pt));
});

// Appointments
on("POST", "/appointments", ["Patient", "Receptionist"], ({ d, user, body }) => {
  const patientId = user!.role === "Patient" ? user!.profileId : body.patientId;
  if (!d.patients.some((x) => x.id === patientId)) return err(400, "Validation failed", undefined, { errors: { patientId: ["Choose a patient."] } });
  const date = cairoYmd(new Date(body.appointmentDateTime));
  const av = slotsFor(d, body.doctorId, date);
  const slot = av.slots.find((s) => s.start === new Date(body.appointmentDateTime).toISOString());
  if (!slot || new Date(slot.start).getTime() < Date.now()) return err(422, "Invalid slot", "This time slot is not valid or is in the past.");
  if (!slot.isAvailable) return err(409, "Conflict", "This slot was just taken.");
  const a: MAppt = { id: uid("apt"), doctorId: body.doctorId, patientId, dt: slot.start, status: "Scheduled", complaint: body.complaint || undefined, isPaid: false, rowVersion: rv() };
  d.appointments.push(a);
  return ok(toSummary(d, a), 201);
});
on("GET", "/appointments/mine", ["Patient"], ({ d, user, q }) => {
  let rows = d.appointments.filter((a) => a.patientId === user!.profileId);
  if (q.status) rows = rows.filter((a) => a.status === q.status);
  if (q.from) rows = rows.filter((a) => a.dt >= q.from);
  if (q.to) rows = rows.filter((a) => a.dt < q.to);
  rows.sort((a, b) => (q.from ? a.dt.localeCompare(b.dt) : b.dt.localeCompare(a.dt)));
  return ok(paginate(rows.map((a) => toSummary(d, a)), q));
});
on("GET", "/appointments", ["Receptionist", "Admin"], ({ d, q }) => {
  let rows = d.appointments.slice();
  if (q.date) rows = rows.filter((a) => cairoYmd(new Date(a.dt)) === q.date);
  if (q.doctorId) rows = rows.filter((a) => a.doctorId === q.doctorId);
  if (q.patientId) rows = rows.filter((a) => a.patientId === q.patientId);
  if (q.status) rows = rows.filter((a) => a.status === q.status);
  if (q.isPaid !== undefined) rows = rows.filter((a) => a.isPaid === truthy(q.isPaid));
  rows.sort((a, b) => a.dt.localeCompare(b.dt));
  return ok(paginate(rows.map((a) => toSummary(d, a)), q));
});
on("GET", "/appointments/:id", ["Patient", "Doctor", "Receptionist", "Admin"], ({ d, user, p }) => {
  const a = d.appointments.find((x) => x.id === p[0]);
  if (!a) return err(404, "Not found");
  if (user!.role === "Patient" && a.patientId !== user!.profileId) return err(403, "Forbidden");
  if (user!.role === "Doctor" && a.doctorId !== user!.profileId) return err(403, "Forbidden");
  const medical = user!.role === "Doctor" || user!.role === "Patient" || user!.role === "Admin";
  return ok({ ...toSummary(d, a), ...(medical ? { diagnosis: a.diagnosis, notes: a.notes } : {}) });
});
on("POST", "/appointments/:id/cancel", ["Patient", "Receptionist"], ({ d, user, p, body }) => {
  const a = d.appointments.find((x) => x.id === p[0]);
  if (!a) return err(404, "Not found");
  if (user!.role === "Patient" && a.patientId !== user!.profileId) return err(403, "Forbidden");
  if (a.rowVersion !== body?.rowVersion) return err(409, "Conflict", "Someone else changed this record.");
  if (a.status !== "Scheduled") return err(422, "Cannot cancel", "Only scheduled appointments can be cancelled.");
  a.status = "Cancelled";
  a.rowVersion = rv();
  return ok(toSummary(d, a));
});
on("POST", "/appointments/:id/check-in", ["Receptionist"], ({ d, p, body }) => {
  const a = d.appointments.find((x) => x.id === p[0]);
  if (!a) return err(404, "Not found");
  if (a.rowVersion !== body?.rowVersion) return err(409, "Conflict", "Someone else changed this record.");
  if (a.status !== "Scheduled" || cairoYmd(new Date(a.dt)) !== cairoYmd()) return err(409, "Conflict", "Check-in is only possible on the appointment's day.");
  a.status = "CheckedIn";
  a.rowVersion = rv();
  return ok(toSummary(d, a));
});
on("PUT", "/appointments/:id/visit", ["Doctor"], ({ d, user, p, body }) => {
  const a = d.appointments.find((x) => x.id === p[0]);
  if (!a) return err(404, "Not found");
  if (a.doctorId !== user!.profileId) return err(403, "Forbidden");
  if (a.rowVersion !== body?.rowVersion) return err(409, "Conflict", "Someone else changed this record.");
  if (a.status !== "CheckedIn" && a.status !== "Completed") return err(422, "Not checked in", "Patient has not checked in yet.");
  a.complaint = body.complaint || undefined;
  a.diagnosis = body.diagnosis || undefined;
  a.notes = body.notes || undefined;
  if (a.diagnosis?.trim()) a.status = "Completed";
  a.rowVersion = rv();
  return ok({ ...toSummary(d, a), diagnosis: a.diagnosis, notes: a.notes });
});
on("POST", "/appointments/:id/prescription", ["Doctor"], ({ d, user, p, body }) => {
  const a = d.appointments.find((x) => x.id === p[0]);
  if (!a) return err(404, "Not found");
  if (a.doctorId !== user!.profileId) return err(403, "Forbidden");
  if (a.prescriptionId) return err(409, "Conflict", "A prescription already exists.");
  if (!body?.items?.length) return err(400, "Validation failed", undefined, { errors: { items: ["Add at least one medicine."] } });
  const r: MRx = { id: uid("rx"), appointmentId: a.id, createdAt: new Date().toISOString(), status: "Pending", additionalNotes: body.additionalNotes || undefined,
    items: body.items.map((i: { medicineId: string; dosage: string; quantity: number }) => ({ id: uid("rxi"), ...i, quantity: Number(i.quantity) })), rowVersion: rv() };
  d.prescriptions.push(r);
  a.prescriptionId = r.id;
  a.rowVersion = rv();
  return ok(toRx(d, r), 201);
});
on("POST", "/appointments/:id/receipt", ["Receptionist"], ({ d, user, p, body }) => {
  const a = d.appointments.find((x) => x.id === p[0]);
  if (!a) return err(404, "Not found");
  if (a.isPaid) return err(409, "Conflict", "This appointment is already paid.");
  if (a.status === "Cancelled") return err(422, "Cancelled", "The appointment is cancelled.");
  const fee = toDoctor(d, d.staff.find((s) => s.id === a.doctorId)!).consultationFee;
  const r: MReceipt = { id: uid("rcp"), appointmentId: a.id, paymentMethod: body.paymentMethod, amount: fee, paidAt: new Date().toISOString(), receptionistId: user!.profileId };
  d.receipts.push(r);
  a.isPaid = true;
  a.rowVersion = rv();
  return ok(toReceipt(d, r), 201);
});

// Prescriptions
on("GET", "/prescriptions/mine", ["Patient"], ({ d, user, q }) => {
  const rows = d.prescriptions.filter((r) => d.appointments.find((a) => a.id === r.appointmentId)?.patientId === user!.profileId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((r) => toRx(d, r));
  return ok(paginate(rows, q));
});
on("GET", "/prescriptions", ["Pharmacist", "Admin"], ({ d, q }) => {
  let rows = d.prescriptions.slice();
  if (q.status) rows = rows.filter((r) => r.status === q.status);
  let out = rows.sort((a, b) => a.createdAt.localeCompare(b.createdAt)).map((r) => toRx(d, r, true));
  if (q.search) out = out.filter((r) => has(r.patient.fullName, q.search));
  return ok(paginate(out, q));
});
on("GET", "/prescriptions/:id", ["Doctor", "Patient", "Pharmacist", "Admin"], ({ d, user, p }) => {
  const r = d.prescriptions.find((x) => x.id === p[0]);
  if (!r) return err(404, "Not found");
  const a = d.appointments.find((x) => x.id === r.appointmentId)!;
  if (user!.role === "Patient" && a.patientId !== user!.profileId) return err(403, "Forbidden");
  return ok(toRx(d, r, user!.role === "Pharmacist" || user!.role === "Admin"));
});
on("PUT", "/prescriptions/:id", ["Doctor"], ({ d, p, body }) => {
  const r = d.prescriptions.find((x) => x.id === p[0]);
  if (!r) return err(404, "Not found");
  if (r.rowVersion !== body?.rowVersion) return err(409, "Conflict", "Someone else changed this record.");
  if (r.status !== "Pending") return err(422, "Already dispensed", "Dispensed prescriptions cannot be edited.");
  if (!body?.items?.length) return err(400, "Validation failed", undefined, { errors: { items: ["Add at least one medicine."] } });
  r.additionalNotes = body.additionalNotes || undefined;
  r.items = body.items.map((i: { medicineId: string; dosage: string; quantity: number }) => ({ id: uid("rxi"), ...i, quantity: Number(i.quantity) }));
  r.rowVersion = rv();
  return ok(toRx(d, r));
});
on("POST", "/prescriptions/:id/dispense", ["Pharmacist"], ({ d, user, p, body }) => {
  const r = d.prescriptions.find((x) => x.id === p[0]);
  if (!r) return err(404, "Not found");
  if (r.rowVersion !== body?.rowVersion || r.status !== "Pending") return err(409, "Conflict", "Already dispensed or edited.");
  const problems = r.items.filter((i) => {
    const m = d.medicines.find((x) => x.id === i.medicineId);
    return !m || m.quantity < i.quantity || toMedicine(m).isExpired;
  });
  if (problems.length) return err(422, "Cannot dispense", "Some items are expired or short on stock.", { items: problems.map((i) => i.id) });
  for (const i of r.items) {
    const m = d.medicines.find((x) => x.id === i.medicineId)!;
    m.quantity -= i.quantity;
    m.rowVersion = rv();
  }
  const ph = d.staff.find((s) => s.id === user!.profileId);
  r.status = "Dispensed";
  r.dispensedAt = new Date().toISOString();
  r.dispensedBy = ph ? fullName(ph) : undefined;
  r.rowVersion = rv();
  const low = r.items.map((i) => toMedicine(d.medicines.find((x) => x.id === i.medicineId)!)).filter((m) => m.isLowStock);
  return ok({ ...toRx(d, r, true), lowStockMedicines: low });
});

// Medicines
on("GET", "/medicines", ["Doctor", "Pharmacist", "Admin"], ({ d, q }) => {
  let rows = d.medicines.map(toMedicine);
  if (q.search) rows = rows.filter((m) => has(m.name, q.search));
  if (truthy(q.lowStockOnly)) rows = rows.filter((m) => m.isLowStock);
  if (truthy(q.inStockOnly)) rows = rows.filter((m) => m.quantity > 0 && !m.isExpired);
  rows.sort((a, b) => a.name.localeCompare(b.name));
  return ok(paginate(rows, q));
});
const medErrors = (b: Record<string, unknown>) => {
  const e: Record<string, string[]> = {};
  if (!String(b.name ?? "").trim()) e.name = ["Name is required."];
  if (!(Number(b.price) >= 0)) e.price = ["Price must be 0 or more."];
  if (!b.expiryDate) e.expiryDate = ["Expiry date is required."];
  if (!(Number(b.quantity) >= 0)) e.quantity = ["Quantity must be 0 or more."];
  if (!(Number(b.lowStockThreshold) >= 0)) e.lowStockThreshold = ["Threshold must be 0 or more."];
  return Object.keys(e).length ? e : null;
};
on("POST", "/medicines", ["Pharmacist", "Admin"], ({ d, body }) => {
  const e = medErrors(body);
  if (e) return err(400, "Validation failed", undefined, { errors: e });
  const m: MMed = { id: uid("med"), name: body.name, price: Number(body.price), expiryDate: body.expiryDate, quantity: Number(body.quantity), lowStockThreshold: Number(body.lowStockThreshold), rowVersion: rv() };
  d.medicines.push(m);
  return ok(toMedicine(m), 201);
});
on("PUT", "/medicines/:id", ["Pharmacist", "Admin"], ({ d, p, body }) => {
  const m = d.medicines.find((x) => x.id === p[0]);
  if (!m) return err(404, "Not found");
  if (m.rowVersion !== body?.rowVersion) return err(409, "Conflict", "Someone else changed this record.");
  const e = medErrors(body);
  if (e) return err(400, "Validation failed", undefined, { errors: e });
  Object.assign(m, { name: body.name, price: Number(body.price), expiryDate: body.expiryDate, quantity: Number(body.quantity), lowStockThreshold: Number(body.lowStockThreshold), rowVersion: rv() });
  return ok(toMedicine(m));
});
on("POST", "/medicines/:id/restock", ["Pharmacist", "Admin"], ({ d, p, body }) => {
  const m = d.medicines.find((x) => x.id === p[0]);
  if (!m) return err(404, "Not found");
  if (!(Number(body?.quantity) > 0)) return err(400, "Validation failed", undefined, { errors: { quantity: ["Enter a quantity above 0."] } });
  m.quantity += Number(body.quantity);
  m.rowVersion = rv();
  return ok(toMedicine(m));
});
on("DELETE", "/medicines/:id", ["Pharmacist", "Admin"], ({ d, p }) => {
  if (d.prescriptions.some((r) => r.items.some((i) => i.medicineId === p[0]))) return err(409, "Conflict", "Used in prescriptions, cannot delete.");
  d.medicines = d.medicines.filter((m) => m.id !== p[0]);
  return ok(undefined, 204);
});

// Receipts
on("GET", "/receipts/mine", ["Patient"], ({ d, user, q }) => {
  const rows = d.receipts.filter((r) => d.appointments.find((a) => a.id === r.appointmentId)?.patientId === user!.profileId).sort((a, b) => b.paidAt.localeCompare(a.paidAt)).map((r) => toReceipt(d, r));
  return ok(paginate(rows, q));
});
on("GET", "/receipts", ["Receptionist", "Admin"], ({ d, q }) => {
  let rows = d.receipts.slice();
  if (q.date) rows = rows.filter((r) => cairoYmd(new Date(r.paidAt)) === q.date);
  if (q.patientId) rows = rows.filter((r) => d.appointments.find((a) => a.id === r.appointmentId)?.patientId === q.patientId);
  return ok(paginate(rows.sort((a, b) => b.paidAt.localeCompare(a.paidAt)).map((r) => toReceipt(d, r)), q));
});
on("GET", "/receipts/:id", ["Receptionist", "Admin", "Patient"], ({ d, user, p }) => {
  const r = d.receipts.find((x) => x.id === p[0]);
  if (!r) return err(404, "Not found");
  if (user!.role === "Patient" && d.appointments.find((a) => a.id === r.appointmentId)?.patientId !== user!.profileId) return err(403, "Forbidden");
  return ok(toReceipt(d, r));
});

// Admin staff
const toStaffRow = (d: DB, s: MStaff): StaffRow => ({ id: s.id, role: s.role, fullName: fullName(s), email: s.email, departmentName: d.departments.find((x) => x.id === s.departmentId)?.name, phoneNumbers: s.phoneNumbers, salary: s.salary, isActive: s.isActive });
const toStaffDetail = (s: MStaff): StaffDetail => ({ ...s });
on("GET", "/admin/staff", ["Admin"], ({ d, q }) => {
  let rows = d.staff.filter((s) => s.role !== "Admin");
  if (q.role) rows = rows.filter((s) => s.role === q.role);
  if (q.departmentId) rows = rows.filter((s) => s.departmentId === q.departmentId);
  if (q.search) rows = rows.filter((s) => has(fullName(s), q.search) || has(s.email, q.search));
  return ok(paginate(rows.map((s) => toStaffRow(d, s)), q));
});
on("GET", "/admin/staff/:id", ["Admin"], ({ d, p }) => {
  const s = d.staff.find((x) => x.id === p[0]);
  return s ? ok(toStaffDetail(s)) : err(404, "Not found");
});
on("POST", "/admin/staff", ["Admin"], ({ d, body }) => {
  const e = validatePerson(body) ?? {};
  if (!body?.email) e.email = ["Email is required."];
  if (!body?.password || body.password.length < 8) e.password = ["Password must be at least 8 characters."];
  if (body?.role === "Doctor" && !body.departmentId) e.departmentId = ["Department is required."];
  if (Object.keys(e).length) return err(400, "Validation failed", undefined, { errors: e });
  if (d.users.some((u) => u.email.toLowerCase() === body.email.toLowerCase()) || (body.nationalId && d.staff.some((s) => s.nationalId === body.nationalId)))
    return err(409, "Conflict", "Duplicate email or national ID.");
  const { password, ...rest } = body;
  const prefix = body.role === "Doctor" ? "doc" : body.role === "Pharmacist" ? "pha" : "rec";
  const s: MStaff = { ...rest, id: uid(prefix), salary: Number(body.salary), appointmentDurationMinutes: body.role === "Doctor" ? Number(body.appointmentDurationMinutes) || 30 : undefined, isActive: true };
  d.staff.push(s);
  d.users.push({ id: `u-${s.id}`, email: s.email, password, role: s.role, profileId: s.id, mustChangePassword: true });
  return ok(toStaffDetail(s), 201);
});
on("PUT", "/admin/staff/:id", ["Admin"], ({ d, p, body }) => {
  const s = d.staff.find((x) => x.id === p[0]);
  if (!s) return err(404, "Not found");
  const e = validatePerson(body);
  if (e) return err(400, "Validation failed", undefined, { errors: e });
  const { role: _r, password: _p, isActive: _a, id: _i, ...rest } = body;
  Object.assign(s, rest, { salary: Number(body.salary) });
  const u = d.users.find((x) => x.profileId === s.id);
  if (u) u.email = s.email;
  return ok(toStaffDetail(s));
});
on("POST", "/admin/staff/:id/deactivate", ["Admin"], ({ d, p }) => {
  const s = d.staff.find((x) => x.id === p[0]);
  if (!s) return err(404, "Not found");
  s.isActive = false;
  return ok(undefined, 204);
});
on("POST", "/admin/staff/:id/activate", ["Admin"], ({ d, p }) => {
  const s = d.staff.find((x) => x.id === p[0]);
  if (!s) return err(404, "Not found");
  s.isActive = true;
  return ok(undefined, 204);
});
on("POST", "/admin/staff/:id/reset-password", ["Admin"], ({ d, p, body }) => {
  const u = d.users.find((x) => x.profileId === p[0]);
  if (!u) return err(404, "Not found");
  if (!body?.newPassword || body.newPassword.length < 8) return err(400, "Validation failed", undefined, { errors: { newPassword: ["Password must be at least 8 characters."] } });
  u.password = body.newPassword;
  u.mustChangePassword = true;
  return ok(undefined, 204);
});

export async function mockHandle(req: { method: string; path: string; query: Record<string, unknown>; body: unknown; token: string | null }): Promise<Res> {
  await new Promise((r) => setTimeout(r, 200 + Math.random() * 200));
  const d = load();
  const q: Record<string, string> = {};
  for (const [k, v] of Object.entries(req.query)) if (v !== undefined && v !== null && v !== "") q[k] = String(v);
  for (const [method, re, roles, h] of routes) {
    if (method !== req.method) continue;
    const m = req.path.match(re);
    if (!m) continue;
    let user: MUser | null = null;
    if (roles !== "public") {
      user = req.token?.startsWith("mock.") ? d.users.find((u) => u.id === req.token!.slice(5)) ?? null : null;
      if (!user) return err(401, "Unauthorized");
      if (roles !== "any" && !roles.includes(user.role)) return err(403, "Forbidden", "You are not allowed to do this.");
    }
    const body = req.body === undefined ? undefined : JSON.parse(JSON.stringify(req.body));
    const res = h({ d, user, q, body, p: m.slice(1) });
    if (req.method !== "GET" && res.status < 400) save();
    return JSON.parse(JSON.stringify(res));
  }
  return err(404, "Not found", `No mock for ${req.method} ${req.path}`);
}
