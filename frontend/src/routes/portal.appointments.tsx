import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { appointments, type AppointmentSummary } from "@/api";
import { fmtDate, fmtTime } from "@/lib/format";
import { handleApiError } from "@/lib/api-errors";
import { AppointmentBadge, PaidBadge } from "@/components/app/badges";
import { ConfirmDialog, EmptyState, PageHeader, Pager, Panel, SkeletonRows } from "@/components/app/common";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/portal/appointments")({
  head: () => ({
    meta: [
      { title: "My appointments — HHMS" },
      { name: "description", content: "See your upcoming and past hospital appointments." },
      { property: "og:title", content: "My appointments — HHMS" },
      { property: "og:description", content: "See your upcoming and past hospital appointments." },
    ],
  }),
  component: MyAppointments,
});

function MyAppointments() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [page, setPage] = useState(1);
  const [cancelling, setCancelling] = useState<AppointmentSummary | null>(null);
  const qc = useQueryClient();
  const now = useMemo(() => new Date().toISOString(), [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const q = useQuery({
    queryKey: ["appointments", "mine", tab, page],
    queryFn: () => appointments.mine(tab === "upcoming" ? { from: now, page, pageSize: 10 } : { to: now, page, pageSize: 10 }),
  });

  return (
    <>
      <PageHeader
        title="My appointments"
        actions={
          <Button asChild>
            <Link to="/portal/book">
              <CalendarPlus /> Book
            </Link>
          </Button>
        }
      />
      <Tabs value={tab} onValueChange={(v) => { setTab(v as typeof tab); setPage(1); }} className="mb-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
      </Tabs>

      {q.isLoading ? (
        <Panel><SkeletonRows rows={3} /></Panel>
      ) : !q.data?.items.length ? (
        <Panel>
          <EmptyState
            title={tab === "upcoming" ? "No upcoming appointments" : "No past appointments"}
            description={tab === "upcoming" ? "When you book an appointment it will appear here." : undefined}
            action={tab === "upcoming" ? <Button asChild><Link to="/portal/book">Book an appointment</Link></Button> : undefined}
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
                    {a.complaint && <p className="mt-1 text-sm text-muted-foreground">{a.complaint}</p>}
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
            <Pager page={q.data.page} pageSize={q.data.pageSize} totalCount={q.data.totalCount} onPage={setPage} />
          </Panel>
        </>
      )}

      <ConfirmDialog
        open={!!cancelling}
        onOpenChange={(o) => !o && setCancelling(null)}
        title={cancelling ? `Cancel your appointment with ${cancelling.doctor.fullName}?` : ""}
        description={cancelling ? `${fmtDate(cancelling.appointmentDateTime)} at ${fmtTime(cancelling.appointmentDateTime)}. This can't be undone.` : undefined}
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
