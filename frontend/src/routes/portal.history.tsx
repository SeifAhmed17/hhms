import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { patients, prescriptions } from "@/api";
import { bloodTypeLabel, fmtDateTime } from "@/lib/format";
import { AppointmentBadge, DangerPill } from "@/components/app/badges";
import { EmptyState, PageHeader, Panel, SkeletonRows } from "@/components/app/common";
import { PrescriptionView } from "@/components/app/prescription-view";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Route = createFileRoute("/portal/history")({
  head: () => ({
    meta: [
      { title: "Medical history — HHMS" },
      { name: "description", content: "Your medical background and visit history at Hurghada Hospital." },
      { property: "og:title", content: "Medical history — HHMS" },
      { property: "og:description", content: "Your medical background and visit history at Hurghada Hospital." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const q = useQuery({ queryKey: ["history", "me"], queryFn: patients.myHistory });
  const [rxId, setRxId] = useState<string | null>(null);
  const rx = useQuery({ queryKey: ["prescription", rxId], queryFn: () => prescriptions.get(rxId!), enabled: !!rxId });

  if (q.isLoading) return (<><PageHeader title="Medical history" /><Panel><SkeletonRows rows={6} /></Panel></>);
  if (!q.data) return null;
  const { background: b, visits } = q.data;

  const bg: [string, string | undefined][] = [
    ["Chronic diseases", b.chronicDiseases],
    ["Blood type", b.bloodType ? bloodTypeLabel[b.bloodType] : undefined],
    ["Past surgeries", b.pastSurgeries],
    ["Family history", b.familyHistory],
  ];

  return (
    <>
      <PageHeader title="Medical history" description="Read-only. Your doctor keeps this up to date." />
      <Panel className="p-5">
        <h2 className="text-lg">Background</h2>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Allergies</p>
          <div className="mt-1">{b.allergies ? <DangerPill>{b.allergies}</DangerPill> : <span className="text-sm">No known allergies</span>}</div>
        </div>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {bg.map(([k, v]) => (
            <div key={k}>
              <dt className="text-sm text-muted-foreground">{k}</dt>
              <dd className="mt-0.5 text-sm">{v || "None recorded"}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <h2 className="mt-8 mb-3 text-lg">Visits</h2>
      {!visits.length ? (
        <Panel><EmptyState title="No visits yet" description="Your visits will appear here after you see a doctor." /></Panel>
      ) : (
        <ol className="relative space-y-4 border-l border-border-strong pl-6">
          {visits.map((v) => (
            <li key={v.appointmentId} className="relative">
              <span className="absolute top-5 -left-[29px] size-2.5 rounded-full border-2 border-card bg-primary" aria-hidden />
              <Panel className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="mono-id text-muted-foreground">{fmtDateTime(v.appointmentDateTime)}</p>
                    <p className="font-medium">{v.doctorName}</p>
                  </div>
                  <AppointmentBadge status={v.status} />
                </div>
                <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                  <div><dt className="text-muted-foreground">Complaint</dt><dd className="mt-0.5">{v.complaint || "—"}</dd></div>
                  <div><dt className="text-muted-foreground">Diagnosis</dt><dd className="mt-0.5">{v.diagnosis || "—"}</dd></div>
                  <div><dt className="text-muted-foreground">Notes</dt><dd className="mt-0.5 whitespace-pre-wrap">{v.notes || "—"}</dd></div>
                </dl>
                {v.prescriptionId && (
                  <Button variant="ghost" size="sm" className="mt-2 -ml-2" onClick={() => setRxId(v.prescriptionId!)}>
                    View prescription
                  </Button>
                )}
              </Panel>
            </li>
          ))}
        </ol>
      )}

      <Sheet open={!!rxId} onOpenChange={(o) => !o && setRxId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader><SheetTitle>Prescription</SheetTitle></SheetHeader>
          <div className="mt-4">{rx.data ? <PrescriptionView rx={rx.data} /> : <SkeletonRows rows={4} className="p-0" />}</div>
        </SheetContent>
      </Sheet>
    </>
  );
}
