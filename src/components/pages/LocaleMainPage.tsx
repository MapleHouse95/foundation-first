import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Home,
  MapPinned,
  MessageSquareText,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import type { Locale } from "@/lib/i18n";

type Action = {
  label: string;
  description: string;
  to?: string;
  icon: ReactNode;
};

type HomeGatewayContent = {
  mvpNotice: string;
  bannerEyebrow: string;
  bannerSlides: Array<{
    title: string;
    body: string;
  }>;
  searchTitle: string;
  searchDescription: string;
  cityLabel: string;
  cityValue: string;
  purposeLabel: string;
  purposeOptions: string[];
  budgetLabel: string;
  budgetPlaceholder: string;
  moveInLabel: string;
  moveInPlaceholder: string;
  peopleLabel: string;
  peopleValue: string;
  housingTypeLabel: string;
  housingTypes: string[];
  conditionsLabel: string;
  conditions: string[];
  primaryCta: string;
  checklistCta: string;
  quickTitle: string;
  quickDescription: string;
  quickActions: Action[];
  checklistTitle: string;
  checklistDescription: string;
  checklistItems: string[];
  guideTitle: string;
  guideItems: string[];
};

const CONTENT: Record<Locale, HomeGatewayContent> = {
  ko: {
    mvpNotice: "MVP 미리보기 · 실제 결제/계약/매물 등록은 아직 활성화되지 않았습니다.",
    bannerEyebrow: "Toronto housing gateway",
    bannerSlides: [
      {
        title: "토론토 첫 집 찾기, 무엇부터 확인해야 할까요?",
        body: "지역, 예산, 체류 목적을 먼저 정리하면 매물 비교가 훨씬 쉬워집니다.",
      },
      {
        title: "지역·예산·계약 조건을 한 번에 비교하세요",
        body: "초심자도 같은 기준으로 매물과 생활권을 살펴볼 수 있게 준비 중입니다.",
      },
      {
        title: "입주 전 꼭 물어볼 질문을 체크리스트로 준비하세요",
        body: "연락 전, 뷰잉 전, 계약 전 확인할 질문을 놓치지 않게 돕습니다.",
      },
    ],
    searchTitle: "내 조건으로 토론토 주거 탐색 시작",
    searchDescription: "아직 실제 검색은 연결 전입니다. 지금은 조건 입력 흐름을 확인하는 MVP 화면입니다.",
    cityLabel: "도시",
    cityValue: "토론토",
    purposeLabel: "체류 목적",
    purposeOptions: ["워킹홀리데이", "유학생", "단기거주", "기타"],
    budgetLabel: "예산",
    budgetPlaceholder: "월세 예산",
    moveInLabel: "입주 시기",
    moveInPlaceholder: "예: 7월 초",
    peopleLabel: "인원",
    peopleValue: "1명",
    housingTypeLabel: "주거 형태",
    housingTypes: ["룸렌트", "스튜디오", "콘도", "쉐어하우스"],
    conditionsLabel: "중요 조건",
    conditions: ["교통", "치안", "학교 근처", "직장 근처", "반려동물", "가구 포함"],
    primaryCta: "조건에 맞는 매물 보기",
    checklistCta: "체크리스트 먼저 보기",
    quickTitle: "빠른 이동",
    quickDescription: "매물 탐색부터 임대인 문의까지, 필요한 흐름으로 바로 이동하세요.",
    quickActions: [
      { label: "매물 보기", description: "지도와 리스트로 보기", to: "/ko/listings", icon: <Home /> },
      { label: "지역 가이드", description: "생활권 비교 준비 중", icon: <MapPinned /> },
      { label: "계약 전 질문", description: "문의 템플릿 준비 중", icon: <MessageSquareText /> },
      { label: "체크리스트", description: "입주 전 확인 기준", icon: <ClipboardCheck /> },
      { label: "임대인 등록/문의", description: "매물 제공자 흐름", to: "/ko/landlords", icon: <Building2 /> },
    ],
    checklistTitle: "처음 집을 보기 전 확인할 것",
    checklistDescription: "메이플하우스는 단순 매물 검색보다 판단 기준을 먼저 정리합니다.",
    checklistItems: ["예산에 포함된 비용", "대중교통과 생활권", "계약 기간과 보증금", "마지막 확인일과 검증 상태"],
    guideTitle: "추천 기준",
    guideItems: ["워홀: 구직 동선", "유학: 학교 접근성", "단기거주: 입주 가능일", "초심자: 계약 리스크"],
  },
  en: {
    mvpNotice: "MVP preview · Real payments, contracts, and property registration are not active yet.",
    bannerEyebrow: "Toronto housing gateway",
    bannerSlides: [
      {
        title: "Finding your first place in Toronto starts with better questions.",
        body: "Organize your city, budget, and stay purpose before comparing listings.",
      },
      {
        title: "Compare neighborhoods, budget, and rental conditions together.",
        body: "MapleHouse is preparing a clearer way to review housing options.",
      },
      {
        title: "Prepare the right questions before contacting a landlord.",
        body: "Use checklist-based guidance before viewing, signing, or moving in.",
      },
    ],
    searchTitle: "Start with your Toronto housing conditions",
    searchDescription: "Real search is not connected yet. This MVP shows the intended discovery flow.",
    cityLabel: "City",
    cityValue: "Toronto",
    purposeLabel: "Stay purpose",
    purposeOptions: ["Working holiday", "Student", "Short-term stay", "Other"],
    budgetLabel: "Budget",
    budgetPlaceholder: "Monthly rent budget",
    moveInLabel: "Move-in timing",
    moveInPlaceholder: "e.g. early July",
    peopleLabel: "People",
    peopleValue: "1",
    housingTypeLabel: "Housing type",
    housingTypes: ["Room rental", "Studio", "Condo", "Share house"],
    conditionsLabel: "Important conditions",
    conditions: ["Transit", "Safety", "Near school", "Near work", "Pet friendly", "Furnished"],
    primaryCta: "View matching listings",
    checklistCta: "View checklist first",
    quickTitle: "Quick actions",
    quickDescription: "Move from discovery to inquiry without losing the bigger decision context.",
    quickActions: [
      { label: "View listings", description: "Map and list preview", to: "/en/listings", icon: <Home /> },
      { label: "Neighborhood guide", description: "Comparison guide planned", icon: <MapPinned /> },
      { label: "Questions before contract", description: "Template planned", icon: <MessageSquareText /> },
      { label: "Checklist", description: "Decision criteria preview", icon: <ClipboardCheck /> },
      { label: "List a property", description: "Provider inquiry flow", to: "/en/landlords", icon: <Building2 /> },
    ],
    checklistTitle: "What to check before choosing a place",
    checklistDescription: "MapleHouse focuses on decision criteria, not just listing volume.",
    checklistItems: ["Costs included in rent", "Transit and neighborhood fit", "Lease period and deposit", "Last checked and verification status"],
    guideTitle: "Matching cues",
    guideItems: ["Working holiday: job access", "Student: school commute", "Short stay: move-in timing", "Newcomer: contract risk"],
  },
  fr: {
    mvpNotice: "Aperçu MVP · Les paiements, contrats et enregistrements réels ne sont pas encore actifs.",
    bannerEyebrow: "Portail logement à Toronto",
    bannerSlides: [
      {
        title: "Trouver un premier logement à Toronto commence par les bonnes questions.",
        body: "Organisez la ville, le budget et l'objectif du séjour avant de comparer.",
      },
      {
        title: "Comparez quartier, budget et conditions de location ensemble.",
        body: "MapleHouse prépare une façon plus claire d'examiner les options.",
      },
      {
        title: "Préparez les questions importantes avant de contacter un propriétaire.",
        body: "Utilisez une liste de vérification avant la visite, le contrat ou l'arrivée.",
      },
    ],
    searchTitle: "Commencer avec vos conditions de logement",
    searchDescription: "La vraie recherche n'est pas encore connectée. Ce MVP montre le parcours prévu.",
    cityLabel: "Ville",
    cityValue: "Toronto",
    purposeLabel: "Objectif du séjour",
    purposeOptions: ["PVT", "Études", "Court séjour", "Autre"],
    budgetLabel: "Budget",
    budgetPlaceholder: "Budget mensuel",
    moveInLabel: "Date d'arrivée",
    moveInPlaceholder: "ex. début juillet",
    peopleLabel: "Personnes",
    peopleValue: "1",
    housingTypeLabel: "Type de logement",
    housingTypes: ["Chambre", "Studio", "Condo", "Colocation"],
    conditionsLabel: "Conditions importantes",
    conditions: ["Transport", "Sécurité", "Près de l'école", "Près du travail", "Animaux", "Meublé"],
    primaryCta: "Voir les logements adaptés",
    checklistCta: "Voir la checklist",
    quickTitle: "Accès rapides",
    quickDescription: "Passez de la recherche à la demande sans perdre les critères de décision.",
    quickActions: [
      { label: "Voir les logements", description: "Carte et liste", to: "/fr/listings", icon: <Home /> },
      { label: "Guide des quartiers", description: "Comparaison prévue", icon: <MapPinned /> },
      { label: "Questions avant contrat", description: "Modèle prévu", icon: <MessageSquareText /> },
      { label: "Checklist", description: "Critères de décision", icon: <ClipboardCheck /> },
      { label: "Proposer un logement", description: "Parcours propriétaire", to: "/fr/landlords", icon: <Building2 /> },
    ],
    checklistTitle: "À vérifier avant de choisir un logement",
    checklistDescription: "MapleHouse met l'accent sur les critères de décision, pas seulement les annonces.",
    checklistItems: ["Coûts inclus dans le loyer", "Transport et quartier", "Durée du bail et dépôt", "Dernière vérification et statut"],
    guideTitle: "Critères de recommandation",
    guideItems: ["PVT: accès au travail", "Études: trajet vers l'école", "Court séjour: date d'arrivée", "Nouveau résident: risque contractuel"],
  },
};

export function LocaleMainPage({ locale }: { locale: Locale }) {
  const t = CONTENT[locale];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % t.bannerSlides.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [t.bannerSlides.length]);

  const currentSlide = t.bannerSlides[activeSlide];

  return (
    <>
      <section className="border-b border-border bg-secondary/70">
        <Container className="py-6 lg:py-8">
          <div className="mb-4 inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            {t.mvpNotice}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_440px]">
            <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-background),var(--color-muted))]" />
              <div className="absolute right-0 top-0 h-48 w-48 rounded-bl-[6rem] bg-accent" />
              <div className="absolute bottom-0 left-0 h-28 w-72 rounded-tr-[5rem] bg-muted" />

              <div className="relative flex h-full min-h-[320px] flex-col justify-between p-6 sm:p-8">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/80 px-3 py-1 text-xs font-semibold text-primary">
                    <MapPinned className="h-3.5 w-3.5" />
                    {t.bannerEyebrow}
                  </span>
                  <h1 className="mt-5 max-w-2xl text-2xl font-semibold leading-tight text-foreground sm:text-3xl lg:text-4xl">
                    {currentSlide.title}
                  </h1>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {currentSlide.body}
                  </p>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <Signal icon={<ShieldCheck />} label={t.guideItems[3]} />
                  <Signal icon={<WalletCards />} label={t.guideItems[0]} />
                  <Signal icon={<CheckCircle2 />} label={t.guideItems[1]} />
                </div>

                <div className="mt-6 flex gap-2" aria-label="banner slide indicators">
                  {t.bannerSlides.map((slide, index) => (
                    <button
                      key={slide.title}
                      type="button"
                      className={`h-2 rounded-full transition-all ${
                        index === activeSlide ? "w-8 bg-primary" : "w-2 bg-border"
                      }`}
                      onClick={() => setActiveSlide(index)}
                      aria-label={`slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-primary">
                    MapleHouse search
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-foreground">
                    {t.searchTitle}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {t.searchDescription}
                  </p>
                </div>
                <Search className="mt-1 h-5 w-5 text-primary" />
              </div>

              <div className="grid gap-3">
                <GatewayField icon={<MapPinned />} label={t.cityLabel}>
                  <StaticValue>{t.cityValue}</StaticValue>
                </GatewayField>
                <GatewayField icon={<SlidersHorizontal />} label={t.purposeLabel}>
                  <select className="w-full bg-transparent text-sm font-medium text-foreground outline-none">
                    {t.purposeOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </GatewayField>
                <div className="grid gap-3 sm:grid-cols-2">
                  <GatewayField icon={<WalletCards />} label={t.budgetLabel}>
                    <input
                      className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
                      placeholder={t.budgetPlaceholder}
                    />
                  </GatewayField>
                  <GatewayField icon={<CalendarDays />} label={t.moveInLabel}>
                    <input
                      className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
                      placeholder={t.moveInPlaceholder}
                    />
                  </GatewayField>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <GatewayField icon={<Users />} label={t.peopleLabel}>
                    <StaticValue>{t.peopleValue}</StaticValue>
                  </GatewayField>
                  <GatewayField icon={<Home />} label={t.housingTypeLabel}>
                    <select className="w-full bg-transparent text-sm font-medium text-foreground outline-none">
                      {t.housingTypes.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </GatewayField>
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {t.conditionsLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  {t.conditions.map((condition, index) => (
                    <span
                      key={condition}
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${
                        index < 3
                          ? "border-primary/30 bg-accent text-foreground"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
                <Button asChild size="lg">
                  <Link to={`/${locale}/listings`}>{t.primaryCta}</Link>
                </Button>
                <Button asChild variant="soft" size="lg">
                  <a href="#checklist-preview">{t.checklistCta}</a>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-8">
        <Container>
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{t.quickTitle}</h2>
              <p className="text-sm text-muted-foreground">{t.quickDescription}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {t.quickActions.map((action) => (
              <QuickAction key={action.label} action={action} />
            ))}
          </div>
        </Container>
      </section>

      <section id="checklist-preview" className="bg-secondary/70 py-10">
        <Container className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                <ClipboardCheck className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{t.checklistTitle}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t.checklistDescription}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {t.checklistItems.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold text-foreground">{t.guideTitle}</h3>
            <ul className="mt-4 space-y-3">
              {t.guideItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </Container>
      </section>
    </>
  );
}

function GatewayField({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex min-h-16 items-center gap-3 rounded-xl border border-border bg-background px-3 py-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-medium text-muted-foreground">{label}</span>
        <span className="block">{children}</span>
      </span>
    </label>
  );
}

function StaticValue({ children }: { children: ReactNode }) {
  return <span className="text-sm font-medium text-foreground">{children}</span>;
}

function Signal({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-background/80 px-3 py-2 text-xs font-medium text-foreground">
      <span className="text-primary [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}

function QuickAction({ action }: { action: Action }) {
  const content = (
    <>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary [&_svg]:h-5 [&_svg]:w-5">
        {action.icon}
      </span>
      <span className="mt-4 block text-sm font-semibold text-foreground">{action.label}</span>
      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
        {action.description}
      </span>
    </>
  );

  if (action.to) {
    return (
      <Link
        to={action.to}
        className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/45 hover:bg-accent/40"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/45 hover:bg-accent/40"
      aria-disabled="true"
    >
      {content}
    </button>
  );
}
