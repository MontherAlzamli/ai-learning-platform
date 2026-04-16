import type { ReactNode } from "react";

import { Card } from "@/components/ui";

type AuthPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthPageShell({
  eyebrow,
  title,
  description,
  children,
}: AuthPageShellProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-16 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.12),_transparent_25%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.65),rgba(2,6,23,0.92))]" />

      <Card className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-[0_24px_80px_rgba(2,6,23,0.55)] backdrop-blur-xl">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-sky-300">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>

        <div className="mt-8">{children}</div>
      </Card>
    </main>
  );
}
