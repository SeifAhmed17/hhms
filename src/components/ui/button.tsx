import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

const buttonBase =
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover",
  destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  outline:
    "border border-border-strong bg-white text-foreground shadow-sm hover:border-primary/40 hover:bg-primary-tint",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  ghost: "text-primary hover:bg-primary-tint",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-11 px-5",
  sm: "h-9 rounded-lg px-3 text-xs",
  lg: "h-12 px-7",
  icon: "size-11",
};

function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
  className?: string | undefined;
} = {}) {
  return cn(buttonBase, variantClasses[variant], sizeClasses[size], className);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={buttonVariants({ variant, size, className })} ref={ref} {...props} />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
