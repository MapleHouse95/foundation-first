import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Globe2, MapPinned, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n";
import type { ReactNode } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MapleHouse · Choose your language" },
      {
        name: "description",
        content:
          "MapleHouse language gateway for Korean, English, and French users.",
      },
    ],
  }),
  component: LanguageSelect,
});

const LANGUAGE_COPY: Record<
  (typeof LOCALES)[number],
  { eyebrow: string; body: string; enter: string }
> = {
  ko: {
    eyebrow: "한국어",
    body: "토론토 주거 탐색과 체크리스트를 한국어 기준으로 확인합니다.",
    enter: "입장하기",
  },
  en: {
    eyebrow: "English",
    body: "Review housing search, checklists, and owner inquiry flows in English.",
    enter: "Enter",
  },
  fr: {
    eyebrow: "Français",
    body: "Consultez la recherche, les listes de vérification et les demandes.",
    enter: "Entrer",
  },
};

function LanguageSelect() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          opacity: 0.34,
        }}
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-16 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-accent blur-3xl"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 h-72 w-72 rounded-tl-[6rem] bg-secondary"
      />

      <Container className="relative py-14 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <Globe2 className="h-3.5 w-3.5 text-primary" />
            MapleHouse language gateway
          </div>

          <h1 className="mx-auto mt-6 max-w-3xl text-3xl font-semibold leading-tight text-foreground sm:min-h-[6.125rem] sm:text-4xl">
            Find housing with clearer criteria · 더 명확한 기준으로 집을 찾으세요 ·
            Trouvez un logement avec plus de clarté
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Choose a language first. MapleHouse will then guide you to housing search,
            checklists, local context, and property owner inquiry flows.
          </p>

          <div className="mx-auto mt-8 grid max-w-2xl gap-3 rounded-2xl border border-border bg-card/90 p-3 text-left shadow-sm backdrop-blur sm:grid-cols-3">
            <EntrySignal icon={<MapPinned />} label="Toronto first" />
            <EntrySignal icon={<ShieldCheck />} label="Trust signals" />
            <EntrySignal icon={<Globe2 />} label="KO · EN · FR" />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {LOCALES.map((loc) => {
              const copy = LANGUAGE_COPY[loc];

              return (
                <Link
                  key={loc}
                  to={`/${loc}`}
                  className="mh-interactive-card mh-language-card group flex min-h-[15rem] flex-col rounded-2xl border border-border bg-card p-6 text-left shadow-sm"
                >
                  <div className="mh-card-accent text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    {copy.eyebrow}
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-inherit">
                    {LOCALE_LABELS[loc]}
                  </h2>
                  <p className="mh-card-muted mh-clamp-3 mt-2 min-h-[4.5rem] text-sm leading-relaxed text-muted-foreground">
                    {copy.body}
                  </p>
                  <span className="mh-card-accent mt-auto inline-flex items-center gap-1 pt-5 text-xs font-semibold uppercase tracking-wider text-primary">
                    {copy.enter}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>

          <p className="mt-10 text-xs text-muted-foreground">
            MVP preview · Real payments, contracts, and property registration are not active yet.
          </p>
        </div>
      </Container>
    </section>
  );
}

function EntrySignal({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-3 py-2 text-xs font-medium text-foreground">
      <span className="text-primary [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      {label}
    </div>
  );
}
