import {
  AlertTriangle,
  Ban,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  LogIn,
  PackageCheck,
  type LucideIcon,
} from "lucide-react";
import type { AppointmentStatus, PrescriptionStatus } from "@/api";
import { cn } from "@/lib/utils";

export type Tone = "info" | "teal" | "success" | "warning" | "danger" | "neutral";
const toneClasses: Record<Tone, string> = {
  info: "border-info-border bg-primary-tint text-primary",
  teal: "border-teal/30 bg-teal-tint text-teal",
  success: "border-success-border bg-success-tint text-success",
  warning: "border-warning-border bg-warning-tint text-warning",
  danger: "border-destructive-border bg-destructive-tint text-destructive",
  neutral: "border-border bg-slate-100 text-slate-600",
};

export function StatusPill({
  tone,
  icon: Icon,
  children,
  className,
}: {
  tone: Tone;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold [&_svg]:size-3.5",
        toneClasses[tone],
        className,
      )}
    >
      <Icon aria-hidden />
      {children}
    </span>
  );
}

const APPT: Record<AppointmentStatus, { tone: Tone; icon: LucideIcon; label: string }> = {
  Scheduled: { tone: "info", icon: CalendarClock, label: "Scheduled" },
  CheckedIn: { tone: "teal", icon: LogIn, label: "Checked-in" },
  Completed: { tone: "success", icon: CheckCircle2, label: "Completed" },
  Cancelled: { tone: "neutral", icon: Ban, label: "Cancelled" },
};
export function AppointmentBadge({ status }: { status: AppointmentStatus }) {
  const s = APPT[status];
  return (
    <StatusPill tone={s.tone} icon={s.icon}>
      {s.label}
    </StatusPill>
  );
}
export function PaidBadge({ paid }: { paid: boolean }) {
  return paid ? (
    <StatusPill tone="success" icon={CircleDollarSign}>
      Paid
    </StatusPill>
  ) : (
    <StatusPill tone="warning" icon={Clock}>
      Unpaid
    </StatusPill>
  );
}
export function PrescriptionBadge({ status }: { status: PrescriptionStatus }) {
  return status === "Dispensed" ? (
    <StatusPill tone="success" icon={PackageCheck}>
      Dispensed
    </StatusPill>
  ) : (
    <StatusPill tone="warning" icon={Clock}>
      Pending
    </StatusPill>
  );
}
export function DangerPill({ children }: { children: React.ReactNode }) {
  return (
    <StatusPill tone="danger" icon={AlertTriangle}>
      {children}
    </StatusPill>
  );
}
