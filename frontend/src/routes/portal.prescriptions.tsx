import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { prescriptions, type Prescription } from "@/api";
import { fmtDate } from "@/lib/format";
import { PrescriptionBadge } from "@/components/app/badges";
import { EmptyState, PageHeader, Pager, Panel, SkeletonRows } from "@/components/app/common";
import { PrescriptionView } from "@/components/app/prescription-view";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Route = createFileRoute("/portal/prescriptions")({
  head: () => ({
    meta: [
      { title: "My prescriptions — HHMS" },
      { name: "description", content: "Prescriptions written for you by Hurghada Hospital doctors." },
      { property: "og:title", content: "My prescriptions — HHMS" },
      { property: "og:description", content: "Prescriptions written for you by Hurghada Hospital doctors." },
    ],
  }),
  component: PrescriptionsPage,
});

function PrescriptionsPage() {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<Prescription | null>(null);
  const q = useQuery({ queryKey: ["prescriptions", "mine", page], queryFn: () => prescriptions.mine({ page, pageSize: 20 }) });

  return (
    <>
      <PageHeader title="My prescriptions" />
      <Panel>
        {q.isLoading ? (
          <SkeletonRows rows={4} />
        ) : !q.data?.items.length ? (
          <EmptyState title="No prescriptions yet" description="Prescriptions from your doctors will appear here." />
        ) : (
          <>
            <ul className="divide-y">
              {q.data.items.map((rx) => (
                <li key={rx.id}>
                  <button onClick={() => setOpen(rx)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted">
                    <span>
                      <span className="tnum block font-medium">{fmtDate(rx.createdAt)}</span>
                      <span className="block text-sm text-muted-foreground">
                        {rx.doctor.fullName} · {rx.items.length} {rx.items.length === 1 ? "item" : "items"}
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <PrescriptionBadge status={rx.status} />
                      <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <Pager page={q.data.page} pageSize={q.data.pageSize} totalCount={q.data.totalCount} onPage={setPage} />
          </>
        )}
      </Panel>
      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader><SheetTitle>Prescription</SheetTitle></SheetHeader>
          <div className="mt-4">{open && <PrescriptionView rx={open} />}</div>
        </SheetContent>
      </Sheet>
    </>
  );
}
