import type { Receipt } from "@/api";
import { fmtDateTime, fmtEGP } from "@/lib/format";

export function ReceiptView({ r }: { r: Receipt }) {
  const rows: [string, string][] = [
    ["Patient", r.patientName],
    ["Doctor", r.doctorName],
    ["Department", r.departmentName],
    ["Appointment", fmtDateTime(r.appointmentDateTime)],
    ["Payment method", r.paymentMethod],
    ["Paid at", fmtDateTime(r.paidAt)],
    ["Received by", r.receptionistName],
  ];
  return (
    <div className="print-area rounded-lg border bg-card p-6">
      <div className="flex items-start justify-between gap-4 border-b pb-4">
        <div>
          <p className="text-lg font-semibold">Hurghada Hospital</p>
          <p className="text-sm text-muted-foreground">Consultation receipt</p>
        </div>
        <p className="mono-id text-muted-foreground">#{r.id}</p>
      </div>
      <dl className="divide-y text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-2 flex items-baseline justify-between border-t pt-4">
        <span className="font-medium">Amount paid</span>
        <span className="tnum text-2xl font-semibold">{fmtEGP(r.amount)}</span>
      </div>
    </div>
  );
}
