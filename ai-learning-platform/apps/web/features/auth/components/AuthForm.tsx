"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ChangeEvent, type FormEvent } from "react";

import { Button, Input } from "@/components/ui";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === "signup";
  const requestedCallbackUrl = searchParams.get("callbackUrl");
  const callbackUrl =
    requestedCallbackUrl &&
    requestedCallbackUrl.startsWith("/") &&
    !requestedCallbackUrl.startsWith("//")
      ? requestedCallbackUrl
      : `/${locale}`;

  function handleInputChange(
    setter: (value: string) => void
  ) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.currentTarget.value);
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          setError(t("auth.errors.passwordMismatch"));
          return;
        }

        const signupResponse = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });

        const signupResult = (await signupResponse.json()) as {
          error?: string;
        };

        if (!signupResponse.ok) {
          setError(signupResult.error || t("auth.errors.generic"));
          return;
        }
      }

      const authResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (!authResult || authResult.error) {
        setError(t("auth.errors.invalidCredentials"));
        return;
      }

      router.push(authResult.url ?? callbackUrl);
      router.refresh();
    } catch (submissionError) {
      console.error("Authentication failed:", submissionError);
      setError(t("auth.errors.generic"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {isSignup ? (
        <Input
          id="name"
          name="name"
          label={t("auth.name")}
          value={name}
          onChange={handleInputChange(setName)}
          autoComplete="name"
          required
          disabled={isSubmitting}
          placeholder={t("auth.placeholders.name")}
        />
      ) : null}

      <Input
        id="email"
        name="email"
        type="email"
        label={t("auth.email")}
        value={email}
        onChange={handleInputChange(setEmail)}
        autoComplete="email"
        required
        disabled={isSubmitting}
        placeholder={t("auth.placeholders.email")}
      />

      <Input
        id="password"
        name="password"
        type="password"
        label={t("auth.password")}
        value={password}
        onChange={handleInputChange(setPassword)}
        autoComplete={isSignup ? "new-password" : "current-password"}
        required
        disabled={isSubmitting}
        placeholder={t("auth.placeholders.password")}
      />

      {isSignup ? (
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label={t("auth.confirmPassword")}
          value={confirmPassword}
          onChange={handleInputChange(setConfirmPassword)}
          autoComplete="new-password"
          required
          disabled={isSubmitting}
          placeholder={t("auth.placeholders.confirmPassword")}
        />
      ) : null}

      {error ? (
        <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-400"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? t("auth.actions.loading")
          : isSignup
            ? t("auth.actions.signup")
            : t("auth.actions.login")}
      </Button>

      <p className="text-center text-sm text-slate-300">
        {isSignup ? t("auth.switch.hasAccount") : t("auth.switch.noAccount")}{" "}
        <Link
          href={`/${locale}/${isSignup ? "login" : "signup"}`}
          className="font-medium text-sky-300 transition-colors hover:text-sky-200"
        >
          {isSignup ? t("auth.actions.login") : t("auth.actions.signup")}
        </Link>
      </p>
    </form>
  );
}
