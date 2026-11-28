import { useState, type ReactNode } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Inbox, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Modal } from "./modal";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl leading-tight tracking-tight sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-white shadow-sm shadow-slate-900/[0.03]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string | undefined;
  action?: ReactNode | undefined;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-tint text-primary">
        <Inbox className="size-6" aria-hidden />
      </span>
      <p className="mt-4 font-semibold">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function SkeletonRows({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-2 p-4", className)} aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function FieldError({ messages }: { messages?: string[] | undefined }) {
  if (!messages?.length) return null;
  return (
    <p className="mt-1 flex items-start gap-1 text-sm text-destructive" role="alert">
      <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      {messages.join(" ")}
    </p>
  );
}

export function SubmitButton({
  loading,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { loading?: boolean }) {
  return (
    <Button {...props} disabled={loading || props.disabled}>
      {loading && <Loader2 className="animate-spin" aria-hidden />}
      {children}
    </Button>
  );
}

export function Pager({
  page,
  pageSize,
  totalCount,
  onPage,
}: {
  page: number;
  pageSize: number;
  totalCount: number;
  onPage: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (totalCount === 0) return null;
  return (
    <div className="flex items-center justify-between gap-2 border-t border-border px-5 py-4 text-sm text-muted-foreground">
      <span className="tnum">
        {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)} of {totalCount}
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>
        <span className="tnum px-2">
          Page {page} of {pages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  destructive = true,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel: string;
  onConfirm: () => Promise<void> | void;
  destructive?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title}>
      {description && <p className="text-sm leading-6 text-muted-foreground">{description}</p>}
      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" autoFocus onClick={() => onOpenChange(false)}>
          Keep it
        </Button>
        <Button
          variant={destructive ? "destructive" : "default"}
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onConfirm();
              onOpenChange(false);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy && <Loader2 className="animate-spin" aria-hidden />}
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export function InlineAlert({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning" | "danger";
  title?: string;
  children?: ReactNode;
}) {
  const cls = {
    info: "border-info-border bg-primary-tint text-foreground",
    warning: "border-warning-border bg-warning-tint text-foreground",
    danger: "border-destructive-border bg-destructive-tint text-foreground",
  }[tone];
  return (
    <div
      className={cn("flex gap-3 rounded-2xl border p-4 text-sm leading-6 shadow-sm", cls)}
      role={tone === "danger" ? "alert" : "status"}
    >
      <AlertCircle
        className={cn(
          "mt-0.5 size-4 shrink-0",
          tone === "danger"
            ? "text-destructive"
            : tone === "warning"
              ? "text-warning"
              : "text-primary",
        )}
        aria-hidden
      />
      <div>
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={cn(title && "mt-0.5", "text-fg-secondary")}>{children}</div>}
      </div>
    </div>
  );
}
