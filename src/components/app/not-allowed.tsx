import { ArrowLeft, Home, ShieldX } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NotAllowed() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-8">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-destructive/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 size-[30rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-white p-8 text-center shadow-xl shadow-slate-900/5 sm:p-12">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-destructive-border bg-destructive-tint text-destructive">
          <ShieldX className="size-8" aria-hidden />
        </span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-destructive">
          Access restricted
        </p>
        <h1 className="mt-2 text-6xl font-semibold tracking-tight text-slate-900">403</h1>
        <h2 className="mt-2 text-xl font-semibold">You don&apos;t have access to this page</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Please contact your administrator if you believe you should be able to view this page.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft aria-hidden />
            Go back
          </Button>
          <Link to="/" className={cn(buttonVariants(), "no-underline")}>
            <Home aria-hidden />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
