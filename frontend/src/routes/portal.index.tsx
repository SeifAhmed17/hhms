import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/portal/")({
  beforeLoad: () => {
    throw redirect({ to: "/portal/appointments" });
  },
});
