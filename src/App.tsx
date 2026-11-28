import { Component, type ErrorInfo, type ReactNode } from "react";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { TbReload } from "react-icons/tb";
import { AuthProvider } from "@/lib/auth";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import PatientShell from "@/routes/portal";
import PortalIndex from "@/routes/portal.index";
import AppointmentsPage from "@/routes/portal.appointments";
import BookPage from "@/routes/portal.book";
import HistoryPage from "@/routes/portal.history";
import PrescriptionsPage from "@/routes/portal.prescriptions";
import ProfilePage from "@/routes/portal.profile";
import ReceiptsPage from "@/routes/portal.receipts";
import ChangePasswordPage from "@/routes/change-password";
import IndexPage from "@/routes/index";
import LoginPage from "@/routes/login";
import SignupPage from "@/routes/signup";

const queryClient = new QueryClient();

const routeMetadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "HHMS — Hurghada Hospital Management System",
    description: "Book appointments, view records and manage hospital work at Hurghada Hospital.",
  },
  "/login": {
    title: "Log in — HHMS",
    description: "Log in to the Hurghada Hospital Management System.",
  },
  "/signup": {
    title: "Create a patient account — HHMS",
    description: "Register as a patient at Hurghada Hospital to book appointments online.",
  },
  "/change-password": {
    title: "Change password — HHMS",
    description: "Change your HHMS account password.",
  },
  "/portal/appointments": {
    title: "My appointments — HHMS",
    description: "See your upcoming and past hospital appointments.",
  },
  "/portal/book": {
    title: "Book an appointment — HHMS",
    description: "Choose a department, doctor and time to book a hospital appointment.",
  },
  "/portal/history": {
    title: "Medical history — HHMS",
    description: "Your medical background and visit history at Hurghada Hospital.",
  },
  "/portal/prescriptions": {
    title: "My prescriptions — HHMS",
    description: "Prescriptions written for you by Hurghada Hospital doctors.",
  },
  "/portal/profile": {
    title: "My profile — HHMS",
    description: "Update your contact details at Hurghada Hospital.",
  },
  "/portal/receipts": {
    title: "My receipts — HHMS",
    description: "Receipts for your paid hospital consultations.",
  },
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <RouteMetadata />
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
              <Route path="/portal" element={<PatientShell />}>
                <Route index element={<PortalIndex />} />
                <Route path="appointments" element={<AppointmentsPage />} />
                <Route path="book" element={<BookPage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="prescriptions" element={<PrescriptionsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="receipts" element={<ReceiptsPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
        <Toaster position="top-right" closeButton />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function RouteMetadata() {
  const { pathname } = useLocation();
  const metadata = routeMetadata[pathname] ?? {
    title: "404 Not Found — HHMS",
    description: "The page you are looking for does not exist or has been moved.",
  };

  useEffect(() => {
    document.title = metadata.title;
    document
      .querySelector<HTMLMetaElement>('meta[name="description"]')
      ?.setAttribute("content", metadata.description);
    document
      .querySelector<HTMLMetaElement>('meta[property="og:title"]')
      ?.setAttribute("content", metadata.title);
    document
      .querySelector<HTMLMetaElement>('meta[property="og:description"]')
      ?.setAttribute("content", metadata.description);
  }, [metadata.title, metadata.description]);

  return null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  override state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  override componentDidCatch(error: Error, _info: ErrorInfo) {
    reportLovableError(error, { boundary: "react_router_error_boundary" });
  }

  override render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-white p-8 text-center shadow-xl shadow-slate-900/5 sm:p-10">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-tint text-primary">
              <TbReload className="size-6" aria-hidden />
            </span>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight">
              This page didn&apos;t load
            </h1>
            <p className="mt-2 leading-6 text-muted-foreground">
              Something went wrong on our end. You can try refreshing or head back home.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl border border-border-strong bg-white px-5 text-sm font-semibold shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
            >
              Try again
            </button>
            <Link
              to="/"
              className="ml-3 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
            >
              Back to Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function NotFoundPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-white p-8 text-center shadow-xl shadow-slate-900/5 sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Page not found</p>
        <h1 className="mt-3 text-6xl font-semibold tracking-tight text-slate-900">404</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
