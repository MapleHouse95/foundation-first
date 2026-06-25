import { startTransition, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
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
import { ListingImageFrame } from "@/components/ui/listing-image-frame";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import { formatStationDisplayName } from "@/lib/stationRecommendationData";
import {
  getMockListingThumbnailImage,
  getStableMockListingGalleryImages,
} from "@/lib/mockListingImages";
import {
  loadGoogleMapsApi,
  type GoogleMapsApi,
  type GoogleMapsLatLngLiteral,
} from "@/lib/googleMapsLoader";
import { TTC_LINES, TTC_STATIONS, type TtcLineId } from "@/lib/mockTtcOverlay";
import { DEFAULT_TRANSIT_CITY_ID, TRANSIT_CITY_PROFILES } from "@/lib/transitCityProfiles";
import {
  buildSelectedInquiryPayload,
  saveSelectedInquiryPayload,
} from "@/lib/mockInquiryStorage";

export type Status = "verified" | "needs_check" | "preparing";
export type LocalizedText = Record<Locale, string>;
type FilterPopover = "budget" | "housing" | "moveIn" | "people" | "more" | null;
type HousingTypeId = "room" | "studio" | "condo" | "share" | "house";
type ChecklistListingSource = "workingHoliday" | "languageStudy" | "studyAbroad";
type MoreFilterId =
  | "school-nearby"
  | "good-transit"
  | "male-only"
  | "female-only"
  | "verified"
  | "furnished"
  | "immediate-move-in"
  | "short-term"
  | "pet"
  | "school"
  | "transit"
  | "contract";

type ExtraFilterId = Exclude<MoreFilterId, "pet" | "school" | "transit" | "contract">;

type PurposeId = "working-holiday" | "study" | "short-term" | "work" | "other";
type ListingCurrency = "KRW" | "CAD";
type ListingMapGroupKind = "station" | "area";

interface ListingMapGroupFilter {
  kind: ListingMapGroupKind;
  id: string;
  label: string;
}

interface ListingMapGroup extends ListingMapGroupFilter {
  lat: number;
  lng: number;
}

interface StationFocusRequest {
  id: string;
  nonce: number;
}

export interface MockListing {
  id: string;
  title: LocalizedText;
  area: string;
  roomType: LocalizedText;
  mapLocation: GoogleMapsLatLngLiteral & { label: string };
  maxPeople: number;
  priceKRW: number;
  priceCAD: number;
  city: string;
  purposeIds: PurposeId[];
  housingTypeId: HousingTypeId;
  availableFrom: string;
  extraFilters: ExtraFilterId[];
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

export interface ApplySelectedListingSummary {
  listingId: string;
  title: string;
  area: string;
  housingType: string;
  rent: number;
  currency: "CAD";
  rentKRW: number;
  capacity: number;
  lastChecked: string;
  verificationStatus: Status;
  thumbnail: string;
}

interface LocalizedOption<T extends string> {
  id: T;
  label: LocalizedText;
}

interface L10n {
  pageTitle: string;
  allListingsTitle: string;
  resultCount: (n: number) => string;
  searchPlaceholder: string;
  searchButton: string;
  budget: string;
  housingType: string;
  moveIn: string;
  people: string;
  moreFilters: string;
  moreFiltersSummary: (count: number) => string;
  appliedFiltersButton: (count: number) => string;
  appliedFiltersClearAll: string;
  appliedFiltersRemoveAria: (value: string) => string;
  filterGroupLabels: {
    city: string;
    purpose: string;
    station: string;
    area: string;
    budget: string;
    housing: string;
    moveIn: string;
    people: string;
    more: string;
  };
  cityChip: (value: string) => string;
  purposeChip: (value: string) => string;
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
  mapEmpty: string;
  mapViewportEmpty: string;
  mapViewportEmptyBody: string;
  showAllListingLocations: string;
  mapMissingKey: string;
  clusterTitle: (count: number) => string;
  ttcLines: string;
  ttcAttribution: string;
  listingLocation: string;
  priceFact: string;
  housingFact: string;
  capacityFact: string;
  detailAction: string;
  inquireAction: string;
  closeAction: string;
  zeroResultTitle: string;
  zeroResultBody: string;
  zeroResultClear: string;
  zeroResultViewAll: string;
  consultationCta: string;
  checklistCta: string;
  viewDetailPage: string;
  detailLabel: string;
  closeDetail: string;
  sampleImage: string;
  mvpNotice: string;
  viewListingAria: (title: string) => string;
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

const BASE_MOCK_LISTINGS: MockListing[] = [
  {
    id: "L-001",
    title: {
      ko: "Koreatown 1BR 코지 스튜디오",
      en: "Cozy 1BR Studio in Koreatown",
      fr: "Studio 1 chambre confortable à Koreatown",
    },
    area: "Koreatown",
    roomType: { ko: "1베드", en: "1BR", fr: "1 chambre" },
    mapLocation: { lat: 43.6645, lng: -79.4207, label: "Christie / Koreatown" },
    maxPeople: 1,
    priceKRW: 1850000,
    priceCAD: 1850,
    city: "toronto",
    purposeIds: ["working-holiday", "study", "work"],
    housingTypeId: "studio",
    availableFrom: "2026-05-15",
    extraFilters: ["good-transit", "furnished", "verified", "immediate-move-in"],
    status: "verified",
    lastChecked: "2026-05-15",
    registered: "2026-04-02",
    imagePath: getMockListingThumbnailImage("L-001"),
    description: {
      ko: "Koreatown 생활권을 먼저 확인해보고 싶은 1인 거주자용 매물입니다.",
      en: "A listing for one person who wants to start around Koreatown.",
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
    mapLocation: { lat: 43.646, lng: -79.384, label: "St Andrew / Downtown" },
    maxPeople: 2,
    priceKRW: 3400000,
    priceCAD: 3400,
    city: "toronto",
    purposeIds: ["working-holiday", "short-term", "work"],
    housingTypeId: "condo",
    availableFrom: "2026-06-01",
    extraFilters: ["good-transit", "furnished", "verified", "short-term"],
    status: "verified",
    lastChecked: "2026-05-12",
    registered: "2026-03-20",
    imagePath: getMockListingThumbnailImage("L-002"),
    description: {
      ko: "다운타운 접근성과 생활 편의성을 비교해보기 위한 콘도 매물입니다.",
      en: "A condo listing for comparing downtown access and daily convenience.",
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
    mapLocation: { lat: 43.7685, lng: -79.4126, label: "North York Centre" },
    maxPeople: 1,
    priceKRW: 1050000,
    priceCAD: 1050,
    city: "toronto",
    purposeIds: ["study", "short-term"],
    housingTypeId: "share",
    availableFrom: "2026-05-20",
    extraFilters: ["female-only", "good-transit", "short-term"],
    status: "needs_check",
    lastChecked: "2026-04-29",
    registered: "2026-03-01",
    imagePath: getMockListingThumbnailImage("L-003"),
    description: {
      ko: "North York에서 예산을 낮춰 비교해볼 수 있는 셰어하우스 매물입니다.",
      en: "A share-house listing for comparing lower-budget options in North York.",
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
    mapLocation: { lat: 43.706, lng: -79.398, label: "Eglinton / Midtown" },
    maxPeople: 3,
    priceKRW: 3950000,
    priceCAD: 3950,
    city: "toronto",
    purposeIds: ["study", "work", "other"],
    housingTypeId: "house",
    availableFrom: "2026-07-01",
    extraFilters: ["school-nearby", "good-transit", "furnished", "male-only", "short-term"],
    status: "preparing",
    lastChecked: "2026-05-10",
    registered: "2026-05-08",
    imagePath: getMockListingThumbnailImage("L-004"),
    description: {
      ko: "Midtown 생활권과 2인 이상 거주 가능성을 비교하기 위한 매물입니다.",
      en: "A listing for comparing Midtown options for two or more people.",
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
    mapLocation: { lat: 43.6689, lng: -79.4028, label: "Spadina / Annex" },
    maxPeople: 1,
    priceKRW: 1620000,
    priceCAD: 1620,
    city: "toronto",
    purposeIds: ["study", "working-holiday"],
    housingTypeId: "studio",
    availableFrom: "2026-05-10",
    extraFilters: ["school-nearby", "good-transit", "verified"],
    status: "verified",
    lastChecked: "2026-05-14",
    registered: "2026-04-18",
    imagePath: getMockListingThumbnailImage("L-005"),
    description: {
      ko: "Annex 주변 생활권과 스튜디오 조건을 비교하기 위한 매물입니다.",
      en: "A studio listing for comparing the Annex area and studio conditions.",
      fr: "Studio fictif pour comparer Annex et les conditions d'un studio.",
    },
    checklist: {
      ko: ["단기 가능 여부 확인", "난방·전기 포함 여부 확인", "가족형 제한 조건 확인"],
      en: ["Confirm short-term availability", "Check heating/electricity", "Review household restrictions"],
      fr: ["Confirmer le court séjour", "Vérifier chauffage/électricité", "Revoir les restrictions"],
    },
  },
];

interface GeneratedListingArea {
  key: string;
  area: string;
  label: string;
  baseLat: number;
  baseLng: number;
  count: number;
  scatterKind?: "station" | "corridor" | "residential";
  priceBaseKRW: number;
  priceStepKRW: number;
  housingCycle: HousingTypeId[];
  roomTypeCycle: LocalizedText[];
  purposeCycle: PurposeId[][];
  extraCycle: ExtraFilterId[][];
}

const GENERATED_LISTING_AREAS: GeneratedListingArea[] = [
  {
    key: "koreatown",
    area: "Koreatown",
    label: "Christie / Koreatown",
    baseLat: 43.6645,
    baseLng: -79.4207,
    count: 8,
    scatterKind: "station",
    priceBaseKRW: 1480000,
    priceStepKRW: 45000,
    housingCycle: ["studio", "room", "share"],
    roomTypeCycle: [
      { ko: "스튜디오", en: "Studio", fr: "Studio" },
      { ko: "룸렌트", en: "Room", fr: "Chambre" },
      { ko: "쉐어룸", en: "Share room", fr: "Chambre partagée" },
    ],
    purposeCycle: [["working-holiday", "study"], ["study"], ["working-holiday", "work"]],
    extraCycle: [
      ["good-transit", "furnished", "verified"],
      ["school-nearby", "good-transit", "immediate-move-in"],
      ["furnished", "short-term"],
      ["female-only", "good-transit"],
    ],
  },
  {
    key: "downtown",
    area: "Downtown",
    label: "Union / St Andrew",
    baseLat: 43.646,
    baseLng: -79.384,
    count: 10,
    scatterKind: "station",
    priceBaseKRW: 2450000,
    priceStepKRW: 65000,
    housingCycle: ["condo", "studio", "room"],
    roomTypeCycle: [
      { ko: "콘도", en: "Condo", fr: "Condo" },
      { ko: "스튜디오", en: "Studio", fr: "Studio" },
      { ko: "룸렌트", en: "Room", fr: "Chambre" },
    ],
    purposeCycle: [["work", "working-holiday"], ["short-term", "work"], ["study", "work"]],
    extraCycle: [
      ["good-transit", "furnished", "verified"],
      ["good-transit", "short-term"],
      ["immediate-move-in", "furnished"],
      ["male-only", "good-transit"],
    ],
  },
  {
    key: "north-york",
    area: "North York",
    label: "North York Centre / Finch",
    baseLat: 43.7685,
    baseLng: -79.4126,
    count: 5,
    scatterKind: "station",
    priceBaseKRW: 980000,
    priceStepKRW: 38000,
    housingCycle: ["share", "room", "studio"],
    roomTypeCycle: [
      { ko: "쉐어룸", en: "Share room", fr: "Chambre partagée" },
      { ko: "룸렌트", en: "Room", fr: "Chambre" },
      { ko: "스튜디오", en: "Studio", fr: "Studio" },
    ],
    purposeCycle: [["study"], ["study", "short-term"], ["working-holiday"]],
    extraCycle: [
      ["female-only", "good-transit"],
      ["good-transit", "short-term"],
      ["furnished", "verified"],
      ["school-nearby", "immediate-move-in"],
    ],
  },
  {
    key: "finch-station",
    area: "North York",
    label: "Finch / Yonge",
    baseLat: 43.7801,
    baseLng: -79.4157,
    count: 3,
    scatterKind: "station",
    priceBaseKRW: 1020000,
    priceStepKRW: 36000,
    housingCycle: ["share", "room", "studio"],
    roomTypeCycle: [
      { ko: "Share room", en: "Share room", fr: "Chambre partagee" },
      { ko: "Room", en: "Room", fr: "Chambre" },
      { ko: "Studio", en: "Studio", fr: "Studio" },
    ],
    /*
    roomTypeCycle: [
      { ko: "?먯뼱猷?, en: "Share room", fr: "Chambre partag챕e" },
      { ko: "猷몃젋??, en: "Room", fr: "Chambre" },
      { ko: "?ㅽ뒠?붿삤", en: "Studio", fr: "Studio" },
    ],
    purposeCycle: [["study"], ["study", "short-term"], ["working-holiday"]],
    extraCycle: [
      ["female-only", "good-transit"],
      ["good-transit", "short-term"],
      ["furnished", "verified"],
    ],
    */
    purposeCycle: [["study"], ["study", "short-term"], ["working-holiday"]],
    extraCycle: [
      ["female-only", "good-transit"],
      ["good-transit", "short-term"],
      ["furnished", "verified"],
    ],
  },
  {
    key: "midtown",
    area: "Midtown",
    label: "Eglinton / Davisville",
    baseLat: 43.706,
    baseLng: -79.398,
    count: 7,
    scatterKind: "station",
    priceBaseKRW: 1720000,
    priceStepKRW: 52000,
    housingCycle: ["house", "condo", "studio"],
    roomTypeCycle: [
      { ko: "하우스", en: "House", fr: "Maison" },
      { ko: "콘도", en: "Condo", fr: "Condo" },
      { ko: "스튜디오", en: "Studio", fr: "Studio" },
    ],
    purposeCycle: [["study", "work"], ["work"], ["other", "study"]],
    extraCycle: [
      ["school-nearby", "furnished", "verified"],
      ["good-transit", "immediate-move-in"],
      ["male-only", "short-term"],
      ["furnished", "good-transit"],
    ],
  },
  {
    key: "annex",
    area: "Annex",
    label: "Spadina / St George",
    baseLat: 43.6689,
    baseLng: -79.4028,
    count: 5,
    scatterKind: "station",
    priceBaseKRW: 1320000,
    priceStepKRW: 42000,
    housingCycle: ["studio", "room", "share"],
    roomTypeCycle: [
      { ko: "스튜디오", en: "Studio", fr: "Studio" },
      { ko: "룸렌트", en: "Room", fr: "Chambre" },
      { ko: "쉐어룸", en: "Share room", fr: "Chambre partagée" },
    ],
    purposeCycle: [["study"], ["study", "working-holiday"], ["short-term"]],
    extraCycle: [
      ["school-nearby", "good-transit", "verified"],
      ["furnished", "immediate-move-in"],
      ["female-only", "school-nearby"],
      ["good-transit", "short-term"],
    ],
  },
  {
    key: "east-side",
    area: "East Side",
    label: "Broadview / Danforth",
    baseLat: 43.678,
    baseLng: -79.352,
    count: 7,
    scatterKind: "station",
    priceBaseKRW: 1180000,
    priceStepKRW: 39000,
    housingCycle: ["room", "share", "studio"],
    roomTypeCycle: [
      { ko: "룸렌트", en: "Room", fr: "Chambre" },
      { ko: "쉐어룸", en: "Share room", fr: "Chambre partagée" },
      { ko: "스튜디오", en: "Studio", fr: "Studio" },
    ],
    purposeCycle: [["working-holiday"], ["study"], ["short-term", "work"]],
    extraCycle: [
      ["good-transit", "verified"],
      ["furnished", "short-term"],
      ["immediate-move-in", "good-transit"],
      ["male-only", "furnished"],
    ],
  },
];

const NON_STATION_GENERATED_AREAS: GeneratedListingArea[] = [
  {
    key: "lawrence-dufferin",
    area: "Lawrence West",
    label: "Lawrence Ave W / Dufferin",
    baseLat: 43.7139,
    baseLng: -79.4548,
    count: 6,
    scatterKind: "corridor",
    priceBaseKRW: 1260000,
    priceStepKRW: 36000,
    housingCycle: ["room", "share", "house"],
    roomTypeCycle: GENERATED_LISTING_AREAS[0].roomTypeCycle,
    purposeCycle: [["study"], ["working-holiday"], ["work", "study"]],
    extraCycle: [["good-transit", "furnished"], ["immediate-move-in"], ["short-term", "good-transit"]],
  },
  {
    key: "lawrence-avenue-road",
    area: "Lawrence Park",
    label: "Lawrence Ave W / Avenue Rd",
    baseLat: 43.7214,
    baseLng: -79.4103,
    count: 5,
    scatterKind: "corridor",
    priceBaseKRW: 1520000,
    priceStepKRW: 42000,
    housingCycle: ["house", "room", "studio"],
    roomTypeCycle: GENERATED_LISTING_AREAS[3].roomTypeCycle,
    purposeCycle: [["study", "work"], ["work"], ["working-holiday"]],
    extraCycle: [["furnished", "verified"], ["school-nearby"], ["good-transit"]],
  },
  {
    key: "thorncliffe-overlea",
    area: "Thorncliffe Park",
    label: "Thorncliffe Park / Overlea",
    baseLat: 43.7055,
    baseLng: -79.3448,
    count: 5,
    scatterKind: "corridor",
    priceBaseKRW: 1120000,
    priceStepKRW: 34000,
    housingCycle: ["share", "room", "condo"],
    roomTypeCycle: GENERATED_LISTING_AREAS[2].roomTypeCycle,
    purposeCycle: [["working-holiday"], ["study"], ["other", "work"]],
    extraCycle: [["good-transit"], ["female-only", "furnished"], ["immediate-move-in"]],
  },
  {
    key: "stclair-davenport",
    area: "St Clair West",
    label: "St Clair W / Davenport",
    baseLat: 43.6776,
    baseLng: -79.4328,
    count: 5,
    scatterKind: "corridor",
    priceBaseKRW: 1340000,
    priceStepKRW: 38000,
    housingCycle: ["room", "studio", "share"],
    roomTypeCycle: GENERATED_LISTING_AREAS[4].roomTypeCycle,
    purposeCycle: [["study"], ["working-holiday"], ["short-term"]],
    extraCycle: [["good-transit"], ["furnished", "short-term"], ["verified"]],
  },
  {
    key: "bathurst-eglinton",
    area: "Cedarvale",
    label: "Bathurst / Eglinton",
    baseLat: 43.6996,
    baseLng: -79.4272,
    count: 5,
    scatterKind: "corridor",
    priceBaseKRW: 1420000,
    priceStepKRW: 39000,
    housingCycle: ["room", "house", "studio"],
    roomTypeCycle: GENERATED_LISTING_AREAS[3].roomTypeCycle,
    purposeCycle: [["study"], ["work"], ["working-holiday", "study"]],
    extraCycle: [["school-nearby"], ["good-transit", "furnished"], ["immediate-move-in"]],
  },
  {
    key: "keele-rogers",
    area: "Keelesdale",
    label: "Keele / Rogers",
    baseLat: 43.6825,
    baseLng: -79.4719,
    count: 5,
    scatterKind: "corridor",
    priceBaseKRW: 1080000,
    priceStepKRW: 31000,
    housingCycle: ["room", "share", "house"],
    roomTypeCycle: GENERATED_LISTING_AREAS[0].roomTypeCycle,
    purposeCycle: [["working-holiday"], ["study"], ["work"]],
    extraCycle: [["good-transit"], ["furnished"], ["short-term"]],
  },
  {
    key: "dufferin-dupont",
    area: "Dufferin Grove",
    label: "Dufferin / Dupont",
    baseLat: 43.6686,
    baseLng: -79.4385,
    count: 4,
    scatterKind: "corridor",
    priceBaseKRW: 1280000,
    priceStepKRW: 35000,
    housingCycle: ["room", "studio", "share"],
    roomTypeCycle: GENERATED_LISTING_AREAS[4].roomTypeCycle,
    purposeCycle: [["study"], ["short-term"], ["working-holiday"]],
    extraCycle: [["good-transit"], ["furnished"], ["female-only"]],
  },
  {
    key: "rosedale-summerhill",
    area: "Rosedale",
    label: "Rosedale / Summerhill",
    baseLat: 43.6818,
    baseLng: -79.3809,
    count: 4,
    scatterKind: "residential",
    priceBaseKRW: 1760000,
    priceStepKRW: 46000,
    housingCycle: ["house", "studio", "room"],
    roomTypeCycle: GENERATED_LISTING_AREAS[3].roomTypeCycle,
    purposeCycle: [["study", "work"], ["work"], ["other"]],
    extraCycle: [["furnished"], ["verified"], ["school-nearby"]],
  },
  {
    key: "cabbagetown-parliament",
    area: "Cabbagetown",
    label: "Cabbagetown / Parliament",
    baseLat: 43.6652,
    baseLng: -79.3687,
    count: 4,
    scatterKind: "residential",
    priceBaseKRW: 1380000,
    priceStepKRW: 37000,
    housingCycle: ["room", "studio", "house"],
    roomTypeCycle: GENERATED_LISTING_AREAS[4].roomTypeCycle,
    purposeCycle: [["study"], ["working-holiday"], ["work"]],
    extraCycle: [["furnished"], ["good-transit"], ["short-term"]],
  },
  {
    key: "leslieville-riverdale",
    area: "Leslieville",
    label: "Leslieville / Riverdale",
    baseLat: 43.6657,
    baseLng: -79.3369,
    count: 4,
    scatterKind: "residential",
    priceBaseKRW: 1320000,
    priceStepKRW: 36000,
    housingCycle: ["room", "house", "share"],
    roomTypeCycle: GENERATED_LISTING_AREAS[5].roomTypeCycle,
    purposeCycle: [["working-holiday"], ["study"], ["short-term"]],
    extraCycle: [["furnished"], ["immediate-move-in"], ["good-transit"]],
  },
  {
    key: "east-york-residential",
    area: "East York",
    label: "East York Residential",
    baseLat: 43.6943,
    baseLng: -79.3218,
    count: 3,
    scatterKind: "residential",
    priceBaseKRW: 1140000,
    priceStepKRW: 33000,
    housingCycle: ["room", "share", "house"],
    roomTypeCycle: GENERATED_LISTING_AREAS[5].roomTypeCycle,
    purposeCycle: [["working-holiday"], ["study"], ["work"]],
    extraCycle: [["good-transit"], ["furnished"], ["verified"]],
  },
];

const GENERATED_TITLES: Partial<Record<string, (index: number) => LocalizedText>> = {
  koreatown: (index) => ({
    ko: `Koreatown 코지 룸 ${formatListingNumber(index)}`,
    en: `Koreatown Cozy Room ${formatListingNumber(index)}`,
    fr: `Chambre confortable à Koreatown ${formatListingNumber(index)}`,
  }),
  downtown: (index) => ({
    ko: `Downtown 퍼니시드 콘도 ${formatListingNumber(index)}`,
    en: `Downtown Furnished Condo ${formatListingNumber(index)}`,
    fr: `Condo meublé au centre-ville ${formatListingNumber(index)}`,
  }),
  "north-york": (index) => ({
    ko: `North York 쉐어하우스 룸 ${formatListingNumber(index)}`,
    en: `North York Share House Room ${formatListingNumber(index)}`,
    fr: `Chambre en colocation à North York ${formatListingNumber(index)}`,
  }),
  midtown: (index) => ({
    ko: `Midtown 라이트 스튜디오 ${formatListingNumber(index)}`,
    en: `Midtown Light Studio ${formatListingNumber(index)}`,
    fr: `Studio lumineux à Midtown ${formatListingNumber(index)}`,
  }),
  annex: (index) => ({
    ko: `Annex 학생 추천 룸 ${formatListingNumber(index)}`,
    en: `Annex Student Room ${formatListingNumber(index)}`,
    fr: `Chambre étudiante à Annex ${formatListingNumber(index)}`,
  }),
  "east-side": (index) => ({
    ko: `Danforth 이스트 룸 ${formatListingNumber(index)}`,
    en: `Danforth East Room ${formatListingNumber(index)}`,
    fr: `Chambre côté est Danforth ${formatListingNumber(index)}`,
  }),
};

function formatListingNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function getGeneratedStatus(index: number): Status {
  if (index % 7 === 0) return "preparing";
  if (index % 5 === 0) return "needs_check";
  return "verified";
}

function getGeneratedTitle(area: GeneratedListingArea, index: number): LocalizedText {
  const titleBuilder = GENERATED_TITLES[area.key];
  if (titleBuilder) return titleBuilder(index);

  return {
    ko: `${area.area} Room ${formatListingNumber(index)}`,
    en: `${area.area} Room ${formatListingNumber(index)}`,
    fr: `Chambre ${area.area} ${formatListingNumber(index)}`,
  };
}

function buildGeneratedListings(): MockListing[] {
  const generatedAreas = [...GENERATED_LISTING_AREAS, ...NON_STATION_GENERATED_AREAS];

  return generatedAreas.flatMap((area, areaIndex) =>
    Array.from({ length: area.count }, (_, index) => {
      const id = `L-${area.key.toUpperCase().replace(/-/g, "")}-${formatListingNumber(index)}`;
      const mapOffset = getGeneratedListingOffset(area.baseLat, area.baseLng, index, areaIndex, area.scatterKind ?? "station");
      const housingTypeId = area.housingCycle[index % area.housingCycle.length];
      const roomType = area.roomTypeCycle[index % area.roomTypeCycle.length];
      const extraFilters = area.extraCycle[index % area.extraCycle.length];
      const status = extraFilters.includes("verified") ? "verified" : getGeneratedStatus(index);
      const maxPeople = housingTypeId === "condo" || housingTypeId === "house" ? 2 + (index % 3) : 1 + (index % 2);
      const priceKRW = area.priceBaseKRW + area.priceStepKRW * (index % 9);

      return {
        id,
        title: getGeneratedTitle(area, index),
        area: area.area,
        roomType,
        mapLocation: {
          lat: mapOffset.lat,
          lng: mapOffset.lng,
          label: area.label,
        },
        maxPeople,
        priceKRW,
        priceCAD: Math.round(priceKRW / 1000),
        city: "toronto",
        purposeIds: area.purposeCycle[index % area.purposeCycle.length],
        housingTypeId,
        availableFrom: `2026-0${5 + (index % 3)}-${String(1 + (index % 24)).padStart(2, "0")}`,
        extraFilters,
        status,
        lastChecked: `2026-05-${String(1 + (index % 20)).padStart(2, "0")}`,
        registered: `2026-04-${String(1 + (index % 24)).padStart(2, "0")}`,
        imagePath: getMockListingThumbnailImage(id),
        description: {
          ko: `${area.area} 주변 조건을 비교하기 위한 안정적인 샘플 매물입니다.`,
          en: `A stable sample listing for comparing options around ${area.area}.`,
          fr: `Annonce stable pour comparer les options autour de ${area.area}.`,
        },
        checklist: {
          ko: ["실제 이동 시간 확인", "포함 항목 확인", "입주 조건 확인"],
          en: ["Check real commute time", "Confirm included items", "Review move-in terms"],
          fr: ["Vérifier le trajet réel", "Confirmer les inclusions", "Vérifier les conditions"],
        },
      };
    }),
  );
}

function getGeneratedListingOffset(
  baseLat: number,
  baseLng: number,
  index: number,
  areaIndex: number,
  scatterKind: NonNullable<GeneratedListingArea["scatterKind"]>,
) {
  const minRadius = scatterKind === "station" ? 120 : scatterKind === "corridor" ? 180 : 220;
  const radiusRange = scatterKind === "station" ? 331 : scatterKind === "corridor" ? 521 : 561;
  const radiusMeters = minRadius + ((index * 47 + areaIndex * 61) % radiusRange);
  const angle = ((index * 137.508 + areaIndex * 31) % 360) * (Math.PI / 180);
  const latMeters = Math.cos(angle) * radiusMeters;
  const lngMeters = Math.sin(angle) * radiusMeters;
  const metersPerDegreeLng = 111_320 * Math.cos(baseLat * (Math.PI / 180));

  return {
    lat: Number((baseLat + latMeters / 111_320).toFixed(6)),
    lng: Number((baseLng + lngMeters / metersPerDegreeLng).toFixed(6)),
  };
}

export const MOCK_LISTINGS: MockListing[] = [...BASE_MOCK_LISTINGS, ...buildGeneratedListings()];

export const APPLY_SELECTED_LISTING_STORAGE_KEY = "maplehouse.apply.selectedListing.ko";

export function buildApplySelectedListingSummary(listing: MockListing): ApplySelectedListingSummary {
  return {
    listingId: listing.id,
    title: listing.title.ko,
    area: listing.area,
    housingType: listing.roomType.ko,
    rent: listing.priceCAD,
    currency: "CAD",
    rentKRW: listing.priceKRW,
    capacity: listing.maxPeople,
    lastChecked: listing.lastChecked,
    verificationStatus: listing.status,
    thumbnail: listing.imagePath,
  };
}

const SELECTED_INQUIRY_FALLBACK: Record<Locale, string> = {
  ko: "확인 필요",
  en: "To confirm",
  fr: "À confirmer",
};

function buildSelectedInquiryFromMockListing(
  locale: Locale,
  listing: MockListing,
  source: "listings_drawer" | "listing_detail" = "listings_drawer",
) {
  const galleryUrls = getStableMockListingGalleryImages(listing.id, 5);
  return buildSelectedInquiryPayload({
    locale,
    listingId: listing.id,
    listingTitle: listing.title[locale],
    city: "Toronto",
    area: listing.area,
    rentCad: listing.priceCAD,
    rentKrw: listing.priceKRW,
    housingType: listing.roomType[locale],
    roomName: SELECTED_INQUIRY_FALLBACK[locale],
    roomType: listing.roomType[locale],
    selectedMoveInDate: "",
    selectedGuestCount: listing.maxPeople,
    thumbnailUrl: galleryUrls[0] ?? listing.imagePath,
    galleryUrls,
    source,
  });
}

function openAssistedApplyFromListing(locale: Locale, listing: MockListing) {
  if (typeof window === "undefined") return;

  try {
    saveSelectedInquiryPayload(buildSelectedInquiryFromMockListing(locale, listing));
    if (locale === "ko") {
      window.sessionStorage.setItem(
        APPLY_SELECTED_LISTING_STORAGE_KEY,
        JSON.stringify(buildApplySelectedListingSummary(listing)),
      );
    }
  } catch {
    // Session storage is only a frontend handoff; navigation can still continue.
  }

  const params = new URLSearchParams({
    mode: "assisted",
    listingId: listing.id,
  });
  window.location.href = `/${locale}/apply?${params.toString()}`;
}

function openDirectApplyFromListing(locale: Locale, listing: MockListing) {
  if (typeof window === "undefined") return;

  try {
    saveSelectedInquiryPayload(buildSelectedInquiryFromMockListing(locale, listing));
    if (locale === "ko") {
      window.sessionStorage.setItem(
        APPLY_SELECTED_LISTING_STORAGE_KEY,
        JSON.stringify(buildApplySelectedListingSummary(listing)),
      );
    }
  } catch {
    // Session storage is only a frontend handoff; navigation can still continue.
  }

  const params = new URLSearchParams({
    mode: "direct",
    listingId: listing.id,
  });
  window.location.href = `/${locale}/apply?${params.toString()}`;
}

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

const EXTRA_FILTER_OPTIONS: LocalizedOption<ExtraFilterId>[] = [
  { id: "school-nearby", label: { ko: "학교 근처", en: "School nearby", fr: "Proche des écoles" } },
  { id: "good-transit", label: { ko: "교통 좋음", en: "Good transit", fr: "Bon transport" } },
  { id: "male-only", label: { ko: "남성 전용", en: "Men only", fr: "Hommes seulement" } },
  { id: "female-only", label: { ko: "여성 전용", en: "Women only", fr: "Femmes seulement" } },
  { id: "furnished", label: { ko: "가구 포함", en: "Furnished", fr: "Meublé" } },
  { id: "immediate-move-in", label: { ko: "즉시 입주", en: "Move-in now", fr: "Entrée rapide" } },
  { id: "short-term", label: { ko: "단기 가능", en: "Short stay", fr: "Court séjour" } },
  { id: "verified", label: { ko: "검증 완료", en: "Verified", fr: "Vérifié" } },
];

const EXTRA_FILTER_IDS = new Set<ExtraFilterId>(EXTRA_FILTER_OPTIONS.map((option) => option.id));

const MAY_2026_DATES = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1;
  return `2026-05-${String(day).padStart(2, "0")}`;
});

const MAY_2026_LEADING_BLANKS = 5;

const L: Record<Locale, L10n> = {
  ko: {
    pageTitle: "조건에 맞는 매물",
    allListingsTitle: "전체 매물",
    resultCount: (n) => `검색 결과 ${n}개`,
    searchPlaceholder: "지역, 학교, 지하철, 매물번호 검색",
    searchButton: "검색",
    budget: "월세 예산",
    housingType: "주거 형태",
    moveIn: "입주 날짜",
    people: "인원",
    moreFilters: "기타",
    moreFiltersSummary: (count) => `기타 ${count}개`,
    appliedFiltersButton: (count) => `적용된 필터 ${count}개 모두보기`,
    appliedFiltersClearAll: "전체 해제",
    appliedFiltersRemoveAria: (value) => `${value} 필터 해제`,
    filterGroupLabels: {
      city: "지역",
      purpose: "체류 목적",
      station: "TTC 역",
      area: "생활권",
      budget: "월세",
      housing: "주거 형태",
      moveIn: "입주 날짜",
      people: "인원",
      more: "기타",
    },
    cityChip: (value) => `도시: ${value}`,
    purposeChip: (value) => `체류 목적: ${value}`,
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
    mapLabel: "지도 보기",
    mapActiveArea: "활성 지역 · Downtown Toronto",
    mapEmpty: "조건에 맞는 매물 위치가 없습니다",
    mapViewportEmpty: "현재 지도 화면에 표시된 매물이 없습니다",
    mapViewportEmptyBody: "지도를 이동하거나 축소해 보세요.",
    showAllListingLocations: "전체 매물 위치 보기",
    mapMissingKey: "지도를 불러오려면 지도 설정이 필요합니다",
    clusterTitle: (count) => `매물 ${count}개`,
    ttcLines: "노선도",
    ttcAttribution: "TTC 노선 정보 출처: Open Government Licence - Toronto",
    listingLocation: "위치",
    priceFact: "월세",
    housingFact: "주거 형태",
    capacityFact: "인원",
    detailAction: "상세페이지 보기",
    inquireAction: "문의하기",
    closeAction: "닫기",
    zeroResultTitle: "조건에 맞는 매물이 없습니다",
    zeroResultBody: "필터를 조금 줄이거나 조건없이 전체 매물을 확인해 보세요.",
    zeroResultClear: "필터 전체 해제",
    zeroResultViewAll: "조건없이 전체 보기",
    consultationCta: "이 매물 문의하기",
    checklistCta: "체크리스트 보기",
    viewDetailPage: "상세페이지 보기",
    detailLabel: "매물 상세",
    closeDetail: "상세 닫기",
    sampleImage: "sample image",
    mvpNotice: "MapleHouse에서 매물과 문의 흐름을 확인해 보세요.",
    viewListingAria: (title) => `${title} 상세 보기`,
    inquiryModal: {
      title: "이 매물에 어떻게 문의할까요?",
      subtitle:
        "선택한 방식에 따라 집주인에게 직접 문의하거나, 메이플하우스의 도움을 받아 문의할 수 있습니다.",
      directTitle: "집주인에게 직접 문의하기",
      directBadge: "무료",
      directDescription:
        "체크리스트를 참고해 직접 집주인에게 문의하는 방식입니다.",
      directAction: "직접 문의 미리보기",
      directMessage:
        "집주인에게 직접 확인할 질문을 정리합니다.",
      supportTitle: "메이플하우스와 함께 문의하기",
      supportBadge: "유료 플랜 예정",
      supportDescription:
        "처음이라 불안하거나 조건 확인이 어렵다면, 메이플하우스가 질문 정리와 기본 확인 과정을 도와주는 흐름입니다.",
      supportAction: "확인 요청서 작성하기",
      supportMessage:
        "메이플하우스와 함께 문의하기는 유료 플랜으로 연결될 예정입니다. 현재는 신청 흐름만 미리 보여주는 단계입니다.",
      footerNotice:
        "문의 방식과 확인 항목을 선택해 다음 단계로 이동합니다.",
    },
  },
  en: {
    pageTitle: "Matching listings",
    allListingsTitle: "All listings",
    resultCount: (n) => `${n} results`,
    searchPlaceholder: "Search area, school, transit, listing ID",
    searchButton: "Search",
    budget: "Budget",
    housingType: "Housing type",
    moveIn: "Move-in",
    people: "People",
    moreFilters: "Other",
    moreFiltersSummary: (count) => `${count} selected`,
    appliedFiltersButton: (count) => `View all ${count} applied filters`,
    appliedFiltersClearAll: "Clear all",
    appliedFiltersRemoveAria: (value) => `Remove ${value} filter`,
    filterGroupLabels: {
      city: "City",
      purpose: "Purpose",
      station: "TTC station",
      area: "Local area",
      budget: "Budget",
      housing: "Housing type",
      moveIn: "Move-in",
      people: "People",
      more: "Other",
    },
    cityChip: (value) => `City: ${value}`,
    purposeChip: (value) => `Purpose: ${value}`,
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
    mapLabel: "Map view",
    mapActiveArea: "Active area · Downtown Toronto",
    mapEmpty: "No matching listing locations",
    mapViewportEmpty: "No listings are visible in this map area",
    mapViewportEmptyBody: "Move or zoom the map to explore more areas.",
    showAllListingLocations: "Show all listing locations",
    mapMissingKey: "Map settings are required to load the map",
    clusterTitle: (count) => `${count} listings`,
    ttcLines: "Lines",
    ttcAttribution: "TTC route data: Open Government Licence - Toronto",
    listingLocation: "Location",
    priceFact: "Monthly rent",
    housingFact: "Housing type",
    capacityFact: "Capacity",
    detailAction: "View details",
    inquireAction: "Inquire",
    closeAction: "Close",
    zeroResultTitle: "No listings match your filters",
    zeroResultBody: "Try removing some filters or browse all listings.",
    zeroResultClear: "Clear filters",
    zeroResultViewAll: "View all listings",
    consultationCta: "Ask about this listing",
    checklistCta: "View checklist",
    viewDetailPage: "View details",
    detailLabel: "Listing details",
    closeDetail: "Close details",
    sampleImage: "sample image",
    mvpNotice: "Explore listings and inquiry flows with MapleHouse.",
    viewListingAria: (title) => `View ${title} details`,
    inquiryModal: {
      title: "How would you like to ask about this listing?",
      subtitle:
        "Choose whether to contact the landlord directly or ask with MapleHouse support.",
      directTitle: "Contact landlord directly",
      directBadge: "Free",
      directDescription:
        "Contact the landlord yourself using the listing details and checklist.",
      directAction: "Preview direct inquiry",
      directMessage:
        "Prepare questions to confirm directly with the landlord.",
      supportTitle: "Ask with MapleHouse support",
      supportBadge: "Paid plan planned",
      supportDescription:
        "If you are unsure what to ask or want help checking conditions, MapleHouse will help organize questions and support the inquiry flow.",
      supportAction: "Preview MapleHouse support",
      supportMessage:
        "MapleHouse-assisted inquiry will be connected to a paid plan later. For now, this only previews the flow.",
      footerNotice:
        "Choose an inquiry method and confirmation items for the next step.",
    },
  },
  fr: {
    pageTitle: "Logements correspondants",
    allListingsTitle: "Tous les logements",
    resultCount: (n) => `${n} résultats`,
    searchPlaceholder: "Rechercher zone, école, transport, annonce",
    searchButton: "Rechercher",
    budget: "Budget",
    housingType: "Type",
    moveIn: "Arrivée",
    people: "Personnes",
    moreFilters: "Autres",
    moreFiltersSummary: (count) => `${count} sélectionnés`,
    appliedFiltersButton: (count) => `Voir les ${count} filtres appliqués`,
    appliedFiltersClearAll: "Tout effacer",
    appliedFiltersRemoveAria: (value) => `Retirer le filtre ${value}`,
    filterGroupLabels: {
      city: "Ville",
      purpose: "Objectif",
      station: "Station TTC",
      area: "Quartier",
      budget: "Budget",
      housing: "Type",
      moveIn: "Arrivée",
      people: "Personnes",
      more: "Autres",
    },
    cityChip: (value) => `Ville : ${value}`,
    purposeChip: (value) => `Objectif : ${value}`,
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
    mapLabel: "Carte",
    mapActiveArea: "Zone active · Downtown Toronto",
    mapEmpty: "Aucun emplacement correspondant",
    mapViewportEmpty: "Aucun logement n'est visible dans cette zone de la carte",
    mapViewportEmptyBody: "Déplacez ou dézoomez la carte pour explorer d'autres zones.",
    showAllListingLocations: "Voir tous les logements",
    mapMissingKey: "Les paramètres de carte sont requis pour charger la carte",
    clusterTitle: (count) => `${count} logements`,
    ttcLines: "Lignes",
    ttcAttribution: "Données TTC : Open Government Licence - Toronto",
    listingLocation: "Emplacement",
    priceFact: "Loyer mensuel",
    housingFact: "Type",
    capacityFact: "Capacité",
    detailAction: "Voir le détail",
    inquireAction: "Faire une demande",
    closeAction: "Fermer",
    zeroResultTitle: "Aucun logement ne correspond à vos filtres",
    zeroResultBody: "Essayez de retirer certains filtres ou consultez tous les logements.",
    zeroResultClear: "Effacer les filtres",
    zeroResultViewAll: "Voir tous les logements",
    consultationCta: "Se renseigner sur ce logement",
    checklistCta: "Voir la liste",
    viewDetailPage: "Voir les détails",
    detailLabel: "Détails du logement",
    closeDetail: "Fermer les détails",
    sampleImage: "image d'exemple",
    mvpNotice: "Explorez les logements et les demandes avec MapleHouse.",
    viewListingAria: (title) => `Voir les détails de ${title}`,
    inquiryModal: {
      title: "Comment souhaitez-vous vous renseigner sur ce logement ?",
      subtitle:
        "Choisissez de contacter directement le propriétaire ou de demander l’aide de MapleHouse.",
      directTitle: "Contacter directement le propriétaire",
      directBadge: "Gratuit",
      directDescription:
        "Contactez vous-même le propriétaire à l’aide des informations du logement et de la liste de vérification.",
      directAction: "Aperçu du contact direct",
      directMessage:
        "Préparez les questions à confirmer directement avec le propriétaire.",
      supportTitle: "Demander l’aide de MapleHouse",
      supportBadge: "Forfait payant prévu",
      supportDescription:
        "Si vous ne savez pas quoi demander ou si vous voulez vérifier les conditions, MapleHouse vous aide à organiser les questions et le parcours de demande.",
      supportAction: "Aperçu avec MapleHouse",
      supportMessage:
        "La demande assistée par MapleHouse sera liée à un forfait payant plus tard. Pour l’instant, ce parcours est seulement prévisualisé.",
      footerNotice:
        "Choisissez une méthode de demande et les points à confirmer pour l’étape suivante.",
    },
  },
};

interface ListingQueryFilters {
  city: string;
  purpose: PurposeId | "";
  housing: HousingTypeId | "";
  budgetMax: number | null;
  moveIn: string;
  people: number;
  extra: ExtraFilterId[];
  station: string;
  area: string;
}

function parseListingQueryFilters(searchStr: string | undefined): ListingQueryFilters {
  const searchText = searchStr ?? (typeof window !== "undefined" ? window.location.search : "");
  const params = new URLSearchParams(searchText.startsWith("?") ? searchText : `?${searchText}`);
  const rawBudget = Number(params.get("budgetMax"));
  const budgetMax = Number.isFinite(rawBudget) && rawBudget > 0 ? rawBudget : null;
  const rawPeople = Number(params.get("people"));
  const people = Number.isFinite(rawPeople) && rawPeople > 0 ? Math.round(rawPeople) : 1;
  const purpose = params.get("purpose") ?? "";
  const housing = params.get("housing") ?? "";

  return {
    city: normalizeQueryValue(params.get("city") ?? ""),
    purpose: isPurposeId(purpose) ? purpose : "",
    housing: isHousingTypeId(housing) ? housing : "",
    budgetMax,
    moveIn: normalizeDateParam(params.get("moveIn") ?? ""),
    people,
    extra: parseExtraFilters(params.get("extra")),
    station: normalizeQueryValue(params.get("station") ?? ""),
    area: normalizeQueryValue(params.get("area") ?? ""),
  };
}

function serializeListingQueryFilters(filters: ListingQueryFilters) {
  const params = new URLSearchParams();
  if (filters.city) params.set("city", filters.city);
  if (filters.purpose) params.set("purpose", filters.purpose);
  if (filters.housing) params.set("housing", filters.housing);
  if (filters.budgetMax) params.set("budgetMax", String(filters.budgetMax));
  if (filters.moveIn) params.set("moveIn", filters.moveIn);
  if (filters.people > 1) params.set("people", String(filters.people));
  if (filters.extra.length > 0) params.set("extra", filters.extra.join(","));
  if (filters.area) params.set("area", filters.area);
  return params.toString();
}

function normalizeQueryValue(value: string) {
  return value.trim().toLowerCase();
}

function normalizeDateParam(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

function parseExtraFilters(value: string | null): ExtraFilterId[] {
  return Array.from(
    new Set(
      (value ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter((item): item is ExtraFilterId => EXTRA_FILTER_IDS.has(item as ExtraFilterId)),
    ),
  );
}

function isPurposeId(value: string): value is PurposeId {
  return ["working-holiday", "study", "short-term", "work", "other"].includes(value);
}

function isHousingTypeId(value: string): value is HousingTypeId {
  return ["room", "studio", "condo", "share", "house"].includes(value);
}

function getBudgetMaxInKRW(value: number | null) {
  if (!value) return null;
  return value > 400 ? value : value * 10000;
}

function getBudgetMaxInManwon(value: number | null) {
  if (!value) return null;
  return value > 400 ? Math.round(value / 10000) : value;
}

function slugifyMapGroup(value: string) {
  return normalizeQueryValue(value)
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getLocalAreaLabel(listing: MockListing) {
  const primaryLabel = listing.mapLocation.label.split("/")[0]?.trim();
  return primaryLabel || listing.area;
}

function getDistanceMeters(a: GoogleMapsLatLngLiteral, b: GoogleMapsLatLngLiteral) {
  const earthRadius = 6371000;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const deltaLat = ((b.lat - a.lat) * Math.PI) / 180;
  const deltaLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  return earthRadius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function getListingMapGroup(listing: MockListing): ListingMapGroup {
  const nearestStation = TTC_STATIONS.reduce<{
    station: (typeof TTC_STATIONS)[number];
    distance: number;
  } | null>((nearest, station) => {
    const distance = getDistanceMeters(listing.mapLocation, station);
    if (!nearest || distance < nearest.distance) return { station, distance };
    return nearest;
  }, null);

  if (nearestStation && nearestStation.distance <= 900) {
    return {
      kind: "station",
      id: nearestStation.station.id,
      label: nearestStation.station.name,
      lat: nearestStation.station.lat,
      lng: nearestStation.station.lng,
    };
  }

  const label = getLocalAreaLabel(listing);
  return {
    kind: "area",
    id: slugifyMapGroup(label),
    label,
    lat: listing.mapLocation.lat,
    lng: listing.mapLocation.lng,
  };
}

function getListingMapGroupLabel(kind: ListingMapGroupKind, id: string) {
  const match = MOCK_LISTINGS.map(getListingMapGroup).find((group) => group.kind === kind && group.id === id);
  return match?.label ?? id;
}

function filterListingsByQuery(listings: MockListing[], filters: ListingQueryFilters) {
  const budgetMaxKRW = getBudgetMaxInKRW(filters.budgetMax);

  return listings.filter((listing) => {
    const mapGroup = filters.area ? getListingMapGroup(listing) : null;
    if (filters.city && listing.city !== filters.city) return false;
    if (filters.purpose && !listing.purposeIds.includes(filters.purpose)) return false;
    if (filters.housing && listing.housingTypeId !== filters.housing) return false;
    if (filters.area && (mapGroup?.kind !== "area" || mapGroup.id !== filters.area)) return false;
    if (budgetMaxKRW && listing.priceKRW > budgetMaxKRW) return false;
    if (filters.moveIn && listing.availableFrom > filters.moveIn) return false;
    if (filters.people > 1 && listing.maxPeople < filters.people) return false;
    if (filters.extra.length > 0) {
      return filters.extra.every((filter) => listing.extraFilters.includes(filter));
    }
    return true;
  });
}

function getExtraFilterLabel(locale: Locale, id: ExtraFilterId) {
  return EXTRA_FILTER_OPTIONS.find((option) => option.id === id)?.label[locale] ?? id;
}

function getMoreFilterTriggerValue(locale: Locale, t: L10n, filters: Set<ExtraFilterId>) {
  if (filters.size === 0) return undefined;
  if (filters.size === 1) return getExtraFilterLabel(locale, Array.from(filters)[0]);
  return t.moreFiltersSummary(filters.size);
}

function getListingResultTags(locale: Locale, t: L10n, listing: MockListing) {
  const priority: ExtraFilterId[] = [
    "immediate-move-in",
    "short-term",
    "female-only",
    "male-only",
    "furnished",
    "good-transit",
    "school-nearby",
  ];
  const tags = priority
    .filter((filter) => listing.extraFilters.includes(filter))
    .map((filter) => getExtraFilterLabel(locale, filter));

  return tags.slice(0, 3);
}

function formatCityLabel(value: string) {
  if (!value) return "";
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const STATUS_CLASS: Record<Status, string> = {
  verified: "border-emerald-200 bg-emerald-50 text-emerald-700",
  needs_check: "border-warning-border/70 bg-warning/15 text-warning-foreground",
  preparing: "border-border bg-muted text-muted-foreground",
};

const CHECKLIST_SOURCE_LABELS: Record<Locale, Record<ChecklistListingSource, string>> = {
  ko: {
    workingHoliday: "워킹홀리데이",
    languageStudy: "어학연수",
    studyAbroad: "유학",
  },
  en: {
    workingHoliday: "Working Holiday",
    languageStudy: "Language Study",
    studyAbroad: "College / University",
  },
  fr: {
    workingHoliday: "PVT",
    languageStudy: "Séjour linguistique",
    studyAbroad: "Collège / université",
  },
};

const CHECKLIST_RECOMMENDATION_COPY: Record<
  Locale,
  {
    applied: string;
    fallbackSource: string;
    summary: (sourceLabel: string | null, count: number) => string;
    show: string;
    hide: string;
    stations: string;
    clear: string;
    clearAria: string;
    removeStationAria: (station: string) => string;
  }
> = {
  ko: {
    applied: "체크리스트 추천 적용됨",
    fallbackSource: "체크리스트",
    summary: (sourceLabel, count) =>
      `${sourceLabel ? `${sourceLabel} 결과 기반` : "체크리스트 결과 기반"} · 기준역 ${count}개`,
    show: "선택된 필터 보기",
    hide: "선택된 필터 숨기기",
    stations: "추천 기준역",
    clear: "추천 전체 해제",
    clearAria: "체크리스트 추천 초기화",
    removeStationAria: (station) => `${station} 삭제`,
  },
  en: {
    applied: "Checklist recommendation applied",
    fallbackSource: "checklist",
    summary: (sourceLabel, count) => {
      const source = sourceLabel ? sourceLabel.toLowerCase() : "checklist";
      return `Based on ${source} result · ${count} ${count === 1 ? "station" : "stations"}`;
    },
    show: "Show selected filters",
    hide: "Hide selected filters",
    stations: "Recommended stations",
    clear: "Clear recommendation",
    clearAria: "Clear checklist recommendation",
    removeStationAria: (station) => `Remove ${station}`,
  },
  fr: {
    applied: "Recommandation appliquée",
    fallbackSource: "check-list",
    summary: (sourceLabel, count) =>
      `${sourceLabel ?? "Check-list"} · ${count} ${count === 1 ? "station" : "stations"}`,
    show: "Afficher les filtres",
    hide: "Masquer les filtres",
    stations: "Stations",
    clear: "Retirer",
    clearAria: "Retirer la recommandation",
    removeStationAria: (station) => `Retirer ${station}`,
  },
};

export function LocaleListingsPage({ locale }: { locale: Locale }) {
  const t = L[locale];
  const location = useLocation() as { href?: string; searchStr?: string };
  const initialQueryFilters = parseListingQueryFilters(location.searchStr);
  const stationFocusNonceRef = useRef(0);
  const rawChecklistContext = parseChecklistListingsContext(location.searchStr, locale);
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
  const [cityFilter, setCityFilter] = useState(initialQueryFilters.city);
  const [purposeFilter, setPurposeFilter] = useState<PurposeId | "">(initialQueryFilters.purpose);
  const [draftBudgetMax, setDraftBudgetMax] = useState(
    getBudgetMaxInManwon(initialQueryFilters.budgetMax) ?? 150,
  );
  const [appliedBudgetMax, setAppliedBudgetMax] = useState<number | null>(
    getBudgetMaxInManwon(initialQueryFilters.budgetMax),
  );
  const [housingType, setHousingType] = useState<HousingTypeId | null>(
    initialQueryFilters.housing || null,
  );
  const [draftMoveIn, setDraftMoveIn] = useState(initialQueryFilters.moveIn);
  const [moveIn, setMoveIn] = useState(initialQueryFilters.moveIn);
  const [draftPeople, setDraftPeople] = useState(initialQueryFilters.people);
  const [peopleCount, setPeopleCount] = useState(initialQueryFilters.people);
  const [draftMoreFilters, setDraftMoreFilters] = useState<Set<ExtraFilterId>>(
    new Set(initialQueryFilters.extra),
  );
  const [moreFilters, setMoreFilters] = useState<Set<ExtraFilterId>>(
    new Set(initialQueryFilters.extra),
  );
  const [areaFilter, setAreaFilter] = useState(initialQueryFilters.area);
  const [focusedStationRequest, setFocusedStationRequest] = useState<StationFocusRequest | null>(() =>
    initialQueryFilters.station
      ? { id: initialQueryFilters.station, nonce: stationFocusNonceRef.current++ }
      : null,
  );
  const [visibleListingIds, setVisibleListingIds] = useState<string[] | null>(null);
  const [manualFitNonce, setManualFitNonce] = useState(0);
  const [showAppliedFilters, setShowAppliedFilters] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MockListing | null>(null);
  const [activeListingId, setActiveListingId] = useState("");
  const [hoveredListingId, setHoveredListingId] = useState("");
  const [currency, setCurrency] = useState<ListingCurrency>(() => (locale === "ko" ? "KRW" : "CAD"));

  useEffect(() => {
    setShowChecklistFilters(false);
    setRemovedChecklistFilters(new Set());
  }, [location.href]);

  useEffect(() => {
    const filters = parseListingQueryFilters(location.searchStr);
    setCityFilter(filters.city);
    setPurposeFilter(filters.purpose);
    setDraftBudgetMax(getBudgetMaxInManwon(filters.budgetMax) ?? 150);
    setAppliedBudgetMax(getBudgetMaxInManwon(filters.budgetMax));
    setHousingType(filters.housing || null);
    setDraftMoveIn(filters.moveIn);
    setMoveIn(filters.moveIn);
    setDraftPeople(filters.people);
    setPeopleCount(filters.people);
    setDraftMoreFilters(new Set(filters.extra));
    setMoreFilters(new Set(filters.extra));
    setAreaFilter(filters.area);
    if (filters.station) {
      setFocusedStationRequest({ id: filters.station, nonce: stationFocusNonceRef.current++ });
    }
  }, [location.searchStr]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncFromUrl = () => {
      const filters = parseListingQueryFilters(window.location.search);
      setCityFilter(filters.city);
      setPurposeFilter(filters.purpose);
      setDraftBudgetMax(getBudgetMaxInManwon(filters.budgetMax) ?? 150);
      setAppliedBudgetMax(getBudgetMaxInManwon(filters.budgetMax));
      setHousingType(filters.housing || null);
      setDraftMoveIn(filters.moveIn);
      setMoveIn(filters.moveIn);
      setDraftPeople(filters.people);
      setPeopleCount(filters.people);
      setDraftMoreFilters(new Set(filters.extra));
      setMoreFilters(new Set(filters.extra));
      setAreaFilter(filters.area);
      if (filters.station) {
        setFocusedStationRequest({ id: filters.station, nonce: stationFocusNonceRef.current++ });
      }
    };

    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const query = serializeListingQueryFilters({
      city: cityFilter,
      purpose: purposeFilter,
      housing: housingType ?? "",
      budgetMax: appliedBudgetMax ? appliedBudgetMax * 10000 : null,
      moveIn,
      people: peopleCount,
      extra: Array.from(moreFilters),
      station: "",
      area: areaFilter,
    });
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl !== currentUrl) {
      window.history.pushState(window.history.state, "", nextUrl);
    }
  }, [appliedBudgetMax, areaFilter, cityFilter, housingType, moreFilters, moveIn, peopleCount, purposeFilter]);

  const toggleFav = (id: string) =>
    setFavs((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const fmtKRW = (v: number) => `월 ${v.toLocaleString("ko-KR")}원`;
  const fmtCAD = (v: number) => `$${v.toLocaleString("en-CA")} /m`;
  const fmtSelectedPrice = (listing: MockListing) =>
    currency === "KRW" ? fmtKRW(listing.priceKRW) : fmtCAD(listing.priceCAD);
  const hardFilterSignature = serializeListingQueryFilters({
    city: cityFilter,
    purpose: purposeFilter,
    housing: housingType ?? "",
    budgetMax: appliedBudgetMax ? appliedBudgetMax * 10000 : null,
    moveIn,
    people: peopleCount,
    extra: Array.from(moreFilters),
    station: "",
    area: areaFilter,
  });
  const hardFilteredListings = filterListingsByQuery(MOCK_LISTINGS, {
    city: cityFilter,
    purpose: purposeFilter,
    housing: housingType ?? "",
    budgetMax: appliedBudgetMax ? appliedBudgetMax * 10000 : null,
    moveIn,
    people: peopleCount,
    extra: Array.from(moreFilters),
    station: "",
    area: areaFilter,
  });
  const visibleListingIdSet = visibleListingIds ? new Set(visibleListingIds) : null;
  const displayedListings = visibleListingIdSet
    ? hardFilteredListings.filter((listing) => visibleListingIdSet.has(listing.id))
    : hardFilteredListings;
  const isViewportEmpty = hardFilteredListings.length > 0 && displayedListings.length === 0;
  const hasActiveFilters = Boolean(
    cityFilter ||
      purposeFilter ||
      housingType ||
      appliedBudgetMax ||
      moveIn ||
      peopleCount > 1 ||
      moreFilters.size > 0 ||
      areaFilter,
  );
  const pageTitle = hasActiveFilters ? t.pageTitle : t.allListingsTitle;
  const activeListingInResults = displayedListings.find((listing) => listing.id === activeListingId);
  const hoveredListingInResults = displayedListings.find((listing) => listing.id === hoveredListingId);
  const selectedListingInResults = selectedListing
    ? displayedListings.find((listing) => listing.id === selectedListing.id)
    : undefined;
  const activeMapListing = hoveredListingInResults ?? activeListingInResults ?? selectedListingInResults ?? null;
  const effectiveActiveListingId = activeMapListing?.id ?? "";
  const housingLabel = housingType
    ? HOUSING_OPTIONS.find((option) => option.id === housingType)?.label[locale]
    : undefined;
  const areaFilterLabel = areaFilter ? getListingMapGroupLabel("area", areaFilter) : "";
  const activeChips = [
    ...(cityFilter ? [{ id: "city", label: t.cityChip(formatCityLabel(cityFilter)) }] : []),
    ...(purposeFilter ? [{ id: "purpose", label: t.purposeChip(purposeFilter) }] : []),
    ...(appliedBudgetMax ? [{ id: "budget", label: t.budgetChip(appliedBudgetMax) }] : []),
    ...(housingLabel ? [{ id: "housing", label: housingLabel }] : []),
    ...(moveIn ? [{ id: "moveIn", label: t.moveInChip(moveIn) }] : []),
    ...(peopleCount > 1 ? [{ id: "people", label: t.peopleChip(peopleCount) }] : []),
    ...Array.from(moreFilters).map((id) => ({
      id: `more-${id}`,
      label: getExtraFilterLabel(locale, id),
    })),
  ];
  const appliedFilterRows = [
    ...(cityFilter
      ? [{ id: "city", group: t.filterGroupLabels.city, value: formatCityLabel(cityFilter) }]
      : []),
    ...(areaFilterLabel
      ? [{ id: "area", group: t.filterGroupLabels.area, value: areaFilterLabel }]
      : []),
    ...(purposeFilter
      ? [{ id: "purpose", group: t.filterGroupLabels.purpose, value: purposeFilter }]
      : []),
    ...(appliedBudgetMax
      ? [{ id: "budget", group: t.filterGroupLabels.budget, value: t.budgetMax(appliedBudgetMax) }]
      : []),
    ...(housingLabel
      ? [{ id: "housing", group: t.filterGroupLabels.housing, value: housingLabel }]
      : []),
    ...(moveIn ? [{ id: "moveIn", group: t.filterGroupLabels.moveIn, value: moveIn }] : []),
    ...(peopleCount > 1
      ? [{ id: "people", group: t.filterGroupLabels.people, value: t.peopleChip(peopleCount) }]
      : []),
    ...Array.from(moreFilters).map((id) => ({
      id: `more-${id}`,
      group: t.filterGroupLabels.more,
      value: getExtraFilterLabel(locale, id),
    })),
  ];

  useEffect(() => {
    if (!activeListingId && !selectedListing) return;
    const activeStillVisible = activeListingId
      ? displayedListings.some((listing) => listing.id === activeListingId)
      : true;
    const selectedStillVisible = selectedListing
      ? displayedListings.some((listing) => listing.id === selectedListing.id)
      : true;

    if (!activeStillVisible) {
      setActiveListingId("");
    }
    if (!selectedStillVisible) {
      setSelectedListing(null);
    }
  }, [activeListingId, displayedListings, selectedListing]);

  useEffect(() => {
    if (appliedFilterRows.length === 0) {
      setShowAppliedFilters(false);
    }
  }, [appliedFilterRows.length]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.classList.add("mh-listings-scroll-lock");
    document.body.classList.add("mh-listings-scroll-lock");
    return () => {
      document.documentElement.classList.remove("mh-listings-scroll-lock");
      document.body.classList.remove("mh-listings-scroll-lock");
    };
  }, []);

  useEffect(() => {
    setHoveredListingId("");
    setActiveListingId((current) => {
      if (displayedListings.some((listing) => listing.id === current)) return current;
      return displayedListings[0]?.id ?? "";
    });
  }, [displayedListings]);

  useEffect(() => {
    setVisibleListingIds(null);
    setSelectedListing(null);
    setHoveredListingId("");
  }, [hardFilterSignature]);

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
    setActiveListingId(listing.id);
    setSelectedListing(listing);
  };

  const activateListing = (listing: MockListing, shouldScroll = false) => {
    setActiveListingId(listing.id);
    if (shouldScroll && typeof document !== "undefined") {
      document.getElementById(`listing-result-${listing.id}`)?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  };

  const removeActiveChip = (id: string) => {
    if (id === "city") setCityFilter("");
    if (id === "purpose") setPurposeFilter("");
    if (id === "area") setAreaFilter("");
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
      const filterId = id.replace("more-", "") as ExtraFilterId;
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
    setShowAppliedFilters(false);
    setCityFilter("");
    setPurposeFilter("");
    setDraftBudgetMax(150);
    setAppliedBudgetMax(null);
    setHousingType(null);
    setDraftMoveIn("");
    setMoveIn("");
    setDraftPeople(1);
    setPeopleCount(1);
    setDraftMoreFilters(new Set());
    setMoreFilters(new Set());
    setAreaFilter("");
    setFocusedStationRequest(null);
    setVisibleListingIds(null);
    setManualFitNonce((value) => value + 1);
  };

  const focusMapGroup = useCallback((group: ListingMapGroupFilter) => {
    setShowAppliedFilters(false);
    setSelectedListing(null);
    setActiveListingId("");
    if (group.kind === "station") {
      setFocusedStationRequest({ id: group.id, nonce: stationFocusNonceRef.current++ });
      return;
    }
    setAreaFilter(group.id);
  }, []);

  const handleMapSelectListing = useCallback((listing: MockListing) => {
    setActiveListingId(listing.id);
    if (typeof document !== "undefined") {
      document.getElementById(`listing-result-${listing.id}`)?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
    setSelectedListing(listing);
  }, []);

  const handleVisibleListingIdsChange = useCallback((ids: string[] | null) => {
    startTransition(() => {
      setVisibleListingIds((current) => {
        if (current === null && ids === null) return current;
        if (current !== null && ids !== null && current.join("|") === ids.join("|")) return current;
        return ids;
      });
    });
  }, []);

  const toggleDraftMoreFilter = (id: ExtraFilterId) => {
    setDraftMoreFilters((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <main className="flex h-[calc(100dvh-4rem)] min-h-0 flex-col overflow-hidden bg-secondary overscroll-none">
      <section className="shrink-0 border-b border-border bg-card">
        <div className="flex min-h-[4.75rem] w-full flex-col gap-3 px-4 py-3 sm:px-5 lg:px-6 xl:flex-row xl:items-center xl:justify-between">
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
                value={getMoreFilterTriggerValue(locale, t, moreFilters)}
                icon={<SlidersHorizontal className="h-4 w-4" />}
                open={openFilter === "more"}
                onClick={() => setOpenFilter(openFilter === "more" ? null : "more")}
              />
              {openFilter === "more" && (
                <FilterPanel className="right-0 left-auto w-[18rem]">
                  <div className="grid gap-2">
                    {EXTRA_FILTER_OPTIONS.map((option) => (
                      <label
                        key={option.id}
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground transition hover:bg-accent"
                      >
                        <input
                          type="checkbox"
                          checked={draftMoreFilters.has(option.id)}
                          onChange={() => toggleDraftMoreFilter(option.id)}
                          className="mh-orange-checkbox"
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

      <section className="grid min-h-0 flex-1 w-full gap-0 overflow-hidden px-4 py-3 sm:px-5 lg:grid-cols-[5rem_minmax(20rem,23.5rem)_minmax(0,1fr)] lg:px-6">
        <aside className="mb-3 flex shrink-0 gap-2 overflow-x-auto border-border bg-card p-2 shadow-sm lg:mb-0 lg:h-full lg:flex-col lg:overflow-hidden lg:rounded-l-2xl lg:border lg:border-r-0">
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

        <section className="min-h-0 overflow-y-auto overscroll-contain border border-border bg-card p-3 shadow-sm lg:h-full lg:rounded-none">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-foreground">{pageTitle}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.resultCount(displayedListings.length)}
              </p>
            </div>
            <CurrencyToggle value={currency} onChange={setCurrency} />
          </div>

          {checklistContext && (
            <ChecklistRecommendationBanner
              locale={locale}
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
            {appliedFilterRows.length > 0 && (
              <div className="relative max-w-full">
                <button
                  type="button"
                  onClick={() => setShowAppliedFilters((value) => !value)}
                  className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition hover:border-primary/40 hover:bg-[#FFF8F1]"
                  aria-expanded={showAppliedFilters}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{t.appliedFiltersButton(appliedFilterRows.length)}</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-transform",
                      showAppliedFilters && "rotate-180",
                    )}
                  />
                </button>

                {showAppliedFilters && (
                  <div className="absolute left-0 top-9 z-30 w-full min-w-[18rem] max-w-[24rem] overflow-hidden rounded-xl border border-border bg-white text-xs shadow-xl">
                    <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
                      <span className="font-semibold text-foreground">
                        {t.appliedFiltersButton(appliedFilterRows.length)}
                      </span>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="shrink-0 text-xs font-semibold text-primary transition hover:text-[#D85F00]"
                      >
                        {t.appliedFiltersClearAll}
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {appliedFilterRows.map((row) => (
                        <div
                          key={row.id}
                          className="flex min-w-0 items-center justify-between gap-3 border-b border-border/70 px-3 py-2 last:border-b-0"
                        >
                          <div className="min-w-0">
                            <span className="font-semibold text-foreground">{row.group}</span>
                            <span className="mx-1.5 text-muted-foreground">·</span>
                            <span className="text-muted-foreground">{row.value}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeActiveChip(row.id)}
                            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-[#FFF3E6] hover:text-primary"
                            aria-label={t.appliedFiltersRemoveAria(row.value)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {displayedListings.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {displayedListings.map((listing) => (
                <ListingResultCard
                  key={listing.id}
                  listing={listing}
                  locale={locale}
                  t={t}
                  favs={favs}
                  onToggleFav={toggleFav}
                  active={listing.id === effectiveActiveListingId}
                  onActivate={() => activateListing(listing)}
                  onOpenSummary={() => openListing(listing)}
                  onHoverStart={() => setHoveredListingId(listing.id)}
                  onHoverEnd={() => setHoveredListingId("")}
                  price={fmtSelectedPrice(listing)}
                />
              ))}
            </ul>
          ) : isViewportEmpty ? (
            <ViewportEmptyState
              t={t}
              onShowAll={() => {
                setVisibleListingIds(null);
                setManualFitNonce((value) => value + 1);
              }}
            />
          ) : (
            <ZeroResultState locale={locale} t={t} onClearFilters={resetFilters} />
          )}

          <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            {t.autoDeact}
          </p>
        </section>

        <section className="relative mt-4 min-h-[24rem] overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:mt-0 lg:h-full lg:min-h-0 lg:rounded-l-none">
          <GoogleListingsMap
            listings={hardFilteredListings}
            activeListingId={effectiveActiveListingId}
            locale={locale}
            t={t}
            ttcOverlayLabel={t.ttcLines}
            focusedStationRequest={focusedStationRequest}
            fitRequestKey={`${hardFilterSignature}|${manualFitNonce}`}
            onVisibleListingIdsChange={handleVisibleListingIdsChange}
            onSelectListing={handleMapSelectListing}
            onSelectGroup={focusMapGroup}
          />

          <div className="absolute left-4 top-4 z-10 flex max-w-[calc(100%-2rem)] flex-wrap gap-2">
            <span className="rounded-full border border-border bg-background/95 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
              {t.mapLabel}
            </span>
          </div>
          {(hardFilteredListings.length === 0 || isViewportEmpty) && (
            <div className="absolute inset-x-6 top-1/2 z-10 flex -translate-y-1/2 justify-center">
              <div className="rounded-full border border-border bg-background/95 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
                {hardFilteredListings.length === 0 ? t.mapEmpty : t.mapViewportEmpty}
              </div>
            </div>
          )}
        </section>

      </section>

      <ListingSummaryDrawer
        listing={selectedListing}
        locale={locale}
        t={t}
        fmtKRW={fmtKRW}
        fmtCAD={fmtCAD}
        price={selectedListing ? fmtSelectedPrice(selectedListing) : ""}
        onClose={() => setSelectedListing(null)}
      />

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

  if (source !== "workingHoliday" && source !== "languageStudy" && source !== "studyAbroad") {
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
  locale,
  context,
  expanded,
  onToggleExpanded,
  onRemoveFilter,
  onClearRecommendation,
}: {
  locale: Locale;
  context: ChecklistListingsContext;
  expanded: boolean;
  onToggleExpanded: () => void;
  onRemoveFilter: (filterId: string) => void;
  onClearRecommendation: () => void;
}) {
  const copy = CHECKLIST_RECOMMENDATION_COPY[locale];
  const stationCount = context.stationItems.length;

  return (
    <section className="mt-4 overflow-hidden rounded-2xl border-2 border-[#FFD7AA] bg-white shadow-sm">
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
              {copy.applied}
            </p>
            <p className="mt-1 whitespace-nowrap text-[12px] font-semibold text-foreground [word-break:keep-all] sm:text-[13px]">
              {copy.summary(context.sourceLabel, stationCount)}
            </p>
          </div>
          <button
            type="button"
            aria-label={copy.clearAria}
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
              {copy.stations}
            </p>
            <button
              type="button"
              className="shrink-0 whitespace-nowrap text-[11px] font-semibold text-primary transition-colors hover:text-primary/80 [word-break:keep-all]"
              onClick={onClearRecommendation}
            >
              {copy.clear}
            </button>
          </div>
          <div className="mt-2 space-y-1.5">
            {context.stationItems.map((station) => (
              <RecommendedStationFilterRow
                key={station.id}
                removeLabel={copy.removeStationAria(station.englishName)}
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
          {expanded ? copy.hide : copy.show}
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
  removeLabel,
  onRemove,
}: {
  station: ChecklistStationItem;
  removeLabel: string;
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
        aria-label={removeLabel}
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
        "inline-flex h-10 max-w-[13rem] min-w-0 items-center justify-center gap-2 rounded-lg border bg-background pl-3.5 pr-3 text-center text-sm font-medium text-foreground shadow-sm transition hover:border-primary/70",
        open ? "border-primary text-primary" : "border-border",
        className,
      )}
    >
      {icon}
      <span className="min-w-0 truncate">{value ?? label}</span>
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
  );
}

function FilterPanel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "absolute left-0 top-12 z-40 rounded-xl border border-border bg-white p-4 text-foreground shadow-xl",
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
        "inline-flex max-w-full items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium leading-tight",
        primary
          ? "border-primary/20 bg-accent text-primary"
          : "border-border bg-background text-muted-foreground",
      )}
    >
      {icon}
      <span className="min-w-0 [overflow-wrap:break-word]">{label}</span>
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

function ZeroResultState({
  locale,
  t,
  onClearFilters,
}: {
  locale: Locale;
  t: L10n;
  onClearFilters: () => void;
}) {
  return (
    <div className="mt-4 rounded-xl border border-border bg-white px-4 py-5">
      <h2 className="text-sm font-bold text-foreground">{t.zeroResultTitle}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.zeroResultBody}</p>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[#FA7000]/60 bg-[#FFF3E6] px-3 text-xs font-semibold text-primary transition hover:bg-[#FFE8CC]"
        >
          {t.zeroResultClear}
        </button>
        <a
          href={`/${locale}/listings`}
          className="inline-flex min-h-9 items-center justify-center rounded-lg border border-border bg-white px-3 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:bg-[#FFF8F1] hover:text-primary"
        >
          {t.zeroResultViewAll}
        </a>
      </div>
    </div>
  );
}

function ViewportEmptyState({ t, onShowAll }: { t: L10n; onShowAll: () => void }) {
  return (
    <div className="mt-4 rounded-xl border border-border bg-white px-4 py-5">
      <h2 className="text-sm font-bold text-foreground">{t.mapViewportEmpty}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.mapViewportEmptyBody}</p>
      <div className="mt-4 border-t border-border pt-4">
        <button
          type="button"
          onClick={onShowAll}
          className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[#FA7000]/60 bg-[#FFF3E6] px-3 text-xs font-semibold text-primary transition hover:bg-[#FFE8CC]"
        >
          {t.showAllListingLocations}
        </button>
      </div>
    </div>
  );
}

function CurrencyToggle({
  value,
  onChange,
}: {
  value: ListingCurrency;
  onChange: (value: ListingCurrency) => void;
}) {
  return (
    <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-xs font-semibold shadow-sm">
      {(["KRW", "CAD"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-full px-2 py-0.5 transition",
            value === option ? "bg-[#FFF3E6] text-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option === "KRW" ? "KRW" : "$"}
        </button>
      ))}
    </div>
  );
}

function ListingResultCard({
  listing,
  locale,
  t,
  favs,
  onToggleFav,
  active,
  onActivate,
  onOpenSummary,
  onHoverStart,
  onHoverEnd,
  price,
}: {
  listing: MockListing;
  locale: Locale;
  t: L10n;
  favs: Set<string>;
  onToggleFav: (id: string) => void;
  active: boolean;
  onActivate: () => void;
  onOpenSummary: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  price: string;
}) {
  const resultTags = getListingResultTags(locale, t, listing);
  const openSummary = () => {
    onActivate();
    onOpenSummary();
  };

  return (
    <li
      id={`listing-result-${listing.id}`}
      role="button"
      tabIndex={0}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      onClick={openSummary}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openSummary();
        }
      }}
      aria-label={t.viewListingAria(listing.title[locale])}
      className={cn(
        "mh-interactive-card cursor-pointer overflow-hidden rounded-xl border bg-card p-2.5 shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        active
          ? "border-primary/80 shadow-md ring-2 ring-primary/15"
          : "border-border hover:border-primary/45 hover:shadow-md",
      )}
    >
      <div className="flex gap-2.5">
        <MockListingImage
          listing={listing}
          locale={locale}
          t={t}
          className="h-20 w-24 shrink-0"
          imageClassName="rounded-lg"
          badgeClassName="left-2 top-2"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-foreground">
                {listing.title[locale]}
              </h2>
            </div>
            <div className="flex shrink-0 items-start gap-1">
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
          </div>

          <div className="mt-2 flex min-w-0 items-baseline">
            <span className="text-[15px] font-bold text-primary">
              {price}
            </span>
          </div>

          {resultTags.length > 0 && (
            <div className="mt-1.5 flex h-5 min-w-0 gap-1 overflow-hidden">
              {resultTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex h-5 min-w-0 items-center truncate rounded-full border border-slate-300/60 bg-white px-2 text-[11px] font-semibold leading-none text-slate-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

        </div>
      </div>
    </li>
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
      className="mh-interactive-card cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
              <p className="mt-1 min-w-0 text-xs leading-5 text-muted-foreground [overflow-wrap:break-word]">
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

          <div className="mt-3 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-[15px] font-bold text-primary">
              {fmtKRW(listing.priceKRW)}
            </span>
            <span className="min-w-0 text-xs font-medium leading-4 text-muted-foreground">
              {fmtCAD(listing.priceCAD)}
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
  return (
    <ListingImageFrame
      src={listing.imagePath}
      alt={listing.title[locale]}
      className={cn(
        "rounded-xl border border-border bg-muted",
        className,
      )}
      imageClassName={imageClassName}
      fallback={
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.8),rgba(226,229,232,0.78))]">
          <div className="absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-border" />
          <div className="absolute inset-y-4 left-1/2 w-px -translate-x-1/2 bg-border" />
        </div>
      }
    >
      <span
        className={cn(
          "absolute max-w-[calc(100%-1rem)] truncate rounded-full border px-2 py-0.5 text-[10px] font-bold",
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
    </ListingImageFrame>
  );
}

function ListingSummaryDrawer({
  listing,
  locale,
  t,
  fmtKRW,
  fmtCAD,
  price,
  onClose,
}: {
  listing: MockListing | null;
  locale: Locale;
  t: L10n;
  fmtKRW: (value: number) => string;
  fmtCAD: (value: number) => string;
  price: string;
  onClose: () => void;
}) {
  if (!listing) return null;

  const detailHref = `/${locale}/listings/${listing.id}`;
  const inquiryHref = `/${locale}/apply?listingId=${encodeURIComponent(listing.id)}`;
  const facts = [
    { label: t.listingLocation, value: listing.mapLocation.label },
    { label: t.priceFact, value: price },
    { label: t.housingFact, value: listing.roomType[locale] },
    { label: t.capacityFact, value: t.maxPeopleLabel(listing.maxPeople) },
  ];

  return (
    <aside
      className="mh-drawer-slide-in fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[27rem] flex-col border-l border-border bg-card shadow-2xl"
      aria-label={t.detailLabel}
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/95 px-5 backdrop-blur">
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

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <MockListingImage
          key={listing.imagePath}
          listing={listing}
          locale={locale}
          t={t}
          className="h-44 w-full"
          imageClassName="rounded-xl"
          badgeClassName="left-3 top-3"
        />

        <div className="mt-4 min-w-0">
          <div className="flex items-center gap-2">
            <span className="min-w-0 truncate text-xs font-medium text-muted-foreground">
              {listing.mapLocation.label}
            </span>
          </div>
          <h3 className="mh-clamp-2 mt-2 text-xl font-extrabold leading-tight text-foreground">
            {listing.title[locale]}
          </h3>
        </div>

        <dl className="mt-5 divide-y divide-border rounded-xl border border-border bg-background">
          {facts.map((fact) => (
            <div key={fact.label} className="grid grid-cols-[7.5rem_1fr] gap-3 px-4 py-3 text-sm">
              <dt className="text-xs font-semibold text-muted-foreground">{fact.label}</dt>
              <dd className="min-w-0 font-semibold text-foreground [overflow-wrap:break-word]">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex min-w-0 flex-wrap gap-1.5">
          {listing.extraFilters.slice(0, 3).map((filterId) => (
            <span
              key={filterId}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
            >
              {getExtraFilterLabel(locale, filterId)}
            </span>
          ))}
        </div>
      </div>

      <div className="shrink-0 space-y-2 border-t border-border bg-card p-5">
        <a
          href={detailHref}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-primary/45 bg-background px-4 py-2 text-sm font-bold text-primary transition hover:bg-[#FFF8F1]"
        >
          {t.detailAction}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
        <a
          href={inquiryHref}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-primary/35 bg-[#FFF3E6] px-4 py-2 text-sm font-bold text-primary transition hover:border-primary/55 hover:bg-[#FFE8CC]"
        >
          {t.inquireAction}
        </a>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {t.closeAction}
        </button>
      </div>
    </aside>
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

          <div className="min-w-0">
            <p className="text-xs font-semibold text-primary">{listing.area}</p>
            <h3 className="mh-clamp-3 mt-1 text-2xl font-extrabold leading-tight text-foreground">
              {listing.title[locale]}
            </h3>
            <p className="mt-2 min-w-0 text-sm leading-6 text-muted-foreground [overflow-wrap:break-word]">
              {listing.area} · {listing.roomType[locale]} · {t.maxPeopleLabel(listing.maxPeople)}
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-border bg-background p-4">
            <div className="flex min-w-0 flex-wrap items-end gap-x-3 gap-y-1">
              <span className="text-2xl font-extrabold text-primary">
                {fmtKRW(listing.priceKRW)}
              </span>
              <span className="min-w-0 text-sm font-semibold leading-5 text-muted-foreground">
                {fmtCAD(listing.priceCAD)}
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

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              size="lg"
              className="min-w-0 flex-1 whitespace-normal leading-tight"
              onClick={() => setInquiryModalOpen(true)}
            >
              {t.consultationCta}
            </Button>
            <a
              href={`/${locale}/listings/${listing.id}`}
              className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-center text-sm font-medium leading-tight text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {t.viewDetailPage}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
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
          onClose={() => setInquiryModalOpen(false)}
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
  onClose,
}: {
  listing: MockListing;
  locale: Locale;
  t: L10n;
  fmtKRW: (value: number) => string;
  fmtCAD: (value: number) => string;
  onClose: () => void;
}) {
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
          <div className="min-w-0">
            <h2 id="inquiry-choice-title" className="break-words text-xl font-extrabold text-foreground">
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

        <div className="mt-5 flex min-w-0 gap-3 rounded-2xl border border-border bg-secondary p-3 sm:p-4">
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
              <span className="min-w-0 [overflow-wrap:break-word]">{listing.area}</span>
              <span>·</span>
              <span className="min-w-0 [overflow-wrap:break-word]">{listing.roomType[locale]}</span>
              <span>·</span>
              <span>{t.maxPeopleLabel(listing.maxPeople)}</span>
            </div>
            <p className="mt-2 text-sm font-extrabold text-primary">
              {fmtKRW(listing.priceKRW)}
              <span className="ml-2 text-xs font-semibold text-muted-foreground">
                {fmtCAD(listing.priceCAD)}
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
            active={false}
            onClick={() => openDirectApplyFromListing(locale, listing)}
          />
          <InquiryOptionCard
            title={t.inquiryModal.supportTitle}
            badge={t.inquiryModal.supportBadge}
            description={t.inquiryModal.supportDescription}
            action={t.inquiryModal.supportAction}
            active={false}
            tone="support"
            onClick={() => {
              openAssistedApplyFromListing(locale, listing);
            }}
          />
        </div>

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
  tone = "default",
  onClick,
}: {
  title: string;
  badge: string;
  description: string;
  action: string;
  active: boolean;
  tone?: "default" | "support";
  onClick: () => void;
}) {
  const isSupport = tone === "support";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-full min-w-0 flex-col rounded-2xl border p-4 text-left shadow-sm transition-[background-color,border-color,box-shadow] duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        isSupport
          ? "border-[#FFE8CC] bg-[#FFF8F1] hover:border-primary hover:bg-[#FFF3E6] hover:shadow-md"
          : active
            ? "border-primary bg-accent shadow-md"
            : "border-border bg-card hover:border-primary hover:bg-accent hover:shadow-md",
      )}
    >
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <h3 className="min-w-0 break-words text-base font-extrabold text-foreground">{title}</h3>
        <span
          className={cn(
            "max-w-full shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold leading-tight text-primary [overflow-wrap:break-word]",
            isSupport ? "border-[#FFE8CC] bg-[#FFF3E6]" : "border-primary/20 bg-accent",
          )}
        >
          {badge}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground [overflow-wrap:break-word]">{description}</p>
      <span className="mt-auto inline-flex min-w-0 items-center gap-1.5 pt-4 text-sm font-bold leading-tight text-primary">
        {action}
        <ArrowRight className="h-4 w-4" />
      </span>
    </button>
  );
}

function GoogleListingsMap({
  listings,
  activeListingId,
  locale,
  t,
  ttcOverlayLabel,
  focusedStationRequest,
  fitRequestKey,
  onVisibleListingIdsChange,
  onSelectListing,
  onSelectGroup,
}: {
  listings: MockListing[];
  activeListingId: string;
  locale: Locale;
  t: L10n;
  ttcOverlayLabel: string;
  focusedStationRequest: StationFocusRequest | null;
  fitRequestKey: string;
  onVisibleListingIdsChange: (ids: string[] | null) => void;
  onSelectListing: (listing: MockListing) => void;
  onSelectGroup: (group: ListingMapGroupFilter) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<InstanceType<GoogleMapsApi["maps"]["Map"]> | null>(null);
  const markersRef = useRef<Map<string, InstanceType<GoogleMapsApi["maps"]["Marker"]>>>(new Map());
  const placeLabelMarkersRef = useRef<Map<string, InstanceType<GoogleMapsApi["maps"]["Marker"]>>>(new Map());
  const ttcLinesRef = useRef<Map<string, InstanceType<GoogleMapsApi["maps"]["Polyline"]>>>(new Map());
  const ttcStationMarkersRef = useRef<Map<string, InstanceType<GoogleMapsApi["maps"]["Marker"]>>>(new Map());
  const clusterDataRef = useRef<Map<string, ListingCluster>>(new Map());
  const projectionOverlayRef = useRef<InstanceType<GoogleMapsApi["maps"]["OverlayView"]> | null>(null);
  const lastFitRequestKeyRef = useRef("");
  const lastStationFocusKeyRef = useRef("");
  const consumedStationFocusKeysRef = useRef<Set<string>>(new Set());
  const markerOverlaySignatureRef = useRef("");
  const ttcRouteOverlaySignatureRef = useRef("");
  const projectionRetryIdRef = useRef<number | null>(null);
  const mapZoomRef = useRef(12);
  const programmaticMapMoveRef = useRef(false);
  const userHasInteractedWithMapRef = useRef(false);
  const onSelectListingRef = useRef(onSelectListing);
  const onSelectGroupRef = useRef(onSelectGroup);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "missing" | "error">("idle");
  const [mapRevision, setMapRevision] = useState(0);
  const [showTtcOverlay, setShowTtcOverlay] = useState(true);
  const [mapTypeId, setMapTypeId] = useState<ListingMapTypeId>(() => getStoredListingMapType());
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const transitProfile = TRANSIT_CITY_PROFILES[DEFAULT_TRANSIT_CITY_ID];
  const mapTypeLabels = LISTING_MAP_TYPE_LABELS[locale];

  useEffect(() => {
    onSelectListingRef.current = onSelectListing;
  }, [onSelectListing]);

  useEffect(() => {
    onSelectGroupRef.current = onSelectGroup;
  }, [onSelectGroup]);

  useEffect(() => {
    if (!apiKey?.trim()) {
      setLoadState("missing");
      return;
    }

    let cancelled = false;
    setLoadState("loading");

    loadGoogleMapsApi(apiKey)
      .then((google) => {
        if (cancelled || !containerRef.current) return;

        if (!mapRef.current) {
          mapRef.current = new google.maps.Map(containerRef.current, {
            center: transitProfile.center,
            zoom: transitProfile.zoom,
            clickableIcons: false,
            fullscreenControl: false,
            mapTypeControl: false,
            mapTypeId,
            streetViewControl: false,
            styles: [
              { featureType: "poi", stylers: [{ visibility: "off" }] },
              { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
              { featureType: "road", elementType: "geometry", stylers: [{ color: "#F4F1EC" }] },
              { featureType: "water", elementType: "geometry", stylers: [{ color: "#DDEAF0" }] },
            ],
          });

          mapRef.current.addListener("zoom_changed", () => {
            const zoom = mapRef.current?.getZoom();
            if (typeof zoom === "number") {
              mapZoomRef.current = zoom;
            }
            if (!programmaticMapMoveRef.current) {
              userHasInteractedWithMapRef.current = true;
            }
          });
          mapRef.current.addListener("dragstart", () => {
            if (!programmaticMapMoveRef.current) {
              userHasInteractedWithMapRef.current = true;
            }
          });
          mapRef.current.addListener("idle", () => {
            const zoom = mapRef.current?.getZoom();
            if (typeof zoom === "number") {
              mapZoomRef.current = zoom;
            }
            programmaticMapMoveRef.current = false;
            setMapRevision((revision) => revision + 1);
          });

          const projectionOverlay = new google.maps.OverlayView();
          projectionOverlay.onAdd = () => {};
          projectionOverlay.draw = () => {};
          projectionOverlay.onRemove = () => {};
          projectionOverlay.setMap(mapRef.current);
          projectionOverlayRef.current = projectionOverlay;
        }

        const zoom = mapRef.current.getZoom();
        if (typeof zoom === "number") {
          mapZoomRef.current = zoom;
        }
        setLoadState("ready");
      })
      .catch(() => {
        if (!cancelled) setLoadState("error");
      });

    return () => {
      cancelled = true;
      if (projectionRetryIdRef.current !== null) {
        window.clearTimeout(projectionRetryIdRef.current);
        projectionRetryIdRef.current = null;
      }
    };
  }, [apiKey]);

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.setMapTypeId(mapTypeId);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LISTING_MAP_TYPE_STORAGE_KEY, mapTypeId);
    }
  }, [mapTypeId]);

  useEffect(() => {
    if (!apiKey?.trim() || loadState !== "ready" || !mapRef.current) return;

    if (listings.length === 0) {
      onVisibleListingIdsChange([]);
      return;
    }

    const bounds = mapRef.current.getBounds();
    if (!bounds) {
      onVisibleListingIdsChange(null);
      return;
    }

    const ids = listings
      .filter((listing) => bounds.contains(listing.mapLocation))
      .map((listing) => listing.id)
      .sort();
    onVisibleListingIdsChange(ids);
  }, [apiKey, listings, loadState, mapRevision, onVisibleListingIdsChange]);

  useEffect(() => {
    if (!apiKey?.trim() || loadState !== "ready" || !window.google?.maps || !mapRef.current) return;

    const google = window.google;

    if (listings.length === 0) {
      if (markerOverlaySignatureRef.current !== "empty") {
        markersRef.current.forEach((marker) => marker.setMap(null));
        placeLabelMarkersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current.clear();
        placeLabelMarkersRef.current.clear();
        clusterDataRef.current.clear();
        markerOverlaySignatureRef.current = "empty";
      }
      return;
    }

    const projection = projectionOverlayRef.current?.getProjection();
    if (!projection) {
      if (projectionRetryIdRef.current === null) {
        projectionRetryIdRef.current = window.setTimeout(() => {
          projectionRetryIdRef.current = null;
          setMapRevision((revision) => revision + 1);
        }, 120);
      }
      return;
    }

    const effectiveMapZoom = mapRef.current.getZoom() ?? mapZoomRef.current;
    const clusters = buildListingClusters(listings, effectiveMapZoom, google, projection);
    const countMarkerBoxes = clusters.map((cluster) =>
      getPixelBox(cluster.x, cluster.y, getClusterMarkerDiameter(cluster.count, cluster.listings.some((listing) => listing.id === activeListingId))),
    );
    const stationLabels =
      showTtcOverlay && effectiveMapZoom >= 13
        ? buildVisibleStationLabels(listings, effectiveMapZoom, google, projection, mapRef.current, countMarkerBoxes)
        : [];
    const nextOverlaySignature = `${getClusterOverlaySignature(clusters, activeListingId)}::${getStationLabelOverlaySignature(stationLabels)}`;

    if (nextOverlaySignature === markerOverlaySignatureRef.current) return;

    markerOverlaySignatureRef.current = nextOverlaySignature;
    const nextClusterKeys = new Set<string>();

    clusters.forEach((cluster) => {
      nextClusterKeys.add(cluster.id);
      clusterDataRef.current.set(cluster.id, cluster);
      const isActive = cluster.listings.some((listing) => listing.id === activeListingId);
      const label = {
        color: "#FFFFFF",
        fontSize: cluster.count >= 20 ? "13px" : "12px",
        fontWeight: "800",
        text: String(cluster.count),
      };
      const position = { lat: cluster.lat, lng: cluster.lng };
      const existingMarker = markersRef.current.get(cluster.id);

      if (existingMarker) {
        const marker = existingMarker as unknown as MutableGoogleMarker;
        marker.setIcon(createClusterMarkerIcon(google, cluster.count, isActive));
        marker.setLabel(label);
        marker.setPosition(position);
        marker.setTitle(t.clusterTitle(cluster.count));
        marker.setZIndex(isActive ? 140 : 120);
        marker.setMap(mapRef.current);
        return;
      }

      const marker = new google.maps.Marker({
        icon: createClusterMarkerIcon(google, cluster.count, isActive),
        label,
        map: mapRef.current,
        position,
        title: t.clusterTitle(cluster.count),
        zIndex: isActive ? 140 : 120,
      });

      const clusterKey = cluster.id;
      marker.addListener("click", () => {
        const currentCluster = clusterDataRef.current.get(clusterKey);
        if (!currentCluster) return;
        if (currentCluster.count === 1) {
          onSelectListingRef.current(currentCluster.listings[0]);
          return;
        }

        programmaticMapMoveRef.current = true;
        mapRef.current?.setCenter({ lat: currentCluster.lat, lng: currentCluster.lng });
        mapRef.current?.setZoom(Math.min((mapRef.current.getZoom() ?? mapZoomRef.current) + 2, 17));
      });
      markersRef.current.set(cluster.id, marker);
    });

    markersRef.current.forEach((marker, key) => {
      if (nextClusterKeys.has(key)) return;
      marker.setMap(null);
      markersRef.current.delete(key);
      clusterDataRef.current.delete(key);
    });

    const nextStationLabelKeys = new Set<string>();

    if (stationLabels.length > 0) {
      stationLabels.forEach((place) => {
        nextStationLabelKeys.add(place.station.id);
        const icon = createStationLabelIcon(
          google,
          place.label,
          place.placement,
          effectiveMapZoom >= 17,
          place.visual,
        );
        const position = { lat: place.station.lat, lng: place.station.lng };
        const existingMarker = placeLabelMarkersRef.current.get(place.station.id);

        if (existingMarker) {
          const marker = existingMarker as unknown as MutableGoogleMarker;
          marker.setIcon(icon);
          marker.setPosition(position);
          marker.setTitle(place.label);
          marker.setMap(mapRef.current);
          return;
        }

        const marker = new google.maps.Marker({
          icon,
          map: mapRef.current,
          position,
          title: place.label,
          zIndex: 90,
        });
        marker.addListener("click", () =>
          onSelectGroupRef.current({ kind: "station", id: place.station.id, label: place.label }),
        );
        placeLabelMarkersRef.current.set(place.station.id, marker);
      });
    }

    placeLabelMarkersRef.current.forEach((marker, key) => {
      if (nextStationLabelKeys.has(key)) return;
      marker.setMap(null);
      placeLabelMarkersRef.current.delete(key);
    });
  }, [activeListingId, apiKey, listings, loadState, mapRevision, showTtcOverlay]);

  useEffect(() => {
    if (!apiKey?.trim() || loadState !== "ready" || !window.google?.maps || !mapRef.current) return;
    if (fitRequestKey === lastFitRequestKeyRef.current) return;
    lastFitRequestKeyRef.current = fitRequestKey;
    if (listings.length === 0) return;

    const google = window.google;
    programmaticMapMoveRef.current = true;
    if (listings.length === 1) {
      mapRef.current.panTo(listings[0].mapLocation);
      mapRef.current.setZoom(14);
    } else {
      const bounds = new google.maps.LatLngBounds();
      listings.forEach((listing) => bounds.extend(listing.mapLocation));
      mapRef.current.fitBounds(bounds, 72);
    }
  }, [apiKey, fitRequestKey, listings, loadState]);

  useEffect(() => {
    if (!focusedStationRequest || !apiKey?.trim() || loadState !== "ready" || !window.google?.maps || !mapRef.current) return;

    const focusKey = `${focusedStationRequest.id}:${focusedStationRequest.nonce}`;
    if (focusKey === lastStationFocusKeyRef.current || consumedStationFocusKeysRef.current.has(focusKey)) return;

    const google = window.google;
    const station = TTC_STATIONS.find((item) => item.id === focusedStationRequest.id);
    if (!station) return;

    lastStationFocusKeyRef.current = focusKey;
    consumedStationFocusKeysRef.current.add(focusKey);
    programmaticMapMoveRef.current = true;

    const nearbyListings = listings.filter(
      (listing) => getDistanceMeters(listing.mapLocation, station) <= TTC_STATION_FOCUS_RADIUS_METERS,
    );

    if (nearbyListings.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: station.lat, lng: station.lng });
      nearbyListings.forEach((listing) => bounds.extend(listing.mapLocation));
      mapRef.current.fitBounds(bounds, 80);
      return;
    }

    mapRef.current.panTo({ lat: station.lat, lng: station.lng });
    if ((mapRef.current.getZoom() ?? mapZoomRef.current) < 15) {
      mapRef.current.setZoom(15);
    }
  }, [apiKey, focusedStationRequest, listings, loadState]);

  useEffect(() => {
    if (!apiKey?.trim() || loadState !== "ready" || !window.google?.maps || !mapRef.current) return;

    const google = window.google;
    const nextRouteSignature = showTtcOverlay ? "ttc-on" : "ttc-off";
    if (nextRouteSignature === ttcRouteOverlaySignatureRef.current) return;
    ttcRouteOverlaySignatureRef.current = nextRouteSignature;

    TTC_LINES.forEach((line) => {
      const key = `line-${line.id}`;
      const existingLine = ttcLinesRef.current.get(key);
      if (existingLine) {
        existingLine.setMap(showTtcOverlay ? mapRef.current : null);
        return;
      }

      const polyline = new google.maps.Polyline({
        clickable: false,
        map: showTtcOverlay ? mapRef.current : null,
        path: line.path,
        strokeColor: line.color,
        strokeOpacity: 0.58,
        strokeWeight: line.id === "1" ? 4 : 3,
        zIndex: 10,
      });
      ttcLinesRef.current.set(key, polyline);
    });

    TTC_STATIONS.forEach((station) => {
      const existingMarker = ttcStationMarkersRef.current.get(station.id);
      if (existingMarker) {
        existingMarker.setMap(showTtcOverlay ? mapRef.current : null);
        return;
      }

      const primaryLine = TTC_LINES.find((line) => station.lineIds.includes(line.id));
      const color = primaryLine?.color ?? "#8A8F98";
      const marker = new google.maps.Marker({
        clickable: true,
        icon: createTtcStationIcon(google, color, Boolean(station.major)),
        map: showTtcOverlay ? mapRef.current : null,
        position: { lat: station.lat, lng: station.lng },
        title: station.name,
        zIndex: station.major ? 25 : 20,
      });
      marker.addListener("click", () =>
        onSelectGroupRef.current({ kind: "station", id: station.id, label: getStationMapLabel(station.name) }),
      );
      ttcStationMarkersRef.current.set(station.id, marker);
    });
  }, [apiKey, loadState, showTtcOverlay]);

  if (loadState === "missing") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#EEF1F2] px-6 text-center">
        <div className="rounded-full border border-border bg-background/95 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
          {t.mapMissingKey}
        </div>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#EEF1F2] px-6 text-center">
        <div className="rounded-full border border-border bg-background/95 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
          {t.mapMissingKey}
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} className="absolute inset-0 bg-[#EEF1F2]" />
      <div className="absolute right-4 top-4 z-20 flex max-w-[calc(100%-2rem)] flex-wrap justify-end gap-2">
        <div className="flex rounded-full border border-border bg-background/95 p-0.5 text-xs font-semibold shadow-sm backdrop-blur">
          {LISTING_MAP_TYPE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setMapTypeId(option.id)}
              className={cn(
                "rounded-full px-2.5 py-1 transition",
                mapTypeId === option.id
                  ? "border border-primary/30 bg-[#FFF3E6] text-primary"
                  : "border border-transparent text-slate-600 hover:bg-muted hover:text-foreground",
              )}
            >
              {mapTypeLabels[option.id]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowTtcOverlay((value) => !value)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur transition",
            showTtcOverlay
              ? "border-primary/30 bg-[#FFF3E6]/95 text-primary hover:bg-[#FFE8CC]"
              : "border-border bg-background/95 text-muted-foreground hover:text-foreground",
          )}
        >
          {ttcOverlayLabel}
        </button>
      </div>
      {showTtcOverlay && (
        <div className="absolute bottom-7 right-4 z-20 max-w-[15rem] rounded-full bg-white/75 px-3 py-1 text-[10px] font-medium leading-tight text-slate-700/70 shadow-sm backdrop-blur">
          {t.ttcAttribution}
        </div>
      )}
      {loadState === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60">
          <div className="rounded-full border border-border bg-background/95 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
            {t.mapLabel}
          </div>
        </div>
      )}
    </>
  );
}

interface ListingCluster {
  id: string;
  count: number;
  listings: MockListing[];
  lat: number;
  lng: number;
  x: number;
  y: number;
  group?: ListingMapGroupFilter;
}

interface MutableGoogleMarker {
  setIcon: (icon: Record<string, unknown>) => void;
  setLabel: (label: Record<string, string>) => void;
  setMap: (map: unknown) => void;
  setPosition: (position: GoogleMapsLatLngLiteral) => void;
  setTitle: (title: string) => void;
  setZIndex: (zIndex: number) => void;
}

interface PixelBox {
  bottom: number;
  left: number;
  right: number;
  top: number;
}

type TtcStation = (typeof TTC_STATIONS)[number];
type StationLabelPlacement =
  | "above"
  | "below"
  | "left"
  | "right"
  | "above-left"
  | "above-right"
  | "below-left"
  | "below-right";

interface VisibleStationLabel {
  label: string;
  placement: StationLabelPlacement;
  station: TtcStation;
  visual: TtcStationLabelVisual;
}

interface TtcStationLabelVisual {
  backgroundColor: string;
  borderColor: string;
  lineColors: string[];
  textColor: string;
  textStrokeColor: string;
  transfer: boolean;
}

type ListingMapTypeId = "roadmap" | "satellite" | "hybrid";

const LISTING_MAP_TYPE_STORAGE_KEY = "maplehouse:listingsMapType";
const TTC_STATION_FOCUS_RADIUS_METERS = 1200;
const LISTING_MAP_TYPE_OPTIONS: Array<{ id: ListingMapTypeId }> = [
  { id: "roadmap" },
  { id: "satellite" },
  { id: "hybrid" },
];
const LISTING_MAP_TYPE_LABELS: Record<Locale, Record<ListingMapTypeId, string>> = {
  ko: {
    roadmap: "지도",
    satellite: "위성",
    hybrid: "혼합",
  },
  en: {
    roadmap: "Map",
    satellite: "Satellite",
    hybrid: "Hybrid",
  },
  fr: {
    roadmap: "Carte",
    satellite: "Satellite",
    hybrid: "Hybride",
  },
};
const TTC_STATION_LABEL_COLORS: Record<TtcLineId, string> = {
  "1": "rgba(226, 216, 122, 0.54)",
  "2": "rgba(128, 184, 137, 0.54)",
  "4": "rgba(190, 162, 204, 0.54)",
  "5": "rgba(238, 178, 124, 0.54)",
  "6": "rgba(176, 184, 190, 0.54)",
};

type GoogleProjection = NonNullable<
  ReturnType<InstanceType<GoogleMapsApi["maps"]["OverlayView"]>["getProjection"]>
>;

function isListingMapTypeId(value: string | null): value is ListingMapTypeId {
  return value === "roadmap" || value === "satellite" || value === "hybrid";
}

function getStoredListingMapType(): ListingMapTypeId {
  if (typeof window === "undefined") return "roadmap";
  const storedValue = window.localStorage.getItem(LISTING_MAP_TYPE_STORAGE_KEY);
  return isListingMapTypeId(storedValue) ? storedValue : "roadmap";
}

function getTtcStationLabelColor(lineId: TtcLineId) {
  return TTC_STATION_LABEL_COLORS[lineId];
}

function getTtcStationLabelVisual(station: TtcStation): TtcStationLabelVisual {
  const lineIds = station.lineIds.filter((lineId, index, lineIds) => lineIds.indexOf(lineId) === index);
  const lineColors = lineIds.map(getTtcStationLabelColor);
  const transfer = lineColors.length === 2;

  return {
    backgroundColor: lineColors[0] ?? "rgba(176, 184, 190, 0.54)",
    borderColor: "rgba(255, 255, 255, 0.48)",
    lineColors,
    textColor: "#334155",
    textStrokeColor: "rgba(255, 255, 255, 0.36)",
    transfer,
  };
}

function getClusterRadiusPx(zoom: number) {
  if (zoom <= 10) return 110;
  if (zoom === 11) return 96;
  if (zoom === 12) return 84;
  if (zoom === 13) return 72;
  if (zoom === 14) return 62;
  if (zoom === 15) return 48;
  return 34;
}

function getClusterMarkerDiameter(count: number, active: boolean) {
  const scale = count >= 20 ? 22 : count >= 5 ? 19 : 16;
  return (active ? scale + 1.5 : scale) * 2 + 10;
}

function getPixelBox(x: number, y: number, size: number): PixelBox {
  const half = size / 2;
  return {
    bottom: y + half,
    left: x - half,
    right: x + half,
    top: y - half,
  };
}

function boxesOverlap(a: PixelBox, b: PixelBox, gap = 8) {
  return !(
    a.right + gap < b.left ||
    a.left - gap > b.right ||
    a.bottom + gap < b.top ||
    a.top - gap > b.bottom
  );
}

function getOverlapArea(a: PixelBox, b: PixelBox) {
  const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return width * height;
}

function projectListingPoint(
  google: GoogleMapsApi,
  projection: GoogleProjection,
  location: GoogleMapsLatLngLiteral,
) {
  const point = projection.fromLatLngToDivPixel(new google.maps.LatLng(location.lat, location.lng));
  if (!point) return null;
  return point;
}

function getStationLabelBox(
  x: number,
  y: number,
  width: number,
  height: number,
  placement: StationLabelPlacement,
): PixelBox {
  const offsets: Record<StationLabelPlacement, { dx: number; dy: number }> = {
    above: { dx: 0, dy: -25 },
    below: { dx: 0, dy: 25 },
    left: { dx: -(width / 2 + 11), dy: 0 },
    right: { dx: width / 2 + 11, dy: 0 },
    "above-left": { dx: -(width / 2 + 8), dy: -22 },
    "above-right": { dx: width / 2 + 8, dy: -22 },
    "below-left": { dx: -(width / 2 + 8), dy: 22 },
    "below-right": { dx: width / 2 + 8, dy: 22 },
  };
  const offset = offsets[placement];
  const centerX = x + offset.dx;
  const centerY = y + offset.dy;

  return {
    bottom: centerY + height / 2,
    left: centerX - width / 2,
    right: centerX + width / 2,
    top: centerY - height / 2,
  };
}

function getStationLabelSize(name: string, compact: boolean) {
  return {
    height: compact ? 18 : 19,
    width: Math.min(Math.max(name.length * (compact ? 5.6 : 5.8) + 22, compact ? 54 : 60), compact ? 148 : 172),
  };
}

function getStationMapLabel(name: string) {
  const normalizedName = name.replace(/\s+Station$/i, "").trim();
  return `${normalizedName} Station`;
}

function getStationLabelPriority(
  station: TtcStation,
  viewportCenter: GoogleMapsLatLngLiteral,
  focusedStationIds: Set<string>,
) {
  const distance = getDistanceMeters(station, viewportCenter);
  const selectedWeight = focusedStationIds.has(station.id) ? -500000 : 0;
  const majorWeight = station.major ? -300000 : 0;
  const terminalWeight = station.terminal ? -200000 : 0;
  return selectedWeight + majorWeight + terminalWeight + distance;
}

function buildVisibleStationLabels(
  listings: MockListing[],
  zoom: number,
  google: GoogleMapsApi,
  projection: GoogleProjection,
  map: InstanceType<GoogleMapsApi["maps"]["Map"]>,
  countMarkerBoxes: PixelBox[],
): VisibleStationLabel[] {
  if (zoom <= 12) return [];

  const focusedStationIds = new Set(
    listings
      .map(getListingMapGroup)
      .filter((group) => group.kind === "station")
      .map((group) => group.id),
  );
  const bounds = map.getBounds();
  const boundStations = TTC_STATIONS.filter((station) => !bounds || bounds.contains(station));
  const focusedStations = TTC_STATIONS.filter((station) => focusedStationIds.has(station.id));
  const visibleStations = Array.from(
    new Map([...focusedStations, ...boundStations].map((station) => [station.id, station])).values(),
  );
  const viewportCenter =
    visibleStations.length > 0
      ? {
          lat: visibleStations.reduce((sum, station) => sum + station.lat, 0) / visibleStations.length,
          lng: visibleStations.reduce((sum, station) => sum + station.lng, 0) / visibleStations.length,
        }
      : { lat: 43.6532, lng: -79.3832 };
  const visible: VisibleStationLabel[] = [];
  const usedBoxes = [...countMarkerBoxes];
  const candidates = visibleStations
    .sort((a, b) => getStationLabelPriority(a, viewportCenter, focusedStationIds) - getStationLabelPriority(b, viewportCenter, focusedStationIds));
  const placements: StationLabelPlacement[] = [
    "above",
    "below",
    "left",
    "right",
    "above-left",
    "above-right",
    "below-left",
    "below-right",
  ];

  candidates.forEach((station) => {
    const point = projectListingPoint(google, projection, station);
    if (!point) return;

    const label = getStationMapLabel(station.name);
    const visual = getTtcStationLabelVisual(station);
    const compact = zoom >= 17;
    const collisionGap = zoom >= 17 ? 2 : zoom >= 16 ? 4 : zoom >= 15 ? 6 : 8;
    const size = getStationLabelSize(label, compact);
    const boxes = placements.map((placement) => ({
      box: getStationLabelBox(point.x, point.y, size.width, size.height, placement),
      placement,
    }));
    const firstSafe = boxes.find(({ box }) => !usedBoxes.some((usedBox) => boxesOverlap(box, usedBox, collisionGap)));

    if (firstSafe) {
      visible.push({ label, placement: firstSafe.placement, station, visual });
      usedBoxes.push(firstSafe.box);
      return;
    }

    if (zoom >= 16) {
      const leastOverlap = boxes
        .map((candidate) => ({
          ...candidate,
          score: usedBoxes.reduce((sum, usedBox) => sum + getOverlapArea(candidate.box, usedBox), 0),
        }))
        .sort((a, b) => a.score - b.score)[0];
      if (leastOverlap) {
        visible.push({ label, placement: leastOverlap.placement, station, visual });
        usedBoxes.push(leastOverlap.box);
      }
    }
  });

  return visible;
}

function buildListingClusters(
  listings: MockListing[],
  zoom: number,
  google: GoogleMapsApi,
  projection: GoogleProjection,
): ListingCluster[] {
  const radius = getClusterRadiusPx(zoom);
  const clusters: ListingCluster[] = [];

  listings.forEach((listing) => {
    const point = projectListingPoint(google, projection, listing.mapLocation);
    if (!point) return;

    let closestClusterIndex = -1;
    let closestDistance = Infinity;

    clusters.forEach((cluster, clusterIndex) => {
      const distance = Math.hypot(point.x - cluster.x, point.y - cluster.y);
      if (distance <= radius && distance < closestDistance) {
        closestClusterIndex = clusterIndex;
        closestDistance = distance;
      }
    });

    if (closestClusterIndex === -1) {
      const group = getListingMapGroup(listing);
      clusters.push({
        id: listing.id,
        count: 1,
        listings: [listing],
        lat: listing.mapLocation.lat,
        lng: listing.mapLocation.lng,
        x: point.x,
        y: point.y,
        group: { kind: group.kind, id: group.id, label: group.label },
      });
      return;
    }

    const cluster = clusters[closestClusterIndex];
    cluster.listings.push(listing);
    cluster.count = cluster.listings.length;
    cluster.lat =
      cluster.listings.reduce((sum, clusterListing) => sum + clusterListing.mapLocation.lat, 0) /
      cluster.count;
    cluster.lng =
      cluster.listings.reduce((sum, clusterListing) => sum + clusterListing.mapLocation.lng, 0) /
      cluster.count;
    cluster.x =
      cluster.listings.reduce((sum, clusterListing) => {
        const clusterPoint = projectListingPoint(google, projection, clusterListing.mapLocation);
        return sum + (clusterPoint?.x ?? cluster.x);
      }, 0) / cluster.count;
    cluster.y =
      cluster.listings.reduce((sum, clusterListing) => {
        const clusterPoint = projectListingPoint(google, projection, clusterListing.mapLocation);
        return sum + (clusterPoint?.y ?? cluster.y);
      }, 0) / cluster.count;
    cluster.id = cluster.listings.map((clusterListing) => clusterListing.id).sort().join("|");
  });

  return clusters;
}

function getClusterOverlaySignature(clusters: ListingCluster[], activeListingId: string) {
  return clusters
    .map((cluster) => {
      const listingIds = cluster.listings.map((listing) => listing.id).sort().join(",");
      const active = cluster.listings.some((listing) => listing.id === activeListingId) ? "active" : "idle";
      return [
        listingIds,
        active,
        cluster.count,
        Math.round(cluster.lat * 100000),
        Math.round(cluster.lng * 100000),
        Math.round(cluster.x),
        Math.round(cluster.y),
      ].join(":");
    })
    .sort()
    .join("|");
}

function getStationLabelOverlaySignature(labels: VisibleStationLabel[]) {
  return labels
    .map((label) => `${label.station.id}:${label.placement}:${label.label}`)
    .sort()
    .join("|");
}

function createClusterMarkerIcon(google: GoogleMapsApi, count: number, active: boolean) {
  const scale = count >= 20 ? 22 : count >= 5 ? 19 : 16;

  return {
    anchor: new google.maps.Point(0, 0),
    fillColor: active ? "#2563EB" : "#3B82F6",
    fillOpacity: active ? 0.94 : 0.82,
    path: google.maps.SymbolPath.CIRCLE,
    scale: active ? scale + 1.5 : scale,
    strokeColor: "#FFFFFF",
    strokeOpacity: active ? 0.98 : 0.72,
    strokeWeight: active ? 2 : 1.5,
  };
}

function createStationLabelIcon(
  google: GoogleMapsApi,
  text: string,
  placement: StationLabelPlacement,
  compact: boolean,
  visual: TtcStationLabelVisual,
) {
  const { height, width } = getStationLabelSize(text, compact);
  const offsets: Record<StationLabelPlacement, { dx: number; dy: number }> = {
    above: { dx: 0, dy: -25 },
    below: { dx: 0, dy: 25 },
    left: { dx: -(width / 2 + 11), dy: 0 },
    right: { dx: width / 2 + 11, dy: 0 },
    "above-left": { dx: -(width / 2 + 8), dy: -22 },
    "above-right": { dx: width / 2 + 8, dy: -22 },
    "below-left": { dx: -(width / 2 + 8), dy: 22 },
    "below-right": { dx: width / 2 + 8, dy: 22 },
  };
  const offset = offsets[placement];
  const safeText = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  const fontSize = compact ? 9.4 : 10.1;
  const rx = height / 2 - 1;
  const rightStartTop = Math.round(width * 0.47);
  const rightStartBottom = Math.round(width * 0.55);
  const fill =
    visual.transfer && visual.lineColors.length === 2
      ? `<defs><clipPath id="stationPillClip"><rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${rx}"/></clipPath><filter id="stationShadow" x="-18%" y="-55%" width="136%" height="210%"><feDropShadow dx="0" dy="2" stdDeviation="1.8" flood-color="#0F172A" flood-opacity="0.08"/></filter></defs><g clip-path="url(#stationPillClip)" filter="url(#stationShadow)"><rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="${visual.lineColors[0]}"/><polygon points="${rightStartTop},1 ${width - 1},1 ${width - 1},${height - 1} ${rightStartBottom},${height - 1}" fill="${visual.lineColors[1]}"/></g><rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${rx}" fill="none" stroke="${visual.borderColor}" stroke-width="1"/>`
      : `<defs><filter id="stationShadow" x="-18%" y="-55%" width="136%" height="210%"><feDropShadow dx="0" dy="2" stdDeviation="1.8" flood-color="#0F172A" flood-opacity="0.08"/></filter></defs><rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${rx}" fill="${visual.backgroundColor}" stroke="${visual.borderColor}" stroke-width="1" filter="url(#stationShadow)"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${fill}<text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="${visual.textColor}" stroke="${visual.textStrokeColor}" stroke-width="0.75" paint-order="stroke fill" stroke-linejoin="round" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="600">${safeText}</text></svg>`;

  return {
    anchor: new google.maps.Point(width / 2 - offset.dx, height / 2 - offset.dy),
    scaledSize: new google.maps.Size(width, height),
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
  };
}

function createTtcStationIcon(google: GoogleMapsApi, color: string, major: boolean) {
  return {
    anchor: new google.maps.Point(0, 0),
    fillColor: "#FFFFFF",
    fillOpacity: 1,
    path: google.maps.SymbolPath.CIRCLE,
    scale: major ? 5 : 3.8,
    strokeColor: color,
    strokeOpacity: 0.95,
    strokeWeight: major ? 2.2 : 1.8,
  };
}
