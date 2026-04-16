import type { InputHTMLAttributes } from "react";

import { cn } from "./cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, id, className, ...props }: InputProps) {
  const inputId = id ?? props.name ?? "input";
  const errorId = `${inputId}-error`;

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-200">
          {label}
        </label>
      ) : null}

      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-3 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400",
          error ? "border-rose-400/70 focus:border-rose-400" : null,
          className
        )}
        {...props}
      />

      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-rose-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
