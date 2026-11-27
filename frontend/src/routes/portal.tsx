import { createFileRoute } from "@tanstack/react-router";
import { PatientShell } from "@/components/app/shell";

export const Route = createFileRoute("/portal")({
  component: PatientShell,
});
