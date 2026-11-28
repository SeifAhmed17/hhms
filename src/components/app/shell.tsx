import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  CalendarPlus,
  ChevronDown,
  FileHeart,
  HeartPulse,
  LogOut,
  Menu,
  Pill,
  Receipt,
  User,
  X,
  KeyRound,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { NotAllowed } from "./not-allowed";

type NavItem = { to: string; label: string; icon: LucideIcon };

const PATIENT_NAV: NavItem[] = [
  { to: "/portal/book", label: "Book", icon: CalendarPlus },
  { to: "/portal/appointments", label: "My appointments", icon: CalendarCheck },
  { to: "/portal/history", label: "Medical history", icon: FileHeart },
  { to: "/portal/prescriptions", label: "Prescriptions", icon: Pill },
  { to: "/portal/receipts", label: "Receipts", icon: Receipt },
  { to: "/portal/profile", label: "Profile", icon: User },
];

function useActive(to: string, all: NavItem[]) {
  const { pathname: path } = useLocation();
  // pick the longest matching nav entry so /patients/new doesn't also light up /patients
  const best = all
    .filter((n) => path === n.to || path.startsWith(n.to + "/"))
    .sort((a, b) => b.to.length - a.to.length)[0];
  return best?.to === to;
}

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    menuRef.current?.removeAttribute("open");
  }, [pathname]);

  if (!user) return null;

  return (
    <details ref={menuRef} className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2.5 rounded-2xl border border-border bg-white py-1.5 pl-2 pr-3 shadow-sm transition hover:border-primary/30 hover:bg-primary-tint/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 [&::-webkit-details-marker]:hidden">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary-tint text-sm font-bold text-primary">
          {user.displayName.replace(/^Dr\.\s*/, "").slice(0, 1)}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block max-w-40 truncate text-sm font-semibold leading-4">
            {user.displayName}
          </span>
          <span className="mt-1 block text-xs leading-4 text-muted-foreground">{user.role}</span>
        </span>
        <ChevronDown className="size-4 text-slate-400" aria-hidden />
      </summary>
      <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 overflow-hidden rounded-2xl border border-border bg-white p-2 shadow-xl shadow-slate-900/10">
        <div className="border-b border-border px-3 py-3">
          <p className="truncate text-sm font-semibold">{user.displayName}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <Link
          to="/change-password"
          className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <KeyRound className="size-4 text-slate-500" aria-hidden />
          Change password
        </Link>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-destructive transition hover:bg-destructive-tint"
          onClick={() => {
            menuRef.current?.removeAttribute("open");
            logout();
            navigate("/login");
          }}
        >
          <LogOut className="size-4" aria-hidden />
          Log out
        </button>
      </div>
    </details>
  );
}

function Brand() {
  return (
    <Link to="/portal/appointments" className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/20">
        <HeartPulse className="size-5" aria-hidden />
      </span>
      <span>
        <span className="block text-base font-bold tracking-tight text-slate-900">HHMS</span>
        <span className="block text-[11px] leading-4 text-muted-foreground">Hurghada Hospital</span>
      </span>
    </Link>
  );
}

function SideLink({ item, all }: { item: NavItem; all: NavItem[] }) {
  const active = useActive(item.to, all);
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900",
        active && "bg-primary-tint text-primary hover:bg-primary-tint hover:text-primary",
      )}
      aria-current={active ? "page" : undefined}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition",
          active && "bg-white text-primary shadow-sm",
        )}
      >
        <Icon className="size-4" aria-hidden />
      </span>
      {item.label}
    </Link>
  );
}

function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const { pathname: path } = useLocation();
  useEffect(() => setOpen(false), [path]);
  return (
    <div className="relative lg:hidden">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X /> : <Menu />}
      </Button>
      {open && (
        <nav
          className="absolute left-0 top-14 z-40 w-[min(22rem,calc(100vw-2rem))] space-y-1 rounded-2xl border border-border bg-white p-3 shadow-xl shadow-slate-900/10"
          aria-label="Main"
        >
          {items.map((i) => (
            <SideLink key={i.to} item={i} all={items} />
          ))}
        </nav>
      )}
    </div>
  );
}

export function PatientShell() {
  const items = PATIENT_NAV;
  return (
    <Guard role="Patient">
      <div className="min-h-screen bg-background lg:flex">
        <aside className="no-print hidden w-[272px] shrink-0 flex-col border-r border-border bg-white px-5 py-7 lg:flex">
          <Brand />
          <p className="mb-3 mt-10 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Patient menu
          </p>
          <nav className="space-y-1" aria-label="Main">
            {items.map((item) => (
              <SideLink key={item.to} item={item} all={items} />
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-primary/10 bg-gradient-to-br from-primary-tint to-white p-4">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
              <HeartPulse className="size-4" aria-hidden />
            </span>
            <p className="mt-3 text-sm font-semibold">Your health, organized</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Access your hospital care information in one secure place.
            </p>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="no-print sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur-xl">
            <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
              <div className="flex items-center gap-3">
                <MobileNav items={items} />
                <div className="lg:hidden">
                  <Brand />
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold">Patient portal</p>
                  <p className="text-xs text-muted-foreground">Your health, organized.</p>
                </div>
              </div>
              <UserMenu />
            </div>
          </header>
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            <Outlet />
          </main>
          <footer className="no-print border-t border-border bg-white px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-10">
            Hurghada Hospital Management System
          </footer>
        </div>
      </div>
    </Guard>
  );
}

function Guard({ role, children }: { role: Role; children: ReactNode }) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!ready) return;
    if (!user) navigate("/login", { replace: true });
    else if (user.mustChangePassword) navigate("/change-password", { replace: true });
  }, [ready, user, navigate]);

  if (!ready || !user || user.mustChangePassword) {
    return (
      <div className="flex min-h-screen flex-col gap-4 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (user.role !== role) return <NotAllowed />;
  return <>{children}</>;
}
