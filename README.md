# HHMS Frontend

The patient-facing web application for the **Hurghada Hospital Management System (HHMS)**. It provides account access and a responsive portal for patients to manage appointments, medical history, prescriptions, profile information, and receipts.

The frontend is built with React and Vite. It can run entirely with an included mock API, or connect to a HHMS REST API through environment variables.

## Features

- Patient registration, login, logout, and required password changes
- Appointment booking with department, doctor, date, and time selection
- Upcoming and previous appointment views
- Appointment cancellation
- Medical history and patient profile views
- Prescription browsing
- Receipt browsing
- Responsive patient portal layout
- Mock API support for local development
- Toast notifications, loading states, form validation, and API error handling

## Tech Stack

- React 19
- TypeScript 5
- Vite 8
- React Router 7
- TanStack React Query 5
- Tailwind CSS 4
- Formik and Yup
- Vitest and Testing Library
- Sonner
- Lucide React

## Getting Started

### Prerequisites

- Node.js 20.19 or newer
- npm, pnpm, or Bun

### Installation

```bash
npm install
```

### Run in Development Mode

```bash
npm run dev
```

Vite will print the local development URL in the terminal, usually `http://localhost:5173`.

The application uses mock data by default, so no backend is required for local development.

## Configuration

Create a `.env.local` file in the project root when configuration differs from the defaults:

```env
VITE_API_BASE_URL=/api/v1
VITE_USE_MOCKS=true
```

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api/v1` | Base URL for the HHMS REST API |
| `VITE_USE_MOCKS` | `true` | Set to `false` to disable the mock API and use the REST API |

For example, to connect to a backend running locally:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_USE_MOCKS=false
```

Restart the Vite development server after changing environment variables.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run build:dev` | Create a development-mode build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format the workspace with Prettier |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |

The repository also includes a `bun.lock` file, so Bun can be used instead of npm if preferred.

## Application Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirect authenticated users to the appropriate area |
| `/login` | Patient sign-in |
| `/signup` | Patient registration |
| `/change-password` | Required or manual password change |
| `/portal` | Patient portal dashboard |
| `/portal/appointments` | Appointment list |
| `/portal/book` | Appointment booking flow |
| `/portal/history` | Medical history |
| `/portal/prescriptions` | Patient prescriptions |
| `/portal/profile` | Patient profile |
| `/portal/receipts` | Payment receipts |

Unknown routes render a not-found page.

## Project Structure

```text
src/
  api/             API client, endpoint definitions, types, and mock responses
  components/
    app/           HHMS application components and flows
    ui/            Reusable interface primitives
  hooks/           Reusable React hooks
  lib/             Authentication, validation, formatting, and utilities
  routes/          Page and route components
  test/            Vitest and Testing Library tests
  App.tsx          Application routes and providers
  main.tsx         React entry point
  styles.css       Tailwind CSS and design tokens
```

## Authentication

Authentication state is stored in browser `localStorage` under the `hhms.token` and `hhms.user` keys. The application sends the stored token in the `Authorization: Bearer` header when using the REST API.

An authenticated session is refreshed from `/auth/me` when the application loads. Invalid or expired sessions are cleared and redirect to `/login`.

## Mock API

Mock mode is enabled by default and is implemented in `src/api/mock.ts`. It supports local authentication and the primary patient data flows without an external backend.

Set `VITE_USE_MOCKS=false` to use the API client from `src/api/client.ts` instead.

## Production Build

```bash
npm run build
npm run preview
```

The production bundle is generated in `dist/`. Deploy this folder behind a static host or web server that supports client-side routing.

For React Router routes such as `/portal/appointments`, the server should rewrite unknown paths to `index.html`.
