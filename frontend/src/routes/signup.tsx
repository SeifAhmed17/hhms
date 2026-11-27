import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { auth } from "@/api";
import { handleApiError, isStatus } from "@/lib/api-errors";
import { AuthLayout } from "@/components/app/auth-layout";
import { SubmitButton } from "@/components/app/common";
import { emptyPerson, Field, PersonFieldsEditor, toPersonFields } from "@/components/app/person-fields";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create a patient account — HHMS" },
      { name: "description", content: "Register as a patient at Hurghada Hospital to book appointments online." },
      { property: "og:title", content: "Create a patient account — HHMS" },
      { property: "og:description", content: "Register as a patient at Hurghada Hospital to book appointments online." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [person, setPerson] = useState(emptyPerson());
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const local: Record<string, string[]> = {};
    if (!email.trim()) local.email = ["Email is required."];
    if (password.length < 8) local.password = ["Use at least 8 characters."];
    if (password !== confirm) local.confirm = ["Passwords do not match."];
    if (Object.keys(local).length) return setErrors(local);
    setBusy(true);
    setErrors({});
    try {
      await auth.register({ email: email.trim(), password, ...toPersonFields(person) });
      toast.success("Account created. You can log in now.");
      navigate({ to: "/login" });
    } catch (err) {
      if (isStatus(err, 409)) {
        toast.error("Account exists, please log in.", { duration: Infinity });
        navigate({ to: "/login" });
      } else setErrors(handleApiError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout title="Create a patient account" subtitle="Staff accounts are created by the hospital administrator." wide>
      <form onSubmit={submit} className="space-y-6" noValidate>
        <section className="space-y-4">
          <h2 className="text-lg">Login details</h2>
          <Field id="email" label="Email" required errors={errors.email}>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="password" label="Password" required errors={errors.password} hint="At least 8 characters.">
              <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            <Field id="confirm" label="Confirm password" required errors={errors.confirm}>
              <Input id="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </Field>
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-lg">Personal details</h2>
          <PersonFieldsEditor value={person} onChange={setPerson} errors={errors} />
        </section>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <Link to="/login" className="text-sm font-medium text-primary hover:underline">
            I already have an account
          </Link>
          <SubmitButton type="submit" loading={busy}>
            Create account
          </SubmitButton>
        </div>
      </form>
    </AuthLayout>
  );
}
