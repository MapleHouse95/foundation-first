import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  GraduationCap,
  Home,
  MapPinned,
  MessageSquareText,
  SlidersHorizontal,
  Sofa,
  TrainFront,
  Users,
  Venus,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
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
    image?: string;
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
        title: "토론토 집 찾기, 기준부터 정리하세요",
        body: "지역, 예산, 계약 조건을 기준으로 더 안전한 주거 결정을 준비하세요.",
      },
      {
        title: "지역·예산·계약 조건을 한 번에 비교하세요",
        body: "매물보다 먼저 조건을 세우는 흐름입니다.",
      },
      {
        title: "입주 전 꼭 물어볼 질문을 체크리스트로 준비하세요",
        body: "연락 전, 계약 전 확인할 질문을 놓치지 않게 돕습니다.",
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
    budgetPlaceholder: "150만원",
    moveInLabel: "입주 시기",
    moveInPlaceholder: "입주 날짜 선택",
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
    heroTitleLines: ["Find housing", "with clearer criteria"],
    heroDescription:
      "Compare location, budget, contract conditions, and checklists before making a housing decision abroad.",
    bannerSlides: [
      {
        title: "Find housing with clearer criteria",
        body: "Compare location, budget, and rental conditions before choosing housing abroad.",
      },
      {
        title: "Compare neighborhoods, budget, and rental conditions",
        body: "Review the housing decision in one place.",
      },
      {
        title: "Prepare the right questions before contacting a landlord",
        body: "Set your questions before browsing listings.",
      },
    ],
    searchTitle: "Start with your Toronto housing conditions",
    searchDescription: "Real search is not connected yet. This MVP shows the intended discovery flow.",
    cityLabel: "City",
    cityValue: "Toronto",
    purposeLabel: "Stay purpose",
    purposeOptions: ["Working holiday", "Student", "Short-term stay", "Worker", "Other"],
    budgetLabel: "Budget",
    budgetPlaceholder: "1,500 C$",
    moveInLabel: "Move-in",
    moveInPlaceholder: "Select",
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
    heroTitleLines: ["Trouver un logement", "avec des critères plus clairs"],
    heroDescription:
      "Comparez le quartier, le budget, les conditions et les listes de vérification avant de choisir un logement.",
    bannerSlides: [
      {
        title: "Trouver un logement avec des critères plus clairs",
        body: "Comparez le quartier, le budget et les conditions avant de choisir un logement.",
      },
      {
        title: "Comparez le quartier, le budget et les conditions",
        body: "Gardez les critères importants au même endroit.",
      },
      {
        title: "Préparez les bonnes questions avant de contacter un propriétaire",
        body: "Définissez vos questions avant les annonces.",
      },
    ],
    searchTitle: "Commencer avec vos conditions de logement",
    searchDescription: "La vraie recherche n'est pas encore connectée. Ce MVP montre le parcours prévu.",
    cityLabel: "Ville",
    cityValue: "Toronto",
    purposeLabel: "Objectif du séjour",
    purposeOptions: ["PVT", "Études", "Court séjour", "Travail", "Autre"],
    budgetLabel: "Budget",
    budgetPlaceholder: "1 500 C$",
    moveInLabel: "Arrivée",
    moveInPlaceholder: "Choisir",
    peopleLabel: "Personnes",
    peopleValue: "1",
    housingTypeLabel: "Type de logement",
    housingTypes: ["Chambre", "Studio", "Condo", "Colocation"],
    conditionsLabel: "Conditions importantes",
    conditions: ["Transport", "Sécurité", "Près de l'école", "Près du travail", "Meublé", "Animaux"],
    primaryCta: "Voir les logements adaptés",
    checklistCta: "Voir la liste d’abord",
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

const JULY_2026_DAYS = Array.from({ length: 31 }, (_, index) => index + 1);
const JULY_2026_START_OFFSET = 3;
const CALENDAR_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HERO_IMAGES = [
  "/hero/toronto-1.png",
  "/hero/toronto-4.png",
  "/hero/vancouver-1.png",
  "/hero/quebec-1.png",
  "/hero/quebec-3.png",
  "/hero/montreal-3.png",
] as const;

type HeroSlide = {
  title: string;
  body: string;
  image: string;
};

const HERO_SLIDES: Record<Locale, HeroSlide[]> = {
  ko: [
    {
      title: "토론토 집 찾기,\n기준부터 정리하세요",
      body: "지역, 예산, 계약 조건을 기준으로 더 안전한 주거 결정을 준비하세요.",
      image: HERO_IMAGES[0],
    },
    {
      title: "지역·예산·계약 조건을\n한 번에 비교하세요",
      body: "낯선 도시에서도 무엇을 먼저 확인해야 하는지 정리해드립니다.",
      image: HERO_IMAGES[1],
    },
    {
      title: "입주 전 꼭 물어볼 질문을\n체크리스트로 준비하세요",
      body: "연락 전, 방문 전, 계약 전 확인할 질문을 놓치지 않게 돕습니다.",
      image: HERO_IMAGES[2],
    },
    {
      title: "검증 신호와 생활 조건을\n함께 확인하세요",
      body: "등록일, 마지막 확인일, 지역 분위기, 비용 조건을 한눈에 비교합니다.",
      image: HERO_IMAGES[3],
    },
    {
      title: "처음 가는 도시에서도\n기준이 있으면 덜 불안합니다",
      body: "주거 형태, 주변 환경, 계약 조건을 차근차근 확인할 수 있게 준비합니다.",
      image: HERO_IMAGES[4],
    },
    {
      title: "해외 단기거주자의\n주거 선택을 더 명확하게",
      body: "매물보다 먼저 확인해야 할 기준을 정리하는 메이플하우스 MVP입니다.",
      image: HERO_IMAGES[5],
    },
  ],
  en: [
    {
      title: "Find housing\nwith clearer criteria",
      body: "Compare location, budget, and rental conditions before choosing housing abroad.",
      image: HERO_IMAGES[0],
    },
    {
      title: "Compare neighborhood, budget,\nand rental conditions",
      body: "Review the housing decision in one place.",
      image: HERO_IMAGES[1],
    },
    {
      title: "Prepare the right questions\nbefore contacting a landlord",
      body: "Set your questions before browsing listings.",
      image: HERO_IMAGES[2],
    },
    {
      title: "Review trust signals\nbefore choosing housing",
      body: "Compare listing dates, last-checked status, and core rental conditions.",
      image: HERO_IMAGES[3],
    },
    {
      title: "A clearer process\nfor unfamiliar cities",
      body: "Move through housing type, neighborhood fit, and contract details step by step.",
      image: HERO_IMAGES[4],
    },
    {
      title: "Start with criteria,\nnot just listings",
      body: "MapleHouse helps organize the decision before the listing search gets noisy.",
      image: HERO_IMAGES[5],
    },
  ],
  fr: [
    {
      title: "Trouver un logement\navec des critères plus clairs",
      body: "Comparez le quartier, le budget et les conditions avant de choisir un logement.",
      image: HERO_IMAGES[0],
    },
    {
      title: "Comparez le quartier,\nle budget et les conditions",
      body: "Gardez les critères importants au même endroit.",
      image: HERO_IMAGES[1],
    },
    {
      title: "Préparez les bonnes questions\navant de contacter un propriétaire",
      body: "Définissez vos questions avant les annonces.",
      image: HERO_IMAGES[2],
    },
    {
      title: "Vérifiez les signaux de confiance\navant de choisir",
      body: "Comparez les dates, le dernier contrôle et les conditions de location.",
      image: HERO_IMAGES[3],
    },
    {
      title: "Un parcours plus clair\npour les villes inconnues",
      body: "Avancez étape par étape avec le type de logement, le quartier et le contrat.",
      image: HERO_IMAGES[4],
    },
    {
      title: "Commencez par les critères,\npas seulement les annonces",
      body: "MapleHouse organise la décision avant la recherche de logements.",
      image: HERO_IMAGES[5],
    },
  ],
};

function budgetInCad(value: number) {
  return value * 10;
}

function formatBudget(locale: Locale, value: number) {
  if (locale === "ko") return `${value}만원`;

  const formatted = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US").format(
    budgetInCad(value),
  );
  return `${formatted} C$`;
}

function formatMaxBudget(locale: Locale, value: number) {
  if (locale === "ko") return `최대 ${value}만원`;
  return `Max ${formatBudget(locale, value)}`;
}

function formatMoveIn(locale: Locale, value: string | null, fallback: string) {
  if (!value) return fallback;
  return value;
}

function formatPeople(locale: Locale, value: number) {
  if (locale === "ko") return `${value}명`;
  if (locale === "fr") return value === 1 ? "1 personne" : `${value} personnes`;
  return value === 1 ? "1 person" : `${value} people`;
}

function datePanelTitle(locale: Locale) {
  if (locale === "ko") return "입주 날짜 선택";
  if (locale === "fr") return "Choisir une date";
  return "Select move-in date";
}

function calendarMonthTitle(locale: Locale) {
  if (locale === "ko") return "2026년 7월";
  if (locale === "fr") return "Juillet 2026";
  return "July 2026";
}

function applyLabel(locale: Locale) {
  if (locale === "ko") return "적용";
  if (locale === "fr") return "Appliquer";
  return "Apply";
}

function resetLabel(locale: Locale) {
  if (locale === "ko") return "초기화";
  if (locale === "fr") return "Réinitialiser";
  return "Reset";
}

function cancelLabel(locale: Locale) {
  if (locale === "ko") return "취소";
  if (locale === "fr") return "Annuler";
  return "Cancel";
}

function cityPlaceholder(locale: Locale) {
  if (locale === "ko") return "도시 선택";
  if (locale === "fr") return "Choisir";
  return "Select";
}

function purposePlaceholder(locale: Locale) {
  if (locale === "ko") return "체류 목적 선택";
  if (locale === "fr") return "Choisir";
  return "Select";
}

function housingPlaceholder(locale: Locale) {
  if (locale === "ko") return "주거 형태 선택";
  if (locale === "fr") return "Choisir";
  return "Select";
}

function budgetPlaceholder(locale: Locale) {
  if (locale === "ko") return "금액 선택";
  if (locale === "fr") return "Choisir";
  return "Select";
}

function moveInLabel(locale: Locale) {
  if (locale === "ko") return "입주 날짜";
  if (locale === "fr") return "Arrivée";
  return "Move-in";
}

function cityOptions(locale: Locale) {
  if (locale === "fr") return ["Toronto", "Vancouver", "Montréal", "Québec"];
  return ["Toronto", "Vancouver", "Montreal", "Quebec City"];
}

export function LocaleMainPage({ locale }: { locale: Locale }) {
  const t = CONTENT[locale];
  const heroSlides = HERO_SLIDES[locale];
  const carouselSlides = useMemo(() => [...heroSlides, heroSlides[0]], [heroSlides]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [withTransition, setWithTransition] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWithTransition(true);
      setActiveSlide((current) => current + 1);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const visibleSlide = activeSlide % heroSlides.length;

  const handleCarouselTransitionEnd = () => {
    if (activeSlide === heroSlides.length) {
      setWithTransition(false);
      setActiveSlide(0);
      window.setTimeout(() => setWithTransition(true), 20);
    }
  };

  return (
    <>
      <section className="border-b border-border bg-background">
        <div className="relative bg-secondary/70 pb-8">
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

          <Container className="relative max-w-[90rem] pt-6 sm:pt-8 lg:pt-10">
            <div className="relative mx-auto max-w-[82rem] overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
              <div
                className={cn(
                  "flex",
                  withTransition && "transition-transform duration-700 ease-out",
                )}
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                onTransitionEnd={handleCarouselTransitionEnd}
              >
                {carouselSlides.map((slide, index) => (
                  <div
                    key={`${slide.title}-${index}`}
                    className="relative flex min-h-[24rem] w-full shrink-0 flex-col justify-center bg-secondary px-6 py-8 text-left sm:min-h-[26rem] sm:px-10 lg:px-14"
                    style={{
                      backgroundImage: `linear-gradient(90deg, rgba(12, 12, 12, 0.70), rgba(12, 12, 12, 0.38), rgba(255, 255, 255, 0.10)), url("${slide.image}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="max-w-3xl text-white drop-shadow-sm">
                      <div className="inline-flex max-w-full rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-medium text-white/90 shadow-sm backdrop-blur">
                        {t.mvpNotice}
                      </div>

                      <h1 className="mt-6 min-h-[6.25rem] whitespace-pre-line text-4xl font-semibold leading-tight sm:text-5xl">
                        {slide.title}
                      </h1>

                      <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90">
                        {slide.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-7 left-6 z-10 flex justify-start gap-2 sm:left-10 lg:left-14" aria-label="banner slide indicators">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    className={`h-2 rounded-full transition-all ${
                      index === visibleSlide ? "w-8 bg-primary" : "w-2 bg-white/60"
                    }`}
                    onClick={() => {
                      setWithTransition(true);
                      setActiveSlide(index);
                    }}
                    aria-label={`slide ${index + 1}`}
                  />
                ))}
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
  const [city, setCity] = useState("");
  const [purpose, setPurpose] = useState("");
  const [housingType, setHousingType] = useState("");
  const [budget, setBudget] = useState<number | null>(null);
  const [draftBudget, setDraftBudget] = useState(150);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [moveInOpen, setMoveInOpen] = useState(false);
  const [moveInDate, setMoveInDate] = useState<string | null>(null);
  const [draftMoveInDate, setDraftMoveInDate] = useState<string | null>(null);
  const [people, setPeople] = useState(1);

  return (
    <div className="relative z-20 mx-auto mt-6 min-h-[16rem] max-w-[82rem] rounded-3xl border border-border bg-card p-4 shadow-lg sm:p-5">
      <div className="mb-4 flex min-h-[4.75rem] items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            MapleHouse search
          </p>
          <h2 className="mh-clamp-2 mt-1 text-xl font-semibold text-foreground">{content.searchTitle}</h2>
          <p className="mh-clamp-2 mt-1 text-xs leading-relaxed text-muted-foreground">
            {content.searchDescription}
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(8.5rem,1fr)_minmax(10rem,1.1fr)_minmax(10rem,1.05fr)_minmax(8.5rem,1fr)_minmax(9rem,1fr)_minmax(14rem,1.25fr)]">
        <GatewaySelectField
          icon={<MapPinned />}
          label={content.cityLabel}
          placeholder={cityPlaceholder(locale)}
          options={cityOptions(locale)}
          value={city}
          onChange={setCity}
          className="xl:col-span-1"
        />
        <GatewaySelectField
          icon={<SlidersHorizontal />}
          label={content.purposeLabel}
          placeholder={purposePlaceholder(locale)}
          options={content.purposeOptions}
          value={purpose}
          onChange={setPurpose}
          className="xl:col-span-1"
        />
        <GatewaySelectField
          icon={<Home />}
          label={content.housingTypeLabel}
          placeholder={housingPlaceholder(locale)}
          options={content.housingTypes}
          value={housingType}
          onChange={setHousingType}
          className="xl:col-span-1"
        />
        <SearchPopoverField
          icon={<WalletCards />}
          label={content.budgetLabel}
          value={budget === null ? budgetPlaceholder(locale) : formatBudget(locale, budget)}
          valueMuted={budget === null}
          className="xl:col-span-1"
          open={budgetOpen}
          onToggle={() => {
            setDraftBudget(budget ?? 150);
            setBudgetOpen((value) => !value);
            setMoveInOpen(false);
          }}
        >
          <div className="w-80 rounded-2xl border border-border bg-card p-4 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {content.budgetLabel}
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {formatMaxBudget(locale, draftBudget)}
            </p>
            <input
              type="range"
              min={0}
              max={400}
              step={10}
              value={draftBudget}
              onChange={(event) => setDraftBudget(Number(event.target.value))}
              className="mh-budget-range mt-4 w-full"
              style={
                {
                  "--mh-range-progress": `${(draftBudget / 400) * 100}%`,
                } as CSSProperties
              }
            />
            <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
              <span>{locale === "ko" ? "0만원" : "0 C$"}</span>
              <span>{locale === "ko" ? "400만원" : "4,000 C$"}</span>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="soft"
                size="sm"
                onClick={() => {
                  setBudget(null);
                  setDraftBudget(150);
                  setBudgetOpen(false);
                }}
              >
                {resetLabel(locale)}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setBudget(draftBudget);
                  setBudgetOpen(false);
                }}
              >
                {applyLabel(locale)}
              </Button>
            </div>
          </div>
        </SearchPopoverField>
        <SearchPopoverField
          icon={<CalendarDays />}
          label={moveInLabel(locale)}
          value={formatMoveIn(locale, moveInDate, content.moveInPlaceholder)}
          valueMuted={!moveInDate}
          className="xl:col-span-1"
          open={moveInOpen}
          onToggle={() => {
            setDraftMoveInDate(moveInDate);
            setMoveInOpen((value) => !value);
            setBudgetOpen(false);
          }}
        >
          <div className="w-80 rounded-2xl border border-border bg-card p-4 text-foreground shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  {datePanelTitle(locale)}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {calendarMonthTitle(locale)}
                </p>
              </div>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                onClick={() => setMoveInOpen(false)}
                aria-label="close calendar"
              >
                ×
              </button>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
              {CALENDAR_WEEKDAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1">
              {Array.from({ length: JULY_2026_START_OFFSET }).map((_, index) => (
                <span key={`blank-${index}`} />
              ))}
              {JULY_2026_DAYS.map((day) => {
                const date = `2026-07-${String(day).padStart(2, "0")}`;
                return (
                <button
                  key={date}
                  type="button"
                  className={cn(
                    "flex h-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                    draftMoveInDate === date
                      ? "bg-[#FA7000] text-white"
                      : "text-foreground hover:bg-accent",
                  )}
                  onClick={() => setDraftMoveInDate(date)}
                >
                  {day}
                </button>
                );
              })}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="soft"
                size="sm"
                onClick={() => setMoveInOpen(false)}
              >
                {cancelLabel(locale)}
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!draftMoveInDate || draftMoveInDate === moveInDate}
                onClick={() => {
                  setMoveInDate(draftMoveInDate);
                  setMoveInOpen(false);
                }}
              >
                {applyLabel(locale)}
              </Button>
            </div>
          </div>
        </SearchPopoverField>
        <PeopleField
          locale={locale}
          label={content.peopleLabel}
          value={people}
          onDecrease={() => setPeople((value) => Math.max(1, value - 1))}
          onIncrease={() => setPeople((value) => value + 1)}
          className="xl:col-span-1"
        />
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
    <label className={`flex h-[3.75rem] items-center gap-3 rounded-xl border border-border bg-background px-3 py-1.5 ${className}`}>
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

function PeopleField({
  locale,
  label,
  value,
  onDecrease,
  onIncrease,
  className = "",
}: {
  locale: Locale;
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  className?: string;
}) {
  return (
    <div className={`flex h-[3.75rem] min-w-0 items-center gap-3 rounded-xl border border-border bg-background px-3 py-1.5 ${className}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary [&_svg]:h-4 [&_svg]:w-4">
        <Users />
      </span>
      <span className="min-w-0 flex-1">
        <span className="mh-clamp-1 block min-h-[1rem] text-[11px] font-medium text-muted-foreground">
          {label}
        </span>
        <span className="mt-0.5 inline-flex max-w-full items-center gap-1.5">
          <button
            type="button"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-white text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-40"
            onClick={onDecrease}
            disabled={value <= 1}
            aria-label="decrease people"
          >
            -
          </button>
          <span className="min-w-[2.8rem] whitespace-nowrap text-center text-sm font-semibold leading-none text-foreground sm:min-w-[3.2rem]">
            {formatPeople(locale, value)}
          </span>
          <button
            type="button"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-white text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            onClick={onIncrease}
            aria-label="increase people"
          >
            +
          </button>
        </span>
      </span>
    </div>
  );
}

function GatewaySelectField({
  icon,
  label,
  placeholder,
  options,
  value,
  onChange,
  className = "",
}: {
  icon: ReactNode;
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "flex h-[3.75rem] w-full cursor-pointer items-center justify-start gap-2.5 rounded-xl border-border bg-background px-3 py-1.5 text-left shadow-none transition-colors hover:border-primary hover:bg-accent/40 focus:ring-1 focus:ring-primary [&>svg]:ml-auto [&>svg]:h-4 [&>svg]:w-4",
          className,
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary [&_svg]:h-4 [&_svg]:w-4">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <span className="block min-h-[1rem] text-[11px] font-medium text-muted-foreground">
            {label}
          </span>
          <span
            className={cn(
              "block truncate whitespace-nowrap text-sm font-medium",
              value ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <SelectValue placeholder={placeholder} />
          </span>
        </div>
      </SelectTrigger>
      <SelectContent
        side="bottom"
        align="start"
        avoidCollisions={false}
        className="rounded-xl border-border bg-white text-foreground shadow-xl"
      >
        {options.map((option) => (
          <SelectItem
            key={option}
            value={option}
            className="rounded-lg px-3 py-2 pr-8 text-sm font-semibold focus:bg-[#FFF3E6] focus:text-primary data-[state=checked]:bg-[#FFF3E6] data-[state=checked]:text-primary"
          >
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SearchPopoverField({
  icon,
  label,
  value,
  valueMuted = false,
  children,
  open,
  onToggle,
  className = "",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  valueMuted?: boolean;
  children: ReactNode;
  open: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="flex h-[3.75rem] w-full cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-background px-3 py-1.5 pr-9 text-left transition-colors hover:border-primary hover:bg-accent/40 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary [&_svg]:h-4 [&_svg]:w-4">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block min-h-[1rem] text-[11px] font-medium text-muted-foreground">
            {label}
          </span>
          <span
            className={cn(
              "block whitespace-nowrap text-sm font-medium",
              valueMuted ? "text-muted-foreground" : "text-foreground",
            )}
          >
            {value}
          </span>
        </span>
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </button>
      {open && <div className="absolute left-0 top-[calc(100%+0.5rem)] z-[60]">{children}</div>}
    </div>
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
