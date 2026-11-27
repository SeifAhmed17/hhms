export type Role = "Patient" | "Doctor" | "Receptionist" | "Pharmacist" | "Admin";
export type Gender = "Male" | "Female";
export type BloodType =
  | "APositive"
  | "ANegative"
  | "BPositive"
  | "BNegative"
  | "ABPositive"
  | "ABNegative"
  | "OPositive"
  | "ONegative";
export type AppointmentStatus = "Scheduled" | "CheckedIn" | "Completed" | "Cancelled";
export type PrescriptionStatus = "Pending" | "Dispensed";
export type PaymentMethod = "Cash" | "Card";
export type DayOfWeek =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface Paged<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface PersonFields {
  firstName: string;
  lastName: string;
  nationalId?: string;
  passportNumber?: string;
  gender: Gender;
  dateOfBirth: string;
  country: string;
  governorate?: string;
  phoneNumbers: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  displayName: string;
  profileId: string;
  mustChangePassword: boolean;
}
export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: AuthUser;
}
export interface Department {
  id: string;
  name: string;
  consultationFee: number;
}
export interface Doctor {
  id: string;
  fullName: string;
  departmentId: string;
  departmentName: string;
  consultationFee: number;
  appointmentDurationMinutes: number;
}
export interface ScheduleDay {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}
export interface Availability {
  date: string;
  slotMinutes: number;
  slots: { start: string; isAvailable: boolean }[];
}

export interface AppointmentSummary {
  id: string;
  appointmentDateTime: string;
  status: AppointmentStatus;
  complaint?: string;
  isPaid: boolean;
  doctor: { id: string; fullName: string; departmentName: string };
  patient: { id: string; fullName: string };
  prescriptionId?: string;
  rowVersion: string;
}
export interface AppointmentDetail extends AppointmentSummary {
  diagnosis?: string;
  notes?: string;
}

export interface ContactPatient extends PersonFields {
  id: string;
  fullName: string;
  rowVersion: string;
}

export interface Background {
  allergies?: string;
  chronicDiseases?: string;
  bloodType?: BloodType;
  pastSurgeries?: string;
  familyHistory?: string;
  rowVersion: string;
}
export interface Visit {
  appointmentId: string;
  appointmentDateTime: string;
  doctorName: string;
  status: AppointmentStatus;
  complaint?: string;
  diagnosis?: string;
  notes?: string;
  prescriptionId?: string;
  rowVersion: string;
}
export interface MedicalHistory {
  patient: { id: string; fullName: string; dateOfBirth: string; gender: Gender };
  background: Background;
  visits: Visit[];
}

export interface Medicine {
  id: string;
  name: string;
  price: number;
  expiryDate: string;
  quantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  isExpired: boolean;
  rowVersion: string;
}
export interface PrescriptionItem {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  quantity: number;
  unitPrice: number;
  stockQuantity?: number;
  isExpired?: boolean;
}
export interface Prescription {
  id: string;
  appointmentId: string;
  createdAt: string;
  status: PrescriptionStatus;
  additionalNotes?: string;
  doctor: { id: string; fullName: string };
  patient: { id: string; fullName: string };
  items: PrescriptionItem[];
  dispensedAt?: string;
  dispensedBy?: string;
  rowVersion: string;
}

export interface Receipt {
  id: string;
  appointmentId: string;
  patientName: string;
  doctorName: string;
  departmentName: string;
  appointmentDateTime: string;
  paymentMethod: PaymentMethod;
  amount: number;
  paidAt: string;
  receptionistName: string;
}

export interface StaffRow {
  id: string;
  role: Role;
  fullName: string;
  email: string;
  departmentName?: string;
  phoneNumbers: string[];
  salary: number;
  isActive: boolean;
}
export interface StaffDetail extends PersonFields {
  id: string;
  role: Role;
  email: string;
  salary: number;
  departmentId?: string;
  appointmentDurationMinutes?: number;
  isActive: boolean;
}

export interface ProblemDetails {
  title?: string;
  detail?: string;
  status?: number;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}
