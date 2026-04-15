import { Button as ParagonButton } from "@openedx/paragon";
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

const buttonClasses: Record<ButtonVariant, string> = {
  primary: "rounded-md font-medium",
  secondary: "rounded-md font-medium",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <ParagonButton
      variant={buttonVariantMap[variant]}
      className={cn(
        "transition-colors",
        buttonClasses[variant],
        className
      )}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </ParagonButton>
  );
}
