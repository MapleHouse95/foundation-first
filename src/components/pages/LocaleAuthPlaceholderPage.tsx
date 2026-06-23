import { LockKeyhole } from "lucide-react";
import { Container } from "@/components/layout/Container";
import type { Locale } from "@/lib/i18n";

type AuthMode = "login" | "signup";

const CONTENT: Record<
  Locale,
  Record<AuthMode, { eyebrow: string; title: string; body: string }>
> = {
  ko: {
    login: {
      eyebrow: "로그인",
      title: "로그인은 아직 활성화되지 않았습니다",
      body: "계정 기능을 준비하는 안내 화면입니다.",
    },
    signup: {
      eyebrow: "회원가입",
      title: "회원가입은 아직 활성화되지 않았습니다",
      body: "계정 기능을 준비하는 안내 화면입니다.",
    },
  },
  en: {
    login: {
      eyebrow: "Login",
      title: "Login is not active yet",
      body: "This page introduces the account flow.",
    },
    signup: {
      eyebrow: "Sign up",
      title: "Sign up is not active yet",
      body: "This page introduces the account flow.",
    },
  },
  fr: {
    login: {
      eyebrow: "Connexion",
      title: "La connexion n'est pas encore active",
      body: "Cette page est un espace réservé pour un futur parcours de compte. L'authentification réelle et les données membres ne sont pas connectées.",
    },
    signup: {
      eyebrow: "Inscription",
      title: "L'inscription n'est pas encore active",
      body: "Cette page est un espace réservé pour un futur parcours de compte. L'authentification réelle et les données membres ne sont pas connectées.",
    },
  },
};

export function LocaleAuthPlaceholderPage({
  locale,
  mode,
}: {
  locale: Locale;
  mode: AuthMode;
}) {
  const t = CONTENT[locale][mode];

  return (
    <main className="bg-background">
      <Container className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <section className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
            <LockKeyhole className="h-5 w-5" />
          </span>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-foreground">{t.title}</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t.body}
          </p>
        </section>
      </Container>
    </main>
  );
}
