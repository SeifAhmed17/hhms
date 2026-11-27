import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { BookingFlow } from "@/components/app/booking-flow";
import { PageHeader, Panel } from "@/components/app/common";
import { Button } from "@/components/ui/button";
import { fmtDateTime } from "@/lib/format";

export const Route = createFileRoute("/portal/book")({
  head: () => ({
    meta: [
      { title: "Book an appointment — HHMS" },
      { name: "description", content: "Choose a department, doctor and time to book a hospital appointment." },
      { property: "og:title", content: "Book an appointment — HHMS" },
      { property: "og:description", content: "Choose a department, doctor and time to book a hospital appointment." },
    ],
  }),
  component: BookPage,
});

function BookPage() {
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
            <Button asChild className="mt-6">
              <Link to="/portal/appointments">View my appointments</Link>
            </Button>
          </Panel>
        )}
      />
    </>
  );
}
