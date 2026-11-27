import { useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronLeft } from "lucide-react";
import { appointments, departments, doctors, type AppointmentSummary, type Department, type Doctor } from "@/api";
import { addDaysYmd, cairoYmd, fmtDateTime, fmtEGP, fmtPlainDate, fmtTime } from "@/lib/format";
import { handleApiError, isStatus } from "@/lib/api-errors";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { EmptyState, InlineAlert, Panel, SubmitButton } from "./common";

type Step = "patient" | "department" | "doctor" | "time" | "complaint" | "confirm";

export function BookingFlow({
  patientStep,
  patient,
  onDone,
}: {
  /** Rendered as the first step when booking on behalf of a patient */
  patientStep?: (select: (p: { id: string; fullName: string }) => void) => ReactNode;
  patient?: { id: string; fullName: string } | null;
  onDone: (a: AppointmentSummary) => ReactNode;
}) {
  const steps: Step[] = [...(patientStep ? (["patient"] as Step[]) : []), "department", "doctor", "time", "complaint", "confirm"];
  const [chosenPatient, setChosenPatient] = useState(patient ?? null);
  const [step, setStep] = useState<Step>(patientStep && !patient ? "patient" : "department");
  const [dep, setDep] = useState<Department | null>(null);
  const [doc, setDoc] = useState<Doctor | null>(null);
  const [date, setDate] = useState(cairoYmd());
  const [slot, setSlot] = useState<string | null>(null);
  const [complaint, setComplaint] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<AppointmentSummary | null>(null);
  const qc = useQueryClient();

  const deps = useQuery({ queryKey: ["departments"], queryFn: departments.list });
  const docs = useQuery({ queryKey: ["doctors", dep?.id], queryFn: () => doctors.list({ departmentId: dep!.id }), enabled: !!dep });
  const avail = useQuery({ queryKey: ["availability", doc?.id, date], queryFn: () => doctors.availability(doc!.id, date), enabled: !!doc && step === "time" });

  const idx = steps.indexOf(step);
  const back = () => setStep(steps[Math.max(0, idx - 1)]);

  async function book() {
    if (!doc || !slot) return;
    setBusy(true);
    try {
      const a = await appointments.create({ doctorId: doc.id, appointmentDateTime: slot, complaint: complaint.trim() || undefined, patientId: patientStep ? chosenPatient?.id : undefined });
      qc.invalidateQueries({ queryKey: ["appointments"] });
      setDone(a);
    } catch (e) {
      if (isStatus(e, 409)) {
        toast.error("That time was just taken. Please pick another slot.", { duration: Infinity });
        setSlot(null);
        setStep("time");
        qc.invalidateQueries({ queryKey: ["availability"] });
      } else if (isStatus(e, 422)) {
        toast.error(e.problem.detail ?? "That slot is no longer valid.", { duration: Infinity });
        setSlot(null);
        setStep("time");
      } else handleApiError(e);
    } finally {
      setBusy(false);
    }
  }

  if (done) return <>{onDone(done)}</>;

  const labels: Record<Step, string> = { patient: "Patient", department: "Department", doctor: "Doctor", time: "Date & time", complaint: "Complaint", confirm: "Confirm" };

  return (
    <div className="max-w-3xl">
      <ol className="mb-6 flex flex-wrap gap-x-4 gap-y-2 text-sm" aria-label="Booking progress">
        {steps.map((s, i) => (
          <li key={s} className={cn("flex items-center gap-2", i === idx ? "font-medium text-foreground" : "text-muted-foreground")} aria-current={i === idx ? "step" : undefined}>
            <span className={cn("flex size-6 items-center justify-center rounded-full border text-xs tnum", i < idx && "border-primary bg-primary text-primary-foreground", i === idx && "border-primary text-primary")}>
              {i < idx ? <Check className="size-3.5" aria-hidden /> : i + 1}
            </span>
            {labels[s]}
          </li>
        ))}
      </ol>

      {idx > 0 && step !== "patient" && (
        <Button variant="ghost" size="sm" className="mb-3 -ml-2" onClick={back}>
          <ChevronLeft /> Back
        </Button>
      )}

      {step === "patient" && patientStep?.((p) => {
        setChosenPatient(p);
        setStep("department");
      })}

      {step === "department" && (
        <section>
          <h2 className="mb-3 text-lg">Choose a department</h2>
          {deps.isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-20" />)}</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {deps.data?.map((d) => (
                <button key={d.id} onClick={() => { setDep(d); setDoc(null); setSlot(null); setStep("doctor"); }}
                  className={cn("rounded-lg border bg-card p-4 text-left transition-colors hover:border-primary hover:bg-primary-tint", dep?.id === d.id && "border-primary bg-primary-tint")}>
                  <span className="block font-medium">{d.name}</span>
                  <span className="tnum mt-1 block text-sm text-muted-foreground">Consultation {fmtEGP(d.consultationFee)}</span>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {step === "doctor" && (
        <section>
          <h2 className="mb-3 text-lg">Choose a doctor in {dep?.name}</h2>
          {docs.isLoading ? (
            <div className="space-y-2">{[0, 1].map((i) => <Skeleton key={i} className="h-16" />)}</div>
          ) : docs.data?.length ? (
            <div className="space-y-2">
              {docs.data.map((d) => (
                <button key={d.id} onClick={() => { setDoc(d); setSlot(null); setStep("time"); }}
                  className={cn("flex w-full items-center justify-between gap-4 rounded-lg border bg-card p-4 text-left hover:border-primary hover:bg-primary-tint", doc?.id === d.id && "border-primary bg-primary-tint")}>
                  <span>
                    <span className="block font-medium">{d.fullName}</span>
                    <span className="block text-sm text-muted-foreground">{d.appointmentDurationMinutes}-minute appointments</span>
                  </span>
                  <span className="tnum text-sm font-medium">{fmtEGP(d.consultationFee)}</span>
                </button>
              ))}
            </div>
          ) : (
            <Panel><EmptyState title="No doctors in this department yet" description="Please choose another department." /></Panel>
          )}
        </section>
      )}

      {step === "time" && doc && (
        <section>
          <h2 className="mb-3 text-lg">Pick a date and time with {doc.fullName}</h2>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Button variant="outline" size="icon" disabled={date <= cairoYmd()} onClick={() => { setDate(addDaysYmd(date, -1)); setSlot(null); }} aria-label="Previous day">
              <ChevronLeft />
            </Button>
            <Input type="date" aria-label="Date" className="tnum w-44" min={cairoYmd()} value={date} onChange={(e) => { if (e.target.value) { setDate(e.target.value < cairoYmd() ? cairoYmd() : e.target.value); setSlot(null); } }} />
            <Button variant="outline" size="icon" onClick={() => { setDate(addDaysYmd(date, 1)); setSlot(null); }} aria-label="Next day">
              <ChevronLeft className="rotate-180" />
            </Button>
            <span className="text-sm text-muted-foreground">{fmtPlainDate(date)} · Cairo time</span>
          </div>
          {avail.isLoading ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">{Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
          ) : !avail.data?.slots.length ? (
            <Panel><EmptyState title="Doctor does not work this day" description="Try another date." /></Panel>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6" role="radiogroup" aria-label="Time slots">
                {avail.data.slots.map((s) => (
                  <button key={s.start} role="radio" aria-checked={slot === s.start} disabled={!s.isAvailable} onClick={() => setSlot(s.start)}
                    className={cn("tnum h-10 rounded-md border text-sm font-medium transition-colors",
                      s.isAvailable ? "bg-card hover:border-primary" : "cursor-not-allowed bg-muted text-disabled line-through",
                      slot === s.start && "border-primary bg-primary text-primary-foreground hover:border-primary")}>
                    {fmtTime(s.start)}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button disabled={!slot} onClick={() => setStep("complaint")}>Continue</Button>
              </div>
            </>
          )}
        </section>
      )}

      {step === "complaint" && (
        <section>
          <h2 className="mb-1 text-lg">What brings {patientStep ? "the patient" : "you"} in?</h2>
          <p className="mb-3 text-sm text-muted-foreground">Optional. A short note helps the doctor prepare.</p>
          <Textarea aria-label="Complaint" rows={4} value={complaint} onChange={(e) => setComplaint(e.target.value)} placeholder="e.g. Knee pain for two weeks" />
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setStep("confirm")}>Continue</Button>
          </div>
        </section>
      )}

      {step === "confirm" && dep && doc && slot && (
        <section>
          <h2 className="mb-3 text-lg">Confirm the appointment</h2>
          <Panel className="divide-y">
            {chosenPatient && patientStep && <Row label="Patient" value={chosenPatient.fullName} />}
            <Row label="Department" value={dep.name} />
            <Row label="Doctor" value={doc.fullName} />
            <Row label="Date & time" value={fmtDateTime(slot)} />
            {complaint.trim() && <Row label="Complaint" value={complaint.trim()} />}
            <Row label="Consultation fee" value={<span className="tnum font-medium">{fmtEGP(doc.consultationFee)}</span>} />
          </Panel>
          <div className="mt-4"><InlineAlert>Payment is taken at reception.</InlineAlert></div>
          <div className="mt-6 flex justify-end">
            <SubmitButton loading={busy} onClick={book}>Book appointment</SubmitButton>
          </div>
        </section>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:gap-4">
      <span className="w-40 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
