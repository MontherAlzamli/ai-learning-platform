import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { AuthPageShell } from "@/features/auth/components/AuthPageShell";
import { AuthForm } from "@/features/auth/components/AuthForm";
import { getServerAuthSession } from "@/lib/auth";

type SignupPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SignupPage({ params }: SignupPageProps) {
  const { locale } = await params;
  const session = await getServerAuthSession();

  if (session?.user) {
    redirect(`/${locale}`);
  }

  const t = await getTranslations("common");

  return (
    <AuthPageShell
      eyebrow={t("auth.brand")}
      title={t("auth.signupTitle")}
      description={t("auth.signupDescription")}
    >
      <AuthForm mode="signup" />
    </AuthPageShell>
  );
}
