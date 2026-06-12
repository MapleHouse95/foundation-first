import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import {
  ArrowUpDown,
  ArrowRight,
  Bath,
  BedDouble,
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Heart,
  Home,
  MapPin,
  Share2,
  ShieldCheck,
  Sofa,
  Star,
  Utensils,
  UserRound,
  X,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { ListingImageFrame } from "@/components/ui/listing-image-frame";
import type { Locale } from "@/lib/i18n";
import { getAllMockListingImages } from "@/lib/mockListingImages";
import { cn } from "@/lib/utils";
import {
  APPLY_SELECTED_LISTING_STORAGE_KEY,
  MOCK_LISTINGS,
  buildApplySelectedListingSummary,
  type MockListing,
} from "./LocaleListingsPage";

const LANDLORD_CENTER_DRAFT_KEY = "maplehouse.landlordDraft.v1";
const LANDLORD_LISTING_DETAILS_DRAFT_KEY = "maplehouse.landlordListingDetailsDraft.v1";
// TODO: Replace mock conversion with real exchange-rate data later.
const MOCK_CAD_TO_KRW = 1000;

type PublicListingSource = "draft" | "mock";
type CurrencyMode = "CAD" | "KRW";

type DraftPhoto = {
  id?: string;
  name: string;
  dataUrl?: string;
};

type LandlordCenterDraft = Partial<{
  city: string;
  area: string;
  nearestStation: string;
  address: string;
  housingType: string;
  residentCondition: string;
  photos: DraftPhoto[];
  coverPhotoId: string;
  listingTitle: string;
  monthlyRent: string;
  availableFrom: string;
  minimumStay: string;
}>;

type LandlordListingDetailsDraft = Partial<{
  area: string;
  nearestStation: string;
  unitDetail: string;
  floor: string;
  useType: string;
  occupancy: string;
  bathroom: string;
  kitchen: string;
  furnished: string;
  elevator: string;
  parking: string;
  tenantPetsAllowed: string;
  homePets: string;
  homePetType: string;
  smokingCondition: string;
  keyDepositAmount: string;
  utilityStatuses: Record<string, string>;
  houseRuleItems: string[];
  additionalNote: string;
  moveInQuestions: string;
  furniture: string[];
  bedSize: string;
}>;

type PublicPhoto = {
  id: string;
  src?: string;
  label: string;
};

type PublicListing = {
  id: string;
  source: PublicListingSource;
  sourceListing?: MockListing;
  title: string;
  city: string;
  area: string;
  nearestStation: string;
  addressHidden: boolean;
  rentLabel: string;
  rentValue: number;
  housingType: string;
  livingCondition: string;
  availableFrom: string;
  minimumStay: string;
  photoCount: number;
  photos: PublicPhoto[];
  detailAdded: boolean;
  details: {
    unitDetail: string;
    floor: string;
    occupancy: string;
    bathroom: string;
    kitchen: string;
    furnished: string;
    bedSize: string;
    elevator: string;
    parking: string;
    pets: string;
    smoking: string;
  };
  keyDeposit: string;
  utilities: string[];
  houseRules: string[];
  extraNotes: string[];
};

type InfoRow = [string, string] | { label: string; value: string; secondary?: string };

type DetailCopy = {
  backToListings: string;
  emptyDraftTitle: string;
  emptyDraftBody: string;
  goListings: string;
  unavailableTitle: string;
  unavailableBody: string;
  photoEmpty: string;
  viewAllPhotos: string;
  currencyLabel: string;
  approximate: string;
  addressAfterInquiry: string;
  addressNotice: string;
  fallback: string;
  detailFallback: string;
  costFallback: string;
  rulesFallback: string;
  infoStatusDefault: string;
  infoStatusPartial: string;
  heroFields: {
    monthlyRent: string;
    availableFrom: string;
    housingType: string;
    livingCondition: string;
    photos: string;
    infoStatus: string;
  };
  sections: {
    overview: string;
    roomInfo: string;
    amenities: string;
    location: string;
    housing: string;
    costs: string;
    rules: string;
    reviews: string;
    host: string;
    faq: string;
    beforeInquiry: string;
    support: string;
  };
  tabs: {
    overview: string;
    roomInfo: string;
    amenities: string;
    location: string;
    rules: string;
    reviews: string;
    host: string;
    faq: string;
    beforeInquiry: string;
  };
  intro: {
    ratingLine: string;
    description: string;
    readMore: string;
    readLess: string;
    shareLabel: string;
    favoriteLabel: string;
  };
  fields: {
    city: string;
    area: string;
    nearestStation: string;
    approximateLocation: string;
    address: string;
    unitDetail: string;
    floor: string;
    minimumStay: string;
    occupancy: string;
    bathroom: string;
    kitchen: string;
    furnished: string;
    bedSize: string;
    elevator: string;
    parking: string;
    pets: string;
    smoking: string;
    keyDeposit: string;
    utilities: string;
  };
  roomUnitTitle: string;
  roomUnitSubtitle: string;
  roomFullDetails: string;
  roomCta: string;
  roomDateCta: string;
  roomAvailabilityBadge: string;
  photosCountLabel: string;
  roomAttributes: {
    bedroom: string;
    bathroom: string;
    kitchen: string;
    livingRoom: string;
  };
  amenityGroups: {
    building: string;
    shared: string;
    rules: string;
    buildingMore: string;
    sharedMore: string;
  };
  amenityItems: {
    parking: string;
    cctv: string;
    fireExtinguisher: string;
    doorLock: string;
    wifi: string;
    heating: string;
    airConditioning: string;
    balcony: string;
  };
  reviews: {
    ratingComing: string;
    emptyTitle: string;
    emptyBody: string;
  };
  host: {
    name: string;
    contactStatus: string;
    listingStatus: string;
    description: string;
    cta: string;
  };
  datePicker: {
    title: string;
    previousMonth: string;
    nextMonth: string;
    weekdays: string[];
    unavailableLabel: string;
    reset: string;
    apply: string;
  };
  mapPlaceholderTitle: string;
  mapPlaceholderBody: string;
  faq: Array<{ question: string; answer: string }>;
  checklist: string[];
  supportBody: string;
  inquire: string;
  inquirySeparateGuide: string;
  modal: {
    title: string;
    subtitle: string;
    directTitle: string;
    supportTitle: string;
    directMessage: string;
  };
};

const DETAIL_COPY: Record<Locale, DetailCopy> = {
  ko: {
    backToListings: "매물 목록으로 돌아가기",
    emptyDraftTitle: "표시할 매물 초안이 없습니다.",
    emptyDraftBody: "임대인 등록에서 첫 매물 초안을 만든 뒤 공개페이지를 미리볼 수 있습니다.",
    goListings: "매물 목록으로 가기",
    unavailableTitle: "매물을 찾을 수 없습니다.",
    unavailableBody: "목록에서 다시 매물을 선택해 주세요.",
    photoEmpty: "등록된 사진이 없습니다.",
    viewAllPhotos: "사진 모두 보기",
    currencyLabel: "통화",
    approximate: "대략적인 위치",
    addressAfterInquiry: "상세 주소는 문의 후 확인",
    addressNotice: "정확한 주소와 출입 관련 정보는 문의 및 확인 단계에서 안내됩니다.",
    fallback: "확인 필요",
    detailFallback: "임대인 상세정보 보완 전",
    costFallback: "공과금과 보증금 조건은 문의 전 확인이 필요합니다.",
    rulesFallback: "하우스 룰은 아직 입력되지 않았습니다.",
    infoStatusDefault: "상세정보 확인 필요",
    infoStatusPartial: "상세정보 일부 입력됨",
    heroFields: {
      monthlyRent: "월세",
      availableFrom: "입주 가능일",
      housingType: "주거 형태",
      livingCondition: "거주 조건",
      photos: "사진",
      infoStatus: "정보 상태",
    },
    sections: {
      overview: "핵심 정보",
      roomInfo: "방 선택",
      amenities: "편의시설",
      location: "위치와 생활권",
      housing: "주거 조건",
      costs: "비용과 공과금",
      rules: "하우스 룰",
      reviews: "리뷰",
      host: "호스트 프로필",
      faq: "FAQ",
      beforeInquiry: "문의 전 확인할 것",
      support: "MapleHouse 확인 지원",
    },
    tabs: {
      overview: "숙소 소개",
      roomInfo: "방 정보",
      amenities: "편의시설",
      location: "위치",
      rules: "하우스 룰",
      reviews: "리뷰",
      host: "호스트",
      faq: "FAQ",
      beforeInquiry: "문의 전 확인",
    },
    intro: {
      ratingLine: "평점 준비 중 · 리뷰 0개",
      description:
        "토론토에서 출국 전 주거를 찾는 분들이 비교하기 쉽도록 등록된 매물입니다. 실제 주소, 입주 가능일, 공과금, 보증금, 생활 규칙은 문의 및 확인 단계에서 다시 정리됩니다.",
      readMore: "더보기",
      readLess: "접기",
      shareLabel: "공유하기",
      favoriteLabel: "관심 매물",
    },
    fields: {
      city: "도시",
      area: "지역",
      nearestStation: "가까운 역",
      approximateLocation: "표시 위치",
      address: "상세 주소",
      unitDetail: "공간 설명",
      floor: "층",
      minimumStay: "최소 거주",
      occupancy: "거주 인원",
      bathroom: "욕실",
      kitchen: "주방",
      furnished: "가구",
      bedSize: "침대 크기",
      elevator: "엘리베이터",
      parking: "주차",
      pets: "반려동물",
      smoking: "흡연",
      keyDeposit: "보증금",
      utilities: "공과금",
    },
    roomUnitTitle: "이 매물의 방 / 유닛",
    roomUnitSubtitle: "1베드",
    roomFullDetails: "전체 방 상세 보기",
    roomCta: "이 방 문의하기",
    roomDateCta: "날짜 선택하기",
    roomAvailabilityBadge: "입주 가능일 확인 필요",
    photosCountLabel: "사진",
    roomAttributes: {
      bedroom: "침실",
      bathroom: "욕실",
      kitchen: "주방",
      livingRoom: "거실",
    },
    amenityGroups: {
      building: "건물 시설",
      shared: "공용 편의시설",
      rules: "이용 규칙",
      buildingMore: "건물 시설 더 보기",
      sharedMore: "편의시설 더 보기",
    },
    amenityItems: {
      parking: "주차",
      cctv: "건물 CCTV",
      fireExtinguisher: "소화기",
      doorLock: "공동현관 도어락",
      wifi: "Wi-Fi",
      heating: "난방",
      airConditioning: "에어컨",
      balcony: "베란다/발코니",
    },
    reviews: {
      ratingComing: "평점 준비 중",
      emptyTitle: "아직 등록된 리뷰가 없습니다.",
      emptyBody: "실제 입주 후기 기능은 정식 운영 단계에서 제공될 예정입니다.",
    },
    host: {
      name: "MapleHouse 등록 임대인",
      contactStatus: "연락처 확인 예정",
      listingStatus: "매물 정보 보완 중",
      description: "이 임대인 정보는 실제 문의 및 확인 단계에서 MapleHouse가 추가로 정리할 예정입니다.",
      cta: "호스트에게 문의하기",
    },
    datePicker: {
      title: "입주 날짜 선택",
      previousMonth: "이전 달",
      nextMonth: "다음 달",
      weekdays: ["일", "월", "화", "수", "목", "금", "토"],
      unavailableLabel: "입주 불가 날짜",
      reset: "초기화",
      apply: "적용하기",
    },
    mapPlaceholderTitle: "지도 위치 미리보기",
    mapPlaceholderBody: "실제 지도 API는 연결되어 있지 않습니다. 정확한 주소와 이동 시간은 문의 및 확인 단계에서 다시 확인해 주세요.",
    faq: [
      {
        question: "실제 주소는 언제 확인할 수 있나요?",
        answer: "정확한 주소와 출입 관련 정보는 문의 및 확인 단계에서 안내됩니다.",
      },
      {
        question: "보증금과 공과금은 확정인가요?",
        answer: "일부 조건은 문의 전 확인이 필요하며, 실제 계약 전 다시 확인해야 합니다.",
      },
      {
        question: "사진과 실제 공간이 동일한가요?",
        answer: "MapleHouse는 비교를 돕지만, 실제 공간 상태는 문의 시 직접 재확인해야 합니다.",
      },
    ],
    checklist: [
      "월세에 포함된 비용을 확인하세요.",
      "입주 가능일과 실제 입주 가능 여부를 확인하세요.",
      "정확한 주소와 이동 시간을 확인하세요.",
      "보증금, 환불 조건, 취소 조건을 확인하세요.",
      "사진과 실제 공간이 일치하는지 확인하세요.",
    ],
    supportBody:
      "MapleHouse는 매물 정보를 표준화해 비교하고, 문의 전 확인해야 할 항목을 정리하는 데 도움을 줍니다. 실제 계약, 입금, 입주 여부는 당사자가 최종 확인해야 합니다.",
    inquire: "이 매물 문의하기",
    inquirySeparateGuide: "문의 및 예약 지원은 별도 안내 후 진행됩니다.",
    modal: {
      title: "이 매물에 어떻게 문의할까요?",
      subtitle: "현재는 MVP 미리보기입니다. 실제 메시지 발송, 결제, 신청 저장은 진행되지 않습니다.",
      directTitle: "집주인에게 직접 문의하기",
      supportTitle: "메이플하우스와 함께 문의하기",
      directMessage: "집주인 직접 메시지 기능은 다음 단계에서 연결됩니다. 현재는 MVP 미리보기입니다.",
    },
  },
  en: {
    backToListings: "Back to listings",
    emptyDraftTitle: "No listing draft to display.",
    emptyDraftBody: "Create a first listing draft from landlord registration to preview the public page.",
    goListings: "Go to listings",
    unavailableTitle: "Listing not found.",
    unavailableBody: "Please choose a listing again from the listing page.",
    photoEmpty: "No photos uploaded.",
    viewAllPhotos: "View all photos",
    currencyLabel: "Currency",
    approximate: "Approximate location",
    addressAfterInquiry: "Detailed address available after inquiry",
    addressNotice:
      "Exact address and access details are provided during the inquiry and confirmation process.",
    fallback: "Needs confirmation",
    detailFallback: "Not added by landlord yet",
    costFallback: "Utilities and deposit conditions need to be confirmed before inquiry.",
    rulesFallback: "House rules have not been added yet.",
    infoStatusDefault: "Details need confirmation",
    infoStatusPartial: "Some details added",
    heroFields: {
      monthlyRent: "Monthly rent",
      availableFrom: "Available from",
      housingType: "Housing type",
      livingCondition: "Living condition",
      photos: "Photos",
      infoStatus: "Info status",
    },
    sections: {
      overview: "Overview",
      roomInfo: "Room selection",
      amenities: "Amenities",
      location: "Location and area",
      housing: "Housing details",
      costs: "Costs and utilities",
      rules: "House rules",
      reviews: "Reviews",
      host: "Host profile",
      faq: "FAQ",
      beforeInquiry: "Before you inquire",
      support: "MapleHouse inquiry support",
    },
    tabs: {
      overview: "Overview",
      roomInfo: "Rooms",
      amenities: "Amenities",
      location: "Location",
      rules: "House rules",
      reviews: "Reviews",
      host: "Host",
      faq: "FAQ",
      beforeInquiry: "Before inquiry",
    },
    intro: {
      ratingLine: "Rating coming soon · 0 reviews",
      description:
        "This listing is prepared for people comparing housing before arriving in Canada. Address, availability, utilities, deposit, and house rules will be reconfirmed during the inquiry process.",
      readMore: "Read more",
      readLess: "Show less",
      shareLabel: "Share",
      favoriteLabel: "Save",
    },
    fields: {
      city: "City",
      area: "Area",
      nearestStation: "Nearest station",
      approximateLocation: "Shown location",
      address: "Address",
      unitDetail: "Space",
      floor: "Floor",
      minimumStay: "Minimum stay",
      occupancy: "Occupancy",
      bathroom: "Bathroom",
      kitchen: "Kitchen",
      furnished: "Furnished",
      bedSize: "Bed size",
      elevator: "Elevator",
      parking: "Parking",
      pets: "Pets",
      smoking: "Smoking",
      keyDeposit: "Deposit",
      utilities: "Utilities",
    },
    roomUnitTitle: "Room / unit for this listing",
    roomUnitSubtitle: "1 bedroom",
    roomFullDetails: "View full room details",
    roomCta: "Inquire about this room",
    roomDateCta: "Select dates",
    roomAvailabilityBadge: "Availability to confirm",
    photosCountLabel: "photos",
    roomAttributes: {
      bedroom: "Bedroom",
      bathroom: "Bathroom",
      kitchen: "Kitchen",
      livingRoom: "Living room",
    },
    amenityGroups: {
      building: "Building facilities",
      shared: "Shared amenities",
      rules: "House rules",
      buildingMore: "View more building facilities",
      sharedMore: "View more amenities",
    },
    amenityItems: {
      parking: "Parking",
      cctv: "Building CCTV",
      fireExtinguisher: "Fire extinguisher",
      doorLock: "Common entrance door lock",
      wifi: "Wi-Fi",
      heating: "Heating",
      airConditioning: "Air conditioning",
      balcony: "Balcony",
    },
    reviews: {
      ratingComing: "Rating coming soon",
      emptyTitle: "No reviews yet.",
      emptyBody: "Resident reviews will be available in a later release.",
    },
    host: {
      name: "MapleHouse registered landlord",
      contactStatus: "Contact to confirm",
      listingStatus: "Listing details in progress",
      description: "Landlord details will be further organized during the inquiry and confirmation process.",
      cta: "Contact host",
    },
    datePicker: {
      title: "Select move-in dates",
      previousMonth: "Previous month",
      nextMonth: "Next month",
      weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      unavailableLabel: "Unavailable dates",
      reset: "Reset",
      apply: "Apply",
    },
    mapPlaceholderTitle: "Map preview",
    mapPlaceholderBody: "No real map API is connected. Please confirm the exact address and travel time during the inquiry stage.",
    faq: [
      {
        question: "When can I see the exact address?",
        answer: "Exact address and access details are shared during the inquiry and confirmation stage.",
      },
      {
        question: "Are deposit and utilities final?",
        answer: "Some conditions still need confirmation before the final agreement.",
      },
      {
        question: "Do the photos exactly match the real space?",
        answer: "MapleHouse helps organize listing info, but the actual space should still be re-confirmed during inquiry.",
      },
    ],
    checklist: [
      "Confirm what is included in the monthly rent.",
      "Confirm the available move-in date.",
      "Confirm the exact location and travel time.",
      "Confirm deposit, refund, and cancellation conditions.",
      "Confirm whether the photos match the actual space.",
    ],
    supportBody:
      "MapleHouse helps organize listing information and pre-inquiry checks. Final agreement, payment, and move-in decisions must be confirmed by the parties involved.",
    inquire: "Inquire about this listing",
    inquirySeparateGuide: "Inquiry and reservation support will be guided separately.",
    modal: {
      title: "How would you like to inquire?",
      subtitle: "This is an MVP preview. No real message, payment, or request is submitted yet.",
      directTitle: "Contact landlord directly",
      supportTitle: "Ask with MapleHouse support",
      directMessage: "Direct landlord messaging will be connected in a later step. This is an MVP preview.",
    },
  },
  fr: {
    backToListings: "Retour aux logements",
    emptyDraftTitle: "Aucun brouillon d’annonce à afficher.",
    emptyDraftBody:
      "Créez un premier brouillon depuis l’inscription propriétaire pour prévisualiser la page publique.",
    goListings: "Voir les annonces",
    unavailableTitle: "Annonce introuvable.",
    unavailableBody: "Veuillez choisir de nouveau une annonce depuis la liste.",
    photoEmpty: "Aucune photo téléversée.",
    viewAllPhotos: "Voir toutes les photos",
    currencyLabel: "Devise",
    approximate: "Emplacement approximatif",
    addressAfterInquiry: "Adresse détaillée disponible après demande",
    addressNotice:
      "L’adresse exacte et les informations d’accès sont fournies pendant l’étape de demande et de confirmation.",
    fallback: "À confirmer",
    detailFallback: "Non encore ajouté par le propriétaire",
    costFallback:
      "Les services et conditions de dépôt doivent être confirmés avant la demande.",
    rulesFallback: "Les règles de la maison n’ont pas encore été ajoutées.",
    infoStatusDefault: "Détails à confirmer",
    infoStatusPartial: "Certains détails ajoutés",
    heroFields: {
      monthlyRent: "Loyer mensuel",
      availableFrom: "Disponible à partir du",
      housingType: "Type de logement",
      livingCondition: "Condition de cohabitation",
      photos: "Photos",
      infoStatus: "État des informations",
    },
    sections: {
      overview: "Informations principales",
      roomInfo: "Choix de la chambre",
      amenities: "Équipements",
      location: "Emplacement et secteur",
      housing: "Détails du logement",
      costs: "Coûts et services",
      rules: "Règles de la maison",
      reviews: "Avis",
      host: "Profil de l’hôte",
      faq: "FAQ",
      beforeInquiry: "Avant de faire une demande",
      support: "Accompagnement MapleHouse",
    },
    tabs: {
      overview: "Présentation",
      roomInfo: "Chambres",
      amenities: "Équipements",
      location: "Emplacement",
      rules: "Règlement",
      reviews: "Avis",
      host: "Hôte",
      faq: "FAQ",
      beforeInquiry: "Avant demande",
    },
    intro: {
      ratingLine: "Note à venir · 0 avis",
      description:
        "Cette annonce aide les personnes à comparer un logement avant leur arrivée au Canada. L’adresse, la disponibilité, les charges, le dépôt et les règles seront reconfirmés lors de la demande.",
      readMore: "Voir plus",
      readLess: "Réduire",
      shareLabel: "Partager",
      favoriteLabel: "Enregistrer",
    },
    fields: {
      city: "Ville",
      area: "Secteur",
      nearestStation: "Station proche",
      approximateLocation: "Emplacement affiché",
      address: "Adresse",
      unitDetail: "Espace",
      floor: "Étage",
      minimumStay: "Séjour minimum",
      occupancy: "Occupation",
      bathroom: "Salle de bain",
      kitchen: "Cuisine",
      furnished: "Meublé",
      bedSize: "Taille du lit",
      elevator: "Ascenseur",
      parking: "Stationnement",
      pets: "Animaux",
      smoking: "Tabac",
      keyDeposit: "Dépôt",
      utilities: "Services",
    },
    roomUnitTitle: "Chambre / unité de cette annonce",
    roomUnitSubtitle: "1 chambre",
    roomFullDetails: "Voir les détails de la chambre",
    roomCta: "Demander cette chambre",
    roomDateCta: "Choisir les dates",
    roomAvailabilityBadge: "Disponibilité à confirmer",
    photosCountLabel: "photos",
    roomAttributes: {
      bedroom: "Chambre",
      bathroom: "Salle de bain",
      kitchen: "Cuisine",
      livingRoom: "Salon",
    },
    amenityGroups: {
      building: "Installations du bâtiment",
      shared: "Équipements partagés",
      rules: "Règlement",
      buildingMore: "Voir plus d’installations",
      sharedMore: "Voir plus d’équipements",
    },
    amenityItems: {
      parking: "Stationnement",
      cctv: "CCTV du bâtiment",
      fireExtinguisher: "Extincteur",
      doorLock: "Serrure de l’entrée commune",
      wifi: "Wi-Fi",
      heating: "Chauffage",
      airConditioning: "Climatisation",
      balcony: "Balcon",
    },
    reviews: {
      ratingComing: "Note à venir",
      emptyTitle: "Aucun avis pour le moment.",
      emptyBody: "Les avis des résidents seront disponibles dans une prochaine version.",
    },
    host: {
      name: "Propriétaire inscrit sur MapleHouse",
      contactStatus: "Contact à confirmer",
      listingStatus: "Détails de l’annonce en cours",
      description: "Les informations du propriétaire seront précisées pendant la demande et la vérification.",
      cta: "Contacter l’hôte",
    },
    datePicker: {
      title: "Choisir les dates d’arrivée",
      previousMonth: "Mois précédent",
      nextMonth: "Mois suivant",
      weekdays: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      unavailableLabel: "Dates indisponibles",
      reset: "Réinitialiser",
      apply: "Appliquer",
    },
    mapPlaceholderTitle: "Aperçu de la carte",
    mapPlaceholderBody: "Aucune API de carte réelle n’est connectée. Confirmez l’adresse exacte et le temps de trajet pendant l’étape de demande.",
    faq: [
      {
        question: "Quand puis-je voir l’adresse exacte ?",
        answer: "L’adresse exacte et les informations d’accès sont partagées pendant l’étape de demande et de confirmation.",
      },
      {
        question: "Le dépôt et les charges sont-ils définitifs ?",
        answer: "Certaines conditions doivent encore être confirmées avant l’accord final.",
      },
      {
        question: "Les photos correspondent-elles exactement au logement réel ?",
        answer: "MapleHouse aide à organiser les informations, mais l’espace réel doit être reconfirmé lors de la demande.",
      },
    ],
    checklist: [
      "Confirmez ce qui est inclus dans le loyer mensuel.",
      "Confirmez la date d’arrivée possible.",
      "Confirmez l’emplacement exact et le temps de trajet.",
      "Confirmez les conditions de dépôt, de remboursement et d’annulation.",
      "Confirmez si les photos correspondent au logement réel.",
    ],
    supportBody:
      "MapleHouse aide à organiser les informations de l’annonce et les vérifications avant demande. L’accord final, le paiement et l’entrée dans le logement doivent être confirmés par les parties concernées.",
    inquire: "Faire une demande pour cette annonce",
    inquirySeparateGuide: "L’accompagnement de demande et de réservation sera présenté séparément.",
    modal: {
      title: "Comment souhaitez-vous faire une demande ?",
      subtitle: "Ceci est un aperçu MVP. Aucun message réel, paiement ou demande n’est envoyé.",
      directTitle: "Contacter directement le propriétaire",
      supportTitle: "Demander avec l’aide de MapleHouse",
      directMessage:
        "La messagerie directe avec le propriétaire sera connectée plus tard. Ceci est un aperçu MVP.",
    },
  },
};

export function LocaleListingDetailPage({
  locale,
  listingId,
}: {
  locale: Locale;
  listingId?: string;
}) {
  const copy = DETAIL_COPY[locale];
  const [draft, setDraft] = useState<LandlordCenterDraft | null>(null);
  const [detailDraft, setDetailDraft] = useState<LandlordListingDetailsDraft | null>(null);
  const [loaded, setLoaded] = useState(listingId !== "draft");
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [directPreview, setDirectPreview] = useState(false);
  const [currency, setCurrency] = useState<CurrencyMode>("CAD");
  const [introExpanded, setIntroExpanded] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    if (listingId !== "draft") return;
    setDraft(readSessionJson<LandlordCenterDraft>(LANDLORD_CENTER_DRAFT_KEY));
    setDetailDraft(readSessionJson<LandlordListingDetailsDraft>(LANDLORD_LISTING_DETAILS_DRAFT_KEY));
    setLoaded(true);
  }, [listingId]);

  const listing = useMemo(() => {
    if (listingId === "draft") {
      if (!loaded || !draftHasData(draft)) return null;
      return buildDraftPublicListing(locale, copy, draft, detailDraft);
    }

    const mockListing = MOCK_LISTINGS.find((item) => item.id === listingId);
    return mockListing ? buildMockPublicListing(locale, copy, mockListing) : null;
  }, [copy, detailDraft, draft, listingId, loaded, locale]);

  if (listingId === "draft" && loaded && !draftHasData(draft)) {
    return (
      <EmptyPublicListing
        copy={copy}
        locale={locale}
        title={copy.emptyDraftTitle}
        body={copy.emptyDraftBody}
      />
    );
  }

  if (loaded && !listing) {
    return (
      <EmptyPublicListing
        copy={copy}
        locale={locale}
        title={copy.unavailableTitle}
        body={copy.unavailableBody}
      />
    );
  }

  if (!listing) {
    return (
      <main className="min-h-screen bg-[#F6F7F9] py-10">
        <Container>
          <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
            <p className="text-sm font-bold text-muted-foreground">{copy.fallback}</p>
          </div>
        </Container>
      </main>
    );
  }

  const priceDisplay = formatMonthlyPrice(listing.rentValue, locale, currency, copy.fallback);

  const locationRows: InfoRow[] = [
    [copy.fields.city, listing.city],
    [copy.fields.area, listing.area],
    [copy.fields.nearestStation, listing.nearestStation],
    [copy.fields.approximateLocation, getApproximateLocation(copy, listing)],
    [copy.fields.address, listing.addressHidden ? copy.addressAfterInquiry : copy.fallback],
  ];

  const roomAttributeRows = [
    {
      label: copy.roomAttributes.bedroom,
      value: listing.details.unitDetail || listing.housingType,
      icon: <BedDouble className="h-4 w-4" aria-hidden />,
    },
    {
      label: copy.roomAttributes.bathroom,
      value: listing.details.bathroom,
      icon: <Bath className="h-4 w-4" aria-hidden />,
    },
    {
      label: copy.roomAttributes.kitchen,
      value: listing.details.kitchen,
      icon: <Utensils className="h-4 w-4" aria-hidden />,
    },
    {
      label: copy.roomAttributes.livingRoom,
      value: listing.livingCondition,
      icon: <Sofa className="h-4 w-4" aria-hidden />,
    },
  ];
  const roomMetaRows = [
    formatMaxOccupancy(listing.details.occupancy, locale),
    formatFloorValue(listing.details.floor, locale),
    display(listing.details.bedSize, ""),
  ].filter(Boolean);
  const amenityGroups = [
    {
      title: copy.amenityGroups.building,
      moreLabel: copy.amenityGroups.buildingMore,
      items: [
        [copy.amenityItems.parking, listing.details.parking],
        [copy.amenityItems.cctv, ""],
        [copy.amenityItems.fireExtinguisher, ""],
        [copy.amenityItems.doorLock, ""],
      ] as Array<[string, string]>,
    },
    {
      title: copy.amenityGroups.shared,
      moreLabel: copy.amenityGroups.sharedMore,
      items: [
        [copy.amenityItems.wifi, ""],
        [copy.amenityItems.heating, ""],
        [copy.amenityItems.airConditioning, ""],
        [copy.amenityItems.balcony, ""],
        [copy.fields.kitchen, listing.details.kitchen],
        [copy.fields.bathroom, listing.details.bathroom],
      ] as Array<[string, string]>,
    },
    {
      title: copy.amenityGroups.rules,
      items: [
        [copy.heroFields.livingCondition, listing.livingCondition],
        [copy.fields.pets, listing.details.pets],
        [copy.fields.smoking, listing.details.smoking],
      ] as Array<[string, string]>,
    },
  ];
  const tabItems = [
    { id: "overview", label: copy.tabs.overview },
    { id: "room-info", label: copy.tabs.roomInfo },
    { id: "amenities", label: copy.tabs.amenities },
    { id: "location", label: copy.tabs.location },
    { id: "rules", label: copy.tabs.rules },
    { id: "reviews", label: copy.tabs.reviews },
    { id: "host", label: copy.tabs.host },
    { id: "faq", label: copy.tabs.faq },
    { id: "before-inquiry", label: copy.tabs.beforeInquiry },
  ];
  return (
    <main className="min-h-screen bg-[#F6F7F9] py-6 sm:py-8">
      <Container className="max-w-7xl">
        <Link
          to={`/${locale}/listings`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
        >
          <ArrowRight className="h-4 w-4 rotate-180" aria-hidden />
          {copy.backToListings}
        </Link>

        <div className="mt-5">
          <PhotoGallery listing={listing} copy={copy} />
        </div>

        <SectionTabs items={tabItems} />

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          <div className="space-y-5">
            <ListingIntroSection
              copy={copy}
              listing={listing}
              expanded={introExpanded}
              onToggle={() => setIntroExpanded((current) => !current)}
            />

            <DetailSection id="room-info" title={copy.sections.roomInfo}>
              <RoomInfoCard
                copy={copy}
                locale={locale}
                listing={listing}
                rows={roomAttributeRows}
                metaRows={roomMetaRows}
                priceDisplay={priceDisplay}
                onOpenDatePicker={() => setDatePickerOpen(true)}
                onInquire={() => {
                  setInquiryOpen(true);
                  setDirectPreview(false);
                }}
              />
            </DetailSection>

            <DetailSection id="amenities" title={copy.sections.amenities}>
              <AmenityGroups groups={amenityGroups} fallback={copy.fallback} />
            </DetailSection>

            <DetailSection id="location" title={copy.sections.location}>
              <InfoGrid rows={locationRows} fallback={copy.fallback} />
              <MapPlaceholder copy={copy} />
              <p className="mt-4 rounded-2xl border border-primary/15 bg-[#FFFDF9] px-4 py-3 text-sm leading-6 text-muted-foreground">
                {copy.addressNotice}
              </p>
            </DetailSection>

            <DetailSection title={copy.sections.costs}>
              <InfoGrid
                rows={[
                  { label: copy.heroFields.monthlyRent, value: priceDisplay.primary, secondary: priceDisplay.secondary },
                  [copy.fields.keyDeposit, listing.keyDeposit],
                  [copy.fields.utilities, listing.utilities.join(", ")],
                ]}
                fallback={copy.fallback}
              />
              {!listing.keyDeposit && !listing.utilities.length ? (
                <p className="mt-4 rounded-2xl border border-border bg-[#FAFAFA] px-4 py-3 text-sm leading-6 text-muted-foreground">
                  {copy.costFallback}
                </p>
              ) : null}
            </DetailSection>

            <DetailSection id="rules" title={copy.sections.rules}>
              <HouseRulesCard copy={copy} listing={listing} />
            </DetailSection>

            <DetailSection id="reviews" title={copy.sections.reviews}>
              <ReviewEmptyState copy={copy} />
            </DetailSection>

            <DetailSection id="host" title={copy.sections.host}>
              <HostProfileCard
                copy={copy}
                onInquire={() => {
                  setInquiryOpen(true);
                  setDirectPreview(false);
                }}
              />
            </DetailSection>

            <DetailSection id="faq" title={copy.sections.faq}>
              <FaqList items={copy.faq} />
            </DetailSection>

            <DetailSection id="before-inquiry" title={copy.sections.beforeInquiry}>
              <ul className="space-y-2">
                {copy.checklist.map((item) => (
                  <li key={item} className="flex min-w-0 gap-2 text-sm leading-6 text-muted-foreground">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span className="min-w-0 [overflow-wrap:break-word]">{item}</span>
                  </li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection title={copy.sections.support}>
              <div className="flex gap-3 rounded-2xl border border-primary/15 bg-[#FFFDF9] p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <p className="text-sm leading-7 text-muted-foreground">{copy.supportBody}</p>
              </div>
            </DetailSection>
          </div>

          <aside className="xl:sticky xl:top-6">
            <section className="rounded-3xl border border-primary/20 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    MapleHouse
                  </p>
                  <h2 className="mt-3 break-words text-2xl font-bold text-foreground">{priceDisplay.primary}</h2>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">{priceDisplay.secondary}</p>
                </div>
                <CurrencySwitch
                  label={copy.currencyLabel}
                  value={currency}
                  onChange={setCurrency}
                />
              </div>
              <dl className="mt-5 space-y-3 text-sm">
                <SummaryRow icon={<CalendarDays className="h-4 w-4" />} label={copy.heroFields.availableFrom} value={listing.availableFrom} fallback={copy.fallback} />
                <SummaryRow icon={<Home className="h-4 w-4" />} label={copy.heroFields.housingType} value={listing.housingType} fallback={copy.fallback} />
                <SummaryRow icon={<MapPin className="h-4 w-4" />} label={copy.fields.nearestStation} value={listing.nearestStation} fallback={copy.fallback} />
              </dl>
              <Button
                type="button"
                className="mt-6 min-h-12 w-full whitespace-normal rounded-2xl text-sm font-semibold leading-tight"
                onClick={() => {
                  setInquiryOpen(true);
                  setDirectPreview(false);
                }}
              >
                {copy.inquire}
              </Button>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                {copy.inquirySeparateGuide}
              </p>
            </section>
          </aside>
        </div>
      </Container>

      {inquiryOpen ? (
        <PublicInquiryModal
          copy={copy}
          locale={locale}
          listing={listing}
          directPreview={directPreview}
          onDirectPreview={() => setDirectPreview(true)}
          onClose={() => {
            setInquiryOpen(false);
            setDirectPreview(false);
          }}
        />
      ) : null}
      {datePickerOpen ? (
        <DatePickerModal
          copy={copy}
          locale={locale}
          onClose={() => setDatePickerOpen(false)}
        />
      ) : null}
    </main>
  );
}

function EmptyPublicListing({
  copy,
  locale,
  title,
  body,
}: {
  copy: DetailCopy;
  locale: Locale;
  title: string;
  body: string;
}) {
  return (
    <main className="min-h-screen bg-[#F6F7F9] py-10">
      <Container>
        <section className="mx-auto max-w-2xl rounded-3xl border border-border bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF3E8] text-primary">
            <Home className="h-7 w-7" aria-hidden />
          </div>
          <h1 className="mt-5 break-words text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p>
          <Link
            to={`/${locale}/listings`}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            {copy.goListings}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      </Container>
    </main>
  );
}

function ListingIntroSection({
  copy,
  listing,
  expanded,
  onToggle,
}: {
  copy: DetailCopy;
  listing: PublicListing;
  expanded: boolean;
  onToggle: () => void;
}) {
  const tags = buildIntroTags(copy, listing);

  return (
    <section id="overview" className="min-w-0 scroll-mt-28 rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="max-w-4xl break-words text-3xl font-bold leading-tight text-foreground sm:text-[2.35rem]">
            {listing.title}
          </h1>
          <p className="mt-3 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-muted-foreground">
            <Star className="h-4 w-4 fill-primary text-primary" aria-hidden />
            <span>{copy.intro.ratingLine}</span>
            <span>·</span>
            <MapPin className="h-4 w-4 text-primary" aria-hidden />
            <span className="min-w-0 [overflow-wrap:break-word]">{display(listing.area, copy.fallback)}</span>
            <span>·</span>
            <span className="min-w-0 [overflow-wrap:break-word]">{display(listing.nearestStation, copy.fallback)}</span>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            aria-label={copy.intro.shareLabel}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          >
            <Share2 className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label={copy.intro.favoriteLabel}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          >
            <Heart className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="max-w-full rounded-full border border-border bg-[#F8FAFC] px-3 py-1 text-xs font-medium leading-tight text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 max-w-3xl">
        <p
          className={cn(
            "text-sm leading-7 text-muted-foreground [overflow-wrap:break-word]",
            expanded ? "" : "line-clamp-3",
          )}
        >
          {copy.intro.description}
        </p>
        <button
          type="button"
          onClick={onToggle}
          className="mt-2 text-sm font-semibold text-primary transition hover:text-primary/80"
        >
          {expanded ? copy.intro.readLess : copy.intro.readMore}
        </button>
      </div>

      {!listing.detailAdded ? (
        <p className="mt-5 rounded-2xl border border-primary/15 bg-[#FFFDF9] px-4 py-3 text-sm font-medium leading-6 text-foreground">
          {copy.detailFallback}
        </p>
      ) : null}
    </section>
  );
}

function CurrencySwitch({
  label,
  value,
  onChange,
}: {
  label: string;
  value: CurrencyMode;
  onChange: (value: CurrencyMode) => void;
}) {
  const nextValue = value === "CAD" ? "KRW" : "CAD";
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => onChange(nextValue)}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-primary/20 bg-[#FFF8F1] px-3 text-xs font-semibold text-primary transition hover:border-primary hover:bg-[#FFF3E8]"
    >
      <span>{value}</span>
      <ArrowUpDown className="h-3.5 w-3.5" aria-hidden />
      <span>{nextValue}</span>
    </button>
  );
}

function SectionTabs({ items }: { items: Array<{ id: string; label: string }> }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    animateScrollTo(target, id);
  };

  return (
    <nav className="mt-4 overflow-x-auto rounded-2xl border border-border bg-white px-2 shadow-sm" aria-label="Listing sections">
      <div className="flex min-w-max items-center gap-1">
        {items.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(event) => handleClick(event, item.id)}
            className={cn(
              "inline-flex h-12 items-center justify-center whitespace-nowrap border-b-2 px-4 text-sm font-semibold transition hover:text-primary",
              index === 0
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground",
            )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function PhotoGallery({ listing, copy }: { listing: PublicListing; copy: DetailCopy }) {
  const photoSlots = [0, 1, 2, 3, 4].map((index) => listing.photos[index]);
  const [allPhotosOpen, setAllPhotosOpen] = useState(false);

  useEffect(() => {
    if (!allPhotosOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAllPhotosOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allPhotosOpen]);

  return (
    <>
      <section className="relative overflow-hidden rounded-[1.75rem] border border-border bg-white p-2 shadow-sm sm:p-3">
        <div className="grid gap-2 lg:h-[370px] lg:grid-cols-[minmax(0,1.18fr)_minmax(0,1fr)]">
          <PhotoTile photo={photoSlots[0]} copy={copy} className="aspect-[16/10] lg:h-full lg:aspect-auto" large />
          <div className="grid grid-cols-2 gap-2 lg:grid-rows-2">
            {photoSlots.slice(1).map((photo, index) => (
              <PhotoTile
                key={photo?.id ?? `placeholder-${index}`}
                photo={photo}
                copy={copy}
                className="aspect-[4/3] lg:h-full lg:aspect-auto"
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setAllPhotosOpen(true)}
          className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full border border-border bg-white/95 px-4 py-2 text-xs font-semibold text-foreground shadow-sm backdrop-blur transition hover:border-primary hover:text-primary"
        >
          <Camera className="h-4 w-4" aria-hidden />
          {copy.viewAllPhotos}
        </button>
      </section>

      {allPhotosOpen ? (
        <AllPhotosModal
          photos={listing.photos}
          copy={copy}
          onClose={() => setAllPhotosOpen(false)}
        />
      ) : null}
    </>
  );
}

function AllPhotosModal({
  photos,
  copy,
  onClose,
}: {
  photos: PublicPhoto[];
  copy: DetailCopy;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={copy.viewAllPhotos}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div className="max-h-[88vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-foreground">{copy.viewAllPhotos}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {photos.length} {copy.photosCountLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition hover:border-primary hover:text-primary"
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="max-h-[calc(88vh-4.25rem)] overflow-y-auto p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <figure
                key={photo.id}
                className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
              >
                <ListingImageFrame
                  src={photo.src}
                  alt={photo.label}
                  fit="contain"
                  className="aspect-[4/3] bg-[#F7F8FA]"
                  fallback={
                    <div className="flex h-full w-full items-center justify-center text-sm font-bold text-muted-foreground">
                      {copy.photoEmpty}
                    </div>
                  }
                />
                <figcaption className="border-t border-border bg-white px-3 py-2 text-xs font-bold text-muted-foreground">
                  {getPhotoFilename(photo.src ?? "")}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getPhotoFilename(src: string) {
  return src.split("/").filter(Boolean).pop() ?? src;
}

function PhotoTile({
  photo,
  copy,
  className,
  large = false,
}: {
  photo?: PublicPhoto;
  copy: DetailCopy;
  className?: string;
  large?: boolean;
}) {
  return (
    <ListingImageFrame
      src={photo?.src}
      alt={photo?.label ?? ""}
      fit="contain"
      className={cn(
        "flex min-h-36 min-w-0 items-center justify-center rounded-2xl border border-border bg-[#F7F8FA]",
        className,
      )}
      fallback={
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-3 text-center text-muted-foreground">
          <Camera className={cn("text-primary", large ? "h-10 w-10" : "h-6 w-6")} aria-hidden />
          {large ? <p className="text-sm font-bold">{copy.photoEmpty}</p> : null}
        </div>
      }
    >
    </ListingImageFrame>
  );
}

function DetailSection({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="min-w-0 scroll-mt-28 rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <h2 className="break-words text-lg font-bold text-foreground">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function RoomInfoCard({
  copy,
  locale,
  listing,
  rows,
  metaRows,
  priceDisplay,
  onOpenDatePicker,
  onInquire,
}: {
  copy: DetailCopy;
  locale: Locale;
  listing: PublicListing;
  rows: Array<{ label: string; value: string; icon: ReactNode }>;
  metaRows: string[];
  priceDisplay: { primary: string; secondary: string };
  onOpenDatePicker: () => void;
  onInquire: () => void;
}) {
  return (
    <article className="rounded-[1.75rem] border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            {copy.roomUnitTitle}
          </p>
          <h3 className="mt-2 break-words text-xl font-bold leading-tight text-foreground">
            {display(listing.housingType, copy.fallback)}
          </h3>
        </div>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(240px,0.42fr)_minmax(0,0.58fr)]">
        <ListingImageFrame
          src={listing.photos[0]?.src}
          alt=""
          fit="contain"
          className="flex aspect-square min-h-0 items-center justify-center rounded-3xl bg-[#F8FAFC]"
          fallback={
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Camera className="h-8 w-8 text-primary" aria-hidden />
              <span className="text-xs font-medium">{copy.photoEmpty}</span>
            </div>
          }
        >
          <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
            {copy.roomAvailabilityBadge}
          </span>
          {listing.photoCount > 0 ? (
            <span className="absolute bottom-3 right-3 rounded-full bg-foreground/75 px-2.5 py-1 text-xs font-semibold text-white">
              {formatPhotoCount(listing.photoCount, copy, locale)}
            </span>
          ) : null}
        </ListingImageFrame>

        <div className="flex min-w-0 flex-col">
          <dl className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
            {rows.map(({ label, value, icon }) => (
              <div key={label} className="flex min-w-0 items-start gap-3 text-sm">
                <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
                <div className="min-w-0">
                  <dt className="text-xs font-medium leading-snug text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-0.5 break-words font-semibold text-foreground">
                    {display(value, copy.fallback)}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-4 border-t border-border pt-4">
            {metaRows.length ? (
              <div className="flex flex-wrap gap-2">
                {metaRows.map((value) => (
                  <span
                    key={value}
                    className="max-w-full rounded-full border border-border bg-[#F8FAFC] px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {value}
                  </span>
                ))}
              </div>
            ) : null}
            <a
              href="#room-info"
              className="mt-3 inline-flex text-sm font-semibold text-primary transition hover:text-primary/80"
            >
              {copy.roomFullDetails}
            </a>
          </div>

          <div className="mt-5">
            <p className="break-words text-2xl font-bold text-foreground">{priceDisplay.primary}</p>
            <p className="mt-1 text-sm font-medium text-muted-foreground">{priceDisplay.secondary}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <button
          type="button"
          onClick={onOpenDatePicker}
          className="flex min-h-12 min-w-0 items-center justify-between gap-3 rounded-2xl border border-border bg-[#F8FAFC] px-4 text-left text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-white"
        >
          <span className="min-w-0 truncate">{copy.roomDateCta}</span>
          <CalendarDays className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        </button>
        <Button
          type="button"
          className="min-h-12 whitespace-normal rounded-2xl px-6 text-sm font-semibold leading-tight sm:shrink-0"
          onClick={onInquire}
        >
          {copy.roomCta}
        </Button>
      </div>
    </article>
  );
}

function AmenityGroups({
  groups,
  fallback,
}: {
  groups: Array<{ title: string; moreLabel?: string; items: Array<[string, string]> }>;
  fallback: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-white">
      {groups.map((group, index) => (
        <section
          key={group.title}
          className={cn("p-4 sm:p-5", index > 0 ? "border-t border-border" : "")}
        >
          <div className="flex min-w-0 items-center justify-between gap-3">
            <h3 className="break-words text-sm font-semibold text-foreground">{group.title}</h3>
            {group.moreLabel ? (
              <button
                type="button"
                className="shrink-0 whitespace-nowrap text-xs font-semibold text-primary transition hover:text-primary/80"
              >
                {group.moreLabel}
              </button>
            ) : null}
          </div>
          <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {group.items.map(([label, value]) => (
              <div key={`${group.title}-${label}`} className="flex min-w-0 items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-foreground/70" aria-hidden />
                <div className="min-w-0">
                  <dt className="break-words font-medium text-foreground">{label}</dt>
                  <dd className="mt-0.5 break-words text-xs leading-5 text-muted-foreground">
                    {display(value, fallback)}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

function HouseRulesCard({ copy, listing }: { copy: DetailCopy; listing: PublicListing }) {
  const ruleRows = listing.houseRules.length
    ? listing.houseRules.map((rule) => [rule, ""] as [string, string])
    : ([
        [copy.heroFields.livingCondition, listing.livingCondition],
        [copy.fields.pets, listing.details.pets],
        [copy.fields.smoking, listing.details.smoking],
      ] as Array<[string, string]>);

  return (
    <div className="rounded-3xl border border-border bg-white p-4 sm:p-5">
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {ruleRows.map(([label, value]) => (
          <div key={`${label}-${value}`} className="flex min-w-0 items-start gap-3 text-sm">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-foreground/70" aria-hidden />
            <div className="min-w-0">
              <dt className="break-words font-medium text-foreground">{label}</dt>
              {value ? (
                <dd className="mt-0.5 break-words text-xs leading-5 text-muted-foreground">
                  {display(value, copy.fallback)}
                </dd>
              ) : null}
            </div>
          </div>
        ))}
      </dl>
      {!listing.houseRules.length ? (
        <p className="mt-4 rounded-2xl bg-[#F8FAFC] px-4 py-3 text-sm leading-6 text-muted-foreground">
          {copy.rulesFallback}
        </p>
      ) : null}
    </div>
  );
}

function ReviewEmptyState({ copy }: { copy: DetailCopy }) {
  return (
    <div className="rounded-3xl border border-border bg-white p-5">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-[#F8FAFC] px-3 py-1 text-xs font-semibold text-muted-foreground">
        <Star className="h-3.5 w-3.5 text-primary" aria-hidden />
        {copy.reviews.ratingComing}
      </div>
      <p className="mt-4 text-sm font-semibold text-foreground">{copy.reviews.emptyTitle}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.reviews.emptyBody}</p>
    </div>
  );
}

function HostProfileCard({ copy, onInquire }: { copy: DetailCopy; onInquire: () => void }) {
  return (
    <div className="rounded-3xl border border-border bg-white p-5">
      <div className="flex min-w-0 gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF8F1] text-primary">
          <UserRound className="h-6 w-6" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="break-words text-base font-semibold text-foreground">{copy.host.name}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {[copy.host.contactStatus, copy.host.listingStatus].map((status) => (
              <span
                key={status}
                className="rounded-full border border-border bg-[#F8FAFC] px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {status}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">{copy.host.description}</p>
          <Button
            type="button"
            variant="outline"
            className="mt-4 min-h-10 rounded-2xl border-primary/30 px-4 text-sm font-semibold text-primary hover:bg-[#FFF8F1] hover:text-primary"
            onClick={onInquire}
          >
            {copy.host.cta}
          </Button>
        </div>
      </div>
    </div>
  );
}

function DatePickerModal({
  copy,
  locale,
  onClose,
}: {
  copy: DetailCopy;
  locale: Locale;
  onClose: () => void;
}) {
  const [baseMonth, setBaseMonth] = useState(() => new Date(2026, 7, 1));
  const months = [baseMonth, new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1, 1)];
  // TODO: Replace mock availability dates with real listing availability data later.
  const unavailableDates = new Set(["2026-08-09", "2026-08-15", "2026-08-28", "2026-09-04"]);
  const selectedDates = new Set(["2026-08-18", "2026-08-19", "2026-08-20", "2026-08-21", "2026-08-22"]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/35 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="date-picker-title"
        className="w-full max-w-3xl rounded-3xl border border-border bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex min-w-0 items-start justify-between gap-4">
          <h2 id="date-picker-title" className="break-words text-xl font-bold text-foreground">
            {copy.datePicker.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setBaseMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary"
            aria-label={copy.datePicker.previousMonth}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <div className="h-px flex-1" />
          <button
            type="button"
            onClick={() => setBaseMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary"
            aria-label={copy.datePicker.nextMonth}
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {months.map((month) => (
            <CalendarMonth
              key={`${month.getFullYear()}-${month.getMonth()}`}
              copy={copy}
              locale={locale}
              month={month}
              unavailableDates={unavailableDates}
              selectedDates={selectedDates}
            />
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" aria-hidden />
            {copy.datePicker.unavailableLabel}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="rounded-2xl" onClick={() => undefined}>
              {copy.datePicker.reset}
            </Button>
            <Button
              type="button"
              className="rounded-2xl bg-[#F4A460] text-white hover:bg-[#EE9348]"
              onClick={onClose}
            >
              {copy.datePicker.apply}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function CalendarMonth({
  copy,
  locale,
  month,
  unavailableDates,
  selectedDates,
}: {
  copy: DetailCopy;
  locale: Locale;
  month: Date;
  unavailableDates: Set<string>;
  selectedDates: Set<string>;
}) {
  const days = buildCalendarDays(month);

  return (
    <div className="min-w-0 rounded-3xl border border-border bg-white p-4">
      <h3 className="text-center text-sm font-semibold text-foreground">
        {formatMonthLabel(month, locale)}
      </h3>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
        {copy.datePicker.weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} className="h-9" />;
          const key = toDateKey(day);
          const unavailable = unavailableDates.has(key);
          const selected = selectedDates.has(key);
          return (
            <button
              key={key}
              type="button"
              disabled={unavailable}
              className={cn(
                "relative h-9 rounded-full text-sm font-medium transition",
                unavailable
                  ? "cursor-not-allowed bg-muted text-muted-foreground/45"
                  : selected
                    ? "bg-[#FFF3E6] text-[#FA7000] ring-1 ring-inset ring-[#FA7000]/45 hover:bg-[#FFE8CC]"
                    : "text-foreground hover:bg-[#FFF8F1]",
              )}
            >
              {day.getDate()}
              {unavailable ? (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-red-500" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MapPlaceholder({ copy }: { copy: DetailCopy }) {
  return (
    <div className="mt-4 flex min-h-56 items-center justify-center rounded-3xl border border-dashed border-primary/25 bg-[linear-gradient(135deg,#FFF8F1,#F8FAFC)] p-5 text-center">
      <div className="max-w-md">
        <MapPin className="mx-auto h-8 w-8 text-primary" aria-hidden />
        <p className="mt-3 text-sm font-semibold text-foreground">{copy.mapPlaceholderTitle}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.mapPlaceholderBody}</p>
      </div>
    </div>
  );
}

function FaqList({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <div className="divide-y divide-border rounded-3xl border border-border bg-[#FAFAFA]">
      {items.map((item) => (
        <div key={item.question} className="min-w-0 p-4 sm:p-5">
          <h3 className="break-words text-sm font-semibold text-foreground">{item.question}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground [overflow-wrap:break-word]">
            {item.answer}
          </p>
        </div>
      ))}
    </div>
  );
}

function InfoGrid({ rows, fallback }: { rows: InfoRow[]; fallback: string }) {
  const normalizedRows = rows.map((row) =>
    Array.isArray(row) ? { label: row[0], value: row[1] } : row,
  );

  return (
    <dl className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
      {normalizedRows.map(({ label, value, secondary }) => (
        <div key={label} className="min-w-0 rounded-2xl border border-border bg-[#FAFAFA] p-4">
          <dt className="text-xs font-medium leading-snug text-muted-foreground [overflow-wrap:break-word]">{label}</dt>
          <dd className="mt-1 min-h-5 break-words text-sm font-semibold text-foreground">
            {display(value, fallback)}
          </dd>
          {secondary ? (
            <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">
              {secondary}
            </p>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  fallback,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  fallback: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-border bg-[#FAFAFA] p-3">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs font-medium leading-snug text-muted-foreground [overflow-wrap:break-word]">{label}</dt>
        <dd className="mt-0.5 break-words font-semibold text-foreground">{display(value, fallback)}</dd>
      </div>
    </div>
  );
}

function PublicInquiryModal({
  copy,
  locale,
  listing,
  directPreview,
  onDirectPreview,
  onClose,
}: {
  copy: DetailCopy;
  locale: Locale;
  listing: PublicListing;
  directPreview: boolean;
  onDirectPreview: () => void;
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
        aria-labelledby="public-inquiry-title"
        className="w-full max-w-2xl rounded-3xl border border-border bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="public-inquiry-title" className="text-xl font-bold text-foreground">
              {copy.modal.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.modal.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onDirectPreview}
            className="min-w-0 rounded-2xl border border-border bg-white p-4 text-left shadow-sm transition hover:border-primary hover:bg-[#FFF8F1]"
          >
            <p className="break-words font-semibold text-foreground">{copy.modal.directTitle}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.modal.directMessage}</p>
          </button>
          <button
            type="button"
            onClick={() => openAssistedApply(locale, listing)}
            className="min-w-0 rounded-2xl border border-primary/25 bg-[#FFF8F1] p-4 text-left shadow-sm transition hover:border-primary"
          >
            <p className="break-words font-semibold text-primary">{copy.modal.supportTitle}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.inquirySeparateGuide}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              {copy.modal.supportTitle}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </button>
        </div>

        {directPreview ? (
          <p className="mt-4 rounded-2xl border border-primary/20 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold leading-6 text-foreground">
            {copy.modal.directMessage}
          </p>
        ) : null}
      </section>
    </div>
  );
}

function buildMockPublicListing(locale: Locale, copy: DetailCopy, listing: MockListing): PublicListing {
  const photos = getAllMockListingImages().map(
    (src, index) => ({
      id: `${listing.id}-mock-${index + 1}`,
      src,
      label: `${listing.title[locale]} ${index + 1}`,
    }),
  );

  return {
    id: listing.id,
    source: "mock",
    sourceListing: listing,
    title: listing.title[locale],
    city: "Toronto",
    area: listing.area,
    nearestStation: "",
    addressHidden: false,
    rentLabel: `C$${listing.priceCAD.toLocaleString("en-CA")}`,
    rentValue: listing.priceCAD,
    housingType: listing.roomType[locale],
    livingCondition: copy.fallback,
    availableFrom: copy.fallback,
    minimumStay: copy.fallback,
    photoCount: photos.length,
    photos,
    detailAdded: true,
    details: {
      unitDetail: "",
      floor: "",
      occupancy: String(listing.maxPeople),
      bathroom: "",
      kitchen: "",
      furnished: "",
      bedSize: "",
      elevator: "",
      parking: "",
      pets: "",
      smoking: "",
    },
    keyDeposit: "",
    utilities: [],
    houseRules: [],
    extraNotes: listing.checklist[locale],
  };
}

function buildDraftPublicListing(
  locale: Locale,
  copy: DetailCopy,
  draft: LandlordCenterDraft | null,
  detailDraft: LandlordListingDetailsDraft | null,
): PublicListing {
  const details = detailDraft ?? {};
  const photos = getDraftPhotos(draft);
  const rentValue = numberFromCurrency(draft?.monthlyRent);
  const utilities = Object.entries(details.utilityStatuses ?? {})
    .filter(([, status]) => status?.trim())
    .map(([utility, status]) => `${utility}: ${status}`);

  return {
    id: "draft",
    source: "draft",
    title: display(draft?.listingTitle, locale === "ko" ? "첫 매물 초안" : locale === "en" ? "Listing draft" : "Brouillon d’annonce"),
    city: draft?.city ?? "",
    area: details.area || draft?.area || "",
    nearestStation: details.nearestStation || draft?.nearestStation || "",
    addressHidden: Boolean(draft?.address?.trim()),
    rentLabel: rentValue > 0 ? `C$${rentValue.toLocaleString("en-CA")}` : "",
    rentValue,
    housingType: draft?.housingType ?? "",
    livingCondition: draft?.residentCondition ?? "",
    availableFrom: draft?.availableFrom ?? "",
    minimumStay: draft?.minimumStay ?? "",
    photoCount: photos.length,
    photos,
    detailAdded: detailDraftHasData(details),
    details: {
      unitDetail: details.unitDetail ?? "",
      floor: details.floor ?? "",
      occupancy: details.occupancy ?? "",
      bathroom: details.bathroom ?? "",
      kitchen: details.kitchen ?? "",
      furnished: buildFurnishedText(details, copy),
      bedSize: details.bedSize ?? "",
      elevator: details.elevator ?? "",
      parking: details.parking ?? "",
      pets: [details.tenantPetsAllowed, details.homePets, details.homePetType].filter(Boolean).join(" / "),
      smoking: details.smokingCondition ?? "",
    },
    keyDeposit: details.keyDepositAmount ?? "",
    utilities,
    houseRules: details.houseRuleItems ?? [],
    extraNotes: [details.additionalNote, details.moveInQuestions].filter((value): value is string => Boolean(value?.trim())),
  };
}

function buildFurnishedText(details: LandlordListingDetailsDraft, copy: DetailCopy) {
  const furniture = details.furniture?.filter(Boolean).join(", ");
  return [details.furnished, furniture].filter(Boolean).join(" / ") || copy.detailFallback;
}

function readSessionJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function draftHasData(draft: LandlordCenterDraft | null) {
  if (!draft) return false;
  return Boolean(
    draft.city ||
      draft.area ||
      draft.nearestStation ||
      draft.housingType ||
      draft.listingTitle ||
      draft.monthlyRent ||
      draft.photos?.length,
  );
}

function detailDraftHasData(details: LandlordListingDetailsDraft) {
  return Boolean(
    details.area?.trim() ||
      details.nearestStation?.trim() ||
      details.occupancy?.trim() ||
      details.bathroom?.trim() ||
      details.kitchen?.trim() ||
      details.furnished?.trim() ||
      details.bedSize?.trim() ||
      details.elevator?.trim() ||
      details.parking?.trim() ||
      details.tenantPetsAllowed?.trim() ||
      details.homePets?.trim() ||
      details.smokingCondition?.trim() ||
      details.keyDepositAmount?.trim() ||
      details.furniture?.length ||
      details.houseRuleItems?.length ||
      Object.values(details.utilityStatuses ?? {}).some((value) => value.trim()),
  );
}

function getDraftPhotos(draft: LandlordCenterDraft | null): PublicPhoto[] {
  const photos = draft?.photos?.filter((photo) => photo.dataUrl || photo.name) ?? [];
  if (!photos.length) {
    return getAllMockListingImages().map(
      (src, index) => ({
        id: `draft-mock-${index + 1}`,
        src,
        label: `mock listing photo ${index + 1}`,
      }),
    );
  }
  const coverIndex = photos.findIndex((photo) => photo.id && photo.id === draft?.coverPhotoId);
  const coverPhoto = coverIndex > -1 ? photos[coverIndex] : null;
  const ordered = coverPhoto
    ? [coverPhoto, ...photos.filter((_, index) => index !== coverIndex)]
    : photos;

  return ordered.map((photo, index) => ({
    id: photo.id || `${photo.name}-${index}`,
    src: photo.dataUrl,
    label: photo.name || `photo ${index + 1}`,
  }));
}

function getApproximateLocation(copy: DetailCopy, listing: PublicListing) {
  return [listing.area, listing.nearestStation].filter(Boolean).join(" · ") || copy.approximate;
}

function display(value: string | undefined | null, fallback: string) {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

function buildIntroTags(copy: DetailCopy, listing: PublicListing) {
  return [
    copy.roomUnitSubtitle,
    display(listing.housingType, ""),
    display(listing.livingCondition, ""),
    listing.detailAdded ? copy.infoStatusPartial : copy.infoStatusDefault,
  ].filter(Boolean);
}

function animateScrollTo(target: HTMLElement, hashId: string) {
  const startY = window.scrollY;
  const targetY = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 120);
  const distance = targetY - startY;
  const duration = 720;
  const startTime = window.performance.now();

  const easeInOutCubic = (time: number) =>
    time < 0.5 ? 4 * time * time * time : 1 - Math.pow(-2 * time + 2, 3) / 2;

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));

    if (progress < 1) {
      window.requestAnimationFrame(step);
      return;
    }

    window.history.replaceState(null, "", `#${hashId}`);
  };

  window.requestAnimationFrame(step);
}

function formatMonthlyPrice(
  amountCad: number,
  locale: Locale,
  currency: CurrencyMode,
  fallback: string,
) {
  if (!amountCad) {
    return { primary: fallback, secondary: "" };
  }

  const krwValue = amountCad * MOCK_CAD_TO_KRW;
  const cadEn = amountCad.toLocaleString("en-CA");
  const cadFr = amountCad.toLocaleString("fr-CA").replace(/\u00A0/g, " ");
  const krwKo = `₩${krwValue.toLocaleString("ko-KR")}`;
  const krwEn = `₩${krwValue.toLocaleString("en-US")}`;
  const krwFr = `${krwValue.toLocaleString("fr-FR").replace(/\u00A0/g, " ")} ₩`;

  if (locale === "ko") {
    return currency === "CAD"
      ? { primary: `${cadEn}$ / 월`, secondary: krwKo }
      : { primary: `${krwKo} / 월`, secondary: `CA$${cadEn}` };
  }

  if (locale === "fr") {
    return currency === "CAD"
      ? { primary: `${cadFr} $ CA / mois`, secondary: `env. ${krwFr}` }
      : { primary: `env. ${krwFr} / mois`, secondary: `${cadFr} $ CA` };
  }

  return currency === "CAD"
    ? { primary: `CA$${cadEn} / mo`, secondary: `approx. ${krwEn}` }
    : { primary: `approx. ${krwEn} / mo`, secondary: `CA$${cadEn}` };
}

function formatMaxOccupancy(value: string, locale: Locale) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const number = Number(trimmed.replace(/[^0-9]/g, ""));
  if (!number) return trimmed;

  if (locale === "ko") return `최대 ${number}명`;
  if (locale === "fr") return `max. ${number} pers.`;
  return `max ${number} ${number === 1 ? "person" : "people"}`;
}

function formatFloorValue(value: string, locale: Locale) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const number = Number(trimmed.replace(/[^0-9]/g, ""));
  if (!number) return trimmed;

  if (locale === "ko") return `${number}층`;
  if (locale === "fr") return `${number}e étage`;

  const suffix = number === 1 ? "st" : number === 2 ? "nd" : number === 3 ? "rd" : "th";
  return `${number}${suffix} floor`;
}

function formatPhotoCount(count: number, copy: DetailCopy, locale: Locale) {
  if (locale === "en") return `${count} ${count === 1 ? "photo" : copy.photosCountLabel}`;
  if (locale === "fr") return `${count} ${count === 1 ? "photo" : copy.photosCountLabel}`;
  return `${count} ${copy.photosCountLabel}`;
}

function buildCalendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const days: Array<Date | null> = Array.from({ length: firstDay.getDay() }, () => null);

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(month.getFullYear(), month.getMonth(), day));
  }

  return days;
}

function toDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function formatMonthLabel(date: Date, locale: Locale) {
  if (locale === "ko") return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  if (locale === "fr") {
    return new Intl.DateTimeFormat("fr-CA", { month: "long", year: "numeric" }).format(date);
  }
  return new Intl.DateTimeFormat("en-CA", { month: "long", year: "numeric" }).format(date);
}

function numberFromCurrency(value?: string) {
  const digits = value?.replace(/[^0-9]/g, "") ?? "";
  return digits ? Number(digits) : 0;
}

function openAssistedApply(locale: Locale, listing: PublicListing) {
  if (typeof window === "undefined") return;

  try {
    const summary = listing.sourceListing
      ? buildApplySelectedListingSummary(listing.sourceListing)
      : {
          listingId: listing.id,
          title: listing.title,
          area: listing.area,
          housingType: listing.housingType,
          rent: listing.rentValue,
          currency: "CAD",
          rentKRW: 0,
          capacity: Number(listing.details.occupancy) || 1,
          lastChecked: "",
          verificationStatus: "preparing",
          thumbnail: listing.photos[0]?.src || "",
        };
    window.sessionStorage.setItem(APPLY_SELECTED_LISTING_STORAGE_KEY, JSON.stringify(summary));
  } catch {
    // MVP handoff only; navigation still works if sessionStorage is unavailable.
  }

  const params = new URLSearchParams({
    mode: "assisted",
    listingId: listing.id,
  });
  window.location.href = `/${locale}/apply?${params.toString()}`;
}
