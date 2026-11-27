import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { patients } from "@/api";
import { handleApiError, isStatus } from "@/lib/api-errors";
import { PageHeader, Panel, SkeletonRows, SubmitButton } from "@/components/app/common";
import { Field, fromPerson, PersonFieldsEditor, toPersonFields, type PersonForm } from "@/components/app/person-fields";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/portal/profile")({
  head: () => ({
    meta: [
      { title: "My profile — HHMS" },
      { name: "description", content: "Update your contact details at Hurghada Hospital." },
      { property: "og:title", content: "My profile — HHMS" },
      { property: "og:description", content: "Update your contact details at Hurghada Hospital." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["patients", "me"], queryFn: patients.me });
  const [form, setForm] = useState<PersonForm | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (q.data) setForm(fromPerson(q.data));
  }, [q.data]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form || !q.data) return;
    setBusy(true);
    setErrors({});
    try {
      const { nationalId: _n, passportNumber: _p, ...editable } = toPersonFields(form);
      await patients.updateMe({ ...editable, rowVersion: q.data.rowVersion });
      toast.success("Profile saved.");
      qc.invalidateQueries({ queryKey: ["patients", "me"] });
    } catch (err) {
      if (isStatus(err, 409)) {
        toast.error("Someone else changed this record. It has been reloaded, please try again.", { duration: Infinity });
        qc.invalidateQueries({ queryKey: ["patients", "me"] });
      } else setErrors(handleApiError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="My profile" description="Your contact details. Medical information is kept by your doctor." />
      <Panel className="max-w-[720px] p-5 sm:p-6">
        {!form || !q.data ? (
          <SkeletonRows rows={6} className="p-0" />
        ) : (
          <form onSubmit={save} className="space-y-5" noValidate>
            <Field id="email" label="Email" hint="To change your email, please visit reception.">
              <Input id="email" value={q.data.email} readOnly disabled />
            </Field>
            <PersonFieldsEditor value={form} onChange={setForm} errors={errors} lockIdentity />
            <div className="flex justify-end border-t pt-5">
              <SubmitButton type="submit" loading={busy}>Save changes</SubmitButton>
            </div>
          </form>
        )}
      </Panel>
    </>
  );
}
