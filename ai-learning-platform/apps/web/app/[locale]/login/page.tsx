import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { AuthPageShell } from "@/features/auth/components/AuthPageShell";
import { AuthForm } from "@/features/auth/components/AuthForm";
import { getServerAuthSession } from "@/lib/auth";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  const session = await getServerAuthSession();

  if (session?.user) {
    redirect(`/${locale}`);
  }

  const t = await getTranslations("common");

  return (
    <AuthPageShell
      eyebrow={t("auth.brand")}
      title={t("auth.loginTitle")}
      description={t("auth.loginDescription")}
    >
      <AuthForm mode="login" />
    </AuthPageShell>
  );
}
