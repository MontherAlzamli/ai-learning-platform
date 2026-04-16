import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "./cn";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const buttonVariantMap: Record<ButtonVariant, "primary" | "secondary"> = {
  primary: "primary",
  secondary: "secondary",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-md border text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary"
          ? "border-sky-500 bg-sky-500 text-slate-950 hover:border-sky-400 hover:bg-sky-400"
          : "border-white/15 bg-white/5 text-white hover:bg-white/10",
        className
      )}
      data-variant={buttonVariantMap[variant]}
      {...props}
    >
      {children}
    </button>
  );
}
