import { Plus, Trash2 } from "lucide-react";
import type { Gender, PersonFields } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
    nationalId: f.idType === "national" ? f.nationalId?.trim() || undefined : undefined,
    passportNumber: f.idType === "passport" ? f.passportNumber?.trim() || undefined : undefined,
    gender: f.gender,
    dateOfBirth: f.dateOfBirth,
    country: f.country.trim(),
    governorate: f.governorate?.trim() || undefined,
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

export function Field({ id, label, required, errors, children, hint }: { id: string; label: string; required?: boolean; errors?: string[]; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {required && (
          <span className="text-destructive" aria-label="required">
            {" "}*
          </span>
        )}
      </Label>
      {children}
      {hint && !errors?.length && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      <FieldError messages={errors} />
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
  const set = <K extends keyof PersonForm>(k: K, v: PersonForm[K]) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="firstName" label="First name" required errors={errors.firstName}>
          <Input id="firstName" value={value.firstName} onChange={(e) => set("firstName", e.target.value)} autoComplete="given-name" />
        </Field>
        <Field id="lastName" label="Last name" required errors={errors.lastName}>
          <Input id="lastName" value={value.lastName} onChange={(e) => set("lastName", e.target.value)} autoComplete="family-name" />
        </Field>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium">
          Identity document<span className="text-destructive" aria-label="required"> *</span>
        </p>
        {lockIdentity ? (
          <p className="mono-id rounded-md border bg-muted px-3 py-2">
            {value.idType === "national" ? `National ID · ${value.nationalId}` : `Passport · ${value.passportNumber}`}
            <span className="ml-2 font-sans text-xs text-muted-foreground">(changes go through reception)</span>
          </p>
        ) : (
          <div className="space-y-2">
            <ToggleGroup
              type="single"
              variant="outline"
              value={value.idType}
              onValueChange={(v) => v && set("idType", v as PersonForm["idType"])}
              className="justify-start"
            >
              <ToggleGroupItem value="national" className="px-4">National ID</ToggleGroupItem>
              <ToggleGroupItem value="passport" className="px-4">Passport</ToggleGroupItem>
            </ToggleGroup>
            {value.idType === "national" ? (
              <Input aria-label="National ID" className="mono-id" value={value.nationalId} onChange={(e) => set("nationalId", e.target.value)} placeholder="14-digit national ID" />
            ) : (
              <Input aria-label="Passport number" className="mono-id" value={value.passportNumber} onChange={(e) => set("passportNumber", e.target.value)} placeholder="Passport number" />
            )}
            <FieldError messages={errors.nationalId ?? errors.passportNumber} />
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="gender" label="Gender" required errors={errors.gender}>
          <ToggleGroup
            id="gender"
            type="single"
            variant="outline"
            value={value.gender}
            onValueChange={(v) => v && set("gender", v as Gender)}
            className="justify-start"
          >
            <ToggleGroupItem value="Male" className="px-4">Male</ToggleGroupItem>
            <ToggleGroupItem value="Female" className="px-4">Female</ToggleGroupItem>
          </ToggleGroup>
        </Field>
        <Field id="dateOfBirth" label="Date of birth" required errors={errors.dateOfBirth}>
          <Input id="dateOfBirth" type="date" className="tnum" max={new Date().toISOString().slice(0, 10)} value={value.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
        </Field>
        <Field id="country" label="Country" required errors={errors.country}>
          <Input id="country" value={value.country} onChange={(e) => set("country", e.target.value)} autoComplete="country-name" />
        </Field>
        <Field id="governorate" label="Governorate" errors={errors.governorate}>
          <Input id="governorate" value={value.governorate} onChange={(e) => set("governorate", e.target.value)} />
        </Field>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium">
          Phone numbers<span className="text-destructive" aria-label="required"> *</span>
        </p>
        <div className="space-y-2">
          {value.phoneNumbers.map((ph, i) => (
            <div key={i} className="flex gap-2">
              <Input
                aria-label={`Phone number ${i + 1}`}
                type="tel"
                className="tnum"
                value={ph}
                onChange={(e) => set("phoneNumbers", value.phoneNumbers.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder="+20 100 000 0000"
              />
              {value.phoneNumbers.length > 1 && (
                <Button type="button" variant="outline" size="icon" aria-label={`Remove phone number ${i + 1}`} onClick={() => set("phoneNumbers", value.phoneNumbers.filter((_, j) => j !== i))}>
                  <Trash2 />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="ghost" size="sm" onClick={() => set("phoneNumbers", [...value.phoneNumbers, ""])}>
            <Plus /> Add phone number
          </Button>
        </div>
        <FieldError messages={errors.phoneNumbers} />
      </div>
    </div>
  );
}
