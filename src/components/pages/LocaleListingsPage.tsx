import { useState } from "react";
import { Star, MapPin, Filter, Search } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

type Status = "verified" | "needs_check" | "preparing";
type LocalizedText = Record<Locale, string>;

interface MockListing {
  id: string;
  title: LocalizedText;
  area: string;
  roomType: LocalizedText;
  maxPeople: number;
  priceKRW: number;
  priceCAD: number;
  status: Status;
  lastChecked: string;
  registered: string;
}

const MOCK_LISTINGS: MockListing[] = [
  {
    id: "L-001",
    title: {
      ko: "Koreatown 1BR 코지 스튜디오",
      en: "Cozy 1BR Studio in Koreatown",
      fr: "Studio 1 chambre confortable à Koreatown",
    },
    area: "Koreatown",
    roomType: { ko: "1베드", en: "1BR", fr: "1 chambre" },
    maxPeople: 1,
    priceKRW: 1850000,
    priceCAD: 1850,
    status: "verified",
    lastChecked: "2026-05-15",
    registered: "2026-04-02",
  },
  {
    id: "L-002",
    title: {
      ko: "Downtown 콘도 풀퍼니시드",
      en: "Fully Furnished Downtown Condo",
      fr: "Condo meublé au centre-ville",
    },
    area: "Downtown",
    roomType: { ko: "콘도", en: "Condo", fr: "Condo" },
    maxPeople: 2,
    priceKRW: 3400000,
    priceCAD: 3400,
    status: "verified",
    lastChecked: "2026-05-12",
    registered: "2026-03-20",
  },
  {
    id: "L-003",
    title: {
      ko: "North York 셰어하우스 룸",
      en: "Share House Room in North York",
      fr: "Chambre en colocation à North York",
    },
    area: "North York",
    roomType: { ko: "셰어룸", en: "Share room", fr: "Chambre en colocation" },
    maxPeople: 1,
    priceKRW: 1050000,
    priceCAD: 1050,
    status: "needs_check",
    lastChecked: "2026-04-29",
    registered: "2026-03-01",
  },
  {
    id: "L-004",
    title: {
      ko: "Midtown 2BR 라이트 필드",
      en: "Bright 2BR in Midtown",
      fr: "Logement 2 chambres lumineux à Midtown",
    },
    area: "Midtown",
    roomType: { ko: "2베드", en: "2BR", fr: "2 chambres" },
    maxPeople: 3,
    priceKRW: 3950000,
    priceCAD: 3950,
    status: "preparing",
    lastChecked: "2026-05-10",
    registered: "2026-05-08",
  },
  {
    id: "L-005",
    title: {
      ko: "Annex 스튜디오 (가족형 X)",
      en: "Annex Studio (Not Family Type)",
      fr: "Studio à Annex (non familial)",
    },
    area: "Downtown",
    roomType: { ko: "스튜디오", en: "Studio", fr: "Studio" },
    maxPeople: 1,
    priceKRW: 1620000,
    priceCAD: 1620,
    status: "verified",
    lastChecked: "2026-05-14",
    registered: "2026-04-18",
  },
];

const MAP_PINS = [
  { area: "Downtown", x: 38, y: 58 },
  { area: "Koreatown", x: 28, y: 50 },
  { area: "North York", x: 55, y: 22 },
  { area: "Midtown", x: 48, y: 40 },
];

interface L10n {
  metaTitle: string;
  metaDescription: string;
  title: string;
  countLabel: (n: number) => string;
  filterChip: string;
  filtersBtn: string;
  searchBtn: string;
  country: string;
  countryValue: string;
  city: string;
  cityValue: string;
  people: string;
  peopleValue: string;
  maxPeopleLabel: (n: number) => string;
  activeArea: string;
  recentTitle: string;
  status: Record<Status, string>;
  perMonth: string;
  lastChecked: string;
  registered: string;
  autoDeact: string;
  mapPlaceholder: string;
  mvpNotice: string;
}

const L: Record<Locale, L10n> = {
  ko: {
    metaTitle: "하우스·서비스 — MapleHouse",
    metaDescription: "토론토 검증 매물 미리보기 (자리표시자).",
    title: "토론토 추천 매물",
    countLabel: (n) => `검색 결과 ${n}건`,
    filterChip: "월세 4,000,000원 이하",
    filtersBtn: "필터 보기",
    searchBtn: "검색하기",
    country: "국가 선택",
    countryValue: "캐나다",
    city: "도시",
    cityValue: "토론토",
    people: "인원",
    peopleValue: "1명",
    maxPeopleLabel: (n) => `최대 ${n}명`,
    activeArea: "활성 지역: Downtown Toronto",
    recentTitle: "최근 본 매물",
    status: { verified: "검증완료", needs_check: "확인필요", preparing: "준비중" },
    perMonth: "/월",
    lastChecked: "최근 확인",
    registered: "등록",
    autoDeact: "30일 미확인 시 자동 비활성화 (예정)",
    mapPlaceholder: "지도 영역 (Google Maps 연동 예정)",
    mvpNotice: "MVP 미리보기 · 실제 결제/계약/매물 등록은 아직 활성화되지 않았습니다.",
  },
  en: {
    metaTitle: "Housing & Services — MapleHouse",
    metaDescription: "Preview of admin-reviewed Toronto housing (placeholder).",
    title: "Recommended Listings in Toronto",
    countLabel: (n) => `${n} results`,
    filterChip: "Rent ≤ 4,000,000 KRW",
    filtersBtn: "Filters",
    searchBtn: "Search",
    country: "Country",
    countryValue: "Canada",
    city: "City",
    cityValue: "Toronto",
    people: "People",
    peopleValue: "1",
    maxPeopleLabel: (n) => `max ${n}`,
    activeArea: "Active area: Downtown Toronto",
    recentTitle: "Recently viewed",
    status: { verified: "Verified", needs_check: "Needs check", preparing: "Preparing" },
    perMonth: "/mo",
    lastChecked: "Last checked",
    registered: "Registered",
    autoDeact: "Auto-deactivates after 30 days without check (planned)",
    mapPlaceholder: "Map area (Google Maps integration planned)",
    mvpNotice: "MVP preview · Real payments, contracts, and property registration are not active yet.",
  },
  fr: {
    metaTitle: "Logements & services — MapleHouse",
    metaDescription: "Aperçu de logements vérifiés à Toronto (placeholder).",
    title: "Logements recommandés à Toronto",
    countLabel: (n) => `${n} résultats`,
    filterChip: "Loyer ≤ 4 000 000 KRW",
    filtersBtn: "Filtres",
    searchBtn: "Rechercher",
    country: "Pays",
    countryValue: "Canada",
    city: "Ville",
    cityValue: "Toronto",
    people: "Personnes",
    peopleValue: "1",
    maxPeopleLabel: (n) => `max. ${n} pers.`,
    activeArea: "Zone active : Downtown Toronto",
    recentTitle: "Vus récemment",
    status: { verified: "Vérifié", needs_check: "À vérifier", preparing: "En préparation" },
    perMonth: "/mois",
    lastChecked: "Dernière vérif.",
    registered: "Enregistré",
    autoDeact: "Désactivation auto après 30 jours sans vérif. (prévu)",
    mapPlaceholder: "Zone carte (intégration Google Maps prévue)",
    mvpNotice: "Aperçu MVP · Les paiements, contrats et enregistrements réels ne sont pas encore actifs.",
  },
};

const STATUS_CLASS: Record<Status, string> = {
  verified: "bg-emerald-100 text-emerald-700 border-emerald-200",
  needs_check: "bg-amber-100 text-amber-800 border-amber-200",
  preparing: "bg-muted text-muted-foreground border-border",
};

export function LocaleListingsPage({ locale }: { locale: Locale }) {
  const t = L[locale];
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const toggleFav = (id: string) =>
    setFavs((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const fmtKRW = (v: number) => `${v.toLocaleString("ko-KR")}원`;
  const fmtCAD = (v: number) => `CA$${v.toLocaleString("en-CA")}`;

  return (
    <div className="bg-secondary/30">
      {/* Top filter bar */}
      <div className="border-b border-border bg-background">
        <Container className="flex flex-wrap items-center gap-2 py-3">
          <FilterPill label={t.country} value={t.countryValue} />
          <FilterPill label={t.city} value={t.cityValue} />
          <FilterPill label={t.people} value={t.peopleValue} />
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" /> {t.filtersBtn}
          </Button>
          <Button size="sm" className="ml-auto gap-1">
            <Search className="h-4 w-4" /> {t.searchBtn}
          </Button>
        </Container>
      </div>

      <Container className="py-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <MapPin className="h-3.5 w-3.5" /> {t.activeArea}
          </span>
          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
            {t.filterChip}
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,420px)_1fr]">
          {/* Left: listing panel */}
          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <header className="mb-3 flex items-baseline justify-between">
              <h1 className="text-lg font-semibold text-foreground">{t.title}</h1>
              <span className="text-xs text-muted-foreground">
                {t.countLabel(MOCK_LISTINGS.length)}
              </span>
            </header>
            <ul className="space-y-3">
              {MOCK_LISTINGS.map((l) => {
                const title = l.title[locale];
                const roomType = l.roomType[locale];

                return (
                  <li
                    key={l.id}
                    className="group rounded-xl border border-border bg-background p-3 transition-colors hover:border-primary/40"
                  >
                    <div className="flex gap-3">
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-accent to-secondary">
                        <span
                          className={cn(
                            "absolute left-1 top-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium",
                            STATUS_CLASS[l.status],
                          )}
                        >
                          {t.status[l.status]}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate text-sm font-semibold text-foreground">
                            {title}
                          </h3>
                          <button
                            type="button"
                            onClick={() => toggleFav(l.id)}
                            aria-label="favorite"
                            className="shrink-0 text-muted-foreground hover:text-primary"
                          >
                            <Star
                              className={cn(
                                "h-4 w-4",
                                favs.has(l.id) && "fill-primary text-primary",
                              )}
                            />
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {l.area} · {roomType} · {t.maxPeopleLabel(l.maxPeople)}
                        </p>
                        <div className="mt-1.5 flex items-baseline gap-2">
                          <span className="text-sm font-semibold text-primary">
                            {fmtKRW(l.priceKRW)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({fmtCAD(l.priceCAD)}){t.perMonth}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {t.lastChecked}: {l.lastChecked} · {t.registered}: {l.registered}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-[11px] text-muted-foreground">{t.autoDeact}</p>
          </section>

          {/* Right: map panel */}
          <section className="relative min-h-[480px] overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--accent)) 100%)",
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 40px)",
              }}
              aria-hidden
            />
            <div className="absolute left-3 top-3 rounded-md border border-border bg-background/90 px-2 py-1 text-[11px] text-muted-foreground backdrop-blur">
              {t.mapPlaceholder}
            </div>

            {MAP_PINS.map((p) => (
              <div
                key={p.area}
                className="absolute -translate-x-1/2 -translate-y-full"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-foreground shadow-sm">
                    {p.area}
                  </span>
                  <span className="h-3 w-3 rounded-full border-2 border-background bg-primary shadow" />
                </div>
              </div>
            ))}

            {/* Recently viewed floating panel */}
            <div className="absolute bottom-3 right-3 w-56 rounded-xl border border-border bg-background/95 p-3 shadow-md backdrop-blur">
              <h4 className="text-xs font-semibold text-foreground">{t.recentTitle}</h4>
              <ul className="mt-2 space-y-2">
                {MOCK_LISTINGS.slice(0, 2).map((l) => (
                  <li key={l.id} className="flex items-center gap-2">
                    <div className="h-8 w-10 shrink-0 rounded bg-gradient-to-br from-accent to-secondary" />
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-medium text-foreground">
                        {l.title[locale]}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {fmtKRW(l.priceKRW)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">{t.mvpNotice}</p>
      </Container>
    </div>
  );
}

function FilterPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
