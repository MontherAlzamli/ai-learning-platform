import { Card as ParagonCard } from "@openedx/paragon";
import type { ComponentProps } from "react";

import { cn } from "./cn";

type CardProps = ComponentProps<typeof ParagonCard>;

export function Card({ className, ...props }: CardProps) {
  return (
    <ParagonCard
      className={cn(
        "rounded-xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
