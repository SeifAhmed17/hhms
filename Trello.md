# Trello & Agile Plan

We work in **one-week sprints** and track every task on our public Trello board.

| | |
|---|---|
| **Board** | [HHMS](https://trello.com/b/mb3fqB6Y) |
| **Workspace** | [HHMS](https://trello.com/w/hhms1) |
| **Visibility** | Public: anyone with the link can view it |
| **Sprint length** | 1 week (Monday – Sunday) |
| **Sprints** | 13, from Sep 28 to Dec 27, 2026 |
| **Cards** | 66 planned tasks |

## Board Setup

### Lists

| List | Meaning |
|---|---|
| **Backlog** | Every planned task that isn't in the current sprint |
| **Sprint** | Tasks picked for this week |
| **In Progress** | Someone is working on it right now |
| **Testing** | Finished by the developer, waiting for the testers (Omar Essam, Ahmed Gamal) |
| **Done** | Tested and working |

A card only moves to **Done** after it passes testing. If a test fails, the card goes back to **In Progress** and a red `Bug` card is added.

### Card Format

Every card title starts with its sprint and module, e.g. **S4 · Patients — Walk-in patient registration**.

- **Due date:** the last day of the card's sprint.
- **Members:** the person working on the card is assigned to it.

### Labels

We use labels to show which team a card belongs to.

| Color | Label | Why this color |
|---|---|---|
| 🟩 Green | `Backend` | Like green terminal text: the "engine room" |
| 🟦 Blue | `Frontend` | The most common UI color: what users see |
| 🟨 Yellow | `Testing` | Caution: "check this" |
| 🟪 Purple | `n8n` | Automation stands apart from normal coding |
| ⬛ Black | `Team` | Neutral: belongs to everyone |
| 🟥 Red | `Bug` | Error: a problem found during testing |

### Members

All 9 of us work on the board, including Omar Essam and Ahmed Gamal, who test the features.

## How a Card Moves

1. **Sprint planning:** the card moves from **Backlog** to **Sprint** and gets assigned.
2. **Work starts:** the assigned member moves it to **In Progress**.
3. **Work finishes:** it moves to **Testing**.
4. **Testing:** the testers try it. If it passes, it moves to **Done**. If it fails, it goes back to **In Progress** and a `Bug` card is added.
5. **Sprint review:** every card in **Done** is added to the README's [Contributions](README.md#contributions) table.

## Weekly Routine

| When | Meeting | What happens |
|---|---|---|
| Start of the week | **Sprint planning** | We move this week's cards from Backlog to Sprint and assign each one |
| During the week | **Stand-ups** | Short check-ins: what I did, what I'll do next, anything blocking me |
| End of the week | **Sprint review** | We show what is done and add finished tasks to the README's Contributions table |
| End of the week | **Retrospective** | What went well, what didn't, and what we change next week |

## Backlog by Sprint

These are the cards on our board, grouped by sprint. They follow our [timeline](README.md#timeline).

### Sprint 1 · Sep 28 – Oct 4

| Card | Label |
|---|---|
| S1 · Setup — Design the data models | 🟩 Backend |
| S1 · Setup — Design the database schema | 🟩 Backend |
| S1 · Setup — Set up the project and its configuration | 🟩 Backend |
| S1 · Setup — Choose the color palette | 🟦 Frontend |
| S1 · Setup — Choose the fonts | 🟦 Frontend |
| S1 · Setup — Create the app identity (name, logo, look and feel) | 🟦 Frontend |
| S1 · Setup — Set up the Trello board and progress tracking | 🟨 Testing |

### Sprint 2 · Oct 5 – 11

| Card | Label |
|---|---|
| S2 · Auth — Account registration and login | 🟩 Backend |
| S2 · Auth — User roles and permissions | 🟩 Backend |
| S2 · Auth — Login screen | 🟦 Frontend |
| S2 · Auth — Sign-up screen | 🟦 Frontend |
| S2 · Auth — Test login, sign-up and role permissions | 🟨 Testing |

### Sprint 3 · Oct 12 – 18

| Card | Label |
|---|---|
| S3 · Admin — Manage staff accounts | 🟩 Backend |
| S3 · Admin — Manage departments | 🟩 Backend |
| S3 · Admin — Set doctors' working hours | 🟩 Backend |
| S3 · Admin — Admin screens (staff, departments, working hours) | 🟦 Frontend |
| S3 · Admin — Test the admin features | 🟨 Testing |

### Sprint 4 · Oct 19 – 25

| Card | Label |
|---|---|
| S4 · Patients — Patient sign-up and profile | 🟩 Backend |
| S4 · Patients — Walk-in patient registration | 🟩 Backend |
| S4 · Patients — Patient search (contact details only) | 🟩 Backend |
| S4 · Patients — Patient profile screen | 🟦 Frontend |
| S4 · Patients — Reception screens (registration, search) | 🟦 Frontend |
| S4 · Patients — Test the patient features | 🟨 Testing |

### Sprint 5 · Oct 26 – Nov 1

| Card | Label |
|---|---|
| S5 · Appointments — Book an appointment | 🟩 Backend |
| S5 · Appointments — Cancel an appointment | 🟩 Backend |
| S5 · Appointments — Booking screen for patients | 🟦 Frontend |
| S5 · Appointments — Booking screen for receptionists | 🟦 Frontend |
| S5 · Appointments — Test booking and cancellation | 🟨 Testing |

### Sprint 6 · Nov 2 – 8

| Card | Label |
|---|---|
| S6 · Appointments — Doctor's appointment schedule | 🟩 Backend |
| S6 · Appointments — Patient check-in | 🟩 Backend |
| S6 · Appointments — Doctor schedule screen | 🟦 Frontend |
| S6 · Appointments — Check-in screen | 🟦 Frontend |
| S6 · Appointments — Test the schedule and check-in | 🟨 Testing |

### Sprint 7 · Nov 9 – 15

| Card | Label |
|---|---|
| S7 · Medical History — Doctors add diagnoses and visit notes | 🟩 Backend |
| S7 · Medical History — Doctors see only their own patients' history | 🟩 Backend |
| S7 · Medical History — Patients view their own history | 🟩 Backend |
| S7 · Medical History — Medical history screen for doctors | 🟦 Frontend |
| S7 · Medical History — Medical history screen for patients | 🟦 Frontend |
| S7 · Medical History — Test medical history and access rules | 🟨 Testing |

### Sprint 8 · Nov 16 – 22

| Card | Label |
|---|---|
| S8 · Prescriptions — Doctors write prescriptions | 🟩 Backend |
| S8 · Prescriptions — Patients view their own prescriptions | 🟩 Backend |
| S8 · Prescriptions — Prescription screen for doctors | 🟦 Frontend |
| S8 · Prescriptions — Prescriptions screen for patients | 🟦 Frontend |
| S8 · Prescriptions — Test prescriptions | 🟨 Testing |

### Sprint 9 · Nov 23 – 29

| Card | Label |
|---|---|
| S9 · Pharmacy — Prescriptions waiting to be filled | 🟩 Backend |
| S9 · Pharmacy — Dispense medication and update stock | 🟩 Backend |
| S9 · Pharmacy — Manage medicine stock | 🟩 Backend |
| S9 · Pharmacy — Pharmacy screens (queue, dispensing, stock) | 🟦 Frontend |
| S9 · Pharmacy — Test the pharmacy features | 🟨 Testing |

### Sprint 10 · Nov 30 – Dec 6

| Card | Label |
|---|---|
| S10 · Automation — Appointment reminders | 🟪 n8n |
| S10 · Automation — Booking and cancellation confirmations | 🟪 n8n |
| S10 · Automation — Low-stock alerts to the pharmacist | 🟪 n8n |
| S10 · Polish — Polish the screens and make them responsive | 🟦 Frontend |
| S10 · Catch-up — Finish unfinished backend cards | 🟩 Backend |
| S10 · Automation — Test the automations | 🟨 Testing |

### Sprint 11 · Dec 7 – 13

| Card | Label |
|---|---|
| S11 · Integration — Frontend and backend working together end to end | 🟩 Backend · 🟦 Frontend |
| S11 · Catch-up — Finish unfinished cards | 🟩 Backend · 🟦 Frontend |
| S11 · Integration — Full end-to-end test of every role | 🟨 Testing |

### Sprint 12 · Dec 14 – 20 (no new features)

| Card | Label |
|---|---|
| S12 · Bugs — Fix the reported bugs (no new features) | 🟩 Backend · 🟦 Frontend · 🟥 Bug |
| S12 · Bugs — Retest the fixed bugs | 🟨 Testing · 🟥 Bug |
| S12 · Demo — Prepare the demo script | 🟨 Testing |
| S12 · Demo — Prepare the presentation | ⬛ Team |

### Sprint 13 · Dec 21 – 27 (no new features)

| Card | Label |
|---|---|
| S13 · Bugs — Final bug fixes (no new features) | 🟩 Backend · 🟦 Frontend · 🟥 Bug |
| S13 · Testing — Final full test | 🟨 Testing |
| S13 · Demo — Demo rehearsal | ⬛ Team |
| S13 · Docs — Final README and documentation update | ⬛ Team |
