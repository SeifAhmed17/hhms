import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import { auth } from "@/api";
import { LANDING, useAuth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-errors";
import { passwordValidation } from "@/lib/validation";
import { AuthLayout } from "@/components/app/auth-layout";
import { InlineAlert, SubmitButton } from "@/components/app/common";
import { Field } from "@/components/app/person-fields";
import { Input } from "@/components/ui/input";

const changePasswordSchema = yup.object({
  current: yup.string().required("Enter your current password."),
  next: passwordValidation,
  confirm: yup
    .string()
    .oneOf([yup.ref("next")], "Passwords do not match.")
    .required("Confirm your new password."),
});

export default function ChangePasswordPage() {
  const { user, ready, refresh } = useAuth();
  const navigate = useNavigate();
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (ready && !user) navigate("/login", { replace: true });
  }, [ready, user, navigate]);

  async function submit(values: { current: string; next: string; confirm: string }) {
    setApiErrors({});
    try {
      await auth.changePassword({ currentPassword: values.current, newPassword: values.next });
      const me = await refresh();
      toast.success("Password changed.");
      if (me) navigate(LANDING[me.role], { replace: true });
    } catch (err) {
      setApiErrors(handleApiError(err));
    }
  }

  const formik = useFormik({
    initialValues: { current: "", next: "", confirm: "" },
    validationSchema: changePasswordSchema,
    onSubmit: submit,
  });

  return (
    <AuthLayout title="Change password">
      <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
        {user?.mustChangePassword && (
          <InlineAlert tone="warning" title="Please set a new password">
            You signed in with a temporary password. Choose your own before continuing.
          </InlineAlert>
        )}
        <Field
          id="current"
          label="Current password"
          required
          errors={
            formik.touched.current && formik.errors.current
              ? [formik.errors.current]
              : apiErrors["currentPassword"]
          }
        >
          <Input
            id="current"
            name="current"
            type="password"
            autoComplete="current-password"
            value={formik.values.current}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Field>
        <Field
          id="next"
          label="New password"
          required
          errors={
            formik.touched.next && formik.errors.next
              ? [formik.errors.next]
              : apiErrors["newPassword"]
          }
          hint="At least 8 characters."
        >
          <Input
            id="next"
            name="next"
            type="password"
            autoComplete="new-password"
            value={formik.values.next}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Field>
        <Field
          id="confirm"
          label="Confirm new password"
          required
          errors={
            formik.touched.confirm && formik.errors.confirm ? [formik.errors.confirm] : undefined
          }
        >
          <Input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            value={formik.values.confirm}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Field>
        <SubmitButton type="submit" loading={formik.isSubmitting} className="w-full">
          Change password
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}
