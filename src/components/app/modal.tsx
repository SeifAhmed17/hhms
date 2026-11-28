import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onOpenChange,
  title,
  children,
  side = "center",
  className,
  headerClassName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  children: ReactNode;
  side?: "center" | "right";
  className?: string;
  headerClassName?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onOpenChange(false);
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onOpenChange(false);
      }}
      className={cn(
        "backdrop:bg-slate-950/45 backdrop:backdrop-blur-sm",
        side === "right"
          ? "fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-xl border-0 bg-transparent p-0"
          : "fixed left-1/2 top-1/2 m-0 max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 border-0 bg-transparent p-0",
        className,
      )}
    >
      <div
        className={cn(
          "flex max-h-[90dvh] flex-col overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl shadow-slate-950/20",
          side === "right" && "h-dvh max-h-none rounded-none border-0 sm:rounded-l-3xl",
        )}
      >
        <div
          className={cn(
            "flex items-start justify-between gap-4 border-b px-6 py-5",
            headerClassName,
          )}
        >
          <h2 id={titleId} className="text-xl font-semibold tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
            aria-label="Close dialog"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </dialog>
  );
}
