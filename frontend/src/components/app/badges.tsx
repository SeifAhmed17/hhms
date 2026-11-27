import { cva } from "class-variance-authority";
import {
  AlertTriangle,
  Ban,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  LogIn,
  PackageCheck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { AppointmentStatus, PrescriptionStatus } from "@/api";
import { cn } from "@/lib/utils";

const badge = cva(
  "inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-xs font-medium whitespace-nowrap [&_svg]:size-3.5",
  {
    variants: {
      tone: {
        info: "bg-primary-tint text-primary border-info-border",
        teal: "bg-teal-tint text-teal border-teal/30",
        success: "bg-success-tint text-success border-success-border",
        warning: "bg-warning-tint text-warning border-warning-border",
        danger: "bg-destructive-tint text-destructive border-destructive-border",
        neutral: "bg-muted text-muted-foreground border-border",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export type Tone = "info" | "teal" | "success" | "warning" | "danger" | "neutral";

export function StatusPill({ tone, icon: Icon, children, className }: { tone: Tone; icon: LucideIcon; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(badge({ tone }), className)}>
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
  return <StatusPill tone={s.tone} icon={s.icon}>{s.label}</StatusPill>;
}
export function PaidBadge({ paid }: { paid: boolean }) {
  return paid ? (
    <StatusPill tone="success" icon={CircleDollarSign}>Paid</StatusPill>
  ) : (
    <StatusPill tone="warning" icon={Clock}>Unpaid</StatusPill>
  );
}
export function PrescriptionBadge({ status }: { status: PrescriptionStatus }) {
  return status === "Dispensed" ? (
    <StatusPill tone="success" icon={PackageCheck}>Dispensed</StatusPill>
  ) : (
    <StatusPill tone="warning" icon={Clock}>Pending</StatusPill>
  );
}
export function DangerPill({ children }: { children: React.ReactNode }) {
  return <StatusPill tone="danger" icon={AlertTriangle}>{children}</StatusPill>;
}
export function ErrorPill({ children }: { children: React.ReactNode }) {
  return <StatusPill tone="danger" icon={XCircle}>{children}</StatusPill>;
}
