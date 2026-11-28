import { useState } from "react";
import { getIn, useFormik } from "formik";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { patients } from "@/api";
import { handleApiError, isStatus } from "@/lib/api-errors";
import { personValidationSchema } from "@/lib/validation";
import { PageHeader, Panel, SkeletonRows, SubmitButton } from "@/components/app/common";
import {
  emptyPerson,
  Field,
  fromPerson,
  PersonFieldsEditor,
  toPersonFields,
  type PersonForm,
} from "@/components/app/person-fields";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["patients", "me"], queryFn: patients.me });
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});

  async function save(form: PersonForm) {
    if (!q.data) return;
    setApiErrors({});
    try {
      const { nationalId: _n, passportNumber: _p, ...editable } = toPersonFields(form);
      await patients.updateMe({ ...editable, rowVersion: q.data.rowVersion });
      toast.success("Profile saved.");
      qc.invalidateQueries({ queryKey: ["patients", "me"] });
    } catch (err) {
      if (isStatus(err, 409)) {
        toast.error("Someone else changed this record. It has been reloaded, please try again.", {
          duration: Infinity,
        });
        qc.invalidateQueries({ queryKey: ["patients", "me"] });
      } else setApiErrors(handleApiError(err));
    }
  }

  const formik = useFormik<PersonForm>({
    initialValues: q.data ? fromPerson(q.data) : emptyPerson(),
    enableReinitialize: true,
    validationSchema: personValidationSchema,
    onSubmit: save,
  });
  const personFieldNames = [
    "firstName",
    "lastName",
    "nationalId",
    "passportNumber",
    "gender",
    "dateOfBirth",
    "country",
    "governorate",
    "phoneNumbers",
  ];
  const fieldErrors = Object.fromEntries(
    personFieldNames.flatMap((name) => {
      const serverErrors = apiErrors[name];
      const validationError = getIn(formik.errors, name);
      const wasTouched = getIn(formik.touched, name);
      const messages =
        serverErrors ??
        (wasTouched && typeof validationError === "string" ? [validationError] : undefined);
      return messages ? [[name, messages]] : [];
    }),
  );

  return (
    <>
      <PageHeader
        title="My profile"
        description="Your contact details. Medical information is kept by your doctor."
      />
      <Panel className="max-w-[720px] p-5 sm:p-6">
        {!q.data ? (
          <SkeletonRows rows={6} className="p-0" />
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
            <Field id="email" label="Email" hint="To change your email, please visit reception.">
              <Input id="email" value={q.data.email} readOnly disabled />
            </Field>
            <PersonFieldsEditor
              value={formik.values}
              onChange={(person) => void formik.setValues(person)}
              errors={fieldErrors}
              lockIdentity
            />
            <div className="flex justify-end border-t pt-5">
              <SubmitButton type="submit" loading={formik.isSubmitting}>
                Save changes
              </SubmitButton>
            </div>
          </form>
        )}
      </Panel>
    </>
  );
}
