import { createFileRoute, Link } from "@tanstack/react-router";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MapleHouse — Choose your language" },
      {
        name: "description",
        content:
          "MapleHouse — choose your language to continue. Korean, English, or French.",
      },
    ],
  }),
  component: LanguageSelect,
});

const TAGLINE: Record<(typeof LOCALES)[number], string> = {
  ko: "차분하고 명확한 주거 연결",
  en: "Calm, clearer housing connections",
  fr: "Des échanges immobiliers plus clairs",
};

function LanguageSelect() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center bg-secondary/50">
      <Container className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h1 className="mt-8 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Welcome · 환영합니다 · Bienvenue
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Choose your language to continue · 언어를 선택해 주세요 · Choisissez votre langue
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {LOCALES.map((loc) => (
              <Link
                key={loc}
                to={`/${loc}`}
                className="group cursor-pointer rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-accent/70 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <div className="text-lg font-semibold text-foreground">
                  {LOCALE_LABELS[loc]}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{TAGLINE[loc]}</p>
                <span className="mt-4 inline-block text-xs font-medium uppercase tracking-wider text-primary transition-transform group-hover:translate-x-0.5">
                  Enter /{loc} →
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-10 text-xs text-muted-foreground">
            Test mode · MVP preview — responsive web service, not a native app.
          </p>
        </div>
      </Container>
    </section>
  );
}
