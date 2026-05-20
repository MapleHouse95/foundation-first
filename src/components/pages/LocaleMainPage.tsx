import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  GraduationCap,
  Home,
  MapPinned,
  MessageSquareText,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sofa,
  TrainFront,
  Users,
  Venus,
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

type PopularFilter = {
  title: string;
  tags: string[];
  icon: ReactNode;
};

type HomeGatewayContent = {
  mvpNotice: string;
  heroLabel: string;
  heroTitleLines: string[];
  heroDescription: string;
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
  popularTitle: string;
  popularDescription: string;
  popularFilters: PopularFilter[];
  quickTitle: string;
  quickDescription: string;
  quickActions: Action[];
  checklistTitle: string;
  checklistDescription: string;
  checklistItems: string[];
};

const CONTENT: Record<Locale, HomeGatewayContent> = {
  ko: {
    mvpNotice: "MVP 미리보기 · 실제 결제/계약/매물 등록은 아직 활성화되지 않았습니다.",
    heroLabel: "토론토 주거 탐색 게이트웨이",
    heroTitleLines: ["토론토 집 찾기,", "기준부터 정리하세요"],
    heroDescription:
      "지역, 예산, 계약 조건, 생활 체크리스트를 함께 보고 더 안전한 주거 결정을 준비하세요.",
    bannerSlides: [
      {
        title: "토론토 첫 집, 무엇부터 확인해야 할까요?",
        body: "처음부터 매물만 보면 놓치는 기준이 생깁니다. 생활권, 예산, 계약 조건을 먼저 정리하세요.",
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
    searchDescription:
      "아직 실제 검색은 연결 전입니다. 지금은 조건 입력 흐름을 확인하는 MVP 화면입니다.",
    cityLabel: "도시",
    cityValue: "토론토",
    purposeLabel: "체류 목적",
    purposeOptions: ["워킹홀리데이", "유학생", "단기거주", "직장인", "기타"],
    budgetLabel: "월세 예산",
    budgetPlaceholder: "예: 1,500,000원",
    moveInLabel: "입주 시기",
    moveInPlaceholder: "예: 7월 초",
    peopleLabel: "인원",
    peopleValue: "1명",
    housingTypeLabel: "주거 형태",
    housingTypes: ["룸렌트", "스튜디오", "콘도", "쉐어하우스"],
    conditionsLabel: "중요 조건",
    conditions: ["교통", "치안", "학교 근처", "직장 근처", "가구 포함", "반려동물"],
    primaryCta: "조건에 맞는 매물 보기",
    checklistCta: "체크리스트 먼저 보기",
    popularTitle: "인기 필터",
    popularDescription: "초심자가 자주 찾는 기준을 먼저 모아두었습니다.",
    popularFilters: [
      { title: "학교 근처", tags: ["통학", "어학원", "유학생"], icon: <GraduationCap /> },
      { title: "교통 좋은", tags: ["TTC", "역세권", "출퇴근"], icon: <TrainFront /> },
      { title: "여성 전용 공간", tags: ["안전", "룸렌트", "공용공간"], icon: <Venus /> },
      { title: "가구 포함", tags: ["침대", "책상", "즉시 생활"], icon: <Sofa /> },
      { title: "즉시 입주 가능", tags: ["빠른 입주", "단기", "공실"], icon: <Clock3 /> },
      { title: "단기 가능", tags: ["서브렛", "1-3개월", "유연"], icon: <CalendarDays /> },
      { title: "검증 완료", tags: ["확인일", "상태", "신뢰"], icon: <BadgeCheck /> },
      { title: "계약 전 확인 필요", tags: ["질문", "조건", "리스크"], icon: <FileCheck2 /> },
    ],
    quickTitle: "빠른 이동",
    quickDescription: "매물 탐색부터 임대인 문의까지 필요한 흐름으로 바로 이동하세요.",
    quickActions: [
      { label: "매물 보기", description: "지도와 리스트로 보기", to: "/ko/listings", icon: <Home /> },
      { label: "지역 가이드", description: "생활권 비교 준비 중", icon: <MapPinned /> },
      { label: "계약 전 질문", description: "문의 템플릿 준비 중", icon: <MessageSquareText /> },
      { label: "체크리스트", description: "입주 전 확인 기준", icon: <ClipboardCheck /> },
      { label: "임대인 등록/문의", description: "매물 제공자 흐름", to: "/ko/landlords", icon: <Building2 /> },
    ],
    checklistTitle: "처음 집을 보기 전 확인할 것",
    checklistDescription: "단순 매물 검색보다 판단 기준을 먼저 정리합니다.",
    checklistItems: ["예산에 포함된 비용", "대중교통과 생활권", "계약 기간과 보증금", "마지막 확인일과 검증 상태"],
  },
  en: {
    mvpNotice: "MVP preview · Real payments, contracts, and property registration are not active yet.",
    heroLabel: "Toronto housing gateway",
    heroTitleLines: ["Find housing with", "clearer criteria"],
    heroDescription:
      "Compare location, budget, contract conditions, and checklists before making a housing decision abroad.",
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
    purposeOptions: ["Working holiday", "Student", "Short-term stay", "Worker", "Other"],
    budgetLabel: "Budget",
    budgetPlaceholder: "Monthly rent budget",
    moveInLabel: "Move-in timing",
    moveInPlaceholder: "e.g. early July",
    peopleLabel: "People",
    peopleValue: "1",
    housingTypeLabel: "Housing type",
    housingTypes: ["Room rental", "Studio", "Condo", "Share house"],
    conditionsLabel: "Important conditions",
    conditions: ["Transit", "Safety", "Near school", "Near work", "Furnished", "Pet friendly"],
    primaryCta: "View matching listings",
    checklistCta: "View checklist first",
    popularTitle: "Popular filters",
    popularDescription: "Common starting points for first-time overseas housing decisions.",
    popularFilters: [
      { title: "Near school", tags: ["Commute", "Student", "Language school"], icon: <GraduationCap /> },
      { title: "Good transit", tags: ["TTC", "Station", "Daily route"], icon: <TrainFront /> },
      { title: "Women-only option", tags: ["Safety", "Room", "Shared space"], icon: <Venus /> },
      { title: "Furnished", tags: ["Bed", "Desk", "Ready"], icon: <Sofa /> },
      { title: "Move-in ready", tags: ["Available", "Fast", "Vacant"], icon: <Clock3 /> },
      { title: "Short-term friendly", tags: ["Sublet", "1-3 months", "Flexible"], icon: <CalendarDays /> },
      { title: "Verified", tags: ["Checked", "Status", "Trust"], icon: <BadgeCheck /> },
      { title: "Contract checklist", tags: ["Questions", "Terms", "Risk"], icon: <FileCheck2 /> },
    ],
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
  },
  fr: {
    mvpNotice: "Aperçu MVP · Les paiements, contrats et enregistrements réels ne sont pas encore actifs.",
    heroLabel: "Portail logement à Toronto",
    heroTitleLines: ["Trouver un logement avec", "des critères plus clairs"],
    heroDescription:
      "Comparez le quartier, le budget, les conditions et les listes de vérification avant de choisir un logement.",
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
    purposeOptions: ["PVT", "Études", "Court séjour", "Travail", "Autre"],
    budgetLabel: "Budget",
    budgetPlaceholder: "Budget mensuel",
    moveInLabel: "Date d'arrivée",
    moveInPlaceholder: "ex. début juillet",
    peopleLabel: "Personnes",
    peopleValue: "1",
    housingTypeLabel: "Type de logement",
    housingTypes: ["Chambre", "Studio", "Condo", "Colocation"],
    conditionsLabel: "Conditions importantes",
    conditions: ["Transport", "Sécurité", "Près de l'école", "Près du travail", "Meublé", "Animaux"],
    primaryCta: "Voir les logements adaptés",
    checklistCta: "Voir la liste de vérification",
    popularTitle: "Filtres populaires",
    popularDescription: "Des critères simples pour commencer une recherche plus claire.",
    popularFilters: [
      { title: "Près de l’école", tags: ["Trajet", "Étudiant", "École"], icon: <GraduationCap /> },
      { title: "Bon transport", tags: ["TTC", "Station", "Quotidien"], icon: <TrainFront /> },
      { title: "Option femmes", tags: ["Sécurité", "Chambre", "Partagé"], icon: <Venus /> },
      { title: "Meublé", tags: ["Lit", "Bureau", "Prêt"], icon: <Sofa /> },
      { title: "Prêt à emménager", tags: ["Disponible", "Rapide", "Libre"], icon: <Clock3 /> },
      { title: "Court séjour", tags: ["Sous-location", "1-3 mois", "Flexible"], icon: <CalendarDays /> },
      { title: "Vérifié", tags: ["Contrôlé", "Statut", "Confiance"], icon: <BadgeCheck /> },
      { title: "Liste avant contrat", tags: ["Questions", "Conditions", "Risque"], icon: <FileCheck2 /> },
    ],
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
      <section className="border-b border-border bg-background">
        <div className="relative overflow-hidden bg-secondary/70">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
              backgroundSize: "46px 46px",
              opacity: 0.34,
            }}
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-8 h-72 w-[54rem] -translate-x-1/2 rounded-full bg-accent blur-3xl"
          />

          <Container className="relative py-8 sm:py-12 lg:py-14">
            <div className="mx-auto flex min-h-[31rem] max-w-4xl flex-col items-center text-center sm:min-h-[33rem] lg:min-h-[34rem]">
              <div className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                {t.mvpNotice}
              </div>

              <div className="flex min-h-[16.5rem] flex-col items-center sm:min-h-[17rem]">
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/90 px-3 py-1 text-xs font-semibold text-primary">
                  <MapPinned className="h-3.5 w-3.5" />
                  {t.heroLabel}
                </div>

                <h1 className="mt-5 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
                  {t.heroTitleLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t.heroDescription}
                </p>
              </div>

              <div className="mx-auto mt-6 flex min-h-[11.75rem] w-full max-w-2xl flex-col justify-between rounded-2xl border border-border bg-card/95 p-4 text-left shadow-sm backdrop-blur">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      MapleHouse guide
                    </p>
                    <h2 className="mh-clamp-2 mt-1 min-h-[3rem] text-base font-semibold text-foreground sm:text-lg">
                      {currentSlide.title}
                    </h2>
                    <p className="mh-clamp-2 mt-1 text-sm leading-relaxed text-muted-foreground">
                      {currentSlide.body}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-center gap-2" aria-label="banner slide indicators">
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

            <SearchModule locale={locale} content={t} />
          </Container>
        </div>
      </section>

      <section className="bg-background py-10">
        <Container>
          <SectionHeading title={t.popularTitle} description={t.popularDescription} />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {t.popularFilters.map((filter) => (
              <PopularFilterCard key={filter.title} filter={filter} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-secondary/70 py-10">
        <Container>
          <SectionHeading title={t.quickTitle} description={t.quickDescription} />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {t.quickActions.map((action) => (
              <QuickAction key={action.label} action={action} />
            ))}
          </div>
        </Container>
      </section>

      <section id="checklist-preview" className="bg-background py-10">
        <Container>
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
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {t.checklistItems.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground"
                >
                  <CheckCircle2 className="mb-2 h-4 w-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function SearchModule({
  locale,
  content,
}: {
  locale: Locale;
  content: HomeGatewayContent;
}) {
  return (
    <div className="relative z-10 mx-auto mt-8 min-h-[28rem] max-w-5xl rounded-3xl border border-border bg-card p-4 shadow-md sm:p-5 lg:min-h-[23.5rem]">
      <div className="mb-4 flex min-h-[5.75rem] items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            MapleHouse search
          </p>
          <h2 className="mh-clamp-2 mt-1 text-xl font-semibold text-foreground">{content.searchTitle}</h2>
          <p className="mh-clamp-2 mt-1 text-xs leading-relaxed text-muted-foreground">
            {content.searchDescription}
          </p>
        </div>
        <Search className="mt-1 h-5 w-5 text-primary" />
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
        <GatewayField icon={<MapPinned />} label={content.cityLabel} className="lg:col-span-1">
          <StaticValue>{content.cityValue}</StaticValue>
        </GatewayField>
        <GatewayField icon={<SlidersHorizontal />} label={content.purposeLabel} className="lg:col-span-2">
          <select className="w-full bg-transparent text-sm font-medium text-foreground outline-none">
            {content.purposeOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </GatewayField>
        <GatewayField icon={<WalletCards />} label={content.budgetLabel} className="lg:col-span-1">
          <input
            className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            placeholder={content.budgetPlaceholder}
          />
        </GatewayField>
        <GatewayField icon={<CalendarDays />} label={content.moveInLabel} className="lg:col-span-1">
          <input
            className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            placeholder={content.moveInPlaceholder}
          />
        </GatewayField>
        <GatewayField icon={<Users />} label={content.peopleLabel} className="lg:col-span-1">
          <StaticValue>{content.peopleValue}</StaticValue>
        </GatewayField>
        <GatewayField icon={<Home />} label={content.housingTypeLabel} className="lg:col-span-2">
          <select className="w-full bg-transparent text-sm font-medium text-foreground outline-none">
            {content.housingTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </GatewayField>
        <div className="min-h-16 rounded-xl border border-border bg-background px-3 py-2 md:col-span-2 lg:col-span-4">
          <p className="mb-2 text-[11px] font-medium text-muted-foreground">
            {content.conditionsLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {content.conditions.map((condition, index) => (
              <span
                key={condition}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  index < 3
                    ? "border-primary/30 bg-accent text-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {condition}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(13rem,auto)]">
        <Button asChild size="lg" className="min-h-10 px-4 text-center">
          <Link to={`/${locale}/listings`}>{content.primaryCta}</Link>
        </Button>
        <Button asChild variant="soft" size="lg" className="min-h-10 px-4 text-center">
          <a href="#checklist-preview">{content.checklistCta}</a>
        </Button>
      </div>
    </div>
  );
}

function GatewayField({
  icon,
  label,
  children,
  className = "",
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex min-h-16 items-center gap-3 rounded-xl border border-border bg-background px-3 py-2 ${className}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="mh-clamp-1 block min-h-[1rem] text-[11px] font-medium text-muted-foreground">{label}</span>
        <span className="block">{children}</span>
      </span>
    </label>
  );
}

function StaticValue({ children }: { children: ReactNode }) {
  return <span className="text-sm font-medium text-foreground">{children}</span>;
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function PopularFilterCard({ filter }: { filter: PopularFilter }) {
  return (
    <button
      type="button"
      className="mh-interactive-card min-h-[10.75rem] rounded-2xl border border-border bg-card p-4 text-left shadow-sm"
      aria-disabled="true"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary [&_svg]:h-5 [&_svg]:w-5">
        {filter.icon}
      </span>
      <span className="mh-clamp-2 mt-4 block min-h-10 text-sm font-semibold text-foreground">{filter.title}</span>
      <span className="mt-3 flex min-h-[3.25rem] flex-wrap content-start gap-1.5 overflow-hidden">
        {filter.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </span>
    </button>
  );
}

function QuickAction({ action }: { action: Action }) {
  const content = (
    <>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary [&_svg]:h-5 [&_svg]:w-5">
        {action.icon}
      </span>
      <span className="mh-clamp-2 mt-4 block min-h-10 text-sm font-semibold text-foreground">{action.label}</span>
      <span className="mh-clamp-2 mt-1 block min-h-10 text-xs leading-relaxed text-muted-foreground">
        {action.description}
      </span>
    </>
  );

  if (action.to) {
    return (
      <Link
        to={action.to}
        className="mh-interactive-card min-h-[11rem] rounded-2xl border border-border bg-card p-4 shadow-sm"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="mh-interactive-card min-h-[11rem] rounded-2xl border border-border bg-card p-4 text-left shadow-sm"
      aria-disabled="true"
    >
      {content}
    </button>
  );
}
