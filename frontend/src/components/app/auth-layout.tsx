import type { ReactNode } from "react";

export function AuthLayout({ title, subtitle, children, wide }: { title: string; subtitle?: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-12 sm:items-center">
      <div className={wide ? "w-full max-w-2xl" : "w-full max-w-md"}>
        <p className="mb-6 text-center text-sm font-semibold tracking-tight text-muted-foreground">
          HHMS · Hurghada Hospital
        </p>
        <div className="rounded-lg border bg-card p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
