# HHMS API & Page Specification

Version 1.0 · Oct 12, 2026 · For the backend and frontend teams

This document lists every page of the HHMS web app, what each page does, what information it needs, and which API endpoint serves it. It follows the sprint order on the Trello board. Until the backend is ready, the frontend can build against mock responses that match the shapes below, and once controllers exist, Swagger/OpenAPI replaces this document as the source of truth.

## 1. Conventions

| Topic | Rule |
| --- | --- |
| Base URL | `/api/v1`, JSON only, camelCase property names |
| Auth | `Authorization: Bearer <jwt>` on every request except register and login. The token carries `userId`, `role` and the profile id (`patientId`, `doctorId`, ...). "Mine" endpoints and ownership checks use the token, never an id sent by the client. |
| Ids and dates | Ids are GUIDs. Date-times are ISO 8601 UTC (`2026-11-02T09:30:00Z`). Dates of birth and expiry dates are `yyyy-MM-dd`. Schedule times are `HH:mm`. The frontend converts to local time (Africa/Cairo) for display. |
| Enums | Sent as strings (see below). |
| Lists | Paged with `?page=1&pageSize=20`, returned as `{ items, page, pageSize, totalCount }`. |
| Errors | ASP.NET `ProblemDetails` JSON. `400` validation (with an `errors` map per field), `401` not logged in, `403` wrong role or not your record, `404` not found, `409` conflict (slot taken, stale `rowVersion`, duplicate), `422` business rule broken. |
| Concurrent edits | Records with `RowVersion` return `rowVersion` (base64 string). The client sends it back unchanged on every update. A stale value gets `409`; the UI reloads the record and tells the user someone else changed it. |
| Person fields | Shared block used in many bodies: `firstName, lastName, nationalId, passportNumber, gender, dateOfBirth, country, governorate, phoneNumbers[]`. Either `nationalId` or `passportNumber` is required (tourists use passport). |
| Medical data | Never included in any response to a Receptionist. |

**Enums (agreed):** Gender: `Male`, `Female`. BloodType: `APositive`, `ANegative`, `BPositive`, `BNegative`, `ABPositive`, `ABNegative`, `OPositive`, `ONegative`. AppointmentStatus: `Scheduled`, `CheckedIn`, `Completed`, `Cancelled`. PrescriptionStatus: `Pending`, `Dispensed`. PaymentMethod: `Cash`, `Card`. Role: `Patient`, `Doctor`, `Receptionist`, `Pharmacist`, `Admin`. DayOfWeek: .NET names (`Sunday` ... `Saturday`).

## 2. Auth (Sprint 2)

### Pages

| Page | Who | What it does | Info it needs |
| --- | --- | --- | --- |
| Login `/login` | Everyone | Signs in, then redirects by role: patient → `/portal`, doctor → `/doctor/schedule`, receptionist → `/reception/checkin`, pharmacist → `/pharmacy/queue`, admin → `/admin/staff` | email, password |
| Sign-up `/signup` | Public (patients) | Patient creates their own account and patient record | email, password + confirmation, Person fields (at least one phone) |

### Endpoints

| Endpoint | Roles | Request | Response and rules |
| --- | --- | --- | --- |
| `POST /auth/register` | Public | `email, password` + Person fields | Creates ApplicationUser (Patient role), Person and Patient. Reception already creates accounts for walk-ins (section 4), so if the email or national ID/passport already exists, return `409` and tell the person to log in. `201` on success. |
| `POST /auth/login` | Public | `email, password` | `{ token, expiresAt, user: { id, email, role, displayName, profileId, mustChangePassword } }`. `401` on bad credentials, same message for wrong email or password. `mustChangePassword` is true for accounts that reception created; the frontend sends those users to change their password first. |
| `GET /auth/me` | Any | none | The same `user` object; used on page reload to restore the session. |
| `POST /auth/change-password` | Any | `currentPassword, newPassword` | `204`. Clears `mustChangePassword`. |

Logout is client-side (delete the token). The token is a single long-lived JWT (about 8 hours) with no refresh token.

## 3. Admin (Sprint 3)

### Pages

| Page | Who | What it does | Info it needs |
| --- | --- | --- | --- |
| Staff `/admin/staff` | Admin | Lists staff with filters; create, edit, deactivate, reset password | Table shows name, role, department, email, phones, salary, active status. Create form: role (Doctor/Receptionist/Pharmacist), email, temporary password, Person fields, salary; doctors also need department and appointment duration in minutes. |
| Departments `/admin/departments` | Admin | List, add, edit, delete departments | name, consultation fee |
| Working hours `/admin/doctors/[id]/schedule` | Admin | Weekly grid for one doctor: per day on/off plus start and end time, saved in one click | doctor id; up to 7 rows of day, start, end. If the save is rejected, shows the list of conflicting appointments. |
|  |  |  |  |

### Endpoints

| Endpoint | Roles | Request | Response and rules |
| --- | --- | --- | --- |
| `GET /admin/staff?role=&departmentId=&search=&page=` | Admin | query only | Paged `{ id, role, fullName, email, departmentName, phoneNumbers, salary, isActive }` |
| `GET /admin/staff/{id}` | Admin | none | Full record including Person fields. For doctors, this id is the same doctor id used in `/doctors/{id}`. |
| `POST /admin/staff` | Admin | `role, email, password, salary` + Person fields; doctors also `departmentId, appointmentDurationMinutes` | `201`. Creates user, person and role row together. `409` on duplicate email or national ID. |
| `PUT /admin/staff/{id}` | Admin | same as create without `role` and `password` | `200` |
| `POST /admin/staff/{id}/deactivate`, `/activate` | Admin | none | Blocks or restores login (Identity lockout). Records stay because appointments reference them; no hard delete. |
| `POST /admin/staff/{id}/reset-password` | Admin | `newPassword` | `204` |
| `GET /departments` | Any logged in | none | `[{ id, name, consultationFee }]`; also used by the booking screens |
| `POST /departments` | Admin | `name, consultationFee` | `201` |
| `PUT /departments/{id}` | Admin | `name, consultationFee` | `200` |
| `DELETE /departments/{id}` | Admin | none | `409` if the department still has doctors |
| `GET /doctors?departmentId=` | Any logged in | query only | `[{ id, fullName, departmentId, departmentName, consultationFee, appointmentDurationMinutes }]`. Never includes salary. |
| `GET /doctors/{id}/schedule` | Any logged in | none | `[{ dayOfWeek, startTime, endTime }]`, one row per working day |
| `PUT /doctors/{id}/schedule` | Admin | `[{ dayOfWeek, startTime, endTime }]` | Replaces the whole week. One entry per day, end after start. Days not listed mean not working. Rejected with `409` if any future non-cancelled appointment falls on a day or time range that is being removed or shortened; the error lists those appointments. Only times with no bookings can be changed. |

## 4. Patients (Sprint 4)

### Pages

| Page | Who | What it does | Info it needs |
| --- | --- | --- | --- |
| My profile `/portal/profile` | Patient | View and edit own personal details | Editable: name, gender, date of birth, country, governorate, phones. National ID/passport shown read-only; changing it goes through reception. Medical background lives on the history page, not here. |
| Register walk-in `/reception/patients/new` | Receptionist | Creates a patient record and a login account on the patient's behalf | Person fields + email. The system generates a temporary password and shows it once so reception can hand it to the patient, who must change it at first login. If the person already exists, shows the existing patient and offers to open it. On save, offers "Book appointment". |
| Patient search `/reception/patients` | Receptionist | Search box (name, phone, national ID or passport) with a results table | Shows name, ID/passport, phones, date of birth. No medical data. Row actions: view/edit contact details, book appointment. |
| Patient contact detail `/reception/patients/[id]` | Receptionist | View and edit contact details | Person fields |

### Endpoints

| Endpoint | Roles | Request | Response and rules |
| --- | --- | --- | --- |
| `GET /patients/me` | Patient | none | Person fields + `email, id, rowVersion`. No medical data. |
| `PUT /patients/me` | Patient | editable Person fields + `rowVersion` | `200` |
| `POST /patients` | Receptionist | Person fields + `email` | `201` with the patient plus a one-time `temporaryPassword`. Creates ApplicationUser (Patient role, `mustChangePassword`), Person and Patient together. `409` on duplicate national ID/passport or email; the error body includes the existing `patientId`. |
| `GET /patients?search=&page=` | Receptionist, Admin | query only | Paged contact-only list (shape below) |
| `GET /patients/{id}` | Receptionist, Admin | none | Contact-only record |
| `PUT /patients/{id}` | Receptionist | Person fields + `rowVersion` | `200` |

Contact-only shape: `{ id, fullName, nationalId, passportNumber, gender, dateOfBirth, country, governorate, phoneNumbers[], rowVersion }`.

## 5. Appointments (Sprints 5 and 6)

### Pages

| Page | Who | What it does | Info it needs |
| --- | --- | --- | --- |
| Book `/portal/book` | Patient | Step flow: department → doctor → date → time slot → complaint → confirm | `departmentId`, `doctorId`, date, chosen slot, optional complaint. Shows doctor name, consultation fee and available slots. Ends on a confirmation screen (the email/message comes from n8n). |
| My appointments `/portal/appointments` | Patient | Upcoming and past tabs; cancel button on scheduled ones | Date/time, doctor, department, status, paid or not |
| Book for patient `/reception/book` | Receptionist | Same flow, but first pick the patient by search or register a walk-in | Same as above plus `patientId` |
| Check-in `/reception/checkin` | Receptionist | Today's appointments with filter by doctor and search by patient name; Check in and Cancel buttons | Time, patient, doctor, status, paid or not |
| Doctor schedule `/doctor/schedule` | Doctor | Own appointments for a chosen day (defaults to today) in time order | Time, patient name, complaint, status. Each row links to `/doctor/patients/[patientId]/history?appointmentId=...`. |

### Endpoints

| Endpoint | Roles | Request | Response and rules |
| --- | --- | --- | --- |
| `GET /doctors/{id}/availability?date=yyyy-MM-dd` | Any logged in | query only | `{ date, slotMinutes, slots: [{ start, isAvailable }] }`. Slots come from the doctor's schedule for that weekday, stepped by `appointmentDurationMinutes`, minus non-cancelled appointments; past slots are unavailable. An empty list means the doctor doesn't work that day. |
| `POST /appointments` | Patient, Receptionist | `doctorId, appointmentDateTime` (a slot start), `complaint?`, `patientId` (Receptionist only; for a Patient it comes from the token) | `201` AppointmentSummary. `409` slot taken; `422` not a valid slot or in the past. Triggers the booking confirmation. |
| `GET /appointments/mine?status=&from=&to=&page=` | Patient | query only | Paged AppointmentSummary, newest first |
| `GET /appointments?date=&doctorId=&patientId=&status=&isPaid=&page=` | Receptionist, Admin | query only | Paged AppointmentSummary, no diagnosis or notes |
| `GET /doctors/me/appointments?date=` (or `from`/`to`) | Doctor | query only | AppointmentSummary list for the logged-in doctor, in time order |
| `GET /appointments/{id}` | Patient (own), Doctor (own), Receptionist, Admin | none | Single appointment. Diagnosis and notes are returned only to the patient, the doctor and Admin. |
| `POST /appointments/{id}/cancel` | Patient (own), Receptionist | `reason?, rowVersion` | Allowed at any time while the appointment is `Scheduled`, otherwise `409`. Triggers the cancellation confirmation. Receipts stay on record; refunds are handled outside the system. |
| `POST /appointments/{id}/check-in` | Receptionist | `rowVersion` | `Scheduled` → `CheckedIn`, only on the appointment's day |

AppointmentSummary: `{ id, appointmentDateTime, status, complaint, isPaid, doctor: { id, fullName, departmentName }, patient: { id, fullName }, prescriptionId, rowVersion }`.

## 6. Medical history (Sprint 7)

A doctor can only open the history of patients who have (or had) an appointment with them. Patients see their own history read-only.

### Pages

| Page | Who | What it does | Info it needs |
| --- | --- | --- | --- |
| My patients `/doctor/patients` | Doctor | Searchable list of the doctor's own patients | name, last visit date |
| Patient history `/doctor/patients/[patientId]/history` | Doctor | Top: background card (allergies, chronic diseases, blood type, past surgeries, family history), editable. Below: visit list, newest first. Opened from an appointment, it shows the visit editor for that appointment with complaint, diagnosis and notes, plus Save and Write prescription buttons. Saving a diagnosis marks the visit as completed. | Background fields; per visit: date, doctor, complaint, diagnosis, notes, status, prescription link |
| My history `/portal/history` | Patient | Same content as above, strictly read-only | Same data |

### Endpoints

| Endpoint | Roles | Request | Response and rules |
| --- | --- | --- | --- |
| `GET /doctors/me/patients?search=&page=` | Doctor | query only | Contact-only patient shape + `lastVisitAt`, limited to this doctor's patients |
| `GET /patients/{id}/medical-history` | Doctor (own patients only), Admin | none | `{ patient: { id, fullName, dateOfBirth, gender }, background: { allergies, chronicDiseases, bloodType, pastSurgeries, familyHistory, rowVersion }, visits: [{ appointmentId, appointmentDateTime, doctorName, status, complaint, diagnosis, notes, prescriptionId, rowVersion }] }`. `403` if the doctor has no appointment with this patient. |
| `GET /patients/me/medical-history` | Patient | none | Same shape for the logged-in patient |
| `PUT /patients/{id}/background` | Doctor (own patients) | `allergies, chronicDiseases, bloodType, pastSurgeries, familyHistory, rowVersion` | `200`; `409` if stale |
| `PUT /appointments/{id}/visit` | Doctor (that appointment's doctor) | `complaint, diagnosis, notes, rowVersion` | Allowed while `CheckedIn` or `Completed`. Saving a non-empty `diagnosis` moves a `CheckedIn` appointment to `Completed` in the same call. `409` if stale. |

## 7. Prescriptions (Sprint 8)

One prescription per appointment. It starts as `Pending` and is filled later by the pharmacist.

### Pages

| Page | Who | What it does | Info it needs |
| --- | --- | --- | --- |
| Write prescription `/doctor/appointments/[id]/prescription` | Doctor | Search medicines and add rows; edit while still pending | Per item: medicine (search by name, shows in-stock indicator), dosage text, quantity; plus additional notes |
| My prescriptions `/portal/prescriptions` | Patient | List of own prescriptions with detail view | Date, doctor, items (medicine, dosage, quantity), status, dispensed date |

### Endpoints

| Endpoint | Roles | Request | Response and rules |
| --- | --- | --- | --- |
| `POST /appointments/{id}/prescription` | Doctor (that appointment's doctor) | `additionalNotes?, items: [{ medicineId, dosage, quantity }]` | `201` Prescription. At least one item; quantity greater than 0. `409` if the appointment already has a prescription. |
| `PUT /prescriptions/{id}` | Doctor (author) | same body + `rowVersion` | Only while `Pending`, otherwise `409` |
| `GET /prescriptions/{id}` | Patient (own), Doctor (author), Pharmacist, Admin | none | Prescription |
| `GET /prescriptions/mine?page=` | Patient | query only | Paged Prescription list, newest first |
| `GET /medicines?search=&inStockOnly=` | Doctor, Pharmacist, Admin | query only | Medicine list (shape in section 8); used by the doctor's autocomplete |

Prescription: `{ id, appointmentId, createdAt, status, additionalNotes, doctor: { id, fullName }, patient: { id, fullName }, items: [{ id, medicineId, medicineName, dosage, quantity, unitPrice, stockQuantity?, isExpired? }], dispensedAt, dispensedBy, rowVersion }`.

`stockQuantity` and `isExpired` on each item are returned only to pharmacists, so the dispense screen can show current stock and block expired medicine.

## 8. Pharmacy (Sprint 9)

### Pages

| Page | Who | What it does | Info it needs |
| --- | --- | --- | --- |
| Queue `/pharmacy/queue` | Pharmacist | Pending prescriptions, oldest first, with search by patient name; low-stock banner on top | Patient name, doctor, date, item count |
| Dispense `/pharmacy/prescriptions/[id]` | Pharmacist | Shows the items with current stock beside each; Dispense button, blocked and highlighted if any item lacks stock or is expired | Prescription detail + current quantity per medicine |
| Stock `/pharmacy/stock` | Pharmacist | Medicine table with search, low-stock filter, add, edit, restock | name, price, expiry date, quantity, low-stock threshold |

### Endpoints

| Endpoint | Roles | Request | Response and rules |
| --- | --- | --- | --- |
| `GET /prescriptions?status=Pending&search=&page=` | Pharmacist, Admin | query only | Paged Prescription list for the queue |
| `POST /prescriptions/{id}/dispense` | Pharmacist | `rowVersion` | One transaction: lowers each `Medicine.Quantity` by the item quantity, sets `Status=Dispensed`, `DispensedAt`, and `PharmacistId` from the token. `409` if stale or already dispensed. `422` with the list of problem items if any medicine is expired or stock is insufficient (nothing changes). Response includes `lowStockMedicines: [...]` for any medicine that fell below its threshold, which also triggers the n8n alert. |
| `GET /medicines?search=&lowStockOnly=&inStockOnly=&page=` | Pharmacist, Admin (Doctor read-only) | query only | Paged `{ id, name, price, expiryDate, quantity, lowStockThreshold, isLowStock, isExpired, rowVersion }`. Low stock means quantity below threshold. |
| `POST /medicines` | Pharmacist, Admin | `name, price, expiryDate, quantity, lowStockThreshold` | `201` |
| `PUT /medicines/{id}` | Pharmacist, Admin | same fields + `rowVersion` | `200`; `409` if stale |
| `POST /medicines/{id}/restock` | Pharmacist, Admin | `quantity` | Adds to the current quantity atomically, so two restocks never overwrite each other |
| `DELETE /medicines/{id}` | Pharmacist, Admin | none | `409` if it appears in any prescription item |

## 9. Billing (Sprint 10)

The amount is the department's consultation fee at payment time, copied into the receipt. The client never sends an amount.

### Pages

| Page | Who | What it does | Info it needs |
| --- | --- | --- | --- |
| Payments `/reception/payments` | Receptionist | Today's unpaid appointments (scheduled, checked-in or completed; payment can be taken before check-in); Pay opens a dialog and then a printable receipt | Appointment id, payment method (Cash/Card). Shows patient, doctor, department, fee. |
| My receipts `/portal/receipts` | Patient | List of own receipts with detail and print view | Date, doctor, department, method, amount |

### Endpoints

| Endpoint | Roles | Request | Response and rules |
| --- | --- | --- | --- |
| `POST /appointments/{id}/receipt` | Receptionist | `paymentMethod` | `201` Receipt. Allowed for `Scheduled`, `CheckedIn` or `Completed` appointments, so payment can come before check-in. `ReceptionistId` comes from the token. `409` if already paid; `422` if the appointment is cancelled. |
| `GET /receipts/{id}` | Receptionist, Patient (own), Admin | none | Receipt |
| `GET /receipts/mine?page=` | Patient | query only | Paged Receipt list |
| `GET /receipts?date=&patientId=&page=` | Receptionist, Admin | query only | Paged Receipt list |

Receipt: `{ id, appointmentId, patientName, doctorName, departmentName, appointmentDateTime, paymentMethod, amount, paidAt, receptionistName }`. Currency is EGP. The receipt print view can be an HTML page printed from the browser; a server-made PDF is optional.

## 10. Automation with n8n (Sprint 10)

Split so the backend doesn't have to send emails itself:

| Automation | How it gets its data |
| --- | --- |
| Booking and cancellation confirmations | After a successful `POST /appointments` or cancel, the backend posts an event to an n8n webhook: `{ event, appointmentId, appointmentDateTime, doctorName, departmentName, patient: { fullName, email, phone } }`. Walk-in patients have no email, so n8n falls back to the phone number. |
| Appointment reminders | A scheduled n8n workflow calls `GET /automation/appointments/upcoming?withinHours=24` using an API key header (`X-Api-Key`), not a user login. It returns the same payload shape for scheduled appointments in that window. |
| Low-stock alerts to the pharmacist | After a dispense or stock change leaves a medicine below its threshold, the backend posts `{ event: "lowStock", medicineId, name, quantity, lowStockThreshold }` to an n8n webhook. |

Webhook URLs and the API key live in backend configuration, never in the frontend.
