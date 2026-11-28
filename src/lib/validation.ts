import * as yup from "yup";

export const emailValidation = yup
  .string()
  .trim()
  .email("Enter a valid email address.")
  .required("Email is required.");

export const passwordValidation = yup
  .string()
  .min(8, "Use at least 8 characters.")
  .required("Password is required.");

export const personValidationSchema = yup.object({
  firstName: yup.string().trim().required("First name is required."),
  lastName: yup.string().trim().required("Last name is required."),
  idType: yup.string().oneOf(["national", "passport"]).required(),
  nationalId: yup.string().when("idType", {
    is: "national",
    then: (schema) => schema.trim().required("National ID is required."),
    otherwise: (schema) => schema.notRequired(),
  }),
  passportNumber: yup.string().when("idType", {
    is: "passport",
    then: (schema) => schema.trim().required("Passport number is required."),
    otherwise: (schema) => schema.notRequired(),
  }),
  gender: yup
    .string()
    .oneOf(["Male", "Female"], "Choose a gender.")
    .required("Gender is required."),
  dateOfBirth: yup
    .string()
    .required("Date of birth is required.")
    .test(
      "not-in-future",
      "Date of birth cannot be in the future.",
      (value) => !value || value <= new Date().toISOString().slice(0, 10),
    ),
  country: yup.string().trim().required("Country is required."),
  governorate: yup.string(),
  phoneNumbers: yup
    .array()
    .of(yup.string().trim())
    .test("has-phone", "Enter at least one phone number.", (phones) =>
      Boolean(phones?.some((phone) => phone?.trim())),
    )
    .required(),
});
