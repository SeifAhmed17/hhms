import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "h-11 w-full rounded-xl border border-border-strong bg-white px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/80 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-muted-foreground file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
