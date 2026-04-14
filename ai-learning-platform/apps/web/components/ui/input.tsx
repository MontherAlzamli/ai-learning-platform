import {
  FormControl,
  FormControlFeedback,
  FormGroup,
  FormLabel,
} from "@openedx/paragon";
import type { ComponentProps } from "react";

import { cn } from "./cn";

type InputProps = ComponentProps<typeof FormControl> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, id, className, ...props }: InputProps) {
  const inputId = id ?? props.name ?? "input";
  const errorId = `${inputId}-error`;

  return (
    <FormGroup className="w-full">
      {label ? (
        <FormLabel
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-200"
        >
          {label}
        </FormLabel>
      ) : null}

      <FormControl
        id={inputId}
        isInvalid={Boolean(error)}
        className={cn(
          "w-full rounded-md text-sm",
          className
        )}
        {...props}
      />

      {error ? (
        <FormControlFeedback id={errorId} hasIcon={false}>
          {error}
        </FormControlFeedback>
      ) : null}
    </FormGroup>
  );
}
