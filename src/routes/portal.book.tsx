import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { BookingFlow } from "@/components/app/booking-flow";
import { PageHeader, Panel } from "@/components/app/common";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fmtDateTime } from "@/lib/format";

export default function BookPage() {
  return (
    <>
      <PageHeader title="Book an appointment" />
      <BookingFlow
        onDone={(a) => (
          <Panel className="max-w-xl p-6">
            <CheckCircle2 className="size-8 text-success" aria-hidden />
            <h2 className="mt-3 text-xl">Appointment booked</h2>
            <p className="mt-1 text-sm text-fg-secondary">
              {a.doctor.fullName} · {a.doctor.departmentName}
              <br />
              <span className="tnum">{fmtDateTime(a.appointmentDateTime)}</span>
            </p>
            <Link to="/portal/appointments" className={cn(buttonVariants(), "mt-6")}>
              View my appointments
            </Link>
          </Panel>
        )}
      />
    </>
  );
}
