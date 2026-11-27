import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { auth, USE_MOCKS, type Role } from "@/api";
import { LANDING, useAuth } from "@/lib/auth";
import { handleApiError, isStatus } from "@/lib/api-errors";
import { AuthLayout } from "@/components/app/auth-layout";
import { InlineAlert, SubmitButton } from "@/components/app/common";
import { Field } from "@/components/app/person-fields";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — HHMS" },
      { name: "description", content: "Log in to the Hurghada Hospital Management System." },
      { property: "og:title", content: "Log in — HHMS" },
      { property: "og:description", content: "Log in to the Hurghada Hospital Management System." },
    ],
  }),
  component: LoginPage,
});

const DEMO: { role: Role; email: string }[] = [
  { role: "Patient", email: "patient@hhms.test" },
  { role: "Receptionist", email: "reception@hhms.test" },
  { role: "Doctor", email: "doctor@hhms.test" },
  { role: "Pharmacist", email: "pharmacy@hhms.test" },
  { role: "Admin", email: "admin@hhms.test" },
];

function LoginPage() {
  const { login, user, ready } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    if (ready && user) navigate({ to: user.mustChangePassword ? "/change-password" : LANDING[user.role], replace: true });
  }, [ready, user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setWrong(false);
    try {
      const res = await auth.login({ email, password });
      login(res.token, res.user);
    } catch (err) {
      if (isStatus(err, 401)) setWrong(true);
      else handleApiError(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout title="Log in" subtitle="Patients and hospital staff use the same login.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        {wrong && <InlineAlert tone="danger" title="Wrong email or password" />}
        <Field id="email" label="Email" required>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field id="password" label="Password" required>
          <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        <SubmitButton type="submit" loading={busy} className="w-full">
          Log in
        </SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New patient?{" "}
        <Link to="/signup" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>

      {USE_MOCKS && (
        <div className="mt-6 border-t pt-4">
          <p className="text-xs text-muted-foreground">Demo mode · password <span className="mono-id">Password1</span></p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DEMO.map((d) => (
              <Button
                key={d.role}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setEmail(d.email);
                  setPassword("Password1");
                }}
              >
                {d.role}
              </Button>
            ))}
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
