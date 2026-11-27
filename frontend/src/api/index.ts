import { request } from "./client";
import type {
  AppointmentDetail,
  AppointmentStatus,
  AppointmentSummary,
  AuthUser,
  Availability,
  Background,
  ContactPatient,
  Department,
  Doctor,
  LoginResponse,
  MedicalHistory,
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

export * from "./types";
export { ApiError, session, USE_MOCKS } from "./client";

type PageQ = { page?: number; pageSize?: number };

// ---------- Auth ----------
export const auth = {
  register: (body: { email: string; password: string } & PersonFields) =>
    request<void>("/auth/register", { method: "POST", body, auth: false }),
  login: (body: { email: string; password: string }) =>
    request<LoginResponse>("/auth/login", { method: "POST", body, auth: false }),
  me: () => request<AuthUser>("/auth/me"),
  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    request<void>("/auth/change-password", { method: "POST", body }),
};

// ---------- Departments & doctors ----------
export const departments = {
  list: () => request<Department[]>("/departments"),
  create: (body: { name: string; consultationFee: number }) =>
    request<Department>("/departments", { method: "POST", body }),
  update: (id: string, body: { name: string; consultationFee: number }) =>
    request<Department>(`/departments/${id}`, { method: "PUT", body }),
  remove: (id: string) => request<void>(`/departments/${id}`, { method: "DELETE" }),
};

export const doctors = {
  list: (q: { departmentId?: string } = {}) => request<Doctor[]>("/doctors", { query: q }),
  availability: (id: string, date: string) =>
    request<Availability>(`/doctors/${id}/availability`, { query: { date } }),
  schedule: (id: string) => request<ScheduleDay[]>(`/doctors/${id}/schedule`),
  saveSchedule: (id: string, body: ScheduleDay[]) =>
    request<ScheduleDay[]>(`/doctors/${id}/schedule`, { method: "PUT", body }),
  myAppointments: (date: string) =>
    request<AppointmentSummary[]>("/doctors/me/appointments", { query: { date } }),
  myPatients: (q: { search?: string } & PageQ) =>
    request<Paged<ContactPatient & { lastVisitAt: string }>>("/doctors/me/patients", { query: q }),
};

// ---------- Patients ----------
export const patients = {
  me: () => request<ContactPatient & { email: string }>("/patients/me"),
  updateMe: (body: Omit<PersonFields, "nationalId" | "passportNumber"> & { rowVersion: string }) =>
    request<ContactPatient & { email: string }>("/patients/me", { method: "PUT", body }),
  myHistory: () => request<MedicalHistory>("/patients/me/medical-history"),
  search: (q: { search?: string } & PageQ) =>
    request<Paged<ContactPatient>>("/patients", { query: q }),
  get: (id: string) => request<ContactPatient>(`/patients/${id}`),
  update: (id: string, body: PersonFields & { rowVersion: string }) =>
    request<ContactPatient>(`/patients/${id}`, { method: "PUT", body }),
  create: (body: { email: string } & PersonFields) =>
    request<ContactPatient & { temporaryPassword: string }>("/patients", { method: "POST", body }),
  history: (id: string) => request<MedicalHistory>(`/patients/${id}/medical-history`),
  updateBackground: (id: string, body: Omit<Background, "rowVersion"> & { rowVersion: string }) =>
    request<Background>(`/patients/${id}/background`, { method: "PUT", body }),
};

// ---------- Appointments ----------
export const appointments = {
  create: (body: {
    doctorId: string;
    appointmentDateTime: string;
    complaint?: string;
    patientId?: string;
  }) => request<AppointmentSummary>("/appointments", { method: "POST", body }),
  mine: (q: { status?: AppointmentStatus; from?: string; to?: string } & PageQ) =>
    request<Paged<AppointmentSummary>>("/appointments/mine", { query: q }),
  list: (
    q: {
      date?: string;
      doctorId?: string;
      patientId?: string;
      status?: AppointmentStatus;
      isPaid?: boolean;
    } & PageQ,
  ) => request<Paged<AppointmentSummary>>("/appointments", { query: q }),
  get: (id: string) => request<AppointmentDetail>(`/appointments/${id}`),
  cancel: (id: string, body: { reason?: string; rowVersion: string }) =>
    request<AppointmentSummary>(`/appointments/${id}/cancel`, { method: "POST", body }),
  checkIn: (id: string, body: { rowVersion: string }) =>
    request<AppointmentSummary>(`/appointments/${id}/check-in`, { method: "POST", body }),
  updateVisit: (
    id: string,
    body: { complaint?: string; diagnosis?: string; notes?: string; rowVersion: string },
  ) => request<AppointmentDetail>(`/appointments/${id}/visit`, { method: "PUT", body }),
  createPrescription: (
    id: string,
    body: { additionalNotes?: string; items: { medicineId: string; dosage: string; quantity: number }[] },
  ) => request<Prescription>(`/appointments/${id}/prescription`, { method: "POST", body }),
  pay: (id: string, body: { paymentMethod: PaymentMethod }) =>
    request<Receipt>(`/appointments/${id}/receipt`, { method: "POST", body }),
};

// ---------- Prescriptions ----------
export const prescriptions = {
  get: (id: string) => request<Prescription>(`/prescriptions/${id}`),
  update: (
    id: string,
    body: {
      additionalNotes?: string;
      items: { medicineId: string; dosage: string; quantity: number }[];
      rowVersion: string;
    },
  ) => request<Prescription>(`/prescriptions/${id}`, { method: "PUT", body }),
  mine: (q: PageQ = {}) => request<Paged<Prescription>>("/prescriptions/mine", { query: q }),
  list: (q: { status?: "Pending" | "Dispensed"; search?: string } & PageQ) =>
    request<Paged<Prescription>>("/prescriptions", { query: q }),
  dispense: (id: string, body: { rowVersion: string }) =>
    request<Prescription & { lowStockMedicines: Medicine[] }>(`/prescriptions/${id}/dispense`, {
      method: "POST",
      body,
    }),
};

// ---------- Medicines ----------
type MedicineInput = {
  name: string;
  price: number;
  expiryDate: string;
  quantity: number;
  lowStockThreshold: number;
};
export const medicines = {
  list: (q: { search?: string; lowStockOnly?: boolean; inStockOnly?: boolean } & PageQ) =>
    request<Paged<Medicine>>("/medicines", { query: q }),
  create: (body: MedicineInput) => request<Medicine>("/medicines", { method: "POST", body }),
  update: (id: string, body: MedicineInput & { rowVersion: string }) =>
    request<Medicine>(`/medicines/${id}`, { method: "PUT", body }),
  restock: (id: string, body: { quantity: number }) =>
    request<Medicine>(`/medicines/${id}/restock`, { method: "POST", body }),
  remove: (id: string) => request<void>(`/medicines/${id}`, { method: "DELETE" }),
};

// ---------- Receipts ----------
export const receipts = {
  get: (id: string) => request<Receipt>(`/receipts/${id}`),
  list: (q: { date?: string; patientId?: string } & PageQ) =>
    request<Paged<Receipt>>("/receipts", { query: q }),
  mine: (q: PageQ = {}) => request<Paged<Receipt>>("/receipts/mine", { query: q }),
};

// ---------- Admin ----------
type StaffInput = PersonFields & {
  email: string;
  salary: number;
  departmentId?: string;
  appointmentDurationMinutes?: number;
};
export const staff = {
  list: (q: { role?: Role; departmentId?: string; search?: string } & PageQ) =>
    request<Paged<StaffRow>>("/admin/staff", { query: q }),
  get: (id: string) => request<StaffDetail>(`/admin/staff/${id}`),
  create: (body: StaffInput & { role: Role; password: string }) =>
    request<StaffDetail>("/admin/staff", { method: "POST", body }),
  update: (id: string, body: StaffInput) =>
    request<StaffDetail>(`/admin/staff/${id}`, { method: "PUT", body }),
  deactivate: (id: string) => request<void>(`/admin/staff/${id}/deactivate`, { method: "POST" }),
  activate: (id: string) => request<void>(`/admin/staff/${id}/activate`, { method: "POST" }),
  resetPassword: (id: string, body: { newPassword: string }) =>
    request<void>(`/admin/staff/${id}/reset-password`, { method: "POST", body }),
};
