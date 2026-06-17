import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import {
  ArrowUp,
  ArrowUpDown,
  ArrowRight,
  Bath,
  BedDouble,
  CalendarDays,
  Camera,
  Car,
  Cctv,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  CigaretteOff,
  DoorOpen,
  Flame,
  Footprints,
  Heart,
  Home,
  KeyRound,
  MapPin,
  Moon,
  PawPrint,
  Recycle,
  Share2,
  ShieldCheck,
  Sofa,
  Snowflake,
  Star,
  ThermometerSun,
  Utensils,
  UserCheck,
  Users,
  VolumeX,
  Wifi,
  X,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { ListingImageFrame } from "@/components/ui/listing-image-frame";
import type { Locale } from "@/lib/i18n";
import { getAllMockListingImages } from "@/lib/mockListingImages";
import {
  buildSelectedInquiryPayload as buildStoredSelectedInquiryPayload,
  saveSelectedInquiryPayload,
  type SelectedInquiryPayload,
} from "@/lib/mockInquiryStorage";
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
type InquiryTarget = "listing" | "room";

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
type AmenityItem = { label: string; value: string; icon: ReactNode };
type AmenityGroupKind = "building" | "shared" | "rules";
type AmenityGroup = {
  kind: AmenityGroupKind;
  title: string;
  moreLabel: string;
  items: AmenityItem[];
};

const DETAIL_ICON_PROPS = {
  className: "h-4 w-4 shrink-0 text-[#FA7000]",
  strokeWidth: 1.5,
};

const DETAIL_RULE_ICON_PROPS = {
  className: "h-3.5 w-3.5 shrink-0 text-[#FA7000]",
  strokeWidth: 1.5,
};

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
  roomDetailsModal: {
    title: string;
    close: string;
    inquire: string;
    previousPhoto: string;
    nextPhoto: string;
    summary: string;
    fields: {
      roomType: string;
      bedroom: string;
      bathroom: string;
      kitchen: string;
      livingRoom: string;
      maxGuests: string;
      floor: string;
      bedSize: string;
      furnished: string;
      availableFrom: string;
      minimumStay: string;
      monthlyRent: string;
    };
  };
  amenityGroups: {
    building: string;
    shared: string;
    rules: string;
    buildingMore: string;
    sharedMore: string;
  };
  amenitiesModal: {
    title: string;
    close: string;
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
    kitchen: string;
    bathroom: string;
    residentCondition: string;
    pets: string;
    smoking: string;
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
  missingDateModal: {
    title: string;
    body: string;
    selectDate: string;
    continueWithoutDate: string;
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
    directDescription: string;
    supportTitle: string;
    supportDescription: string;
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
    roomDetailsModal: {
      title: "방 상세 정보",
      close: "닫기",
      inquire: "방 문의하기",
      previousPhoto: "이전 사진",
      nextPhoto: "다음 사진",
      summary: "방 요약",
      fields: {
        roomType: "방 유형",
        bedroom: "침실",
        bathroom: "욕실",
        kitchen: "주방",
        livingRoom: "거실",
        maxGuests: "최대 인원",
        floor: "층수",
        bedSize: "침대 크기",
        furnished: "가구 포함",
        availableFrom: "입주 가능일",
        minimumStay: "최소 거주",
        monthlyRent: "월세",
      },
    },
    amenityGroups: {
      building: "건물 시설",
      shared: "공용 편의시설",
      rules: "이용 규칙",
      buildingMore: "건물 시설 더 보기",
      sharedMore: "편의시설 더 보기",
    },
    amenitiesModal: {
      title: "편의시설 전체 보기",
      close: "닫기",
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
      kitchen: "주방",
      bathroom: "화장실",
      residentCondition: "거주 조건",
      pets: "반려동물",
      smoking: "흡연",
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
    missingDateModal: {
      title: "입주 희망일을 선택하지 않았습니다",
      body: "입주 희망일이 있으면 문의가 더 정확해집니다. 지금 선택하지 않고도 문의를 계속할 수 있습니다.",
      selectDate: "날짜 선택하기",
      continueWithoutDate: "날짜 없이 계속하기",
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
      directDescription:
        "무료로 집주인에게 직접 문의하는 흐름입니다. MVP 단계에서는 실제 메시지 전송 기능은 아직 연결되어 있지 않습니다.",
      supportTitle: "메이플하우스와 함께 문의하기",
      supportDescription:
        "MapleHouse가 문의 전 확인할 항목을 정리하고, 예약 전 확인 절차를 도와주는 흐름입니다.",
      directMessage: "직접 문의 기능은 MVP 이후 연결될 예정입니다.",
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
      roomInfo: "Room info",
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
    roomDetailsModal: {
      title: "Room details",
      close: "Close",
      inquire: "Ask about this room",
      previousPhoto: "Previous photo",
      nextPhoto: "Next photo",
      summary: "Room summary",
      fields: {
        roomType: "Room type",
        bedroom: "Bedroom",
        bathroom: "Bathroom",
        kitchen: "Kitchen",
        livingRoom: "Living room",
        maxGuests: "Max guests",
        floor: "Floor",
        bedSize: "Bed size",
        furnished: "Furnished",
        availableFrom: "Available from",
        minimumStay: "Minimum stay",
        monthlyRent: "Monthly rent",
      },
    },
    amenityGroups: {
      building: "Building facilities",
      shared: "Shared amenities",
      rules: "House rules",
      buildingMore: "View more building facilities",
      sharedMore: "View more amenities",
    },
    amenitiesModal: {
      title: "All amenities",
      close: "Close",
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
      kitchen: "Kitchen",
      bathroom: "Bathroom",
      residentCondition: "Resident condition",
      pets: "Pets",
      smoking: "Smoking",
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
    missingDateModal: {
      title: "Move-in date not selected",
      body: "Adding a preferred move-in date helps make the inquiry more accurate. You can still continue without selecting a date.",
      selectDate: "Select date",
      continueWithoutDate: "Continue without date",
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
      directDescription:
        "This is a free direct inquiry flow. Real messaging is not connected in the MVP preview.",
      supportTitle: "Ask with MapleHouse support",
      supportDescription:
        "MapleHouse helps organize key questions and pre-inquiry checks before reservation.",
      directMessage: "Direct messaging will be connected after the MVP stage.",
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
      overview: "Aperçu",
      roomInfo: "Chambre",
      amenities: "Équipements",
      location: "Emplacement",
      rules: "Règles",
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
    roomDetailsModal: {
      title: "Détails de la chambre",
      close: "Fermer",
      inquire: "Se renseigner sur cette chambre",
      previousPhoto: "Photo précédente",
      nextPhoto: "Photo suivante",
      summary: "Résumé de la chambre",
      fields: {
        roomType: "Type de chambre",
        bedroom: "Chambre",
        bathroom: "Salle de bain",
        kitchen: "Cuisine",
        livingRoom: "Salon",
        maxGuests: "Nombre max. de personnes",
        floor: "Étage",
        bedSize: "Taille du lit",
        furnished: "Meublé",
        availableFrom: "Disponible à partir de",
        minimumStay: "Séjour minimum",
        monthlyRent: "Loyer mensuel",
      },
    },
    amenityGroups: {
      building: "Installations du bâtiment",
      shared: "Équipements partagés",
      rules: "Règlement",
      buildingMore: "Voir plus d’installations",
      sharedMore: "Voir plus d’équipements",
    },
    amenitiesModal: {
      title: "Tous les équipements",
      close: "Fermer",
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
      kitchen: "Cuisine",
      bathroom: "Salle de bain",
      residentCondition: "Conditions de résidence",
      pets: "Animaux",
      smoking: "Fumeur / non-fumeur",
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
    missingDateModal: {
      title: "Date d’arrivée non sélectionnée",
      body: "Ajouter une date d’arrivée souhaitée rend la demande plus précise. Vous pouvez continuer sans date.",
      selectDate: "Choisir une date",
      continueWithoutDate: "Continuer sans date",
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
      directDescription:
        "Flux de contact direct gratuit. La messagerie réelle n’est pas encore connectée dans l’aperçu MVP.",
      supportTitle: "Demander avec l’aide de MapleHouse",
      supportDescription:
        "MapleHouse aide à organiser les questions importantes et les vérifications avant réservation.",
      directMessage:
        "La messagerie directe sera connectée après la phase MVP.",
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
  const [currency, setCurrency] = useState<CurrencyMode>("CAD");
  const [introExpanded, setIntroExpanded] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [missingDateOpen, setMissingDateOpen] = useState(false);
  const [selectedMoveInDate, setSelectedMoveInDate] = useState("");
  const [pendingInquiryTarget, setPendingInquiryTarget] = useState<InquiryTarget>("listing");
  const [datePickerReturnToInquiry, setDatePickerReturnToInquiry] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState<number | null>(null);
  const [roomDetailsOpen, setRoomDetailsOpen] = useState(false);
  const [amenitiesModalOpen, setAmenitiesModalOpen] = useState<AmenityGroupKind | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    if (listingId !== "draft") return;
    setDraft(readSessionJson<LandlordCenterDraft>(LANDLORD_CENTER_DRAFT_KEY));
    setDetailDraft(readSessionJson<LandlordListingDetailsDraft>(LANDLORD_LISTING_DETAILS_DRAFT_KEY));
    setLoaded(true);
  }, [listingId]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 560);
    const checkAfterAnchorScroll = window.setTimeout(handleScroll, 800);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.clearTimeout(checkAfterAnchorScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
  const showBackToTopButton =
    showBackToTop &&
    !inquiryOpen &&
    !datePickerOpen &&
    !missingDateOpen &&
    photoViewerIndex === null &&
    !roomDetailsOpen &&
    amenitiesModalOpen === null;
  const closeDetailModals = () => {
    setRoomDetailsOpen(false);
    setAmenitiesModalOpen(null);
  };
  const openInquiryModal = (target: InquiryTarget = pendingInquiryTarget) => {
    setPendingInquiryTarget(target);
    setMissingDateOpen(false);
    setDatePickerOpen(false);
    setDatePickerReturnToInquiry(false);
    setPhotoViewerIndex(null);
    closeDetailModals();
    setInquiryOpen(true);
  };
  const requestInquiry = (target: InquiryTarget) => {
    setPendingInquiryTarget(target);
    setDatePickerOpen(false);
    setDatePickerReturnToInquiry(false);
    setPhotoViewerIndex(null);
    closeDetailModals();
    setInquiryOpen(false);

    if (!selectedMoveInDate) {
      setMissingDateOpen(true);
      return;
    }

    openInquiryModal(target);
  };
  const openDatePicker = (returnToInquiry = false) => {
    setInquiryOpen(false);
    setMissingDateOpen(false);
    setDatePickerReturnToInquiry(returnToInquiry);
    setPhotoViewerIndex(null);
    closeDetailModals();
    setDatePickerOpen(true);
  };
  const openPhotoViewer = (index = 0) => {
    if (!listing.photos.length) return;
    setInquiryOpen(false);
    setMissingDateOpen(false);
    setDatePickerOpen(false);
    setDatePickerReturnToInquiry(false);
    closeDetailModals();
    setPhotoViewerIndex(index);
  };
  const openRoomDetails = () => {
    setInquiryOpen(false);
    setMissingDateOpen(false);
    setDatePickerOpen(false);
    setDatePickerReturnToInquiry(false);
    setPhotoViewerIndex(null);
    setAmenitiesModalOpen(null);
    setRoomDetailsOpen(true);
  };
  const openAmenitiesModal = (kind: AmenityGroupKind) => {
    setInquiryOpen(false);
    setMissingDateOpen(false);
    setDatePickerOpen(false);
    setDatePickerReturnToInquiry(false);
    setPhotoViewerIndex(null);
    setRoomDetailsOpen(false);
    setAmenitiesModalOpen(kind);
  };

  const locationRows: InfoRow[] = [
    [copy.fields.city, listing.city],
    [copy.fields.area, listing.area],
    [copy.fields.nearestStation, listing.nearestStation],
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
  const roomDetailRows: InfoRow[] = [
    [copy.roomDetailsModal.fields.roomType, listing.housingType],
    [copy.roomDetailsModal.fields.bedroom, listing.details.unitDetail || listing.housingType],
    [copy.roomDetailsModal.fields.bathroom, listing.details.bathroom],
    [copy.roomDetailsModal.fields.kitchen, listing.details.kitchen],
    [copy.roomDetailsModal.fields.livingRoom, listing.livingCondition],
    [copy.roomDetailsModal.fields.maxGuests, formatMaxOccupancy(listing.details.occupancy, locale)],
    [copy.roomDetailsModal.fields.floor, formatFloorValue(listing.details.floor, locale)],
    [copy.roomDetailsModal.fields.bedSize, listing.details.bedSize],
    [copy.roomDetailsModal.fields.furnished, listing.details.furnished],
    [copy.roomDetailsModal.fields.availableFrom, listing.availableFrom],
    [copy.roomDetailsModal.fields.minimumStay, listing.minimumStay],
    {
      label: copy.roomDetailsModal.fields.monthlyRent,
      value: priceDisplay.primary,
      secondary: priceDisplay.secondary,
    },
  ];
  const amenityGroupItems: Array<Omit<AmenityGroup, "moreLabel">> = [
    {
      kind: "building",
      title: copy.amenityGroups.building,
      items: [
        { label: copy.amenityItems.parking, value: listing.details.parking, icon: <Car {...DETAIL_ICON_PROPS} /> },
        { label: copy.amenityItems.cctv, value: "", icon: <Cctv {...DETAIL_ICON_PROPS} /> },
        { label: copy.amenityItems.fireExtinguisher, value: "", icon: <Flame {...DETAIL_ICON_PROPS} /> },
        { label: copy.amenityItems.doorLock, value: "", icon: <KeyRound {...DETAIL_ICON_PROPS} /> },
      ] satisfies AmenityItem[],
    },
    {
      kind: "shared",
      title: copy.amenityGroups.shared,
      items: [
        { label: copy.amenityItems.wifi, value: "", icon: <Wifi {...DETAIL_ICON_PROPS} /> },
        { label: copy.amenityItems.heating, value: "", icon: <ThermometerSun {...DETAIL_ICON_PROPS} /> },
        { label: copy.amenityItems.airConditioning, value: "", icon: <Snowflake {...DETAIL_ICON_PROPS} /> },
        { label: copy.amenityItems.balcony, value: "", icon: <DoorOpen {...DETAIL_ICON_PROPS} /> },
        { label: copy.amenityItems.kitchen, value: listing.details.kitchen, icon: <Utensils {...DETAIL_ICON_PROPS} /> },
        { label: copy.amenityItems.bathroom, value: listing.details.bathroom, icon: <Bath {...DETAIL_ICON_PROPS} /> },
      ] satisfies AmenityItem[],
    },
    {
      kind: "rules",
      title: copy.amenityGroups.rules,
      items: [
        { label: copy.amenityItems.residentCondition, value: listing.livingCondition, icon: <Users {...DETAIL_ICON_PROPS} /> },
        { label: copy.amenityItems.pets, value: listing.details.pets, icon: <PawPrint {...DETAIL_ICON_PROPS} /> },
        { label: copy.amenityItems.smoking, value: listing.details.smoking, icon: <CigaretteOff {...DETAIL_ICON_PROPS} /> },
      ] satisfies AmenityItem[],
    },
  ];
  const amenityGroups: AmenityGroup[] = amenityGroupItems.map((group) => ({
    ...group,
    moreLabel: formatAmenityMoreLabel(locale, group.kind, group.items.length),
  }));
  const tabItems = [
    { id: "overview", label: copy.tabs.overview },
    { id: "room-info", label: copy.tabs.roomInfo },
    { id: "amenities", label: copy.tabs.amenities },
    { id: "location", label: copy.tabs.location },
    { id: "rules", label: copy.tabs.rules },
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
          <PhotoGallery
            listing={listing}
            copy={copy}
            onOpenPhotoViewer={openPhotoViewer}
          />
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
                onOpenPhotoViewer={openPhotoViewer}
                onOpenDatePicker={() => openDatePicker(false)}
                onOpenRoomDetails={openRoomDetails}
                onInquire={() => requestInquiry("room")}
              />
            </DetailSection>

            <DetailSection id="amenities" title={copy.sections.amenities}>
              <AmenityGroups
                groups={amenityGroups}
                fallback={copy.fallback}
                onOpenGroup={openAmenitiesModal}
              />
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

          <aside className="xl:sticky xl:top-28 xl:max-h-[calc(100vh-128px)] xl:overflow-auto">
            <section className="rounded-3xl border border-primary/20 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    MapleHouse
                  </p>
                  <h2 className="mt-3 break-words text-[1.375rem] font-bold leading-tight text-foreground sm:text-2xl">{priceDisplay.primary}</h2>
                  <p className="mt-1 text-[13px] font-medium text-muted-foreground">{priceDisplay.secondary}</p>
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
                onClick={() => requestInquiry("listing")}
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
          inquiryTarget={pendingInquiryTarget}
          selectedMoveInDate={selectedMoveInDate}
          onClose={() => {
            setInquiryOpen(false);
          }}
        />
      ) : null}
      {datePickerOpen ? (
        <DatePickerModal
          copy={copy}
          locale={locale}
          selectedDate={selectedMoveInDate}
          onSelectDate={setSelectedMoveInDate}
          onClose={() => {
            setDatePickerOpen(false);
            setDatePickerReturnToInquiry(false);
          }}
          onApply={() => {
            setDatePickerOpen(false);
            if (datePickerReturnToInquiry) {
              openInquiryModal(pendingInquiryTarget);
            }
            setDatePickerReturnToInquiry(false);
          }}
        />
      ) : null}
      {missingDateOpen ? (
        <MissingMoveInDateModal
          copy={copy}
          onClose={() => setMissingDateOpen(false)}
          onSelectDate={() => openDatePicker(true)}
          onContinue={() => openInquiryModal(pendingInquiryTarget)}
        />
      ) : null}
      {photoViewerIndex !== null ? (
        <PhotoViewerModal
          photos={listing.photos}
          copy={copy}
          activeIndex={photoViewerIndex}
          onChangeIndex={setPhotoViewerIndex}
          onClose={() => setPhotoViewerIndex(null)}
        />
      ) : null}
      {roomDetailsOpen ? (
        <RoomDetailsModal
          copy={copy}
          listing={listing}
          rows={roomDetailRows}
          priceDisplay={priceDisplay}
          onClose={() => setRoomDetailsOpen(false)}
          onInquire={() => requestInquiry("room")}
        />
      ) : null}
      {amenitiesModalOpen !== null ? (
        <AmenitiesModal
          copy={copy}
          groups={amenityGroups}
          onClose={() => setAmenitiesModalOpen(null)}
        />
      ) : null}
      {showBackToTopButton ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-4 z-40 inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-white/95 px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-primary shadow-sm backdrop-blur transition hover:border-primary hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 sm:bottom-8 sm:right-8"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-3.5 w-3.5" aria-hidden />
          TOP
        </button>
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
          <h1 className="max-w-4xl break-words text-2xl font-bold leading-[1.22] text-foreground sm:text-[1.95rem]">
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
            className="max-w-full rounded-full border border-border bg-[#F8FAFC] px-2.5 py-0.5 text-[11px] font-medium leading-5 text-muted-foreground"
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
    <nav className="mt-4 overflow-x-auto border-y border-border bg-white px-1 shadow-sm" aria-label="Listing sections">
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

function PhotoGallery({
  listing,
  copy,
  onOpenPhotoViewer,
}: {
  listing: PublicListing;
  copy: DetailCopy;
  onOpenPhotoViewer: (index: number) => void;
}) {
  const photoSlots = [0, 1, 2, 3, 4].map((index) => listing.photos[index]);

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-border bg-white p-2 shadow-sm sm:p-3">
      <div className="grid gap-2 lg:h-[370px] lg:grid-cols-[minmax(0,1.18fr)_minmax(0,1fr)]">
        <PhotoTile
          photo={photoSlots[0]}
          copy={copy}
          className="aspect-[16/10] lg:h-full lg:aspect-auto"
          large
          onOpen={() => onOpenPhotoViewer(0)}
        />
        <div className="grid grid-cols-2 gap-2 lg:grid-rows-2">
          {photoSlots.slice(1).map((photo, index) => (
            <PhotoTile
              key={photo?.id ?? `placeholder-${index}`}
              photo={photo}
              copy={copy}
              className="aspect-[4/3] lg:h-full lg:aspect-auto"
              onOpen={() => onOpenPhotoViewer(index + 1)}
            />
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onOpenPhotoViewer(0)}
        className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full border border-border bg-white/95 px-4 py-2 text-xs font-semibold text-foreground shadow-sm backdrop-blur transition hover:border-primary hover:text-primary"
      >
        <Camera className="h-4 w-4" aria-hidden />
        {copy.viewAllPhotos}
      </button>
    </section>
  );
}

function PhotoViewerModal({
  photos,
  copy,
  activeIndex,
  onChangeIndex,
  onClose,
}: {
  photos: PublicPhoto[];
  copy: DetailCopy;
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  onClose: () => void;
}) {
  const photoCount = photos.length;
  const normalizedIndex = photoCount ? ((activeIndex % photoCount) + photoCount) % photoCount : 0;
  const activePhoto = photos[normalizedIndex];
  const goPrevious = () => {
    if (!photoCount) return;
    onChangeIndex((normalizedIndex - 1 + photoCount) % photoCount);
  };
  const goNext = () => {
    if (!photoCount) return;
    onChangeIndex((normalizedIndex + 1) % photoCount);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrevious();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (!photoCount || !activePhoto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={copy.viewAllPhotos}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-[min(1100px,92vw)] flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#101010] shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 text-white sm:px-5">
          <div className="min-w-0">
            <p className="text-sm font-extrabold">{copy.viewAllPhotos}</p>
            <p className="mt-1 text-xs font-medium text-white/65">
              {normalizedIndex + 1} / {photoCount}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="relative flex min-h-0 flex-1 items-center justify-center p-3 sm:p-5">
          <button
            type="button"
            onClick={goPrevious}
            className="absolute left-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white shadow-lg transition hover:bg-black/55 sm:left-5"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <div className="h-[72vh] max-h-[78vh] w-full">
            <ListingImageFrame
              src={activePhoto.src}
              alt={activePhoto.label}
              fit="contain"
              className="h-full w-full bg-[#111]"
              fallback={
                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white/70">
                  {copy.photoEmpty}
                </div>
              }
            />
          </div>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white shadow-lg transition hover:bg-black/55 sm:right-5"
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="border-t border-white/10 px-4 py-3 text-center text-xs font-semibold text-white/70">
          {getPhotoFilename(activePhoto.src ?? "")}
        </div>
      </div>
    </div>
  );
}

function useModalLifecycle(onClose: () => void) {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
}

function RoomDetailsModal({
  copy,
  listing,
  rows,
  priceDisplay,
  onClose,
  onInquire,
}: {
  copy: DetailCopy;
  listing: PublicListing;
  rows: InfoRow[];
  priceDisplay: { primary: string; secondary: string };
  onClose: () => void;
  onInquire: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const photoCount = listing.photos.length;
  const normalizedIndex = photoCount ? ((activeIndex % photoCount) + photoCount) % photoCount : 0;
  const activePhoto = listing.photos[normalizedIndex];
  const goPrevious = () => {
    if (!photoCount) return;
    setActiveIndex((normalizedIndex - 1 + photoCount) % photoCount);
  };
  const goNext = () => {
    if (!photoCount) return;
    setActiveIndex((normalizedIndex + 1) % photoCount);
  };

  useModalLifecycle(onClose);

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center bg-black/55 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="room-details-modal-title"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section className="flex max-h-[90vh] w-full max-w-[940px] flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-2xl">
        <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              MapleHouse
            </p>
            <h2 id="room-details-modal-title" className="mt-1 break-words text-xl font-bold text-foreground">
              {copy.roomDetailsModal.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition hover:border-primary/45 hover:text-primary"
            aria-label={copy.roomDetailsModal.close}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>

        <div className="min-h-0 overflow-y-auto p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
            <div className="min-w-0">
              <div className="relative overflow-hidden rounded-3xl border border-border bg-[#F7F8FA]">
                <ListingImageFrame
                  src={activePhoto?.src}
                  alt={activePhoto?.label ?? listing.title}
                  fit="contain"
                  className="aspect-[4/3] w-full bg-[#F7F8FA]"
                  fallback={
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Camera className="h-8 w-8 text-primary" aria-hidden />
                      <span className="text-xs font-medium">{copy.photoEmpty}</span>
                    </div>
                  }
                />
                {photoCount > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={goPrevious}
                      className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/85 text-foreground shadow-sm backdrop-blur transition hover:border-primary/40 hover:text-primary"
                      aria-label={copy.roomDetailsModal.previousPhoto}
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/85 text-foreground shadow-sm backdrop-blur transition hover:border-primary/40 hover:text-primary"
                      aria-label={copy.roomDetailsModal.nextPhoto}
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden />
                    </button>
                  </>
                ) : null}
                {photoCount > 0 ? (
                  <span className="absolute bottom-3 right-3 rounded-full bg-foreground/75 px-2.5 py-0.5 text-[11px] font-medium leading-5 text-white">
                    {normalizedIndex + 1} / {photoCount}
                  </span>
                ) : null}
              </div>
            </div>

            <aside className="min-w-0 rounded-3xl border border-border bg-[#FAFAFA] p-4 sm:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                {copy.roomDetailsModal.summary}
              </p>
              <h3 className="mt-2 break-words text-lg font-bold leading-tight text-foreground">
                {display(listing.housingType, copy.fallback)}
              </h3>
              <div className="mt-4 grid gap-3">
                <SummaryRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label={copy.roomDetailsModal.fields.availableFrom}
                  value={listing.availableFrom}
                  fallback={copy.fallback}
                />
                <SummaryRow
                  icon={<MapPin className="h-4 w-4" />}
                  label={copy.fields.nearestStation}
                  value={listing.nearestStation}
                  fallback={copy.fallback}
                />
                <SummaryRow
                  icon={<Home className="h-4 w-4" />}
                  label={copy.roomDetailsModal.fields.monthlyRent}
                  value={priceDisplay.primary}
                  fallback={copy.fallback}
                />
              </div>
            </aside>
          </div>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((row) => {
              const normalizedRow = Array.isArray(row)
                ? { label: row[0], value: row[1], secondary: undefined }
                : row;

              return (
                <div
                  key={normalizedRow.label}
                  className="min-w-0 rounded-2xl border border-border bg-white px-4 py-3"
                >
                  <dt className="text-[12px] font-medium leading-snug text-muted-foreground">
                    {normalizedRow.label}
                  </dt>
                  <dd className="mt-1 break-words text-[15px] font-semibold leading-snug text-foreground">
                    {display(normalizedRow.value, copy.fallback)}
                  </dd>
                  {normalizedRow.secondary ? (
                    <dd className="mt-1 break-words text-xs leading-5 text-muted-foreground">
                      {normalizedRow.secondary}
                    </dd>
                  ) : null}
                </div>
              );
            })}
          </dl>
        </div>

        <footer className="grid gap-3 border-t border-border bg-white px-5 py-4 sm:grid-cols-[auto_1fr] sm:px-6">
          <Button
            type="button"
            variant="outline"
            className="min-h-11 rounded-2xl border-border px-5 text-sm font-semibold"
            onClick={onClose}
          >
            {copy.roomDetailsModal.close}
          </Button>
          <Button
            type="button"
            className="min-h-11 rounded-2xl px-5 text-sm font-semibold"
            onClick={onInquire}
          >
            {copy.roomDetailsModal.inquire}
          </Button>
        </footer>
      </section>
    </div>
  );
}

function AmenitiesModal({
  copy,
  groups,
  onClose,
}: {
  copy: DetailCopy;
  groups: AmenityGroup[];
  onClose: () => void;
}) {
  useModalLifecycle(onClose);

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center bg-black/55 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="amenities-modal-title"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section className="flex max-h-[90vh] w-full max-w-[920px] flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-2xl">
        <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              MapleHouse
            </p>
            <h2 id="amenities-modal-title" className="mt-1 break-words text-xl font-bold text-foreground">
              {copy.amenitiesModal.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition hover:border-primary/45 hover:text-primary"
            aria-label={copy.amenitiesModal.close}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>

        <div className="min-h-0 space-y-5 overflow-y-auto p-5 sm:p-6">
          {groups.map((group) => (
            <section key={group.kind} className="min-w-0">
              <h3 className="break-words text-base font-bold text-foreground">{group.title}</h3>
              <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map(({ label, value, icon }) => (
                  <div
                    key={`${group.kind}-${label}`}
                    className="flex min-w-0 items-start gap-3 rounded-2xl border border-border bg-white px-4 py-3"
                  >
                    <span className="mt-0.5 shrink-0 text-primary" aria-hidden>
                      {icon}
                    </span>
                    <div className="min-w-0">
                      <dt className="break-words text-sm font-semibold leading-snug text-foreground">
                        {label}
                      </dt>
                      <dd className="mt-1 break-words text-[12px] leading-5 text-muted-foreground">
                        {display(value, copy.fallback)}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </section>
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
  onOpen,
}: {
  photo?: PublicPhoto;
  copy: DetailCopy;
  className?: string;
  large?: boolean;
  onOpen?: () => void;
}) {
  const interactive = Boolean(photo?.src && onOpen);
  const content = (
    <ListingImageFrame
      src={photo?.src}
      alt={photo?.label ?? ""}
      fit="cover"
      className="h-full w-full bg-[#F7F8FA]"
      fallback={
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-3 text-center text-muted-foreground">
          <Camera className={cn("text-primary", large ? "h-10 w-10" : "h-6 w-6")} aria-hidden />
          {large ? <p className="text-sm font-bold">{copy.photoEmpty}</p> : null}
        </div>
      }
    />
  );

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "group relative block min-h-36 min-w-0 w-full overflow-hidden rounded-2xl border border-border bg-[#F7F8FA] text-left transition hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
          className,
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "relative min-h-36 min-w-0 w-full overflow-hidden rounded-2xl border border-border bg-[#F7F8FA]",
        className,
      )}
    >
      {content}
    </div>
  );
}

function DetailSection({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="min-w-0 scroll-mt-28 rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <h2 className="break-words text-xl font-bold leading-snug text-foreground">{title}</h2>
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
  onOpenPhotoViewer,
  onOpenDatePicker,
  onOpenRoomDetails,
  onInquire,
}: {
  copy: DetailCopy;
  locale: Locale;
  listing: PublicListing;
  rows: Array<{ label: string; value: string; icon: ReactNode }>;
  metaRows: string[];
  priceDisplay: { primary: string; secondary: string };
  onOpenPhotoViewer: (index: number) => void;
  onOpenDatePicker: () => void;
  onOpenRoomDetails: () => void;
  onInquire: () => void;
}) {
  return (
    <article className="rounded-[1.75rem] border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            {copy.roomUnitTitle}
          </p>
          <h3 className="mt-2 break-words text-lg font-bold leading-tight text-foreground">
            {display(listing.housingType, copy.fallback)}
          </h3>
        </div>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(240px,0.42fr)_minmax(0,0.58fr)]">
        <button
          type="button"
          onClick={() => onOpenPhotoViewer(0)}
          className="group relative block aspect-square min-h-0 overflow-hidden rounded-3xl bg-[#F8FAFC] text-left transition hover:ring-2 hover:ring-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label={copy.viewAllPhotos}
        >
          <ListingImageFrame
            src={listing.photos[0]?.src}
            alt=""
            fit="cover"
            className="h-full w-full bg-[#F8FAFC]"
            fallback={
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <Camera className="h-8 w-8 text-primary" aria-hidden />
                <span className="text-xs font-medium">{copy.photoEmpty}</span>
              </div>
            }
          />
          <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-medium leading-5 text-foreground shadow-sm">
            {copy.roomAvailabilityBadge}
          </span>
          {listing.photoCount > 0 ? (
            <span className="absolute bottom-3 right-3 rounded-full bg-foreground/75 px-2.5 py-0.5 text-[11px] font-medium leading-5 text-white transition group-hover:bg-primary">
              {formatPhotoCount(listing.photoCount, copy, locale)}
            </span>
          ) : null}
        </button>

        <div className="flex min-w-0 flex-col">
          <dl className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
            {rows.map(({ label, value, icon }) => (
              <div key={label} className="flex min-w-0 items-start gap-3 text-sm">
                <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
                <div className="min-w-0">
                  <dt className="text-[12px] font-medium leading-snug text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-0.5 break-words text-[15px] font-semibold leading-snug text-foreground">
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
                    className="max-w-full rounded-full border border-border bg-[#F8FAFC] px-2.5 py-0.5 text-[11px] font-medium leading-5 text-muted-foreground"
                  >
                    {value}
                  </span>
                ))}
              </div>
            ) : null}
            <button
              type="button"
              onClick={onOpenRoomDetails}
              className="mt-3 inline-flex text-sm font-semibold text-primary transition hover:text-primary/80"
            >
              {copy.roomFullDetails}
            </button>
          </div>

          <div className="mt-5">
            <p className="break-words text-[1.375rem] font-bold leading-tight text-foreground sm:text-2xl">{priceDisplay.primary}</p>
            <p className="mt-1 text-[13px] font-medium text-muted-foreground">{priceDisplay.secondary}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <button
          type="button"
          onClick={onOpenDatePicker}
          className="flex min-h-12 min-w-0 items-center justify-between gap-3 rounded-2xl border border-border bg-[#F8FAFC] px-4 text-left text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-white"
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
  onOpenGroup,
}: {
  groups: AmenityGroup[];
  fallback: string;
  onOpenGroup: (kind: AmenityGroupKind) => void;
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
                onClick={() => onOpenGroup(group.kind)}
                className="shrink-0 whitespace-nowrap text-xs font-semibold text-primary transition hover:text-primary/80"
              >
                {group.moreLabel}
              </button>
            ) : null}
          </div>
          <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {group.items.map(({ label, value, icon }) => (
              <div key={`${group.title}-${label}`} className="flex min-w-0 items-start gap-2.5 text-sm">
                <span className="mt-0.5 shrink-0" aria-hidden>
                  {icon}
                </span>
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
    ? listing.houseRules.map((rule) => ({
        label: rule,
        value: "",
        icon: getHouseRuleIcon(rule),
      }))
    : ([
        { label: copy.heroFields.livingCondition, value: listing.livingCondition, icon: <Users {...DETAIL_RULE_ICON_PROPS} /> },
        { label: copy.fields.pets, value: listing.details.pets, icon: <PawPrint {...DETAIL_RULE_ICON_PROPS} /> },
        { label: copy.fields.smoking, value: listing.details.smoking, icon: <CigaretteOff {...DETAIL_RULE_ICON_PROPS} /> },
      ] satisfies AmenityItem[]);

  return (
    <div className="rounded-3xl border border-border bg-white p-4 sm:p-5">
      <dl className="flex flex-wrap gap-2.5">
        {ruleRows.map(({ label, value, icon }) => (
          <div
            key={`${label}-${value}`}
            className="flex min-w-0 items-center gap-2 rounded-2xl border border-border bg-[#F8FAFC] px-3 py-1.5 text-sm"
          >
            <span className="shrink-0" aria-hidden>
              {icon}
            </span>
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
              <dt className="min-w-0 break-words text-xs font-semibold leading-5 text-foreground">{label}</dt>
              {value ? (
                <dd className="min-w-0 break-words text-[11px] leading-5 text-muted-foreground">
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

function getHouseRuleIcon(label: string): ReactNode {
  const normalized = label.toLowerCase();

  if (normalized.includes("pet") || normalized.includes("animal") || normalized.includes("반려") || normalized.includes("anim")) {
    return <PawPrint {...DETAIL_RULE_ICON_PROPS} />;
  }
  if (normalized.includes("smok") || normalized.includes("흡연") || normalized.includes("fum")) {
    return <CigaretteOff {...DETAIL_RULE_ICON_PROPS} />;
  }
  if (normalized.includes("quiet") || normalized.includes("조용") || normalized.includes("silence")) {
    return <Moon {...DETAIL_RULE_ICON_PROPS} />;
  }
  if (normalized.includes("visitor") || normalized.includes("방문") || normalized.includes("visiteur")) {
    return <UserCheck {...DETAIL_RULE_ICON_PROPS} />;
  }
  if (normalized.includes("party") || normalized.includes("파티") || normalized.includes("fête")) {
    return <VolumeX {...DETAIL_RULE_ICON_PROPS} />;
  }
  if (normalized.includes("shoe") || normalized.includes("신발") || normalized.includes("chauss")) {
    return <Footprints {...DETAIL_RULE_ICON_PROPS} />;
  }
  if (normalized.includes("waste") || normalized.includes("trash") || normalized.includes("쓰레기") || normalized.includes("déchet") || normalized.includes("recycl")) {
    return <Recycle {...DETAIL_RULE_ICON_PROPS} />;
  }

  return <ShieldCheck {...DETAIL_RULE_ICON_PROPS} />;
}

function MissingMoveInDateModal({
  copy,
  onClose,
  onSelectDate,
  onContinue,
}: {
  copy: DetailCopy;
  onClose: () => void;
  onSelectDate: () => void;
  onContinue: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center bg-foreground/35 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="missing-date-title"
        className="w-full max-w-lg rounded-3xl border border-border bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="missing-date-title" className="break-words text-xl font-bold text-foreground">
              {copy.missingDateModal.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {copy.missingDateModal.body}
            </p>
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
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="rounded-2xl" onClick={onSelectDate}>
            {copy.missingDateModal.selectDate}
          </Button>
          <Button type="button" className="rounded-2xl" onClick={onContinue}>
            {copy.missingDateModal.continueWithoutDate}
          </Button>
        </div>
      </section>
    </div>
  );
}

function DatePickerModal({
  copy,
  locale,
  selectedDate,
  onSelectDate,
  onClose,
  onApply,
}: {
  copy: DetailCopy;
  locale: Locale;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onClose: () => void;
  onApply: () => void;
}) {
  const [baseMonth, setBaseMonth] = useState(() => new Date(2026, 7, 1));
  const months = [baseMonth, new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1, 1)];
  // TODO: Replace mock availability dates with real listing availability data later.
  const unavailableDates = new Set(["2026-08-09", "2026-08-15", "2026-08-28", "2026-09-04"]);

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
              selectedDate={selectedDate}
              onSelectDate={onSelectDate}
            />
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" aria-hidden />
            {copy.datePicker.unavailableLabel}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="rounded-2xl" onClick={() => onSelectDate("")}>
              {copy.datePicker.reset}
            </Button>
            <Button
              type="button"
              className="rounded-2xl bg-[#FA7000] text-white hover:bg-[#E76600]"
              onClick={onApply}
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
  selectedDate,
  onSelectDate,
}: {
  copy: DetailCopy;
  locale: Locale;
  month: Date;
  unavailableDates: Set<string>;
  selectedDate: string;
  onSelectDate: (date: string) => void;
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
          const selected = selectedDate === key;
          return (
            <button
              key={key}
              type="button"
              disabled={unavailable}
              onClick={() => onSelectDate(key)}
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
  inquiryTarget,
  selectedMoveInDate,
  onClose,
}: {
  copy: DetailCopy;
  locale: Locale;
  listing: PublicListing;
  inquiryTarget: InquiryTarget;
  selectedMoveInDate: string;
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
            onClick={() => openDirectApply(locale, listing, inquiryTarget, selectedMoveInDate)}
            className="min-w-0 rounded-2xl border border-border bg-white p-4 text-left shadow-sm transition hover:border-primary hover:bg-[#FFF8F1]"
          >
            <p className="break-words font-semibold text-foreground">{copy.modal.directTitle}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.modal.directDescription}</p>
          </button>
          <button
            type="button"
            onClick={() => openAssistedApply(locale, listing, inquiryTarget, selectedMoveInDate)}
            className="min-w-0 rounded-2xl border border-[#FFE8CC] bg-[#FFF8F1] p-4 text-left shadow-sm transition hover:border-primary hover:bg-[#FFF3E6] hover:shadow-md"
          >
            <p className="break-words font-semibold text-primary">{copy.modal.supportTitle}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.modal.supportDescription}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              {copy.modal.supportTitle}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </button>
        </div>
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

function formatAmenityMoreLabel(locale: Locale, kind: AmenityGroupKind, count: number) {
  if (locale === "ko") {
    if (kind === "building") return `건물 시설 ${count}개 보기`;
    if (kind === "shared") return `공용 편의시설 ${count}개 보기`;
    return `하우스 룰 ${count}개 보기`;
  }

  if (locale === "fr") {
    if (kind === "building") return `Voir ${count} équipements du bâtiment`;
    if (kind === "shared") return `Voir ${count} équipements communs`;
    return `Voir ${count} règles de la maison`;
  }

  if (kind === "building") return `View ${count} building amenities`;
  if (kind === "shared") return `View ${count} shared amenities`;
  return `View ${count} house rules`;
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

function getListingGuestCount(listing: PublicListing) {
  const fromDetails = Number(listing.details.occupancy?.replace(/[^0-9]/g, ""));
  if (Number.isFinite(fromDetails) && fromDetails > 0) return fromDetails;
  return listing.sourceListing?.maxPeople ?? 1;
}

function getInquiryRoomName(listing: PublicListing, target: InquiryTarget) {
  if (target !== "room") return "";
  return listing.details.unitDetail || listing.housingType;
}

function buildSelectedInquiryPayload(
  locale: Locale,
  listing: PublicListing,
  inquiryTarget: InquiryTarget,
  selectedMoveInDate: string,
): SelectedInquiryPayload {
  return buildStoredSelectedInquiryPayload({
    locale,
    listingId: listing.id,
    listingTitle: listing.title,
    city: listing.city,
    area: listing.area,
    rentCad: listing.rentValue,
    rentKrw: listing.sourceListing?.priceKRW ?? listing.rentValue * MOCK_CAD_TO_KRW,
    housingType: listing.housingType,
    roomName: getInquiryRoomName(listing, inquiryTarget),
    roomType: inquiryTarget === "room" ? listing.housingType : "",
    selectedMoveInDate,
    selectedGuestCount: getListingGuestCount(listing),
    thumbnailUrl: listing.photos[0]?.src || "",
    galleryUrls: listing.photos
      .slice(0, 5)
      .map((photo) => photo.src)
      .filter((src): src is string => Boolean(src)),
    source: "listing_detail",
  });
}

function openAssistedApply(
  locale: Locale,
  listing: PublicListing,
  inquiryTarget: InquiryTarget,
  selectedMoveInDate: string,
) {
  if (typeof window === "undefined") return;

  try {
    const selectedInquiry = buildSelectedInquiryPayload(
      locale,
      listing,
      inquiryTarget,
      selectedMoveInDate,
    );
    saveSelectedInquiryPayload(selectedInquiry);

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
    if (locale === "ko") {
      window.sessionStorage.setItem(APPLY_SELECTED_LISTING_STORAGE_KEY, JSON.stringify(summary));
    }
  } catch {
    // MVP handoff only; navigation still works if sessionStorage is unavailable.
  }

  const params = new URLSearchParams({
    mode: "assisted",
    listingId: listing.id,
  });
  window.location.href = `/${locale}/apply?${params.toString()}`;
}

function openDirectApply(
  locale: Locale,
  listing: PublicListing,
  inquiryTarget: InquiryTarget,
  selectedMoveInDate: string,
) {
  if (typeof window === "undefined") return;

  try {
    const selectedInquiry = buildSelectedInquiryPayload(
      locale,
      listing,
      inquiryTarget,
      selectedMoveInDate,
    );
    saveSelectedInquiryPayload(selectedInquiry);

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
    if (locale === "ko") {
      window.sessionStorage.setItem(APPLY_SELECTED_LISTING_STORAGE_KEY, JSON.stringify(summary));
    }
  } catch {
    // MVP handoff only; navigation still works if sessionStorage is unavailable.
  }

  const params = new URLSearchParams({
    mode: "direct",
    listingId: listing.id,
  });
  window.location.href = `/${locale}/apply?${params.toString()}`;
}
