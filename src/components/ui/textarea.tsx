import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "min-h-28 w-full rounded-xl border border-border-strong bg-white px-4 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/80 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-muted-foreground",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
