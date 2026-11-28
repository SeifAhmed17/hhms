import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getIn, useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import { auth } from "@/api";
import { handleApiError, isStatus } from "@/lib/api-errors";
import { emailValidation, passwordValidation, personValidationSchema } from "@/lib/validation";
import { AuthLayout } from "@/components/app/auth-layout";
import { SubmitButton } from "@/components/app/common";
import {
  emptyPerson,
  Field,
  PersonFieldsEditor,
  toPersonFields,
} from "@/components/app/person-fields";
import { Input } from "@/components/ui/input";

const signupSchema = yup.object({
  email: emailValidation,
  password: passwordValidation,
  confirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match.")
    .required("Confirm your password."),
  person: personValidationSchema,
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

export default function SignupPage() {
  const navigate = useNavigate();
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});

  async function submit(values: {
    email: string;
    password: string;
    confirm: string;
    person: ReturnType<typeof emptyPerson>;
  }) {
    setApiErrors({});
    try {
      await auth.register({
        email: values.email.trim(),
        password: values.password,
        ...toPersonFields(values.person),
      });
      toast.success("Account created. You can log in now.");
      navigate("/login");
    } catch (err) {
      if (isStatus(err, 409)) {
        toast.error("Account exists, please log in.", { duration: Infinity });
        navigate("/login");
      } else setApiErrors(handleApiError(err));
    }
  }

  const formik = useFormik({
    initialValues: { email: "", password: "", confirm: "", person: emptyPerson() },
    validationSchema: signupSchema,
    onSubmit: submit,
  });
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
    isSubmitting,
  } = formik;
  const personErrors = Object.fromEntries(
    personFieldNames.flatMap((name) => {
      const serverErrors = apiErrors[name];
      const validationError = getIn(errors, `person.${name}`);
      const wasTouched = getIn(touched, `person.${name}`);
      const messages =
        serverErrors ??
        (wasTouched && typeof validationError === "string" ? [validationError] : undefined);
      return messages ? [[name, messages]] : [];
    }),
  );

  return (
    <AuthLayout
      title="Create a patient account"
      subtitle="Staff accounts are created by the hospital administrator."
      wide
    >
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <section className="space-y-4">
          <h2 className="text-lg">Login details</h2>
          <Field
            id="email"
            label="Email"
            required
            errors={touched.email && errors.email ? [errors.email] : apiErrors["email"]}
          >
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="password"
              label="Password"
              required
              errors={
                touched.password && errors.password ? [errors.password] : apiErrors["password"]
              }
              hint="At least 8 characters."
            >
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>
            <Field
              id="confirm"
              label="Confirm password"
              required
              errors={touched.confirm && errors.confirm ? [errors.confirm] : undefined}
            >
              <Input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                value={values.confirm}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-lg">Personal details</h2>
          <PersonFieldsEditor
            value={values.person}
            onChange={(person) => void setFieldValue("person", person)}
            errors={personErrors}
          />
        </section>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <Link to="/login" className="text-sm font-medium text-primary hover:underline">
            I already have an account
          </Link>
          <SubmitButton type="submit" loading={isSubmitting}>
            Create account
          </SubmitButton>
        </div>
      </form>
    </AuthLayout>
  );
}
