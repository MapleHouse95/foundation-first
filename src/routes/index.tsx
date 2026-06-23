import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Home, MapPin, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { LOCALES } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MapleHouse · Choose your language" },
      {
        name: "description",
        content:
          "Choose Korean, English, or French before entering MapleHouse.",
      },
    ],
  }),
  component: LanguageSelect,
});

const LANGUAGE_COPY: Record<
  (typeof LOCALES)[number],
  { label: string; title: string; body: string; enter: string }
> = {
  ko: {
    label: "KO",
    title: "한국어",
    body: "토론토 주거 탐색과 체크리스트를 한국어 기준으로 확인합니다.",
    enter: "한국어로 시작하기",
  },
  en: {
    label: "EN",
    title: "English",
    body: "Explore housing search, checklists, and owner inquiry flows in English.",
    enter: "Start in English",
  },
  fr: {
    label: "FR",
    title: "Français",
    body: "Consultez la recherche de logements, les listes et les demandes.",
    enter: "Commencer en français",
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
          backgroundSize: "48px 48px",
          opacity: 0.28,
        }}
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-20 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-accent/70 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 h-72 w-72 rounded-tl-[6rem] bg-secondary"
      />

      <Container className="relative py-8 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <GatewayVisual />

          <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
            {LOCALES.map((loc) => {
              const copy = LANGUAGE_COPY[loc];

              return (
                <Link
                  key={loc}
                  to={`/${loc}`}
                  className="mh-interactive-card mh-language-card group flex min-h-[10.75rem] flex-col rounded-2xl border border-border bg-card p-4 text-left text-foreground shadow-sm hover:border-[#FA7000] hover:bg-[#FA7000] hover:text-white hover:shadow-xl focus-visible:border-[#FA7000] focus-visible:bg-[#FA7000] focus-visible:text-white"
                >
                  <div className="mh-card-accent text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary group-hover:text-white group-focus-visible:text-white">
                    {copy.label}
                  </div>
                  <h2 className="mt-3 text-xl font-extrabold text-inherit">
                    {copy.title}
                  </h2>
                  <p className="mh-card-muted mh-clamp-2 mt-2 text-xs leading-relaxed text-muted-foreground group-hover:text-white group-focus-visible:text-white">
                    {copy.body}
                  </p>
                  <span className="mh-card-accent mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-bold text-primary group-hover:text-white group-focus-visible:text-white">
                    {copy.enter}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Preview · Real payments, contracts, and property registration are not active yet.
          </p>
        </div>
      </Container>
    </section>
  );
}

function GatewayVisual() {
  return (
    <div
      aria-hidden
      className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-7"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,112,0,0.12),transparent_28%),linear-gradient(135deg,rgba(238,241,242,0.86),rgba(255,255,255,0.76))]" />
      <div className="relative grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[21rem] overflow-hidden rounded-3xl border border-border bg-[#EEF1F2] sm:min-h-[24rem] lg:min-h-[27rem]">
          <div
            className="absolute inset-0 opacity-80"
            style={{
              backgroundImage:
                "linear-gradient(24deg, rgba(255,255,255,0.78) 0 2px, transparent 2px 92px), linear-gradient(112deg, rgba(255,255,255,0.72) 0 2px, transparent 2px 104px), repeating-linear-gradient(0deg, rgba(96,101,107,0.12) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, rgba(96,101,107,0.12) 0 1px, transparent 1px 40px)",
            }}
          />
          <svg
            viewBox="0 0 420 260"
            className="absolute inset-0 h-full w-full"
            fill="none"
          >
            <path
              d="M58 190 C128 112 178 156 222 102 C260 56 326 74 362 38"
              stroke="#FA7000"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="8 13"
            />
          </svg>
          <MapDot className="left-[12%] top-[68%]" active />
          <MapDot className="left-[48%] top-[40%]" />
          <MapDot className="left-[73%] top-[25%]" active />
          <MapDot className="left-[36%] top-[58%]" />

          <div className="absolute left-5 top-5 rounded-2xl border border-border bg-white/92 p-3 shadow-sm backdrop-blur">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-2xl border border-border bg-white/92 px-3 py-2 shadow-sm backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="h-2 w-20 rounded-full bg-muted" />
          </div>
        </div>

        <div className="grid content-center gap-4">
          <VisualCard tone="primary" />
          <VisualCard />
          <VisualCard compact />
        </div>
      </div>
    </div>
  );
}

function MapDot({ className, active = false }: { className: string; active?: boolean }) {
  return (
    <span
      className={`absolute h-4 w-4 rounded-full border-[3px] border-white shadow-md ${
        active ? "bg-primary" : "bg-[#FF9900]"
      } ${className}`}
    />
  );
}

function VisualCard({
  tone,
  compact = false,
}: {
  tone?: "primary";
  compact?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white/94 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            tone === "primary" ? "bg-[#FFF3E6] text-primary" : "bg-secondary text-muted-foreground"
          }`}
        >
          {tone === "primary" ? <Home className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <span className="block h-3 w-2/3 rounded-full bg-foreground/16" />
          <span className="block h-2.5 w-full rounded-full bg-muted" />
          {!compact && <span className="block h-2.5 w-4/5 rounded-full bg-muted" />}
        </div>
      </div>
    </div>
  );
}
