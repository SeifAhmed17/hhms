import type { AuthUser, ProblemDetails } from "./types";

const TOKEN_KEY = "hhms.token";
const USER_KEY = "hhms.user";

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || "/api/v1";
// Mocks are on unless explicitly disabled, so the app works without a backend.
export const USE_MOCKS: boolean = (import.meta.env.VITE_USE_MOCKS ?? "true") !== "false";

export class ApiError extends Error {
  status: number;
  problem: ProblemDetails;
  constructor(status: number, problem: ProblemDetails) {
    super(problem.detail || problem.title || `Request failed (${status})`);
    this.status = status;
    this.problem = problem;
  }
  get fieldErrors(): Record<string, string[]> {
    return this.problem.errors ?? {};
  }
}

export const session = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  getUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  },
  set(token: string, user: AuthUser) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  setUser(user: AuthUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

type Query = Record<string, string | number | boolean | undefined | null>;

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  query?: Query;
  body?: unknown;
  auth?: boolean;
}

function buildQuery(q?: Query) {
  if (!q) return "";
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v === undefined || v === null || v === "") continue;
    p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

function handleUnauthorized() {
  session.clear();
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.assign("/login");
  }
}

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const method = opts.method ?? "GET";
  const token = opts.auth === false ? null : session.getToken();

  if (USE_MOCKS) {
    const { mockHandle } = await import("./mock");
    const res = await mockHandle({ method, path, query: opts.query ?? {}, body: opts.body, token });
    if (res.status >= 400) {
      if (res.status === 401 && opts.auth !== false) handleUnauthorized();
      throw new ApiError(res.status, (res.body as ProblemDetails) ?? {});
    }
    return res.body as T;
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}${buildQuery(opts.query)}`, {
    method,
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  if (!res.ok) {
    if (res.status === 401 && opts.auth !== false) handleUnauthorized();
    let problem: ProblemDetails = { status: res.status };
    try {
      problem = await res.json();
    } catch {
      /* empty body */
    }
    throw new ApiError(res.status, problem);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
