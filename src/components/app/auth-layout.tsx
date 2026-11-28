import type { ReactNode } from "react";
import { CalendarCheck2, HeartPulse, ShieldCheck } from "lucide-react";

export function AuthLayout({
  title,
  subtitle,
  children,
  wide,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const features = [
    { icon: CalendarCheck2, label: "Appointments, all in one place" },
    { icon: HeartPulse, label: "Your health records, always accessible" },
    { icon: ShieldCheck, label: "Private and protected care" },
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-6 sm:px-6 lg:py-10">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 size-[30rem] rounded-full bg-teal/10 blur-3xl" />
      <div
        className={`relative grid w-full overflow-hidden rounded-[2rem] border border-white bg-white shadow-2xl shadow-slate-900/10 ${
          wide ? "max-w-6xl lg:grid-cols-[0.8fr_1.2fr]" : "max-w-5xl lg:grid-cols-2"
        }`}
      >
        <aside className="relative hidden min-h-[660px] flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary p-10 text-white lg:flex xl:p-14">
          <div className="absolute -right-20 top-28 size-72 rounded-full border border-white/10" />
          <div className="absolute -right-8 top-40 size-48 rounded-full border border-white/10" />
          <div className="absolute -bottom-28 -left-24 size-80 rounded-full bg-primary/40 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <HeartPulse className="size-6" aria-hidden />
            </span>
            <span>
              <span className="block text-lg font-bold tracking-wide">HHMS</span>
              <span className="block text-xs text-white/65">Hurghada Hospital</span>
            </span>
          </div>
          <div className="relative max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Your care, connected
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              Better care starts with feeling in control.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/70">
              Keep your appointments, prescriptions and health information together in one secure
              place.
            </p>
            <ul className="mt-9 space-y-4">
              {features.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-white/85">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-cyan-200">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <p className="relative text-xs text-white/50">Secure patient access · Hurghada, Egypt</p>
        </aside>
        <section
          className={`px-6 py-8 sm:px-10 sm:py-10 xl:px-14 xl:py-14 ${wide ? "lg:px-12" : ""}`}
        >
          <div className="mb-8 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 lg:hidden">
            <HeartPulse className="size-5 text-primary" aria-hidden />
            HHMS · Hurghada Hospital
          </div>
          <div className="mx-auto w-full max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Patient portal
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
            {subtitle && <p className="mt-2 text-sm leading-6 text-muted-foreground">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
