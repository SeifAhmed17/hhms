import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LANDING, useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HHMS — Hurghada Hospital Management System" },
      { name: "description", content: "Book appointments, view records and manage hospital work at Hurghada Hospital." },
      { property: "og:title", content: "HHMS — Hurghada Hospital Management System" },
      { property: "og:description", content: "Book appointments, view records and manage hospital work at Hurghada Hospital." },
    ],
  }),
  component: Index,
});

function Index() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!ready) return;
    if (!user) navigate({ to: "/login", replace: true });
    else navigate({ to: user.mustChangePassword ? "/change-password" : LANDING[user.role], replace: true });
  }, [ready, user, navigate]);
  return (
    <div className="p-6">
      <Skeleton className="h-10 w-48" />
    </div>
  );
}
