import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { appointments, type AppointmentSummary } from "@/api";
import { fmtDate, fmtTime } from "@/lib/format";
import { handleApiError } from "@/lib/api-errors";
import { AppointmentBadge, PaidBadge } from "@/components/app/badges";
import {
  ConfirmDialog,
  EmptyState,
  PageHeader,
  Pager,
  Panel,
  SkeletonRows,
} from "@/components/app/common";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MyAppointments() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [page, setPage] = useState(1);
  const [cancelling, setCancelling] = useState<AppointmentSummary | null>(null);
  const qc = useQueryClient();
  const now = useMemo(() => new Date().toISOString(), [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const q = useQuery({
    queryKey: ["appointments", "mine", tab, page],
    queryFn: () =>
      appointments.mine(
        tab === "upcoming" ? { from: now, page, pageSize: 10 } : { to: now, page, pageSize: 10 },
      ),
  });

  return (
    <>
      <PageHeader
        title="My appointments"
        actions={
          <Link to="/portal/book" className={buttonVariants()}>
            <CalendarPlus /> Book
          </Link>
        }
      />
      <div
        role="tablist"
        aria-label="Appointment list"
        className="mb-5 inline-flex gap-1 rounded-2xl border border-border bg-white p-1.5 shadow-sm"
      >
        {(["upcoming", "past"] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => {
              setTab(value);
              setPage(1);
            }}
            className={cn(
              "rounded-xl px-5 py-2.5 text-sm font-semibold capitalize transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15",
              tab === value
                ? "bg-primary text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
            )}
          >
            {value}
          </button>
        ))}
      </div>

      {q.isLoading ? (
        <Panel>
          <SkeletonRows rows={3} />
        </Panel>
      ) : !q.data?.items.length ? (
        <Panel>
          <EmptyState
            title={tab === "upcoming" ? "No upcoming appointments" : "No past appointments"}
            description={
              tab === "upcoming" ? "When you book an appointment it will appear here." : undefined
            }
            action={
              tab === "upcoming" ? (
                <Link to="/portal/book" className={buttonVariants()}>
                  Book an appointment
                </Link>
              ) : undefined
            }
          />
        </Panel>
      ) : (
        <>
          <ul className="space-y-3">
            {q.data.items.map((a) => (
              <li key={a.id} className="rounded-lg border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="tnum font-medium">
                      {fmtDate(a.appointmentDateTime)} · {fmtTime(a.appointmentDateTime)}
                    </p>
                    <p className="mt-0.5 text-sm text-fg-secondary">
                      {a.doctor.fullName} · {a.doctor.departmentName}
                    </p>
                    {a.complaint && (
                      <p className="mt-1 text-sm text-muted-foreground">{a.complaint}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <AppointmentBadge status={a.status} />
                    {a.status !== "Cancelled" && <PaidBadge paid={a.isPaid} />}
                  </div>
                </div>
                {a.status === "Scheduled" && (
                  <div className="mt-3 border-t pt-3">
                    <Button variant="outline" size="sm" onClick={() => setCancelling(a)}>
                      Cancel appointment
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <Panel className="mt-3 border-0 bg-transparent">
            <Pager
              page={q.data.page}
              pageSize={q.data.pageSize}
              totalCount={q.data.totalCount}
              onPage={setPage}
            />
          </Panel>
        </>
      )}

      <ConfirmDialog
        open={!!cancelling}
        onOpenChange={(o) => !o && setCancelling(null)}
        title={cancelling ? `Cancel your appointment with ${cancelling.doctor.fullName}?` : ""}
        description={
          cancelling
            ? `${fmtDate(cancelling.appointmentDateTime)} at ${fmtTime(cancelling.appointmentDateTime)}. This can't be undone.`
            : undefined
        }
        confirmLabel="Cancel appointment"
        onConfirm={async () => {
          if (!cancelling) return;
          try {
            await appointments.cancel(cancelling.id, { rowVersion: cancelling.rowVersion });
            toast.success("Appointment cancelled.");
          } catch (e) {
            handleApiError(e);
          } finally {
            qc.invalidateQueries({ queryKey: ["appointments"] });
          }
        }}
      />
    </>
  );
}
