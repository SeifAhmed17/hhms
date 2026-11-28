import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { prescriptions, type Prescription } from "@/api";
import { fmtDate } from "@/lib/format";
import { PrescriptionBadge } from "@/components/app/badges";
import { EmptyState, PageHeader, Pager, Panel, SkeletonRows } from "@/components/app/common";
import { PrescriptionView } from "@/components/app/prescription-view";
import { Modal } from "@/components/app/modal";

export default function PrescriptionsPage() {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<Prescription | null>(null);
  const q = useQuery({
    queryKey: ["prescriptions", "mine", page],
    queryFn: () => prescriptions.mine({ page, pageSize: 20 }),
  });

  return (
    <>
      <PageHeader title="My prescriptions" />
      <Panel>
        {q.isLoading ? (
          <SkeletonRows rows={4} />
        ) : !q.data?.items.length ? (
          <EmptyState
            title="No prescriptions yet"
            description="Prescriptions from your doctors will appear here."
          />
        ) : (
          <>
            <ul className="divide-y">
              {q.data.items.map((rx) => (
                <li key={rx.id}>
                  <button
                    onClick={() => setOpen(rx)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted"
                  >
                    <span>
                      <span className="tnum block font-medium">{fmtDate(rx.createdAt)}</span>
                      <span className="block text-sm text-muted-foreground">
                        {rx.doctor.fullName} · {rx.items.length}{" "}
                        {rx.items.length === 1 ? "item" : "items"}
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
            <Pager
              page={q.data.page}
              pageSize={q.data.pageSize}
              totalCount={q.data.totalCount}
              onPage={setPage}
            />
          </>
        )}
      </Panel>
      <Modal
        open={!!open}
        onOpenChange={(isOpen) => !isOpen && setOpen(null)}
        title="Prescription"
        side="right"
      >
        {open && <PrescriptionView rx={open} />}
      </Modal>
    </>
  );
}
