import { toast } from "sonner";
import { ApiError } from "@/api";

/** Show a non-field API error as a toast. Returns field errors (400) for the form to display. */
export function handleApiError(e: unknown, overrides: Partial<Record<number, string>> = {}): Record<string, string[]> {
  if (e instanceof ApiError) {
    if (e.status === 400 && Object.keys(e.fieldErrors).length) return e.fieldErrors;
    const msg =
      overrides[e.status] ??
      (e.status === 403
        ? "You are not allowed to do this."
        : e.status === 404
          ? "Not found."
          : e.status === 409
            ? e.problem.detail || "Someone else changed this record. It has been reloaded, please try again."
            : e.problem.detail || e.problem.title || "Something went wrong.");
    if (e.status !== 401) toast.error(msg, { duration: Infinity });
    return {};
  }
  toast.error("Could not reach the server. Check your connection and try again.", { duration: Infinity });
  return {};
}

export function isStatus(e: unknown, status: number): e is ApiError {
  return e instanceof ApiError && e.status === status;
}
