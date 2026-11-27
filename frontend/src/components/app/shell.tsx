import { useEffect, useState, type ReactNode } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  CalendarCheck,
  CalendarPlus,
  ClipboardList,
  CreditCard,
  FileHeart,
  Building2,
  LogOut,
  Menu,
  Package,
  Pill,
  Receipt,
  Stethoscope,
  User,
  UserPlus,
  Users,
  X,
  KeyRound,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { NotAllowed } from "./not-allowed";

type NavItem = { to: string; label: string; icon: LucideIcon };

export const NAV: Record<Role, NavItem[]> = {
  Patient: [
    { to: "/portal/book", label: "Book", icon: CalendarPlus },
    { to: "/portal/appointments", label: "My appointments", icon: CalendarCheck },
    { to: "/portal/history", label: "Medical history", icon: FileHeart },
    { to: "/portal/prescriptions", label: "Prescriptions", icon: Pill },
    { to: "/portal/receipts", label: "Receipts", icon: Receipt },
    { to: "/portal/profile", label: "Profile", icon: User },
  ],
  Receptionist: [
    { to: "/reception/checkin", label: "Check-in", icon: ClipboardList },
    { to: "/reception/payments", label: "Payments", icon: CreditCard },
    { to: "/reception/book", label: "Book appointment", icon: CalendarPlus },
    { to: "/reception/patients", label: "Patients", icon: Users },
    { to: "/reception/patients/new", label: "Register patient", icon: UserPlus },
  ],
  Doctor: [
    { to: "/doctor/schedule", label: "Schedule", icon: CalendarCheck },
    { to: "/doctor/patients", label: "My patients", icon: Stethoscope },
  ],
  Pharmacist: [
    { to: "/pharmacy/queue", label: "Queue", icon: ClipboardList },
    { to: "/pharmacy/stock", label: "Stock", icon: Package },
  ],
  Admin: [
    { to: "/admin/staff", label: "Staff", icon: Users },
    { to: "/admin/departments", label: "Departments", icon: Building2 },
  ],
};

function useActive(to: string, all: NavItem[]) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  // pick the longest matching nav entry so /patients/new doesn't also light up /patients
  const best = all.filter((n) => path === n.to || path.startsWith(n.to + "/")).sort((a, b) => b.to.length - a.to.length)[0];
  return best?.to === to;
}

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 gap-2 px-3">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary-tint text-xs font-semibold text-primary">
            {user.displayName.replace(/^Dr\.\s*/, "").slice(0, 1)}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm leading-4">{user.displayName}</span>
            <span className="block text-xs leading-4 text-muted-foreground">{user.role}</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <span className="block">{user.displayName}</span>
          <span className="block text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/change-password">
            <KeyRound /> Change password
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            logout();
            navigate({ to: "/login" });
          }}
        >
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Brand() {
  return <span className="text-sm font-semibold tracking-tight">HHMS</span>;
}

function SideLink({ item, all }: { item: NavItem; all: NavItem[] }) {
  const active = useActive(item.to, all);
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={cn(
        "relative flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-fg-secondary transition-colors hover:bg-card hover:text-foreground",
        active && "bg-primary-tint text-primary hover:bg-primary-tint hover:text-primary",
      )}
      aria-current={active ? "page" : undefined}
    >
      {active && <span className="absolute inset-y-1 left-0 w-[3px] rounded-r bg-primary" aria-hidden />}
      <Icon className="size-4" aria-hidden />
      {item.label}
    </Link>
  );
}

export function StaffShell({ role }: { role: Role }) {
  const items = NAV[role];
  return (
    <Guard role={role}>
      <div className="flex min-h-screen">
        <aside className="no-print sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-sidebar md:flex">
          <div className="flex h-14 items-center border-b px-5">
            <Brand />
          </div>
          <nav className="flex-1 space-y-1 p-3" aria-label="Main">
            {items.map((i) => (
              <SideLink key={i.to} item={i} all={items} />
            ))}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="no-print sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b bg-card px-4 md:px-6">
            <MobileNav items={items} />
            <span className="hidden text-sm text-muted-foreground md:block">Hurghada Hospital · {role}</span>
            <UserMenu />
          </header>
          <main className="mx-auto w-full max-w-[1440px] flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </Guard>
  );
}

function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => setOpen(false), [path]);
  return (
    <div className="md:hidden">
      <Button variant="outline" size="icon" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
        {open ? <X /> : <Menu />}
      </Button>
      {open && (
        <nav className="absolute inset-x-0 top-14 z-40 space-y-1 border-b bg-card p-3 shadow-md" aria-label="Main">
          {items.map((i) => (
            <SideLink key={i.to} item={i} all={items} />
          ))}
        </nav>
      )}
    </div>
  );
}

export function PatientShell() {
  const items = NAV.Patient;
  return (
    <Guard role="Patient">
      <div className="flex min-h-screen flex-col">
        <header className="no-print sticky top-0 z-30 border-b bg-card">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
            <div className="flex items-center gap-6">
              <MobileNav items={items} />
              <Brand />
              <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
                {items.map((i) => (
                  <TopLink key={i.to} item={i} all={items} />
                ))}
              </nav>
            </div>
            <UserMenu />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
          <Outlet />
        </main>
      </div>
    </Guard>
  );
}

function TopLink({ item, all }: { item: NavItem; all: NavItem[] }) {
  const active = useActive(item.to, all);
  return (
    <Link
      to={item.to}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium text-fg-secondary hover:bg-muted hover:text-foreground",
        active && "bg-primary-tint text-primary hover:bg-primary-tint hover:text-primary",
      )}
      aria-current={active ? "page" : undefined}
    >
      {item.label}
    </Link>
  );
}

function Guard({ role, children }: { role: Role; children: ReactNode }) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!ready) return;
    if (!user) navigate({ to: "/login", replace: true });
    else if (user.mustChangePassword) navigate({ to: "/change-password", replace: true });
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
