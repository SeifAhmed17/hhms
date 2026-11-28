# Routes

The app uses React Router DOM with `BrowserRouter`. Page components live in this
directory, and their URL paths are registered in `src/App.tsx`.

The patient portal uses `PatientShell` as a nested layout route. It renders
child pages through React Router's `<Outlet />`. Add new portal pages as
children of `/portal` in `src/App.tsx`.

Production hosting must serve `index.html` for unknown paths so direct visits
and refreshes on client-side routes resolve through `BrowserRouter`.

| Page component | URL |
| --- | --- |
| `index.tsx` | `/` |
| `login.tsx` | `/login` |
| `signup.tsx` | `/signup` |
| `change-password.tsx` | `/change-password` |
| `portal.index.tsx` | `/portal` |
| `portal.appointments.tsx` | `/portal/appointments` |
| `portal.book.tsx` | `/portal/book` |
| `portal.history.tsx` | `/portal/history` |
| `portal.prescriptions.tsx` | `/portal/prescriptions` |
| `portal.profile.tsx` | `/portal/profile` |
| `portal.receipts.tsx` | `/portal/receipts` |
