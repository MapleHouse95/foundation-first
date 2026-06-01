import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  Home,
  House,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import { formatStationDisplayName } from "@/lib/stationRecommendationData";

type Status = "verified" | "needs_check" | "preparing";
type LocalizedText = Record<Locale, string>;
type FilterPopover = "budget" | "housing" | "moveIn" | "people" | "more" | null;
type HousingTypeId = "room" | "studio" | "condo" | "share" | "house";
type InquiryMethod = "direct" | "support";
type ChecklistListingSource = "workingHoliday" | "languageStudy";
type MoreFilterId =
  | "verified"
  | "furnished"
  | "pet"
  | "school"
  | "transit"
  | "contract";

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
  imagePath: string;
  description: LocalizedText;
  checklist: Record<Locale, string[]>;
}

interface SidebarItem {
  key: string;
  icon: ReactNode;
  label: LocalizedText;
}

interface MapPinData {
  area: string;
  x: number;
  y: number;
}

interface ChecklistListingsContext {
  source: ChecklistListingSource;
  sourceLabel: string | null;
  resultLabel: string | null;
  stationItems: ChecklistStationItem[];
}

interface ChecklistStationItem {
  id: string;
  label: string;
  englishName: string;
  koreanName?: string;
}

interface LocalizedOption<T extends string> {
  id: T;
  label: LocalizedText;
}

interface L10n {
  pageTitle: string;
  resultCount: (n: number) => string;
  searchPlaceholder: string;
  searchButton: string;
  budget: string;
  housingType: string;
  moveIn: string;
  people: string;
  moreFilters: string;
  reset: string;
  apply: string;
  activeArea: string;
  budgetTitle: string;
  budgetRange: string;
  budgetMax: (value: number) => string;
  budgetChip: (value: number) => string;
  budgetMinLabel: string;
  budgetMaxLabel: string;
  calendarTitle: string;
  weekdays: string[];
  moveInChip: (value: string) => string;
  peopleChip: (value: number) => string;
  status: Record<Status, string>;
  maxPeopleLabel: (n: number) => string;
  lastChecked: string;
  registered: string;
  autoDeact: string;
  mapLabel: string;
  mapActiveArea: string;
  consultationCta: string;
  checklistCta: string;
  detailLabel: string;
  closeDetail: string;
  sampleImage: string;
  mvpNotice: string;
  inquiryModal: {
    title: string;
    subtitle: string;
    directTitle: string;
    directBadge: string;
    directDescription: string;
    directAction: string;
    directMessage: string;
    supportTitle: string;
    supportBadge: string;
    supportDescription: string;
    supportAction: string;
    supportMessage: string;
    footerNotice: string;
  };
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
    imagePath: "/listings/koreatown-studio.svg",
    description: {
      ko: "Koreatown 생활권을 먼저 확인해보고 싶은 1인 거주자용 mock 매물입니다.",
      en: "A mock listing for one person who wants to start around Koreatown.",
      fr: "Annonce fictive pour une personne souhaitant commencer par Koreatown.",
    },
    checklist: {
      ko: ["역까지 실제 이동 시간 확인", "가구 포함 범위 확인", "계약 전 보증금 조건 확인"],
      en: ["Check real transit time", "Confirm furnished items", "Review deposit terms"],
      fr: ["Vérifier le temps de trajet", "Confirmer les meubles inclus", "Relire les conditions"],
    },
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
    imagePath: "/listings/downtown-condo.svg",
    description: {
      ko: "다운타운 접근성과 생활 편의성을 비교해보기 위한 콘도 mock 매물입니다.",
      en: "A mock condo listing for comparing downtown access and daily convenience.",
      fr: "Condo fictif pour comparer l'accès au centre-ville et les commodités.",
    },
    checklist: {
      ko: ["공용 시설 비용 확인", "월세 포함 항목 확인", "소음·출퇴근 동선 확인"],
      en: ["Check amenity costs", "Confirm included utilities", "Review commute and noise"],
      fr: ["Vérifier les frais communs", "Confirmer les inclusions", "Vérifier trajet et bruit"],
    },
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
    imagePath: "/listings/northyork-share.svg",
    description: {
      ko: "North York에서 예산을 낮춰 비교해볼 수 있는 셰어하우스 mock 매물입니다.",
      en: "A mock share-house listing for comparing lower-budget options in North York.",
      fr: "Colocation fictive pour comparer des options plus abordables à North York.",
    },
    checklist: {
      ko: ["룸메이트 규칙 확인", "주방·욕실 공유 기준 확인", "최근 확인일 재점검"],
      en: ["Confirm roommate rules", "Check shared kitchen/bath terms", "Recheck last verification"],
      fr: ["Confirmer les règles", "Vérifier cuisine/salle de bain partagées", "Revoir la date de vérif."],
    },
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
    imagePath: "/listings/midtown-2br.svg",
    description: {
      ko: "Midtown 생활권과 2인 이상 거주 가능성을 비교하기 위한 mock 매물입니다.",
      en: "A mock listing for comparing Midtown options for two or more people.",
      fr: "Annonce fictive pour comparer Midtown pour deux personnes ou plus.",
    },
    checklist: {
      ko: ["방별 실제 크기 확인", "입주 가능일 확인", "교통·치안 우선순위 비교"],
      en: ["Check actual room sizes", "Confirm move-in date", "Compare transit and safety"],
      fr: ["Vérifier la taille des pièces", "Confirmer la date d'arrivée", "Comparer transport et sécurité"],
    },
  },
  {
    id: "L-005",
    title: {
      ko: "Annex 스튜디오 (가족형 X)",
      en: "Annex Studio (Not Family Type)",
      fr: "Studio à Annex (non familial)",
    },
    area: "Annex",
    roomType: { ko: "스튜디오", en: "Studio", fr: "Studio" },
    maxPeople: 1,
    priceKRW: 1620000,
    priceCAD: 1620,
    status: "verified",
    lastChecked: "2026-05-14",
    registered: "2026-04-18",
    imagePath: "/listings/annex-studio.svg",
    description: {
      ko: "Annex 주변 생활권과 스튜디오 조건을 비교하기 위한 mock 매물입니다.",
      en: "A mock studio listing for comparing the Annex area and studio conditions.",
      fr: "Studio fictif pour comparer Annex et les conditions d'un studio.",
    },
    checklist: {
      ko: ["단기 가능 여부 확인", "난방·전기 포함 여부 확인", "가족형 제한 조건 확인"],
      en: ["Confirm short-term availability", "Check heating/electricity", "Review household restrictions"],
      fr: ["Confirmer le court séjour", "Vérifier chauffage/électricité", "Revoir les restrictions"],
    },
  },
];

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    key: "rent",
    icon: <Home className="h-4 w-4" />,
    label: { ko: "월/룸", en: "Room", fr: "Chambre" },
  },
  {
    key: "condo",
    icon: <Building2 className="h-4 w-4" />,
    label: { ko: "콘도", en: "Condo", fr: "Condo" },
  },
  {
    key: "house",
    icon: <House className="h-4 w-4" />,
    label: { ko: "하우스", en: "House", fr: "Maison" },
  },
  {
    key: "share",
    icon: <Users className="h-4 w-4" />,
    label: { ko: "쉐어", en: "Share", fr: "Colocation" },
  },
  {
    key: "favorites",
    icon: <Star className="h-4 w-4" />,
    label: { ko: "즐겨찾기", en: "Favorites", fr: "Favoris" },
  },
  {
    key: "guide",
    icon: <BookOpen className="h-4 w-4" />,
    label: { ko: "가이드", en: "Guide", fr: "Guide" },
  },
];

const HOUSING_OPTIONS: LocalizedOption<HousingTypeId>[] = [
  { id: "room", label: { ko: "룸렌트", en: "Room rental", fr: "Chambre" } },
  { id: "studio", label: { ko: "스튜디오", en: "Studio", fr: "Studio" } },
  { id: "condo", label: { ko: "콘도", en: "Condo", fr: "Condo" } },
  { id: "share", label: { ko: "쉐어하우스", en: "Share house", fr: "Colocation" } },
  { id: "house", label: { ko: "하우스", en: "House", fr: "Maison" } },
];

const MORE_FILTER_OPTIONS: LocalizedOption<MoreFilterId>[] = [
  { id: "verified", label: { ko: "검증완료만", en: "Verified only", fr: "Vérifié seulement" } },
  { id: "furnished", label: { ko: "가구 포함", en: "Furnished", fr: "Meublé" } },
  { id: "pet", label: { ko: "반려동물 가능", en: "Pet friendly", fr: "Animaux acceptés" } },
  { id: "school", label: { ko: "학교 근처", en: "Near school", fr: "Près de l’école" } },
  { id: "transit", label: { ko: "교통 좋은", en: "Good transit", fr: "Bon transport" } },
  {
    id: "contract",
    label: { ko: "계약 전 확인 필요", en: "Contract checklist", fr: "Liste avant contrat" },
  },
];

const MAP_PINS: MapPinData[] = [
  { area: "Downtown", x: 43, y: 62 },
  { area: "Koreatown", x: 30, y: 51 },
  { area: "North York", x: 58, y: 24 },
  { area: "Midtown", x: 52, y: 42 },
  { area: "Annex", x: 36, y: 46 },
];

const MAY_2026_DATES = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1;
  return `2026-05-${String(day).padStart(2, "0")}`;
});

const MAY_2026_LEADING_BLANKS = 5;

const L: Record<Locale, L10n> = {
  ko: {
    pageTitle: "토론토 추천 매물",
    resultCount: (n) => `검색 결과 ${n}개`,
    searchPlaceholder: "지역, 학교, 지하철, 매물번호 검색",
    searchButton: "검색",
    budget: "월세 예산",
    housingType: "주거 형태",
    moveIn: "입주 날짜",
    people: "인원",
    moreFilters: "추가필터",
    reset: "초기화",
    apply: "적용",
    activeArea: "활성 지역",
    budgetTitle: "월세 예산",
    budgetRange: "0만원 ~ 400만원",
    budgetMax: (value) => `최대 ${value}만원`,
    budgetChip: (value) => `월세 최대 ${value}만원`,
    budgetMinLabel: "0만원",
    budgetMaxLabel: "400만원",
    calendarTitle: "2026년 5월",
    weekdays: ["일", "월", "화", "수", "목", "금", "토"],
    moveInChip: (value) => `입주 날짜 ${value}`,
    peopleChip: (value) => `${value}명`,
    status: { verified: "검증완료", needs_check: "확인필요", preparing: "준비중" },
    maxPeopleLabel: (n) => `최대 ${n}명`,
    lastChecked: "최근 확인",
    registered: "등록",
    autoDeact: "30일 미확인 시 자동 비활성화 예정",
    mapLabel: "지도 자리표시자 · 실제 지도 API 미연동",
    mapActiveArea: "활성 지역 · Downtown Toronto",
    consultationCta: "이 매물 문의하기",
    checklistCta: "체크리스트 보기",
    detailLabel: "매물 상세",
    closeDetail: "상세 닫기",
    sampleImage: "sample image",
    mvpNotice: "MVP 미리보기 · 실제 결제/계약/매물 등록은 아직 활성화되지 않았습니다.",
    inquiryModal: {
      title: "이 매물에 어떻게 문의할까요?",
      subtitle:
        "선택한 방식에 따라 집주인에게 직접 문의하거나, 메이플하우스의 도움을 받아 문의할 수 있습니다.",
      directTitle: "집주인에게 직접 문의하기",
      directBadge: "무료",
      directDescription:
        "체크리스트를 참고해 직접 집주인과 메시지를 주고받는 방식입니다. 현재 DM 기능은 MVP 준비 중입니다.",
      directAction: "직접 문의 미리보기",
      directMessage:
        "집주인 직접 메시지 기능은 다음 단계에서 연결됩니다. 현재는 MVP 미리보기입니다.",
      supportTitle: "메이플하우스와 함께 문의하기",
      supportBadge: "유료 플랜 예정",
      supportDescription:
        "처음이라 불안하거나 조건 확인이 어렵다면, 메이플하우스가 질문 정리와 기본 확인 과정을 도와주는 흐름입니다.",
      supportAction: "함께 문의 미리보기",
      supportMessage:
        "메이플하우스와 함께 문의하기는 유료 플랜으로 연결될 예정입니다. 현재는 신청 흐름만 미리 보여주는 단계입니다.",
      footerNotice:
        "현재 MVP 미리보기 단계입니다. 실제 메시지 발송, 결제, 신청 저장은 아직 진행되지 않습니다.",
    },
  },
  en: {
    pageTitle: "Recommended Listings in Toronto",
    resultCount: (n) => `${n} results`,
    searchPlaceholder: "Search area, school, transit, listing ID",
    searchButton: "Search",
    budget: "Budget",
    housingType: "Housing type",
    moveIn: "Move-in",
    people: "People",
    moreFilters: "More filters",
    reset: "Reset",
    apply: "Apply",
    activeArea: "Active area",
    budgetTitle: "Budget",
    budgetRange: "0 to 4,000,000 KRW",
    budgetMax: (value) => `Max ${Math.round(value * 10).toLocaleString("en-CA")} C$`,
    budgetChip: (value) => `Budget max ${Math.round(value * 10).toLocaleString("en-CA")} C$`,
    budgetMinLabel: "0 KRW",
    budgetMaxLabel: "4,000,000 KRW",
    calendarTitle: "May 2026",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    moveInChip: (value) => `Move-in ${value}`,
    peopleChip: (value) => `${value} people`,
    status: { verified: "Verified", needs_check: "Needs check", preparing: "Preparing" },
    maxPeopleLabel: (n) => `max ${n}`,
    lastChecked: "Last checked",
    registered: "Registered",
    autoDeact: "Auto-deactivation after 30 unchecked days is planned",
    mapLabel: "Map placeholder · no real map API",
    mapActiveArea: "Active area · Downtown Toronto",
    consultationCta: "Ask about this listing",
    checklistCta: "View checklist",
    detailLabel: "Listing details",
    closeDetail: "Close details",
    sampleImage: "sample image",
    mvpNotice: "MVP preview · Real payments, contracts, and property registration are not active yet.",
    inquiryModal: {
      title: "How would you like to ask about this listing?",
      subtitle:
        "Choose whether to contact the landlord directly or ask with MapleHouse support.",
      directTitle: "Contact landlord directly",
      directBadge: "Free",
      directDescription:
        "Message the landlord yourself using the listing details and checklist. Direct messaging is still being prepared for the MVP.",
      directAction: "Preview direct inquiry",
      directMessage:
        "Direct landlord messaging will be connected in a later step. This is an MVP preview.",
      supportTitle: "Ask with MapleHouse support",
      supportBadge: "Paid plan planned",
      supportDescription:
        "If you are unsure what to ask or want help checking conditions, MapleHouse will help organize questions and support the inquiry flow.",
      supportAction: "Preview MapleHouse support",
      supportMessage:
        "MapleHouse-assisted inquiry will be connected to a paid plan later. For now, this only previews the flow.",
      footerNotice:
        "This is an MVP preview. No real message, payment, or request is submitted yet.",
    },
  },
  fr: {
    pageTitle: "Logements recommandés à Toronto",
    resultCount: (n) => `${n} résultats`,
    searchPlaceholder: "Rechercher zone, école, transport, annonce",
    searchButton: "Rechercher",
    budget: "Budget",
    housingType: "Type",
    moveIn: "Arrivée",
    people: "Personnes",
    moreFilters: "Plus de filtres",
    reset: "Réinitialiser",
    apply: "Appliquer",
    activeArea: "Zone active",
    budgetTitle: "Budget",
    budgetRange: "0 à 4 000 000 KRW",
    budgetMax: (value) =>
      `Max ${Math.round(value * 10).toLocaleString("fr-FR").replace(/\u202f/g, " ")} C$`,
    budgetChip: (value) =>
      `Budget max ${Math.round(value * 10).toLocaleString("fr-FR").replace(/\u202f/g, " ")} C$`,
    budgetMinLabel: "0 KRW",
    budgetMaxLabel: "4 000 000 KRW",
    calendarTitle: "Mai 2026",
    weekdays: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    moveInChip: (value) => `Arrivée ${value}`,
    peopleChip: (value) => `${value} personnes`,
    status: { verified: "Vérifié", needs_check: "À vérifier", preparing: "En préparation" },
    maxPeopleLabel: (n) => `max. ${n} pers.`,
    lastChecked: "Dernière vérif.",
    registered: "Enregistré",
    autoDeact: "Désactivation automatique prévue après 30 jours sans vérification",
    mapLabel: "Carte fictive · aucune API réelle",
    mapActiveArea: "Zone active · Downtown Toronto",
    consultationCta: "Se renseigner sur ce logement",
    checklistCta: "Voir la liste",
    detailLabel: "Détails du logement",
    closeDetail: "Fermer les détails",
    sampleImage: "image d'exemple",
    mvpNotice: "Aperçu MVP · Les paiements, contrats et enregistrements réels ne sont pas encore actifs.",
    inquiryModal: {
      title: "Comment souhaitez-vous vous renseigner sur ce logement ?",
      subtitle:
        "Choisissez de contacter directement le propriétaire ou de demander l’aide de MapleHouse.",
      directTitle: "Contacter directement le propriétaire",
      directBadge: "Gratuit",
      directDescription:
        "Contactez vous-même le propriétaire à l’aide des informations du logement et de la liste de vérification. La messagerie directe est encore en préparation pour le MVP.",
      directAction: "Aperçu du contact direct",
      directMessage:
        "La messagerie directe avec le propriétaire sera connectée plus tard. Ceci est un aperçu MVP.",
      supportTitle: "Demander l’aide de MapleHouse",
      supportBadge: "Forfait payant prévu",
      supportDescription:
        "Si vous ne savez pas quoi demander ou si vous voulez vérifier les conditions, MapleHouse vous aide à organiser les questions et le parcours de demande.",
      supportAction: "Aperçu avec MapleHouse",
      supportMessage:
        "La demande assistée par MapleHouse sera liée à un forfait payant plus tard. Pour l’instant, ce parcours est seulement prévisualisé.",
      footerNotice:
        "Ceci est un aperçu MVP. Aucun message réel, paiement ou demande n’est envoyé pour le moment.",
    },
  },
};

const STATUS_CLASS: Record<Status, string> = {
  verified: "border-emerald-200 bg-emerald-50 text-emerald-700",
  needs_check: "border-warning-border/70 bg-warning/15 text-warning-foreground",
  preparing: "border-border bg-muted text-muted-foreground",
};

const CHECKLIST_SOURCE_LABELS: Record<Locale, Record<ChecklistListingSource, string>> = {
  ko: {
    workingHoliday: "워킹홀리데이",
    languageStudy: "어학연수",
  },
  en: {
    workingHoliday: "Working Holiday",
    languageStudy: "Language Study",
  },
  fr: {
    workingHoliday: "Permis vacances-travail",
    languageStudy: "Études linguistiques",
  },
};

export function LocaleListingsPage({ locale }: { locale: Locale }) {
  const t = L[locale];
  const location = useLocation() as { href?: string; searchStr?: string };
  const rawChecklistContext =
    locale === "ko" ? parseChecklistListingsContext(location.searchStr, locale) : null;
  const [showChecklistFilters, setShowChecklistFilters] = useState(false);
  const [removedChecklistFilters, setRemovedChecklistFilters] = useState<Set<string>>(new Set());
  const appliedChecklistContext = rawChecklistContext
    ? applyRemovedChecklistFilters(rawChecklistContext, removedChecklistFilters)
    : null;
  const checklistContext =
    appliedChecklistContext && appliedChecklistContext.stationItems.length > 0
      ? appliedChecklistContext
      : null;
  const [searchValue, setSearchValue] = useState("");
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [openFilter, setOpenFilter] = useState<FilterPopover>(null);
  const [draftBudgetMax, setDraftBudgetMax] = useState(150);
  const [appliedBudgetMax, setAppliedBudgetMax] = useState<number | null>(null);
  const [housingType, setHousingType] = useState<HousingTypeId | null>(null);
  const [draftMoveIn, setDraftMoveIn] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [draftPeople, setDraftPeople] = useState(1);
  const [peopleCount, setPeopleCount] = useState(1);
  const [draftMoreFilters, setDraftMoreFilters] = useState<Set<MoreFilterId>>(new Set());
  const [moreFilters, setMoreFilters] = useState<Set<MoreFilterId>>(new Set());
  const [selectedListing, setSelectedListing] = useState<MockListing | null>(null);

  useEffect(() => {
    setShowChecklistFilters(false);
    setRemovedChecklistFilters(new Set());
  }, [location.href]);

  const toggleFav = (id: string) =>
    setFavs((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const fmtKRW = (v: number) =>
    locale === "ko" ? `${v.toLocaleString("ko-KR")}원` : `₩${v.toLocaleString("ko-KR")}`;
  const fmtCAD = (v: number) => `CA$${v.toLocaleString("en-CA")}`;
  const selectedArea = selectedListing?.area ?? "Downtown Toronto";
  const activePinArea = selectedListing?.area ?? "Downtown";
  const activePin = MAP_PINS.find((pin) => pin.area === activePinArea);
  const mapTransform = activePin
    ? `translate(${(50 - activePin.x) * 0.16}%, ${(50 - activePin.y) * 0.16}%) scale(1.03)`
    : "translate(0, 0) scale(1)";
  const housingLabel = housingType
    ? HOUSING_OPTIONS.find((option) => option.id === housingType)?.label[locale]
    : undefined;
  const activeChips = [
    { id: "area", label: `${t.activeArea}: ${selectedArea}`, primary: true },
    ...(appliedBudgetMax ? [{ id: "budget", label: t.budgetChip(appliedBudgetMax) }] : []),
    ...(housingLabel ? [{ id: "housing", label: housingLabel }] : []),
    ...(moveIn ? [{ id: "moveIn", label: t.moveInChip(moveIn) }] : []),
    ...(peopleCount > 1 ? [{ id: "people", label: t.peopleChip(peopleCount) }] : []),
    ...Array.from(moreFilters).map((id) => ({
      id: `more-${id}`,
      label: MORE_FILTER_OPTIONS.find((option) => option.id === id)?.label[locale] ?? id,
    })),
  ];
  const activeAreaChip = activeChips.find((chip) => chip.id === "area");
  const userFilterChips = activeChips.filter((chip) => chip.id !== "area");

  const clearChecklistRecommendation = () => {
    setShowChecklistFilters(false);
    if (rawChecklistContext) {
      setRemovedChecklistFilters(
        new Set(["source", "result", ...rawChecklistContext.stationItems.map((station) => station.id)]),
      );
    }

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("checklist");
      url.searchParams.delete("stations");
      url.searchParams.delete("label");
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    }
  };

  const openListing = (listing: MockListing) => {
    setSelectedListing(listing);
  };

  const removeActiveChip = (id: string) => {
    if (id === "budget") setAppliedBudgetMax(null);
    if (id === "housing") setHousingType(null);
    if (id === "moveIn") {
      setMoveIn("");
      setDraftMoveIn("");
    }
    if (id === "people") {
      setPeopleCount(1);
      setDraftPeople(1);
    }
    if (id.startsWith("more-")) {
      const filterId = id.replace("more-", "") as MoreFilterId;
      setMoreFilters((current) => {
        const next = new Set(current);
        next.delete(filterId);
        return next;
      });
      setDraftMoreFilters((current) => {
        const next = new Set(current);
        next.delete(filterId);
        return next;
      });
    }
  };

  const resetFilters = () => {
    setSearchValue("");
    setOpenFilter(null);
    setDraftBudgetMax(150);
    setAppliedBudgetMax(null);
    setHousingType(null);
    setDraftMoveIn("");
    setMoveIn("");
    setDraftPeople(1);
    setPeopleCount(1);
    setDraftMoreFilters(new Set());
    setMoreFilters(new Set());
  };

  const toggleDraftMoreFilter = (id: MoreFilterId) => {
    setDraftMoreFilters((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-secondary">
      <section className="border-b border-border bg-card">
        <div className="mx-auto flex min-h-[4.75rem] w-full max-w-[96rem] flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2 xl:max-w-[38rem]">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                aria-label={t.searchPlaceholder}
                placeholder={t.searchPlaceholder}
                className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <Button type="button" className="h-10 shrink-0 gap-1.5 px-4" onClick={() => setOpenFilter(null)}>
              <Search className="h-4 w-4" />
              {t.searchButton}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            <div className="relative">
              <FilterTrigger
                label={t.budget}
                value={appliedBudgetMax ? t.budgetMax(appliedBudgetMax) : undefined}
                open={openFilter === "budget"}
                onClick={() => setOpenFilter(openFilter === "budget" ? null : "budget")}
              />
              {openFilter === "budget" && (
                <FilterPanel className="w-[19rem]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold">{t.budgetTitle}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">{t.budgetRange}</p>
                  </div>
                  <span className="text-sm font-extrabold text-primary">
                    {t.budgetMax(draftBudgetMax)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="400"
                  step="10"
                  value={draftBudgetMax}
                  onChange={(event) => setDraftBudgetMax(Number(event.target.value))}
                  className="mh-budget-range mt-5 w-full"
                  style={
                    {
                      "--mh-range-progress": `${(draftBudgetMax / 400) * 100}%`,
                    } as CSSProperties
                  }
                  aria-label={t.budgetTitle}
                />
                <div className="mt-2 flex justify-between text-[11px] font-medium text-muted-foreground">
                  <span>{t.budgetMinLabel}</span>
                  <span>{t.budgetMaxLabel}</span>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDraftBudgetMax(150);
                      setAppliedBudgetMax(null);
                    }}
                  >
                    {t.reset}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setAppliedBudgetMax(draftBudgetMax);
                      setOpenFilter(null);
                    }}
                  >
                    {t.apply}
                  </Button>
                </div>
                </FilterPanel>
              )}
            </div>

            <div className="relative">
              <FilterTrigger
                label={t.housingType}
                value={housingLabel}
                open={openFilter === "housing"}
                onClick={() => setOpenFilter(openFilter === "housing" ? null : "housing")}
              />
              {openFilter === "housing" && (
                <FilterPanel className="w-40">
                  <div className="grid gap-1">
                    {HOUSING_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setHousingType(option.id);
                          setOpenFilter(null);
                        }}
                        className={cn(
                          "rounded-lg px-3 py-2 text-left text-sm transition hover:bg-accent hover:text-primary",
                          housingType === option.id && "bg-accent text-primary",
                        )}
                      >
                        {option.label[locale]}
                      </button>
                    ))}
                  </div>
                </FilterPanel>
              )}
            </div>

            <div className="relative">
              <FilterTrigger
                label={t.moveIn}
                value={moveIn || undefined}
                icon={<CalendarDays className="h-4 w-4" />}
                open={openFilter === "moveIn"}
                onClick={() => setOpenFilter(openFilter === "moveIn" ? null : "moveIn")}
              />
              {openFilter === "moveIn" && (
                <FilterPanel className="w-[19rem]">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-foreground">{t.calendarTitle}</h2>
                    {draftMoveIn && (
                      <button
                        type="button"
                        onClick={() => setDraftMoveIn("")}
                        className="text-xs font-semibold text-primary"
                      >
                        {t.reset}
                      </button>
                    )}
                  </div>
                  <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-muted-foreground">
                    {t.weekdays.map((weekday) => (
                      <span key={weekday}>{weekday}</span>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-1">
                    {Array.from({ length: MAY_2026_LEADING_BLANKS }).map((_, index) => (
                      <span key={`blank-${index}`} aria-hidden />
                    ))}
                    {MAY_2026_DATES.map((date) => {
                      const day = Number(date.slice(-2));
                      const selected = draftMoveIn === date;

                      return (
                        <button
                          key={date}
                          type="button"
                          onClick={() => setDraftMoveIn(date)}
                          className={cn(
                            "h-9 rounded-full text-sm font-semibold transition",
                            selected
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-accent hover:text-primary",
                          )}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDraftMoveIn("");
                        setMoveIn("");
                      }}
                    >
                      {t.reset}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setMoveIn(draftMoveIn);
                        setOpenFilter(null);
                      }}
                    >
                      {t.apply}
                    </Button>
                  </div>
                </FilterPanel>
              )}
            </div>

            <div className="relative">
              <FilterTrigger
                label={t.people}
                value={peopleCount > 1 ? t.peopleChip(peopleCount) : undefined}
                icon={<Users className="h-4 w-4" />}
                open={openFilter === "people"}
                onClick={() => setOpenFilter(openFilter === "people" ? null : "people")}
              />
              {openFilter === "people" && (
                <FilterPanel className="w-56">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setDraftPeople((value) => Math.max(1, value - 1))}
                      className="h-9 w-9 rounded-full border border-border text-lg font-bold text-foreground transition hover:border-primary hover:text-primary"
                    >
                      -
                    </button>
                    <span className="text-lg font-extrabold text-foreground">
                      {t.peopleChip(draftPeople)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDraftPeople((value) => value + 1)}
                      className="h-9 w-9 rounded-full border border-border text-lg font-bold text-foreground transition hover:border-primary hover:text-primary"
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDraftPeople(1);
                        setPeopleCount(1);
                      }}
                    >
                      {t.reset}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setPeopleCount(draftPeople);
                        setOpenFilter(null);
                      }}
                    >
                      {t.apply}
                    </Button>
                  </div>
                </FilterPanel>
              )}
            </div>

            <div className="relative">
              <FilterTrigger
                label={t.moreFilters}
                value={moreFilters.size > 0 ? `${moreFilters.size}` : undefined}
                icon={<SlidersHorizontal className="h-4 w-4" />}
                open={openFilter === "more"}
                onClick={() => setOpenFilter(openFilter === "more" ? null : "more")}
              />
              {openFilter === "more" && (
                <FilterPanel className="right-0 left-auto w-[18rem]">
                  <div className="grid gap-2">
                    {MORE_FILTER_OPTIONS.map((option) => (
                      <label
                        key={option.id}
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground transition hover:bg-accent"
                      >
                        <input
                          type="checkbox"
                          checked={draftMoreFilters.has(option.id)}
                          onChange={() => toggleDraftMoreFilter(option.id)}
                          className="h-4 w-4 accent-[#FA7000]"
                        />
                        <span>{option.label[locale]}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDraftMoreFilters(new Set());
                        setMoreFilters(new Set());
                      }}
                    >
                      {t.reset}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setMoreFilters(new Set(draftMoreFilters));
                        setOpenFilter(null);
                      }}
                    >
                      {t.apply}
                    </Button>
                  </div>
                </FilterPanel>
              )}
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              {t.reset}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[96rem] gap-0 px-4 py-4 sm:px-6 lg:grid-cols-[5.5rem_minmax(22rem,25.5rem)_minmax(0,1fr)] lg:px-8">
        <aside className="mb-3 flex gap-2 overflow-x-auto border-border bg-card p-2 shadow-sm lg:mb-0 lg:h-[calc(100vh-10.75rem)] lg:flex-col lg:overflow-visible lg:rounded-l-2xl lg:border lg:border-r-0">
          {SIDEBAR_ITEMS.map((item, index) => {
            const selected = index === 0;

            return (
              <button
                key={item.key}
                type="button"
                className={cn(
                  "flex min-w-[4.75rem] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 text-xs font-semibold transition lg:min-w-0",
                  selected
                    ? "border-primary bg-accent text-primary"
                    : "border-transparent text-muted-foreground hover:border-primary/35 hover:bg-background hover:text-foreground",
                )}
              >
                {item.icon}
                <span className="mh-clamp-2 leading-tight">{item.label[locale]}</span>
              </button>
            );
          })}
        </aside>

        <section className="border border-border bg-card p-4 shadow-sm lg:h-[calc(100vh-10.75rem)] lg:overflow-y-auto lg:rounded-none">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-foreground">{t.pageTitle}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.resultCount(MOCK_LISTINGS.length)}
              </p>
            </div>
          </div>

          {checklistContext && (
            <ChecklistRecommendationBanner
              context={checklistContext}
              expanded={showChecklistFilters}
              onToggleExpanded={() => setShowChecklistFilters((current) => !current)}
              onRemoveFilter={(filterId) => {
                setRemovedChecklistFilters((current) => {
                  const next = new Set(current);
                  if (filterId === "stations" && rawChecklistContext) {
                    rawChecklistContext.stationItems.forEach((station) => next.add(station.id));
                  } else {
                    next.add(filterId);
                  }
                  return next;
                });
              }}
              onClearRecommendation={clearChecklistRecommendation}
            />
          )}

          <div className="mt-4 space-y-2">
            {activeAreaChip && (
              <div className="flex flex-wrap gap-2">
                <Chip
                  icon={<MapPin className="h-3.5 w-3.5" />}
                  label={activeAreaChip.label}
                  primary={activeAreaChip.primary}
                />
              </div>
            )}
            {userFilterChips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {userFilterChips.map((chip) => (
                  <Chip
                    key={chip.id}
                    label={chip.label}
                    primary={chip.primary}
                    onRemove={() => removeActiveChip(chip.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <ul className="mt-4 space-y-3">
            {MOCK_LISTINGS.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                locale={locale}
                t={t}
                favs={favs}
                onToggleFav={toggleFav}
                onOpenDetail={openListing}
                fmtKRW={fmtKRW}
                fmtCAD={fmtCAD}
              />
            ))}
          </ul>

          <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            {t.autoDeact}
          </p>
        </section>

        <section className="relative mt-4 min-h-[34rem] overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:mt-0 lg:h-[calc(100vh-10.75rem)] lg:rounded-l-none">
          <div
            className="absolute inset-[-2rem] transition-transform duration-300 ease-out"
            style={{ transform: mapTransform }}
          >
            <MapBackground />
            {MAP_PINS.map((pin) => (
              <MapMarker key={pin.area} pin={pin} active={pin.area === activePinArea} />
            ))}
          </div>

          <div className="absolute left-4 top-4 z-10 flex max-w-[calc(100%-2rem)] flex-wrap gap-2">
            <span className="rounded-full border border-border bg-background/95 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
              {t.mapLabel}
            </span>
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
              {t.activeArea} · {selectedArea}
            </span>
          </div>
        </section>

      </section>

      <ListingDetailDrawer
        listing={selectedListing}
        locale={locale}
        t={t}
        fmtKRW={fmtKRW}
        fmtCAD={fmtCAD}
        onClose={() => setSelectedListing(null)}
      />

      <p className="px-4 pb-6 text-center text-xs text-muted-foreground">{t.mvpNotice}</p>
    </main>
  );
}

function parseChecklistListingsContext(
  searchStr: string | undefined,
  locale: Locale,
): ChecklistListingsContext | null {
  const searchText =
    searchStr ?? (typeof window !== "undefined" ? window.location.search : "");
  const params = new URLSearchParams(searchText.startsWith("?") ? searchText : `?${searchText}`);
  const source = params.get("checklist");

  if (source !== "workingHoliday" && source !== "languageStudy") {
    return null;
  }

  const stationLabels = Array.from(
    new Set(
      (params.get("stations") ?? "")
        .split(",")
        .map((station) => station.trim())
        .filter(Boolean),
    ),
  ).map((station) => {
    const label = formatStationDisplayName(station, locale);
    return {
      id: `station:${station}`,
      label,
      ...splitStationLabel(label),
    };
  });

  if (stationLabels.length === 0) return null;

  return {
    source,
    sourceLabel: CHECKLIST_SOURCE_LABELS[locale][source],
    resultLabel: params.get("label"),
    stationItems: stationLabels,
  };
}

function applyRemovedChecklistFilters(
  context: ChecklistListingsContext,
  removedFilters: Set<string>,
): ChecklistListingsContext {
  return {
    ...context,
    sourceLabel: removedFilters.has("source") ? null : context.sourceLabel,
    resultLabel: removedFilters.has("result") ? null : context.resultLabel,
    stationItems: context.stationItems.filter((station) => !removedFilters.has(station.id)),
  };
}

function splitStationLabel(label: string) {
  const match = label.match(/^(.*?)\s*(\(.+\))$/);
  return {
    englishName: match?.[1] ?? label,
    koreanName: match?.[2],
  };
}

function ChecklistRecommendationBanner({
  context,
  expanded,
  onToggleExpanded,
  onRemoveFilter,
  onClearRecommendation,
}: {
  context: ChecklistListingsContext;
  expanded: boolean;
  onToggleExpanded: () => void;
  onRemoveFilter: (filterId: string) => void;
  onClearRecommendation: () => void;
}) {
  const sourceText = context.sourceLabel ? `${context.sourceLabel} 결과 기반` : "체크리스트 결과 기반";
  const stationCount = context.stationItems.length;

  return (
    <section className="mt-4 overflow-hidden rounded-2xl border-2 border-[#FFD7AA] bg-white shadow-sm">
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
              체크리스트 추천 적용됨
            </p>
            <p className="mt-1 whitespace-nowrap text-[12px] font-semibold text-foreground [word-break:keep-all] sm:text-[13px]">
              {sourceText} · 기준역 {stationCount}개
            </p>
          </div>
          <button
            type="button"
            aria-label="체크리스트 추천 초기화"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#FFD7AA] bg-white text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            onClick={onClearRecommendation}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#FFF0E0] bg-white px-3.5 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="whitespace-nowrap text-[11px] font-semibold text-primary [word-break:keep-all]">
              추천 기준역
            </p>
            <button
              type="button"
              className="shrink-0 whitespace-nowrap text-[11px] font-semibold text-primary transition-colors hover:text-primary/80 [word-break:keep-all]"
              onClick={onClearRecommendation}
            >
              추천 전체 해제
            </button>
          </div>
          <div className="mt-2 space-y-1.5">
            {context.stationItems.map((station) => (
              <RecommendedStationFilterRow
                key={station.id}
                station={station}
                onRemove={() => onRemoveFilter(station.id)}
              />
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        className="flex w-full items-center justify-center gap-1.5 border-t border-[#FFD7AA] bg-[#FFF3E6] px-3.5 py-2 text-xs font-semibold text-primary transition-colors hover:bg-[#FFE8CC]"
        onClick={onToggleExpanded}
      >
        <span className="whitespace-nowrap [word-break:keep-all]">
          {expanded ? "선택된 필터 숨기기" : "선택된 필터 보기"}
        </span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 shrink-0 transition-transform", expanded && "rotate-180")}
        />
      </button>
    </section>
  );
}

function RecommendedStationFilterRow({
  station,
  onRemove,
}: {
  station: ChecklistStationItem;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#FFE0BF] bg-white px-3 py-2">
      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
      <span className="min-w-0 flex-1 text-xs font-semibold leading-snug text-foreground">
        {station.englishName}
      </span>
      <button
        type="button"
        aria-label={`${station.englishName} 삭제`}
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#FFE0BF] bg-white text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

function FilterTrigger({
  label,
  value,
  icon,
  open,
  onClick,
  className,
}: {
  label: string;
  value?: string;
  icon?: ReactNode;
  open: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 max-w-[13rem] items-center justify-center gap-1.5 rounded-lg border bg-background px-3 text-center text-sm font-medium text-foreground shadow-sm transition hover:border-primary/70",
        open ? "border-primary text-primary" : "border-border",
        className,
      )}
    >
      {icon}
      <span className="truncate">{value ?? label}</span>
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function FilterPanel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "absolute left-0 top-12 z-40 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Chip({
  label,
  icon,
  primary = false,
  onRemove,
}: {
  label: string;
  icon?: ReactNode;
  primary?: boolean;
  onRemove?: () => void;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
        primary
          ? "border-primary/20 bg-accent text-primary"
          : "border-border bg-background text-muted-foreground",
      )}
    >
      {icon}
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="-mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition hover:bg-background hover:text-foreground"
          aria-label="remove filter"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

function ListingCard({
  listing,
  locale,
  t,
  favs,
  onToggleFav,
  onOpenDetail,
  fmtKRW,
  fmtCAD,
}: {
  listing: MockListing;
  locale: Locale;
  t: L10n;
  favs: Set<string>;
  onToggleFav: (id: string) => void;
  onOpenDetail: (listing: MockListing) => void;
  fmtKRW: (value: number) => string;
  fmtCAD: (value: number) => string;
}) {
  return (
    <li
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetail(listing)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenDetail(listing);
        }
      }}
      className="mh-interactive-card cursor-pointer rounded-2xl border border-border bg-card p-3 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="flex gap-3">
        <MockListingImage
          listing={listing}
          locale={locale}
          t={t}
          className="h-24 w-28 shrink-0"
          imageClassName="rounded-xl"
          badgeClassName="left-2 top-2"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="mh-clamp-2 text-sm font-bold text-foreground">
                {listing.title[locale]}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {listing.area} · {listing.roomType[locale]} · {t.maxPeopleLabel(listing.maxPeople)}
              </p>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleFav(listing.id);
              }}
              aria-label="favorite"
              className="rounded-full p-1 text-muted-foreground transition hover:bg-accent hover:text-primary"
            >
              <Star className={cn("h-4 w-4", favs.has(listing.id) && "fill-primary text-primary")} />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-base font-extrabold text-primary">
              {fmtKRW(listing.priceKRW)}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {fmtCAD(listing.priceCAD)}/mo
            </span>
          </div>

          <p className="mt-2 text-[11px] text-muted-foreground">
            {t.lastChecked}: {listing.lastChecked} · {t.registered}: {listing.registered}
          </p>
        </div>
      </div>
    </li>
  );
}

function MockListingImage({
  listing,
  locale,
  t,
  className,
  imageClassName,
  badgeClassName,
  showSampleLabel = false,
}: {
  listing: MockListing;
  locale: Locale;
  t: L10n;
  className?: string;
  imageClassName?: string;
  badgeClassName?: string;
  showSampleLabel?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-muted",
        className,
      )}
    >
      {!failed && (
        <img
          src={listing.imagePath}
          alt={listing.title[locale]}
          onError={() => setFailed(true)}
          className={cn("h-full w-full object-cover", imageClassName)}
        />
      )}
      {failed && (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.8),rgba(226,229,232,0.78))]">
          <div className="absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-border" />
          <div className="absolute inset-y-4 left-1/2 w-px -translate-x-1/2 bg-border" />
        </div>
      )}
      <span
        className={cn(
          "absolute rounded-full border px-2 py-0.5 text-[10px] font-bold",
          STATUS_CLASS[listing.status],
          badgeClassName,
        )}
      >
        {t.status[listing.status]}
      </span>
      {showSampleLabel && (
        <span className="absolute bottom-2 left-2 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur">
          {t.sampleImage}
        </span>
      )}
    </div>
  );
}

function ListingDetailDrawer({
  listing,
  locale,
  t,
  fmtKRW,
  fmtCAD,
  onClose,
}: {
  listing: MockListing | null;
  locale: Locale;
  t: L10n;
  fmtKRW: (value: number) => string;
  fmtCAD: (value: number) => string;
  onClose: () => void;
}) {
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryPreview, setInquiryPreview] = useState<InquiryMethod | null>(null);

  if (!listing) return null;

  return (
    <>
      <aside
        className="mh-drawer-slide-in fixed bottom-0 right-0 top-0 z-50 w-full max-w-[30rem] overflow-y-auto border-l border-border bg-card shadow-2xl"
        aria-label={t.detailLabel}
      >
        <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-card/95 px-5 backdrop-blur">
          <h2 className="text-sm font-bold text-foreground">{t.detailLabel}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeDetail}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <MockListingImage
            key={listing.imagePath}
            listing={listing}
            locale={locale}
            t={t}
            className="h-64 w-full"
            imageClassName="rounded-xl"
            badgeClassName="left-3 top-3"
            showSampleLabel
          />

          <div>
            <p className="text-xs font-semibold text-primary">{listing.area}</p>
            <h3 className="mt-1 text-2xl font-extrabold text-foreground">
              {listing.title[locale]}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {listing.area} · {listing.roomType[locale]} · {t.maxPeopleLabel(listing.maxPeople)}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-4">
            <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
              <span className="text-2xl font-extrabold text-primary">
                {fmtKRW(listing.priceKRW)}
              </span>
              <span className="text-sm font-semibold text-muted-foreground">
                {fmtCAD(listing.priceCAD)}/mo
              </span>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
              <span>
                {t.lastChecked}: <strong className="text-foreground">{listing.lastChecked}</strong>
              </span>
              <span>
                {t.registered}: <strong className="text-foreground">{listing.registered}</strong>
              </span>
            </div>
          </div>

          <p className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
            {listing.description[locale]}
          </p>

          <section className="rounded-2xl border border-border bg-card p-4">
            <h4 className="text-sm font-bold text-foreground">{t.checklistCta}</h4>
            <ul className="mt-3 space-y-2">
              {listing.checklist[locale].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              size="lg"
              onClick={() => {
                setInquiryModalOpen(true);
                setInquiryPreview(null);
              }}
            >
              {t.consultationCta}
            </Button>
            <Button type="button" variant="outline" size="lg">
              {t.checklistCta}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">{t.mvpNotice}</p>
        </div>
      </aside>

      {inquiryModalOpen && (
        <InquiryChoiceModal
          listing={listing}
          locale={locale}
          t={t}
          fmtKRW={fmtKRW}
          fmtCAD={fmtCAD}
          selectedMethod={inquiryPreview}
          onSelectMethod={setInquiryPreview}
          onClose={() => {
            setInquiryModalOpen(false);
            setInquiryPreview(null);
          }}
        />
      )}
    </>
  );
}

function InquiryChoiceModal({
  listing,
  locale,
  t,
  fmtKRW,
  fmtCAD,
  selectedMethod,
  onSelectMethod,
  onClose,
}: {
  listing: MockListing;
  locale: Locale;
  t: L10n;
  fmtKRW: (value: number) => string;
  fmtCAD: (value: number) => string;
  selectedMethod: InquiryMethod | null;
  onSelectMethod: (method: InquiryMethod) => void;
  onClose: () => void;
}) {
  const message =
    selectedMethod === "direct"
      ? t.inquiryModal.directMessage
      : selectedMethod === "support"
        ? t.inquiryModal.supportMessage
        : null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/35 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-choice-title"
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border bg-card p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="inquiry-choice-title" className="text-xl font-extrabold text-foreground">
              {t.inquiryModal.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t.inquiryModal.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeDetail}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 flex gap-3 rounded-2xl border border-border bg-secondary p-3 sm:p-4">
          <MockListingImage
            listing={listing}
            locale={locale}
            t={t}
            className="h-[72px] w-[88px] shrink-0"
            imageClassName="rounded-xl"
            badgeClassName="hidden"
          />
          <div className="min-w-0 flex-1">
            <p className="mh-clamp-2 text-sm font-extrabold text-foreground">
              {listing.title[locale]}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span>{listing.area}</span>
              <span>·</span>
              <span>{listing.roomType[locale]}</span>
              <span>·</span>
              <span>{t.maxPeopleLabel(listing.maxPeople)}</span>
            </div>
            <p className="mt-2 text-sm font-extrabold text-primary">
              {fmtKRW(listing.priceKRW)}
              <span className="ml-2 text-xs font-semibold text-muted-foreground">
                {fmtCAD(listing.priceCAD)}/mo
              </span>
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <InquiryOptionCard
            title={t.inquiryModal.directTitle}
            badge={t.inquiryModal.directBadge}
            description={t.inquiryModal.directDescription}
            action={t.inquiryModal.directAction}
            active={selectedMethod === "direct"}
            onClick={() => onSelectMethod("direct")}
          />
          <InquiryOptionCard
            title={t.inquiryModal.supportTitle}
            badge={t.inquiryModal.supportBadge}
            description={t.inquiryModal.supportDescription}
            action={t.inquiryModal.supportAction}
            active={selectedMethod === "support"}
            onClick={() => onSelectMethod("support")}
          />
        </div>

        {message && (
          <p className="mt-4 rounded-2xl border border-primary/20 bg-accent px-4 py-3 text-sm font-medium leading-relaxed text-foreground">
            {message}
          </p>
        )}

        <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
          {t.inquiryModal.footerNotice}
        </p>
      </section>
    </div>
  );
}

function InquiryOptionCard({
  title,
  badge,
  description,
  action,
  active,
  onClick,
}: {
  title: string;
  badge: string;
  description: string;
  action: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-full flex-col rounded-2xl border p-4 text-left shadow-sm transition-[background-color,border-color,box-shadow] duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        active
          ? "border-primary bg-accent shadow-md"
          : "border-border bg-card hover:border-primary hover:bg-accent hover:shadow-md",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-extrabold text-foreground">{title}</h3>
        <span className="shrink-0 rounded-full border border-primary/20 bg-accent px-2.5 py-1 text-[11px] font-bold text-primary">
          {badge}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold text-primary">
        {action}
        <ArrowRight className="h-4 w-4" />
      </span>
    </button>
  );
}

function MapBackground() {
  return (
    <div
      className="absolute inset-0 bg-[#EEF1F2]"
      style={{
        backgroundImage:
          "linear-gradient(24deg, rgba(255,255,255,0.75) 0 2px, transparent 2px 90px), linear-gradient(115deg, rgba(255,255,255,0.72) 0 2px, transparent 2px 105px), repeating-linear-gradient(0deg, rgba(96,101,107,0.11) 0 1px, transparent 1px 42px), repeating-linear-gradient(90deg, rgba(96,101,107,0.11) 0 1px, transparent 1px 42px)",
      }}
      aria-hidden
    />
  );
}

function MapMarker({ pin, active }: { pin: MapPinData; active: boolean }) {
  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-full"
      style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
    >
      <div className="flex flex-col items-center gap-1">
        <span
          className={cn(
            "rounded-md border px-2 py-1 text-[11px] font-bold shadow-sm",
            active
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-foreground",
          )}
        >
          {pin.area}
        </span>
        <span
          className={cn(
            "relative flex items-center justify-center rounded-full border-4 border-background bg-primary shadow-md transition-all",
            active ? "h-7 w-7 ring-4 ring-primary/20" : "h-5 w-5",
          )}
        >
          <span className="h-2 w-2 rounded-full bg-primary-foreground" />
        </span>
      </div>
    </div>
  );
}
