import { Plus, Trash2 } from "lucide-react";
import type { Gender, PersonFields } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "./common";

export type PersonForm = PersonFields & { idType: "national" | "passport" };

export const emptyPerson = (): PersonForm => ({
  firstName: "",
  lastName: "",
  nationalId: "",
  passportNumber: "",
  gender: "Male",
  dateOfBirth: "",
  country: "Egypt",
  governorate: "",
  phoneNumbers: [""],
  idType: "national",
});

export function toPersonFields(f: PersonForm): PersonFields {
  return {
    firstName: f.firstName.trim(),
    lastName: f.lastName.trim(),
    ...(f.idType === "national" && f.nationalId?.trim() ? { nationalId: f.nationalId.trim() } : {}),
    ...(f.idType === "passport" && f.passportNumber?.trim()
      ? { passportNumber: f.passportNumber.trim() }
      : {}),
    gender: f.gender,
    dateOfBirth: f.dateOfBirth,
    country: f.country.trim(),
    ...(f.governorate?.trim() ? { governorate: f.governorate.trim() } : {}),
    phoneNumbers: f.phoneNumbers.map((p) => p.trim()).filter(Boolean),
  };
}

export function fromPerson(p: PersonFields): PersonForm {
  return {
    ...p,
    nationalId: p.nationalId ?? "",
    passportNumber: p.passportNumber ?? "",
    governorate: p.governorate ?? "",
    phoneNumbers: p.phoneNumbers.length ? p.phoneNumbers : [""],
    idType: p.passportNumber && !p.nationalId ? "passport" : "national",
  };
}

export function Field({
  id,
  label,
  required,
  errors,
  children,
  hint,
}: {
  id: string;
  label: string;
  required?: boolean;
  errors?: string[] | undefined;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {required && (
          <span className="text-destructive" aria-label="required">
            {" "}
            *
          </span>
        )}
      </Label>
      {children}
      {hint && !errors?.length && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      <FieldError messages={errors} />
    </div>
  );
}

function ChoiceGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex max-w-full flex-wrap gap-1 rounded-xl bg-slate-100 p-1"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 ${
            value === option.value
              ? "bg-white text-primary shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function PersonFieldsEditor({
  value,
  onChange,
  errors,
  lockIdentity,
}: {
  value: PersonForm;
  onChange: (v: PersonForm) => void;
  errors: Record<string, string[]>;
  lockIdentity?: boolean;
}) {
  const set = <K extends keyof PersonForm>(k: K, v: PersonForm[K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="firstName" label="First name" required errors={errors["firstName"]}>
          <Input
            id="firstName"
            value={value.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            autoComplete="given-name"
          />
        </Field>
        <Field id="lastName" label="Last name" required errors={errors["lastName"]}>
          <Input
            id="lastName"
            value={value.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            autoComplete="family-name"
          />
        </Field>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium">
          Identity document
          <span className="text-destructive" aria-label="required">
            {" "}
            *
          </span>
        </p>
        {lockIdentity ? (
          <p className="mono-id rounded-md border bg-muted px-3 py-2">
            {value.idType === "national"
              ? `National ID · ${value.nationalId}`
              : `Passport · ${value.passportNumber}`}
            <span className="ml-2 font-sans text-xs text-muted-foreground">
              (changes go through reception)
            </span>
          </p>
        ) : (
          <div className="space-y-2">
            <ChoiceGroup
              label="Identity document type"
              value={value.idType}
              onChange={(v) => set("idType", v as PersonForm["idType"])}
              options={[
                { value: "national", label: "National ID" },
                { value: "passport", label: "Passport" },
              ]}
            />
            {value.idType === "national" ? (
              <Input
                aria-label="National ID"
                className="mono-id"
                value={value.nationalId}
                onChange={(e) => set("nationalId", e.target.value)}
                placeholder="14-digit national ID"
              />
            ) : (
              <Input
                aria-label="Passport number"
                className="mono-id"
                value={value.passportNumber}
                onChange={(e) => set("passportNumber", e.target.value)}
                placeholder="Passport number"
              />
            )}
            <FieldError messages={errors["nationalId"] ?? errors["passportNumber"]} />
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="mb-1.5 block">
            Gender{" "}
            <span className="text-destructive" aria-label="required">
              {" "}
              *
            </span>
          </Label>
          <ChoiceGroup
            label="Gender"
            value={value.gender}
            onChange={(v) => set("gender", v as Gender)}
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
            ]}
          />
          <FieldError messages={errors["gender"]} />
        </div>
        <Field id="dateOfBirth" label="Date of birth" required errors={errors["dateOfBirth"]}>
          <Input
            id="dateOfBirth"
            type="date"
            className="tnum"
            max={new Date().toISOString().slice(0, 10)}
            value={value.dateOfBirth}
            onChange={(e) => set("dateOfBirth", e.target.value)}
          />
        </Field>
        <Field id="country" label="Country" required errors={errors["country"]}>
          <Input
            id="country"
            value={value.country}
            onChange={(e) => set("country", e.target.value)}
            autoComplete="country-name"
          />
        </Field>
        <Field id="governorate" label="Governorate" errors={errors["governorate"]}>
          <Input
            id="governorate"
            value={value.governorate}
            onChange={(e) => set("governorate", e.target.value)}
          />
        </Field>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium">
          Phone numbers
          <span className="text-destructive" aria-label="required">
            {" "}
            *
          </span>
        </p>
        <div className="space-y-2">
          {value.phoneNumbers.map((ph, i) => (
            <div key={i} className="flex gap-2">
              <Input
                aria-label={`Phone number ${i + 1}`}
                type="tel"
                className="tnum"
                value={ph}
                onChange={(e) =>
                  set(
                    "phoneNumbers",
                    value.phoneNumbers.map((x, j) => (j === i ? e.target.value : x)),
                  )
                }
                placeholder="+20 100 000 0000"
              />
              {value.phoneNumbers.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Remove phone number ${i + 1}`}
                  onClick={() =>
                    set(
                      "phoneNumbers",
                      value.phoneNumbers.filter((_, j) => j !== i),
                    )
                  }
                >
                  <Trash2 />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => set("phoneNumbers", [...value.phoneNumbers, ""])}
          >
            <Plus /> Add phone number
          </Button>
        </div>
        <FieldError messages={errors["phoneNumbers"]} />
      </div>
    </div>
  );
}
