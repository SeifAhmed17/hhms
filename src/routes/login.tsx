import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { auth, USE_MOCKS, type Role } from "@/api";
import { LANDING, useAuth } from "@/lib/auth";
import { handleApiError, isStatus } from "@/lib/api-errors";
import { emailValidation } from "@/lib/validation";
import { AuthLayout } from "@/components/app/auth-layout";
import { InlineAlert, SubmitButton } from "@/components/app/common";
import { Field } from "@/components/app/person-fields";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DEMO: { role: Role; email: string }[] = [
  { role: "Patient", email: "patient@hhms.test" },
  { role: "Receptionist", email: "reception@hhms.test" },
  { role: "Doctor", email: "doctor@hhms.test" },
  { role: "Pharmacist", email: "pharmacy@hhms.test" },
  { role: "Admin", email: "admin@hhms.test" },
];

const loginSchema = yup.object({
  email: emailValidation,
  password: yup.string().required("Password is required."),
});

type LoginValues = { email: string; password: string };

export default function LoginPage() {
  const { login, user, ready } = useAuth();
  const navigate = useNavigate();
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    if (ready && user)
      navigate(user.mustChangePassword ? "/change-password" : LANDING[user.role], {
        replace: true,
      });
  }, [ready, user, navigate]);

  async function submit({ email, password }: LoginValues) {
    setWrong(false);
    try {
      const res = await auth.login({ email: email.trim(), password });
      login(res.token, res.user);
    } catch (err) {
      if (isStatus(err, 401)) setWrong(true);
      else handleApiError(err);
    }
  }

  const formik = useFormik<LoginValues>({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: submit,
  });

  return (
    <AuthLayout title="Log in" subtitle="Patients and hospital staff use the same login.">
      <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
        {wrong && <InlineAlert tone="danger" title="Wrong email or password" />}
        <Field
          id="email"
          label="Email"
          required
          errors={formik.touched.email && formik.errors.email ? [formik.errors.email] : undefined}
        >
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Field>
        <Field
          id="password"
          label="Password"
          required
          errors={
            formik.touched.password && formik.errors.password ? [formik.errors.password] : undefined
          }
        >
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Field>
        <SubmitButton type="submit" loading={formik.isSubmitting} className="w-full">
          Log in
        </SubmitButton>
        {USE_MOCKS && (
          <div className="mt-6 border-t pt-4">
            <p className="text-xs text-muted-foreground">
              Demo mode · password <span className="mono-id">Password1</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {DEMO.map((d) => (
                <Button
                  key={d.role}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void formik.setFieldValue("email", d.email);
                    void formik.setFieldValue("password", "Password1");
                    setWrong(false);
                  }}
                >
                  {d.role}
                </Button>
              ))}
            </div>
          </div>
        )}
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New patient?{" "}
        <Link to="/signup" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
