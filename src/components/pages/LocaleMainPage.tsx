import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  Heart,
  Home,
  MapPin,
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
import { MOCK_LISTINGS, type MockListing } from "./LocaleListingsPage";

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
  imageSrc?: string;
};

type HomeGatewayContent = {
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
  browseCta: string;
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

type HomeListingCopy = {
  recommendedTitle: string;
  recommendedDescription: string;
  recommendedLink: string;
  newTitle: string;
  newDescription: string;
  newLink: string;
  status: {
    verified: string;
    needs_check: string;
    preparing: string;
  };
  peopleLabel: (value: number) => string;
  priceSuffix: string;
  favoriteLabel: string;
};

const CONTENT: Record<Locale, HomeGatewayContent> = {
  ko: {
    heroLabel: "해외 주거 탐색 게이트웨이",
    heroTitleLines: ["해외에서도", "집 찾기는 더 쉽게"],
    heroDescription:
      "지역, 예산, 계약 조건, 생활 체크리스트를 함께 보고 더 안전한 주거 결정을 준비하세요.",
    bannerSlides: [
      {
        title: "해외에서도 국내보다 쉽고 안전하게 자취 시작하기",
        body: "불편한 사이트와 불안한 사기를 걱정하지 않도록 MapleHouse가 흐름을 정리해드릴게요.",
      },
      {
        title: "지역, 예산, 계약 조건을 한 번에 비교하세요",
        body: "낯선 도시에서도 무엇을 먼저 확인해야 하는지 차근차근 볼 수 있어요.",
      },
      {
        title: "처음이라도 괜찮아요",
        body: "체크리스트로 어떤 기준부터 봐야 하는지 함께 정리해요.",
      },
    ],
    searchTitle: "해외에서 거주할 집 찾아보기",
    searchDescription:
      "해외에서의 소중한 첫 추억이 될 보금자리를 검색해 보세요.",
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
    housingTypes: ["룸렌트", "스튜디오", "콘도", "셰어하우스"],
    conditionsLabel: "중요 조건",
    conditions: ["교통", "치안", "학교 근처", "직장 근처", "가구 포함", "반려동물"],
    browseCta: "조건없이 집 구경하기",
    primaryCta: "조건에 맞는 매물 보기",
    checklistCta: "체크리스트 먼저 보기",
    popularTitle: "인기 필터",
    popularDescription: "",
    popularFilters: [
      {
        title: "학교 근처",
        tags: ["통학", "어학원", "유학생"],
        icon: <GraduationCap />,
        imageSrc: "/home/popular-filters/popular-school-nearby.webp",
      },
      {
        title: "교통 좋음",
        tags: ["TTC", "역세권", "출퇴근"],
        icon: <TrainFront />,
        imageSrc: "/home/popular-filters/popular-good-transit.webp",
      },
      {
        title: "남성 전용",
        tags: ["안전", "룸렌트", "공용공간"],
        icon: <Users />,
        imageSrc: "/home/popular-filters/popular-male-only.webp",
      },
      {
        title: "여성 전용",
        tags: ["안전", "룸렌트", "공용공간"],
        icon: <Venus />,
        imageSrc: "/home/popular-filters/popular-female-only.webp",
      },
      {
        title: "가구 포함",
        tags: ["침대", "책상", "즉시 생활"],
        icon: <Sofa />,
        imageSrc: "/home/popular-filters/popular-furnished.webp",
      },
      {
        title: "즉시 입주",
        tags: ["빠른 입주", "단기", "공실"],
        icon: <Clock3 />,
        imageSrc: "/home/popular-filters/popular-immediate-move-in.webp",
      },
      {
        title: "단기 가능",
        tags: ["서브렛", "1-3개월", "유연"],
        icon: <CalendarDays />,
        imageSrc: "/home/popular-filters/popular-short-term.webp",
      },
      {
        title: "검증 완료",
        tags: ["확인됨", "상태", "신뢰"],
        icon: <BadgeCheck />,
        imageSrc: "/home/popular-filters/popular-verified.webp",
      },
    ],
    quickTitle: "빠른 이동",
    quickDescription: "매물 탐색부터 문의까지 필요한 흐름으로 바로 이동하세요.",
    quickActions: [
      { label: "매물 보기", description: "지도와 리스트로 보기", to: "/ko/listings", icon: <Home /> },
      { label: "지역 가이드", description: "생활권 비교 가이드", icon: <MapPinned /> },
      { label: "계약 전 질문", description: "문의 전 확인 질문", icon: <MessageSquareText /> },
      { label: "체크리스트", description: "입주 전 확인 기준", icon: <ClipboardCheck /> },
      { label: "임대인 등록/문의", description: "매물 제공자 흐름", to: "/ko/landlords", icon: <Building2 /> },
    ],
    checklistTitle: "처음 집을 보기 전 확인할 것",
    checklistDescription: "단순 매물 검색보다 판단 기준을 먼저 정리합니다.",
    checklistItems: ["월세에 포함된 비용", "대중교통과 생활권", "계약 기간과 보증금", "마지막 확인일과 검증 상태"],
  },
  en: {
    heroLabel: "Overseas housing gateway",
    heroTitleLines: ["Find housing", "with clearer criteria"],
    heroDescription:
      "Compare location, budget, contract conditions, and checklists before making a housing decision abroad.",
    bannerSlides: [
      {
        title: "Start living abroad with less friction and more confidence",
        body: "MapleHouse helps organize the search so unfamiliar sites and risky listings feel easier to handle.",
      },
      {
        title: "Compare area, budget, and rental terms in one place",
        body: "See what to check first when you are choosing housing in a new city.",
      },
      {
        title: "New to overseas housing? Start with the checklist",
        body: "Clarify what kind of neighborhood and home conditions fit your first stay abroad.",
      },
    ],
    searchTitle: "Find a home for your life abroad",
    searchDescription: "Search for a place that can hold your first memories in a new country.",
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
    browseCta: "Browse homes without filters",
    primaryCta: "View matching listings",
    checklistCta: "View checklist first",
    popularTitle: "Popular filters",
    popularDescription: "",
    popularFilters: [
      {
        title: "School nearby",
        tags: ["Commute", "Student", "Language school"],
        icon: <GraduationCap />,
        imageSrc: "/home/popular-filters/popular-school-nearby.webp",
      },
      {
        title: "Good transit",
        tags: ["TTC", "Station", "Daily route"],
        icon: <TrainFront />,
        imageSrc: "/home/popular-filters/popular-good-transit.webp",
      },
      {
        title: "Men only",
        tags: ["Safety", "Room", "Shared space"],
        icon: <Users />,
        imageSrc: "/home/popular-filters/popular-male-only.webp",
      },
      {
        title: "Women only",
        tags: ["Safety", "Room", "Shared space"],
        icon: <Venus />,
        imageSrc: "/home/popular-filters/popular-female-only.webp",
      },
      {
        title: "Furnished",
        tags: ["Bed", "Desk", "Ready"],
        icon: <Sofa />,
        imageSrc: "/home/popular-filters/popular-furnished.webp",
      },
      {
        title: "Move in now",
        tags: ["Available", "Fast", "Vacant"],
        icon: <Clock3 />,
        imageSrc: "/home/popular-filters/popular-immediate-move-in.webp",
      },
      {
        title: "Short stay",
        tags: ["Sublet", "1-3 months", "Flexible"],
        icon: <CalendarDays />,
        imageSrc: "/home/popular-filters/popular-short-term.webp",
      },
      {
        title: "Checked",
        tags: ["Checked", "Status", "Trust"],
        icon: <BadgeCheck />,
        imageSrc: "/home/popular-filters/popular-verified.webp",
      },
    ],
    quickTitle: "Quick actions",
    quickDescription: "Move from discovery to inquiry without losing the bigger decision context.",
    quickActions: [
      { label: "View listings", description: "Map and list preview", to: "/en/listings", icon: <Home /> },
      { label: "Neighborhood guide", description: "Area comparison guide", icon: <MapPinned /> },
      { label: "Questions before contract", description: "Questions to check first", icon: <MessageSquareText /> },
      { label: "Checklist", description: "Decision criteria preview", icon: <ClipboardCheck /> },
      { label: "List a property", description: "Provider inquiry flow", to: "/en/landlords", icon: <Building2 /> },
    ],
    checklistTitle: "What to check before choosing a place",
    checklistDescription: "MapleHouse focuses on decision criteria, not just listing volume.",
    checklistItems: ["Costs included in rent", "Transit and neighborhood fit", "Lease period and deposit", "Last checked and verification status"],
  },
  fr: {
    heroLabel: "Portail de logement à l’étranger",
    heroTitleLines: ["Trouver un logement", "avec des critères plus clairs"],
    heroDescription:
      "Comparez le quartier, le budget, les conditions et les listes de vérification avant de choisir un logement.",
    bannerSlides: [
      {
        title: "Commencez votre vie à l’étranger avec plus de confiance",
        body: "MapleHouse organise la recherche pour rendre les annonces et les sites inconnus plus faciles à comprendre.",
      },
      {
        title: "Comparez le quartier, le budget et les conditions",
        body: "Gardez les critères importants au même endroit avant de choisir.",
      },
      {
        title: "Une première recherche à l’étranger? Commencez par la checklist",
        body: "Clarifiez le quartier et les conditions qui correspondent à votre premier séjour.",
      },
    ],
    searchTitle: "Trouvez votre logement à l’étranger",
    searchDescription: "Cherchez un chez-vous pour commencer vos premiers souvenirs dans un nouveau pays.",
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
    conditions: ["Transport", "Sécurité", "Près de l’école", "Près du travail", "Meublé", "Animaux"],
    browseCta: "Voir les logements sans filtres",
    primaryCta: "Voir les logements adaptés",
    checklistCta: "Voir la checklist d’abord",
    popularTitle: "Filtres populaires",
    popularDescription: "",
    popularFilters: [
      {
        title: "Proche des écoles",
        tags: ["Trajet", "Étudiant", "École"],
        icon: <GraduationCap />,
        imageSrc: "/home/popular-filters/popular-school-nearby.webp",
      },
      {
        title: "Transports pratiques",
        tags: ["TTC", "Station", "Quotidien"],
        icon: <TrainFront />,
        imageSrc: "/home/popular-filters/popular-good-transit.webp",
      },
      {
        title: "Hommes seulement",
        tags: ["Sécurité", "Chambre", "Partagé"],
        icon: <Users />,
        imageSrc: "/home/popular-filters/popular-male-only.webp",
      },
      {
        title: "Femmes seulement",
        tags: ["Sécurité", "Chambre", "Partagé"],
        icon: <Venus />,
        imageSrc: "/home/popular-filters/popular-female-only.webp",
      },
      {
        title: "Meublé",
        tags: ["Lit", "Bureau", "Prêt"],
        icon: <Sofa />,
        imageSrc: "/home/popular-filters/popular-furnished.webp",
      },
      {
        title: "Entrée rapide",
        tags: ["Disponible", "Rapide", "Libre"],
        icon: <Clock3 />,
        imageSrc: "/home/popular-filters/popular-immediate-move-in.webp",
      },
      {
        title: "Court séjour",
        tags: ["Sous-location", "1-3 mois", "Flexible"],
        icon: <CalendarDays />,
        imageSrc: "/home/popular-filters/popular-short-term.webp",
      },
      {
        title: "Vérifié",
        tags: ["Contrôlé", "Statut", "Confiance"],
        icon: <BadgeCheck />,
        imageSrc: "/home/popular-filters/popular-verified.webp",
      },
    ],
    quickTitle: "Accès rapides",
    quickDescription: "Passez de la recherche à la demande sans perdre les critères de décision.",
    quickActions: [
      { label: "Voir les logements", description: "Carte et liste", to: "/fr/listings", icon: <Home /> },
      { label: "Guide des quartiers", description: "Comparaison des quartiers", icon: <MapPinned /> },
      { label: "Questions avant contrat", description: "Questions à vérifier", icon: <MessageSquareText /> },
      { label: "Checklist", description: "Critères de décision", icon: <ClipboardCheck /> },
      { label: "Proposer un logement", description: "Parcours propriétaire", to: "/fr/landlords", icon: <Building2 /> },
    ],
    checklistTitle: "À vérifier avant de choisir un logement",
    checklistDescription: "MapleHouse met l’accent sur les critères de décision, pas seulement les annonces.",
    checklistItems: ["Coûts inclus dans le loyer", "Transport et quartier", "Durée du bail et dépôt", "Dernière vérification et statut"],
  },
};

const HOME_LISTING_COPY: Record<Locale, HomeListingCopy> = {
  ko: {
    recommendedTitle: "추천 매물",
    recommendedDescription: "조건을 정하기 전 먼저 비교해볼 만한 매물입니다.",
    recommendedLink: "전체 매물 보기",
    newTitle: "신규 매물",
    newDescription: "최근 등록된 매물을 먼저 확인해보세요.",
    newLink: "신규 매물 전체 보기",
    status: {
      verified: "확인 완료",
      needs_check: "확인 필요",
      preparing: "확인 중",
    },
    peopleLabel: (value) => "최대 " + value + "명",
    priceSuffix: "월",
    favoriteLabel: "관심 매물",
  },
  en: {
    recommendedTitle: "Recommended listings",
    recommendedDescription: "A few homes worth comparing before you narrow your conditions.",
    recommendedLink: "View all listings",
    newTitle: "New listings",
    newDescription: "Recently added homes to check first.",
    newLink: "View new listings",
    status: {
      verified: "Verified",
      needs_check: "Needs check",
      preparing: "Under review",
    },
    peopleLabel: (value) => "max " + value,
    priceSuffix: "mo",
    favoriteLabel: "Save listing",
  },
  fr: {
    recommendedTitle: "Logements recommandés",
    recommendedDescription: "Quelques logements à comparer avant de préciser vos critères.",
    recommendedLink: "Voir tous les logements",
    newTitle: "Nouveaux logements",
    newDescription: "Des logements récemment ajoutés à vérifier en premier.",
    newLink: "Voir les nouveaux logements",
    status: {
      verified: "Vérifié",
      needs_check: "À vérifier",
      preparing: "En vérification",
    },
    peopleLabel: (value) => "max. " + value + " pers.",
    priceSuffix: "mois",
    favoriteLabel: "Enregistrer le logement",
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
      title: "해외에서도 국내보다 쉽고 안전하게\n자취 시작하기",
      body: "더 이상 불편한 사이트와 불안한 사기를 걱정하지 마세요. 메이플하우스가 있으니까!",
      image: HERO_IMAGES[0],
    },
    {
      title: "지역·예산·계약 조건을\n한 번에 비교하세요",
      body: "낯선 도시에서도 무엇을 먼저 확인해야 하는지 메이플하우스가 알려드릴게요!",
      image: HERO_IMAGES[1],
    },
    {
      title: "해외 생활이 처음이신가요?\n걱정 마세요",
      body: "메이플하우스의 체크리스트로 집을 어떤 곳 주변으로 구하면 좋을지까지 알려드려요.",
      image: HERO_IMAGES[2],
    },
    {
      title: "직접 집주인에게 문의하기\n어려우시다면, 저희에게 맡겨주세요",
      body: "메이플하우스가 여러분을 위해 직접 매물 문의부터 예약까지 도와드려요.",
      image: HERO_IMAGES[3],
    },
    {
      title: "워홀? 어학연수? 유학?\n현지 생활에 대한 정보가 필요하세요?",
      body: "메이플하우스가 교통, 팁 문화, 주거 관련 용어, 생활 문화까지! 알아야 할 모든 것을 공유해드릴게요.",
      image: HERO_IMAGES[4],
    },
    {
      title: "메이플하우스가 여러분의\n소중한 월세를 지켜드릴게요",
      body: "예약은 출국 전 진행하고, 현지 집에 도착해 확인할 때까지 과정을 투명하게 안내해드릴게요.",
      image: HERO_IMAGES[5],
    },
  ],
  en: [
    {
      title: "Start living abroad\nwith more confidence",
      body: "No more confusing sites or anxious first steps. MapleHouse keeps the housing flow clear.",
      image: HERO_IMAGES[0],
    },
    {
      title: "Compare area, budget,\nand contract terms together",
      body: "In a new city, MapleHouse helps you see what to check first.",
      image: HERO_IMAGES[1],
    },
    {
      title: "New to overseas housing?\nStart with a checklist",
      body: "Clarify the neighborhood and home conditions that fit your first stay abroad.",
      image: HERO_IMAGES[2],
    },
    {
      title: "Need help asking landlords?\nLet MapleHouse guide the flow",
      body: "Move from listing inquiry to reservation steps with a clearer process.",
      image: HERO_IMAGES[3],
    },
    {
      title: "Need local living tips?\nMapleHouse organizes them",
      body: "Transit, tipping culture, housing terms, and daily-life basics are easier when they are in one place.",
      image: HERO_IMAGES[4],
    },
    {
      title: "MapleHouse helps protect\nyour monthly rent decision",
      body: "Start before departure and keep the process transparent until you can check the home locally.",
      image: HERO_IMAGES[5],
    },
  ],
  fr: [
    {
      title: "Commencez votre vie à l’étranger\navec plus de confiance",
      body: "Moins de sites confus, moins d’incertitude: MapleHouse clarifie le parcours logement.",
      image: HERO_IMAGES[0],
    },
    {
      title: "Comparez le quartier, le budget\net les conditions ensemble",
      body: "Dans une nouvelle ville, MapleHouse vous aide à voir quoi vérifier en premier.",
      image: HERO_IMAGES[1],
    },
    {
      title: "Première recherche à l’étranger?\nCommencez par la checklist",
      body: "Clarifiez le quartier et les conditions qui correspondent à votre premier séjour.",
      image: HERO_IMAGES[2],
    },
    {
      title: "Besoin d’aide pour contacter\nun propriétaire?",
      body: "MapleHouse vous aide à passer de la demande au parcours de réservation.",
      image: HERO_IMAGES[3],
    },
    {
      title: "Besoin de conseils locaux?\nMapleHouse les organise",
      body: "Transport, culture du pourboire, vocabulaire du logement et vie quotidienne au même endroit.",
      image: HERO_IMAGES[4],
    },
    {
      title: "MapleHouse vous aide à protéger\nvotre budget logement",
      body: "Préparez la réservation avant le départ et gardez un parcours transparent jusqu’à la visite sur place.",
      image: HERO_IMAGES[5],
    },
  ],
};

function budgetInCad(value: number) {
  return value * 10;
}

function formatBudget(locale: Locale, value: number) {
  if (locale === "ko") return value + "\uB9CC\uC6D0";

  const formatted = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US").format(
    budgetInCad(value),
  );
  return formatted + " C$";
}

function formatMaxBudget(locale: Locale, value: number) {
  if (locale === "ko") return "\uCD5C\uB300 " + value + "\uB9CC\uC6D0";
  return "Max " + formatBudget(locale, value);
}

function formatMoveIn(locale: Locale, value: string | null, fallback: string) {
  if (!value) return fallback;
  return value;
}

function formatPeople(locale: Locale, value: number) {
  if (locale === "ko") return value + "\uBA85";
  if (locale === "fr") return value === 1 ? "1 personne" : value + " personnes";
  return value === 1 ? "1 person" : value + " people";
}

function datePanelTitle(locale: Locale) {
  if (locale === "ko") return "\uC785\uC8FC \uB0A0\uC9DC \uC120\uD0DD";
  if (locale === "fr") return "Choisir une date";
  return "Select move-in date";
}

function calendarMonthTitle(locale: Locale) {
  if (locale === "ko") return "2026\uB144 7\uC6D4";
  if (locale === "fr") return "Juillet 2026";
  return "July 2026";
}

function applyLabel(locale: Locale) {
  if (locale === "ko") return "\uC801\uC6A9";
  if (locale === "fr") return "Appliquer";
  return "Apply";
}

function resetLabel(locale: Locale) {
  if (locale === "ko") return "\uCD08\uAE30\uD654";
  if (locale === "fr") return "Réinitialiser";
  return "Reset";
}

function cancelLabel(locale: Locale) {
  if (locale === "ko") return "\uCDE8\uC18C";
  if (locale === "fr") return "Annuler";
  return "Cancel";
}

function cityPlaceholder(locale: Locale) {
  if (locale === "ko") return "\uB3C4\uC2DC \uC120\uD0DD";
  if (locale === "fr") return "Choisir";
  return "Select";
}

function purposePlaceholder(locale: Locale) {
  if (locale === "ko") return "\uCCB4\uB958 \uBAA9\uC801 \uC120\uD0DD";
  if (locale === "fr") return "Choisir";
  return "Select";
}

function housingPlaceholder(locale: Locale) {
  if (locale === "ko") return "\uC8FC\uAC70 \uD615\uD0DC \uC120\uD0DD";
  if (locale === "fr") return "Choisir";
  return "Select";
}

function budgetPlaceholder(locale: Locale) {
  if (locale === "ko") return "\uAE08\uC561 \uC120\uD0DD";
  if (locale === "fr") return "Choisir";
  return "Select";
}

function moveInLabel(locale: Locale) {
  if (locale === "ko") return "\uC785\uC8FC \uB0A0\uC9DC";
  if (locale === "fr") return "Arrivée";
  return "Move-in";
}

function cityOptions(locale: Locale) {
  if (locale === "fr") return ["Toronto", "Vancouver", "Montréal", "Québec"];
  return ["Toronto", "Vancouver", "Montreal", "Quebec City"];
}

export function LocaleMainPage({ locale }: { locale: Locale }) {
  const t = CONTENT[locale];
  const listingCopy = HOME_LISTING_COPY[locale];
  const heroSlides = HERO_SLIDES[locale];
  const recommendedListings = useMemo(() => MOCK_LISTINGS.slice(0, 4), []);
  const newListings = useMemo(
    () =>
      [...MOCK_LISTINGS]
        .sort((a, b) => b.registered.localeCompare(a.registered))
        .slice(0, 4),
    [],
  );
  const [activeSlide, setActiveSlide] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [heroManualNavigationTick, setHeroManualNavigationTick] = useState(0);
  const [loadedHeroImages, setLoadedHeroImages] = useState<Set<string>>(
    () => new Set([heroSlides[0]?.image].filter(Boolean)),
  );
  const [lastVisibleHeroImage, setLastVisibleHeroImage] = useState(
    heroSlides[0]?.image ?? HERO_IMAGES[0],
  );
  const loadedHeroImagesRef = useRef(loadedHeroImages);

  useEffect(() => {
    const initialImage = heroSlides[0]?.image ?? HERO_IMAGES[0];
    const initialLoadedImages = new Set([initialImage]);
    loadedHeroImagesRef.current = initialLoadedImages;
    setLoadedHeroImages(initialLoadedImages);
    setLastVisibleHeroImage(initialImage);
    setActiveSlide(0);
  }, [heroSlides]);

  useEffect(() => {
    loadedHeroImagesRef.current = loadedHeroImages;
  }, [loadedHeroImages]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    heroSlides.forEach((slide) => {
      const image = new window.Image();
      image.src = slide.image;
      image.onload = async () => {
        try {
          await image.decode?.();
        } catch {
          // The image is still usable after onload even if decode is skipped.
        }

        setLoadedHeroImages((current) => {
          if (current.has(slide.image)) return current;
          const next = new Set(current);
          next.add(slide.image);
          loadedHeroImagesRef.current = next;
          return next;
        });
        setLastVisibleHeroImage((current) => current || slide.image);
      };
    });
  }, [heroSlides]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let timer: number | undefined;

    const repairHeroCarousel = () => {
      setWithTransition(true);
      setActiveSlide((current) => {
        const safeIndex = current >= 0 && current < heroSlides.length ? current : 0;
        const currentImage = heroSlides[safeIndex]?.image;
        if (currentImage && loadedHeroImagesRef.current.has(currentImage)) {
          setLastVisibleHeroImage(currentImage);
          return safeIndex;
        }

        const firstLoadedIndex = heroSlides.findIndex((slide) =>
          loadedHeroImagesRef.current.has(slide.image),
        );
        return firstLoadedIndex >= 0 ? firstLoadedIndex : 0;
      });
    };

    const stopTimer = () => {
      if (timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };

    const startTimer = () => {
      stopTimer();
      if (document.hidden || isHeroHovered || heroSlides.length <= 1) return;
      timer = window.setInterval(() => {
        setWithTransition(true);
        setActiveSlide((current) => {
          const next = (current + 1) % heroSlides.length;
          const nextImage = heroSlides[next]?.image;
          if (nextImage && loadedHeroImagesRef.current.has(nextImage)) {
            setLastVisibleHeroImage(nextImage);
            return next;
          }

          const firstLoadedIndex = heroSlides.findIndex((slide) =>
            loadedHeroImagesRef.current.has(slide.image),
          );
          return firstLoadedIndex >= 0 ? firstLoadedIndex : current;
        });
      }, 5000);
    };

    const handleResume = () => {
      repairHeroCarousel();
      startTimer();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimer();
        return;
      }
      handleResume();
    };

    startTimer();
    window.addEventListener("focus", handleResume);
    window.addEventListener("pageshow", handleResume);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopTimer();
      window.removeEventListener("focus", handleResume);
      window.removeEventListener("pageshow", handleResume);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [heroSlides, isHeroHovered, heroManualNavigationTick]);

  const visibleSlide = activeSlide >= 0 && activeSlide < heroSlides.length ? activeSlide : 0;
  const showHeroSlide = (nextIndex: number, resetAutoplay = true) => {
    const safeIndex = (nextIndex + heroSlides.length) % heroSlides.length;
    const nextImage = heroSlides[safeIndex]?.image;

    setWithTransition(true);
    if (resetAutoplay) {
      setHeroManualNavigationTick((value) => value + 1);
    }
    if (nextImage && loadedHeroImagesRef.current.has(nextImage)) {
      setLastVisibleHeroImage(nextImage);
    }
    setActiveSlide(safeIndex);
  };

  const moveHeroSlide = (delta: number) => {
    setWithTransition(true);
    setHeroManualNavigationTick((value) => value + 1);
    setActiveSlide((current) => {
      const safeCurrent = current >= 0 && current < heroSlides.length ? current : 0;
      const next = (safeCurrent + delta + heroSlides.length) % heroSlides.length;
      const nextImage = heroSlides[next]?.image;

      if (nextImage && loadedHeroImagesRef.current.has(nextImage)) {
        setLastVisibleHeroImage(nextImage);
      }

      return next;
    });
  };

  return (
    <div className="mh-page-grid">
      <section className="overflow-visible border-b border-border">
        <div className="relative overflow-visible pb-8">
          <div
            aria-hidden
            className="absolute left-1/2 top-8 h-72 w-[54rem] -translate-x-1/2 rounded-full bg-accent blur-3xl"
          />

          <Container className="relative max-w-[82rem] pt-6 sm:pt-8 lg:pt-10">
            <div
              className="relative mx-auto max-w-[82rem] overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm"
              onMouseEnter={() => setIsHeroHovered(true)}
              onMouseLeave={() => setIsHeroHovered(false)}
            >
              <div
                className={cn(
                  "flex",
                  withTransition && "transition-transform duration-700 ease-out",
                )}
                style={{ transform: `translateX(-${visibleSlide * 100}%)` }}
              >
                {heroSlides.map((slide) => {
                  const displayImage = loadedHeroImages.has(slide.image)
                    ? slide.image
                    : lastVisibleHeroImage || HERO_IMAGES[0];

                  return (
                    <div
                      key={slide.title}
                      className="relative flex min-h-[24rem] w-full shrink-0 flex-col justify-center overflow-hidden bg-secondary px-6 py-8 text-left sm:min-h-[26rem] sm:px-10 lg:px-14"
                      style={{
                        backgroundImage: `linear-gradient(90deg, rgba(12, 12, 12, 0.70), rgba(12, 12, 12, 0.38), rgba(255, 255, 255, 0.10)), url("${displayImage}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <img
                        src={displayImage}
                        alt=""
                        aria-hidden
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
                        onLoad={() => {
                          setLoadedHeroImages((current) => {
                            if (current.has(displayImage)) return current;
                            const next = new Set(current);
                            next.add(displayImage);
                            loadedHeroImagesRef.current = next;
                            return next;
                          });
                          setLastVisibleHeroImage(displayImage);
                        }}
                      />
                      <div className="relative z-10 max-w-3xl text-white drop-shadow-sm">
                        <h1 className="min-h-[7.25rem] max-w-4xl whitespace-pre-line text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                          {slide.title}
                        </h1>

                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90">
                          {slide.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
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
                      showHeroSlide(index);
                    }}
                    aria-label={`slide ${index + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/[0.16] text-white opacity-[0.45] backdrop-blur transition hover:bg-black/25 hover:opacity-75 focus-visible:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-5"
                onClick={(event) => {
                  event.stopPropagation();
                  moveHeroSlide(-1);
                }}
                aria-label={locale === "ko" ? "이전 슬라이드" : locale === "fr" ? "Diapositive précédente" : "Previous slide"}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/[0.16] text-white opacity-[0.45] backdrop-blur transition hover:bg-black/25 hover:opacity-75 focus-visible:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-5"
                onClick={(event) => {
                  event.stopPropagation();
                  moveHeroSlide(1);
                }}
                aria-label={locale === "ko" ? "다음 슬라이드" : locale === "fr" ? "Diapositive suivante" : "Next slide"}
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <SearchModule locale={locale} content={t} />
          </Container>
        </div>
      </section>

      <section className="overflow-x-hidden pb-1 pt-8">
        <Container className="max-w-[82rem]">
          <SectionHeading title={t.popularTitle} />
          <div className="mt-3 max-w-full overflow-x-auto pb-2">
            <div className="grid min-w-[52rem] grid-cols-8 gap-3 lg:min-w-0">
              {t.popularFilters.map((filter) => (
                <PopularFilterCard key={filter.title} filter={filter} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-10 pt-3">
        <Container className="max-w-[82rem] space-y-10">
          <HomeListingSection
            locale={locale}
            copy={listingCopy}
            title={listingCopy.recommendedTitle}
            description={listingCopy.recommendedDescription}
            linkLabel={listingCopy.recommendedLink}
            listings={recommendedListings}
          />
          <HomeListingSection
            locale={locale}
            copy={listingCopy}
            title={listingCopy.newTitle}
            description={listingCopy.newDescription}
            linkLabel={listingCopy.newLink}
            listings={newListings}
          />
        </Container>
      </section>
    </div>
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
    <div className="relative z-30 mx-auto mt-6 min-h-[18rem] max-w-[82rem] overflow-visible rounded-3xl border-2 border-[#FA7000]/65 bg-card p-5 shadow-xl shadow-black/10 sm:p-7">
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

      <div className="mt-5 grid gap-2 md:grid-cols-3">
        <Link
          to={`/${locale}/listings`}
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#FA7000]/70 bg-white px-4 text-center text-sm font-semibold text-[#B55300] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#FFF8F1]"
        >
          {content.browseCta}
        </Link>
        <Link
          to={`/${locale}/checklist`}
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#FA7000]/70 bg-white px-4 text-center text-sm font-semibold text-[#B55300] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#FFF8F1]"
        >
          {content.checklistCta}
        </Link>
        <Link
          to={`/${locale}/listings`}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#FA7000] px-4 text-center text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#E66600]"
        >
          {content.primaryCta}
        </Link>
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
    <label className={`flex h-[4.25rem] items-center gap-3 rounded-xl border border-border bg-background px-3 py-1.5 ${className}`}>
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
    <div className={`flex h-[4.25rem] min-w-0 items-center gap-3 rounded-xl border border-border bg-background px-3 py-1.5 ${className}`}>
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
          "flex h-[4.25rem] w-full cursor-pointer items-center justify-start gap-2.5 rounded-xl border-border bg-background px-3 py-1.5 text-left shadow-none transition-colors hover:border-primary hover:bg-accent/40 focus:ring-1 focus:ring-primary [&>svg]:ml-auto [&>svg]:h-4 [&>svg]:w-4",
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
  const [popoverFrame, setPopoverFrame] = useState<{
    left: number;
    top: number;
    width: number;
    maxHeight: number;
  } | null>(null);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="flex h-[4.25rem] w-full cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-background px-3 py-1.5 pr-9 text-left transition-colors hover:border-primary hover:bg-accent/40 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        onClick={(event) => {
          const triggerRect = event.currentTarget.getBoundingClientRect();
          const popoverWidth = Math.min(320, window.innerWidth - 24);
          const left = Math.min(
            Math.max(12, triggerRect.left),
            Math.max(12, window.innerWidth - popoverWidth - 12),
          );
          const top = triggerRect.bottom + 8;

          setPopoverFrame({
            left,
            top,
            width: popoverWidth,
            maxHeight: Math.max(160, window.innerHeight - top - 16),
          });
          onToggle();
        }}
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
      {open && popoverFrame && (
        <div
          className="fixed z-[1000] overflow-y-auto"
          style={{
            left: popoverFrame.left,
            top: popoverFrame.top,
            width: popoverFrame.width,
            maxHeight: popoverFrame.maxHeight,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function StaticValue({ children }: { children: ReactNode }) {
  return <span className="text-sm font-medium text-foreground">{children}</span>;
}

function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}

function HomeListingSection({
  locale,
  copy,
  title,
  description,
  linkLabel,
  listings,
}: {
  locale: Locale;
  copy: HomeListingCopy;
  title: string;
  description: string;
  linkLabel: string;
  listings: MockListing[];
}) {
  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading title={title} description={description} />
        <Link
          to={`/${locale}/listings`}
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/30 hover:bg-[#FFF8F1] hover:text-primary"
        >
          {linkLabel}
          <ChevronDown className="h-3.5 w-3.5 -rotate-90" aria-hidden />
        </Link>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {listings.map((listing) => (
          <HomeListingCard key={listing.id} listing={listing} locale={locale} copy={copy} />
        ))}
      </div>
    </section>
  );
}

function HomeListingCard({
  listing,
  locale,
  copy,
}: {
  listing: MockListing;
  locale: Locale;
  copy: HomeListingCopy;
}) {
  const price = formatHomeListingPrice(locale, listing);

  return (
    <Link
      to={`/${locale}/listings/$listingId`}
      params={{ listingId: listing.id }}
      className="mh-interactive-card group block overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        <img
          src={listing.imagePath}
          alt={listing.title[locale]}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.opacity = "0";
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        <span
          className={cn(
            "absolute left-2 top-2 max-w-[calc(100%-3.5rem)] truncate rounded-full border px-2.5 py-1 text-[11px] font-bold shadow-sm",
            homeListingStatusClass(listing.status),
          )}
        >
          {copy.status[listing.status]}
        </span>
        <span className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/90 text-muted-foreground shadow-sm backdrop-blur transition group-hover:text-primary">
          <Heart className="h-4 w-4" aria-label={copy.favoriteLabel} />
        </span>
      </div>

      <div className="pt-3">
        <h3 className="mh-clamp-2 min-h-11 text-sm font-extrabold leading-snug text-foreground">
          {listing.title[locale]}
        </h3>
        <div className="mt-2 flex min-w-0 items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          <span className="truncate">{listing.area}</span>
        </div>
        <div className="mt-3 flex min-h-6 flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            <Home className="h-3 w-3 text-primary" aria-hidden />
            {listing.roomType[locale]}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            <Users className="h-3 w-3 text-primary" aria-hidden />
            {copy.peopleLabel(listing.maxPeople)}
          </span>
        </div>
        <div className="mt-4 flex items-baseline gap-1.5">
          <span className="text-lg font-extrabold text-primary">{price}</span>
          <span className="text-xs font-semibold text-muted-foreground">/{copy.priceSuffix}</span>
        </div>
      </div>
    </Link>
  );
}

function formatHomeListingPrice(locale: Locale, listing: MockListing) {
  if (locale === "ko") {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(listing.priceKRW);
  }

  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(listing.priceCAD);
}

function homeListingStatusClass(status: MockListing["status"]) {
  if (status === "verified") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "needs_check") {
    return "border-[#F7D59D] bg-[#FFF8F1] text-[#8A4B00]";
  }
  return "border-border bg-white text-muted-foreground";
}

function PopularFilterCard({ filter }: { filter: PopularFilter }) {
  return (
    <button
      type="button"
      className="group flex min-h-[7.5rem] flex-col items-center justify-start px-2 py-2 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      aria-disabled="true"
    >
      {filter.imageSrc ? (
        <span className="relative block h-[4.75rem] w-[4.75rem] overflow-hidden rounded-full border border-black/10 transition duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-md group-hover:-translate-y-0.5 group-hover:scale-[1.03] group-hover:shadow-md">
          <img
            src={filter.imageSrc}
            alt={filter.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </span>
      ) : (
        <span className="flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full border border-border bg-white text-primary transition group-hover:-translate-y-0.5 group-hover:shadow-md [&_svg]:h-7 [&_svg]:w-7">
          {filter.icon}
        </span>
      )}
      <span className="mh-clamp-2 mt-3 block min-h-9 text-xs font-normal leading-snug text-foreground sm:text-sm">
        {filter.title}
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
