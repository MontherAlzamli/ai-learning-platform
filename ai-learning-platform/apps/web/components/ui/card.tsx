import type { HTMLAttributes } from "react";

import { cn } from "./cn";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
