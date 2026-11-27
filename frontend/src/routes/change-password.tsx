import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { auth } from "@/api";
import { LANDING, useAuth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-errors";
import { AuthLayout } from "@/components/app/auth-layout";
import { InlineAlert, SubmitButton } from "@/components/app/common";
import { Field } from "@/components/app/person-fields";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/change-password")({
  head: () => ({
    meta: [
      { title: "Change password — HHMS" },
      { name: "description", content: "Change your HHMS account password." },
      { property: "og:title", content: "Change password — HHMS" },
      { property: "og:description", content: "Change your HHMS account password." },
    ],
  }),
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const { user, ready, refresh } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/login", replace: true });
  }, [ready, user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const local: Record<string, string[]> = {};
    if (!current) local.currentPassword = ["Enter your current password."];
    if (next.length < 8) local.newPassword = ["Use at least 8 characters."];
    if (next !== confirm) local.confirm = ["Passwords do not match."];
    if (Object.keys(local).length) return setErrors(local);
    setBusy(true);
    setErrors({});
    try {
      await auth.changePassword({ currentPassword: current, newPassword: next });
      const me = await refresh();
      toast.success("Password changed.");
      if (me) navigate({ to: LANDING[me.role], replace: true });
    } catch (err) {
      setErrors(handleApiError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout title="Change password">
      <form onSubmit={submit} className="space-y-4" noValidate>
        {user?.mustChangePassword && (
          <InlineAlert tone="warning" title="Please set a new password">
            You signed in with a temporary password. Choose your own before continuing.
          </InlineAlert>
        )}
        <Field id="current" label="Current password" required errors={errors.currentPassword}>
          <Input id="current" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
        <Field id="next" label="New password" required errors={errors.newPassword} hint="At least 8 characters.">
          <Input id="next" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
        </Field>
        <Field id="confirm" label="Confirm new password" required errors={errors.confirm}>
          <Input id="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
        <SubmitButton type="submit" loading={busy} className="w-full">
          Change password
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}
