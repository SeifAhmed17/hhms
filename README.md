# Hospital Management System

A web application covering the patient journey: registration, appointment booking, diagnosis and medical history, prescriptions, and pharmacy dispensing. It acts as a secure electronic medical record (EMR) for hospital staff, and it gives patients a portal to manage their own appointments and view their records.

## Objectives

- Keep complete and secure electronic medical records for every patient.
- Coordinate appointments between patients, doctors and departments.
- Manage prescriptions and link them to pharmacy inventory.
- Protect sensitive medical data through role-based access control, and handle concurrent updates to the same patient record safely.

## Team

**Team Leader:** Seif Ahmed — 01119470160

| Member | Role |
|---|---|
| Seif Ahmed | Backend |
| Moamen Mahmoud | Backend |
| Mohammed Ali | Backend |
| Mohammed Mahmoud | Backend |
| Marwan Saber | Backend (automation) |
| Patrick Hany | Frontend / Design |
| Mohammed Hany | Frontend / Design |
| Omar Essam | Testing / QA |
| Ahmed Gamal | Testing / QA |

## Features

The system has five user roles. Each role only sees what it needs.

| Role | What they can do |
|---|---|
| **Patient** | Sign up online and manage their profile · Book and cancel their own appointments · View their own medical history (read-only) · View their own prescriptions |
| **Doctor** | See their own appointment schedule · Read and write the medical history of **their own patients only** · Write prescriptions |
| **Receptionist** | Register walk-in patients · Book and cancel appointments on a patient's behalf · Check patients in · Search patients (contact details only, no medical data) |
| **Pharmacist** | See prescriptions waiting to be filled · Dispense medication (stock updates automatically) · Manage medicine stock · Receive low-stock alerts |
| **Admin** | Full access to the system · Manage staff accounts and departments · Set doctors' working hours |

**Modules:** Patient registration & medical history · Doctor & department management · Appointment scheduling & cancellation · Prescriptions & medication records · Pharmacy inventory

**Automations (n8n):** Appointment reminders · Booking and cancellation confirmations · Low-stock alerts to the pharmacist

**Future work (out of the current scope):** Billing and invoices · Hospital admission

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core (C#) |
| Database | SQL Server |
| Frontend | Next.js (React) |
| Automation | n8n |

**Why this stack**

- **The team already knows C#**, so the backend team can start building right away.
- **Security is built in.** ASP.NET Core has built-in authentication and role-based authorization, which suits a system holding sensitive medical records.
- **Modern and in demand.** These tools are widely used in industry.

## How We Work

- **Backend:** the backend team assigns tasks as the project progresses.
- **Frontend:** one designer builds the staff screens and the other builds the patient portal.
- **Automation:** Marwan Saber builds the n8n workflows.
- **Testing:** Omar Essam and Ahmed Gamal test each feature as it's finished, report bugs, and track the team's progress.
- Credit for every finished task is recorded in the [Contributions](#contributions) table below.

## Timeline

A weekly plan from project start to the final demo. The last two weeks have no new features and are reserved for testing, bug fixes and demo preparation.

| Week | Dates | Backend | Frontend | Testing |
|---|---|---|---|---|
| 1 | Sep 28 – Oct 4 | Data models, database schema, configuration | Color palette, fonts, app identity | Set up progress tracking |
| 2 | Oct 5 – 11 | Accounts, login, roles | Login and sign-up screens | Test login and roles |
| 3 | Oct 12 – 18 | Admin: staff, departments, doctors' hours | Admin screens | Test the previous week's features |
| 4 | Oct 19 – 25 | Patients: sign-up, profile, walk-ins, search | Patient profile and reception screens | Test the previous week's features |
| 5 | Oct 26 – Nov 1 | Appointments: booking and cancellation | Booking screens | Test the previous week's features |
| 6 | Nov 2 – 8 | Doctor schedule, check-in | Doctor schedule screen | Test the previous week's features |
| 7 | Nov 9 – 15 | Medical history | Medical history screens | Test the previous week's features |
| 8 | Nov 16 – 22 | Prescriptions | Prescription screens | Test the previous week's features |
| 9 | Nov 23 – 29 | Pharmacy: queue, dispensing, stock | Pharmacy screens | Test the previous week's features |
| 10 | Nov 30 – Dec 6 | n8n automations, catch-up | Polish, responsive layout | Test the previous week's features |
| 11 | Dec 7 – 13 | Catch-up, integration | Catch-up, integration | Full end-to-end test |
| 12–13 | Dec 14 – 27 | **No new features:** testing, bug fixes, demo and presentation rehearsal | | |

## Contributions

| Task | Done by | Date |
|---|---|---|
| Project planning (scope, roles, features, timeline, tech stack) | Whole team | Sep 28, 2026 |
