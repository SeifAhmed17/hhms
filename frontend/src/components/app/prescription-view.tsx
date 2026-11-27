import type { Prescription } from "@/api";
import { fmtDateTime } from "@/lib/format";
import { PrescriptionBadge } from "./badges";

export function PrescriptionView({ rx }: { rx: Prescription }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <PrescriptionBadge status={rx.status} />
        <span className="text-muted-foreground">Written {fmtDateTime(rx.createdAt)}</span>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Doctor</dt>
          <dd className="font-medium">{rx.doctor.fullName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Patient</dt>
          <dd className="font-medium">{rx.patient.fullName}</dd>
        </div>
      </dl>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs font-semibold tracking-wide text-fg-secondary uppercase">
            <tr>
              <th className="px-3 py-2">Medicine</th>
              <th className="px-3 py-2">Dosage</th>
              <th className="px-3 py-2 text-right">Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rx.items.map((i) => (
              <tr key={i.id}>
                <td className="px-3 py-2 font-medium">{i.medicineName}</td>
                <td className="mono-id px-3 py-2">{i.dosage}</td>
                <td className="tnum px-3 py-2 text-right">{i.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rx.additionalNotes && (
        <div className="text-sm">
          <p className="text-muted-foreground">Notes</p>
          <p className="mt-0.5 whitespace-pre-wrap">{rx.additionalNotes}</p>
        </div>
      )}
      {rx.status === "Dispensed" && (
        <p className="text-sm text-muted-foreground">
          Dispensed {fmtDateTime(rx.dispensedAt)}
          {rx.dispensedBy ? ` by ${rx.dispensedBy}` : ""}
        </p>
      )}
    </div>
  );
}
