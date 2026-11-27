import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Printer } from "lucide-react";
import { receipts, type Receipt } from "@/api";
import { fmtDate, fmtEGP } from "@/lib/format";
import { EmptyState, PageHeader, Pager, Panel, SkeletonRows } from "@/components/app/common";
import { ReceiptView } from "@/components/app/receipt-view";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/portal/receipts")({
  head: () => ({
    meta: [
      { title: "My receipts — HHMS" },
      { name: "description", content: "Receipts for your paid hospital consultations." },
      { property: "og:title", content: "My receipts — HHMS" },
      { property: "og:description", content: "Receipts for your paid hospital consultations." },
    ],
  }),
  component: ReceiptsPage,
});

function ReceiptsPage() {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<Receipt | null>(null);
  const q = useQuery({ queryKey: ["receipts", "mine", page], queryFn: () => receipts.mine({ page, pageSize: 20 }) });

  return (
    <>
      <PageHeader title="My receipts" />
      <Panel>
        {q.isLoading ? (
          <SkeletonRows rows={4} />
        ) : !q.data?.items.length ? (
          <EmptyState title="No receipts yet" description="Receipts appear here after you pay at reception." />
        ) : (
          <>
            <ul className="divide-y">
              {q.data.items.map((r) => (
                <li key={r.id}>
                  <button onClick={() => setOpen(r)} className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted">
                    <span>
                      <span className="tnum block font-medium">{fmtDate(r.appointmentDateTime)}</span>
                      <span className="block text-sm text-muted-foreground">
                        {r.doctorName} · {r.departmentName} · {r.paymentMethod}
                      </span>
                    </span>
                    <span className="tnum font-medium">{fmtEGP(r.amount)}</span>
                  </button>
                </li>
              ))}
            </ul>
            <Pager page={q.data.page} pageSize={q.data.pageSize} totalCount={q.data.totalCount} onPage={setPage} />
          </>
        )}
      </Panel>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="no-print"><DialogTitle>Receipt</DialogTitle></DialogHeader>
          {open && <ReceiptView r={open} />}
          <div className="no-print flex justify-end">
            <Button onClick={() => window.print()}>
              <Printer /> Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
