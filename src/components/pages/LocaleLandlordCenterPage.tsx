import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Building2,
  Camera,
  CheckCircle,
  ClipboardList,
  Home,
  Inbox,
  Plus,
  Save,
  UserRound,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ListingImageFrame } from "@/components/ui/listing-image-frame";
import type { Locale } from "@/lib/i18n";
import { getMockListingThumbnailImage } from "@/lib/mockListingImages";
import { cn } from "@/lib/utils";

const LANDLORD_CENTER_DRAFT_KEY = "maplehouse.landlordDraft.v1";
const LANDLORD_LISTING_DETAILS_DRAFT_KEY = "maplehouse.landlordListingDetailsDraft.v1";

type LandlordCenterPage =
  | "dashboard"
  | "listings"
  | "listingDraft"
  | "listingDetails"
  | "newListing"
  | "inquiries"
  | "profile";

type LandlordInquiryStatusKey =
  | "new"
  | "needsReview"
  | "waitingLandlord"
  | "waitingTenant"
  | "reservationReview"
  | "closed";

type LandlordInquirySummaryKey =
  | "total"
  | "new"
  | "needsReview"
  | "waitingLandlord"
  | "reservationReview";

type LandlordMockInquiry = {
  id: string;
  status: LandlordInquiryStatusKey;
  listing: string;
  inquirer: string;
  replyStatus: string;
  note: string;
};

type LandlordCenterPhoto = {
  id?: string;
  name: string;
  dataUrl?: string;
};

type LandlordCenterDraft = Partial<{
  role: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  emailLocal: string;
  emailDomain: string;
  contact: string;
  phoneCountryCode: string;
  phoneCountryCodeCustom: string;
  phoneNumber: string;
  preferredLanguage: string;
  preferredLanguages: string[];
  preferredContactMethods: string[];
  shortMessage: string;
  city: string;
  area: string;
  nearestStation: string;
  address: string;
  housingType: string;
  unitDetail: string;
  floor: string;
  useType: string;
  furnished: string;
  elevator: string;
  parking: string;
  residentCondition: string;
  tenantPetsAllowed: string;
  homePets: string;
  homePetType: string;
  smokingCondition: string;
  photos: LandlordCenterPhoto[];
  coverPhotoId: string;
  listingTitle: string;
  monthlyRent: string;
  availableFrom: string;
  minimumStay: string;
  occupancy: string;
  bathroom: string;
  kitchen: string;
  furniture: string[];
  bedSize: string;
  keyDepositAmount: string;
  utilitiesIncluded: string[];
  utilitiesSeparate: string[];
  utilityStatuses: Record<string, string>;
  houseRuleItems: string[];
  additionalNote: string;
  moveInQuestions: string;
}>;

type LandlordListingDetailsDraft = {
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
};

type CenterCopy = {
  breadcrumb: { home: string; center: string };
  nav: {
    dashboard: string;
    listings: string;
    inquiries: string;
    profile: string;
  };
  common: {
    emptyValue: string;
    comingSoon: string;
    addListing: string;
    goRegister: string;
    viewDetails: string;
    previewPublicPage: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    cards: {
      listings: string;
      pendingInquiries: string;
      needsReview: string;
      recentUpdates: string;
    };
    notice: string;
    emptyTitle: string;
    emptyBody: string;
    onboardingButton: string;
  };
  listings: {
    title: string;
    subtitle: string;
    draftTitle: string;
    firstDraftLabel: string;
    emptyTitle: string;
    emptyBody: string;
    startFirstListing: string;
    statusLabel: string;
    detailsIncomplete: string;
    detailsPartial: string;
    completeBeforeInquiry: string;
    viewDraft: string;
    completeDetails: string;
    noCoverPhoto: string;
    fields: {
      listingTitle: string;
      city: string;
      area: string;
      nearestStation: string;
      address: string;
      monthlyRent: string;
      availableFrom: string;
      minimumStay: string;
      housingType: string;
      residentCondition: string;
      photos: string;
      status: string;
      detailsStatus: string;
    };
  };
  draftDetail: {
    title: string;
    subtitle: string;
    notice: string;
    checklistTitle: string;
    cta: string;
    checklistItems: string[];
  };
  detailForm: {
    title: string;
    subtitle: string;
    save: string;
    saved: string;
    readinessTitle: string;
    readinessStatus: string;
    readinessItems: string[];
    sections: {
      location: string;
      room: string;
      living: string;
      money: string;
      rules: string;
      questions: string;
    };
    fields: {
      unitDetail: string;
      floor: string;
      useType: string;
      occupancy: string;
      bathroom: string;
      kitchen: string;
      furnished: string;
      furniture: string;
      bedSize: string;
      elevator: string;
      parking: string;
      tenantPetsAllowed: string;
      homePets: string;
      homePetType: string;
      smokingCondition: string;
      keyDepositAmount: string;
      utilities: string;
      houseRules: string;
      additionalNote: string;
      moveInQuestions: string;
    };
  };
  detailOptions: {
    useTypes: string[];
    yesNoConfirm: string[];
    occupancy: string[];
    bathroom: string[];
    kitchen: string[];
    furniture: string[];
    bedSize: string[];
    petAllowed: string[];
    homePets: string[];
    smoking: string[];
    utilities: string[];
    utilityStatus: string[];
    houseRules: string[];
  };
  newListing: {
    title: string;
    subtitle: string;
    cardTitle: string;
    cardBody: string;
  };
  inquiries: {
    title: string;
    subtitle: string;
    mvpNote: string;
    emptyTitle: string;
    emptyBody: string;
    summary: Record<LandlordInquirySummaryKey, string>;
    statusLabels: Record<LandlordInquiryStatusKey, string>;
    fields: {
      type: string;
      listing: string;
      inquirer: string;
      replyStatus: string;
      note: string;
      detail: string;
    };
    action: string;
    detailComingSoon: string;
    items: LandlordMockInquiry[];
  };
  profile: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyBody: string;
    fields: {
      role: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      preferredContactMethods: string;
      preferredLanguages: string;
      memo: string;
    };
  };
};

const CENTER_COPY: Record<Locale, CenterCopy> = {
  ko: {
    breadcrumb: { home: "홈", center: "임대인 센터" },
    nav: {
      dashboard: "센터 홈",
      listings: "매물 관리",
      inquiries: "문의 관리",
      profile: "임대인 정보",
    },
    common: {
      emptyValue: "미입력",
      comingSoon: "준비 중",
      addListing: "새 매물 등록하기",
      goRegister: "임대인 등록으로 이동",
      viewDetails: "자세히 보기",
      previewPublicPage: "공개페이지 미리보기",
    },
    dashboard: {
      title: "임대인 센터",
      subtitle: "등록한 매물, 입주 문의, 임대인 정보를 한곳에서 관리하는 공간입니다.",
      cards: {
        listings: "등록 매물",
        pendingInquiries: "문의 대기",
        needsReview: "검토 필요",
        recentUpdates: "최근 업데이트",
      },
      notice:
        "이 화면은 임대인 센터 MVP 미리보기입니다. 실제 로그인, 매물 저장, 문의 수신 기능은 아직 연결되어 있지 않습니다.",
      emptyTitle: "아직 임대인 등록이 완료되지 않았습니다.",
      emptyBody: "임대인 기본 정보와 첫 매물을 먼저 등록해 주세요.",
      onboardingButton: "임대인 등록 및 첫 매물 등록 시작하기",
    },
    listings: {
      title: "매물 관리",
      subtitle: "등록한 매물 초안과 이후 추가될 매물 관리 흐름을 확인하는 공간입니다.",
      draftTitle: "최근 작성한 최초 매물 초안",
      firstDraftLabel: "첫 매물 초안",
      emptyTitle: "아직 등록한 매물 초안이 없습니다.",
      emptyBody: "첫 임대인 등록 흐름에서 기본 정보와 첫 매물을 먼저 정리해 주세요.",
      startFirstListing: "첫 매물 등록하러 가기",
      statusLabel: "검토 전",
      detailsIncomplete: "상세정보 미완성",
      detailsPartial: "상세정보 일부 입력됨",
      completeBeforeInquiry: "문의 전 보완 필요",
      viewDraft: "초안 보기",
      completeDetails: "상세정보 보완",
      noCoverPhoto: "대표사진 없음",
      fields: {
        listingTitle: "매물 제목",
        city: "도시",
        area: "지역",
        nearestStation: "가까운 역",
        address: "상세 주소",
        monthlyRent: "월세",
        availableFrom: "입주 가능일",
        minimumStay: "최소 거주",
        housingType: "주거 형태",
        residentCondition: "거주 조건",
        photos: "사진",
        status: "상태",
        detailsStatus: "상세정보",
      },
    },
    draftDetail: {
      title: "첫 매물 초안",
      subtitle: "빠른 등록 단계에서 만든 첫 매물 초안을 임대인 센터에서 확인합니다.",
      notice:
        "첫 등록 단계에서는 빠른 초안 생성을 위해 상세정보 입력을 줄였습니다. 실제 문의·예약·계약 단계로 넘어가기 전에는 아래 정보를 보완해야 합니다.",
      checklistTitle: "상세정보 보완 필요 항목",
      cta: "상세정보 보완하기",
      checklistItems: [
        "공과금",
        "보증금",
        "하우스 룰",
        "반려동물·흡연",
        "방·공유공간 정보",
        "입주 전 확인 질문",
      ],
    },
    detailForm: {
      title: "매물 상세정보 보완",
      subtitle:
        "실제 문의·예약·계약 전 세입자와 서로 확인해야 할 조건을 정리합니다.",
      save: "상세정보 임시 저장",
      saved: "상세정보 초안이 이 브라우저에 저장되었습니다.",
      readinessTitle: "문의·예약 전 준비도",
      readinessStatus: "상세정보 보완 필요",
      readinessItems: [
        "기본 정보 입력됨",
        "사진 업로드됨",
        "조건 정보 확인 필요",
        "하우스 룰 확인 필요",
        "공과금 확인 필요",
      ],
      sections: {
        location: "A. 위치·공간 상세",
        room: "B. 방·공유공간",
        living: "C. 생활 조건",
        money: "D. 보증금·공과금",
        rules: "E. 하우스 룰",
        questions: "F. 입주 전 확인 질문",
      },
      fields: {
        unitDetail: "유닛 상세",
        floor: "층수",
        useType: "이용 형태",
        occupancy: "인원",
        bathroom: "욕실",
        kitchen: "주방",
        furnished: "가구 포함",
        furniture: "포함 가구",
        bedSize: "침대 크기",
        elevator: "엘리베이터",
        parking: "주차",
        tenantPetsAllowed: "입주자 반려동물 가능 여부",
        homePets: "현재 집에 반려동물이 있나요?",
        homePetType: "동물 종류",
        smokingCondition: "흡연 조건",
        keyDepositAmount: "열쇠 보증금",
        utilities: "공과금",
        houseRules: "하우스 룰",
        additionalNote: "추가 메모",
        moveInQuestions: "입주 전 확인 질문",
      },
    },
    detailOptions: {
      useTypes: ["전체 유닛", "개인 방", "공유 방"],
      yesNoConfirm: ["예", "아니오", "확인 필요"],
      occupancy: ["1명", "2명", "협의"],
      bathroom: ["개인 욕실", "공용 욕실", "방 안 욕실", "협의"],
      kitchen: ["개인 주방", "공용 주방", "없음/협의"],
      furniture: ["침대", "매트리스", "책상", "의자", "옷장", "침구"],
      bedSize: ["싱글", "더블", "퀸", "확인 필요"],
      petAllowed: ["가능", "불가", "협의 필요"],
      homePets: ["없음", "있음"],
      smoking: ["금연", "실외만 가능", "협의 필요"],
      utilities: ["전기/hydro", "난방", "수도", "가스", "인터넷", "세탁", "주차"],
      utilityStatus: ["월세 포함", "입주자 별도", "확인 필요"],
      houseRules: ["금연", "조용한 시간 준수", "방문객 사전 협의", "공용공간 정리", "파티 불가", "실내 신발 착용 금지", "쓰레기 분리배출", "기타 협의"],
    },
    newListing: {
      title: "추가 매물 등록",
      subtitle:
        "임대인 기본 정보는 다시 입력하지 않고, 새 매물 정보만 정리하는 흐름으로 확장할 예정입니다.",
      cardTitle: "추가 매물 등록 흐름 준비 중",
      cardBody:
        "추가 매물 등록은 임대인 기본 정보 등록 후 사용할 수 있는 흐름으로 확장할 예정입니다.",
    },
    inquiries: {
      title: "문의 관리",
      subtitle: "MapleHouse가 정리한 예비 입주자 문의를 한 곳에서 확인하는 mock 화면입니다.",
      mvpNote: "실제 메시지 발송, 답변, 계약, 결제는 아직 연결되어 있지 않습니다.",
      emptyTitle: "아직 접수된 입주 문의가 없습니다.",
      emptyBody:
        "입주 문의가 들어오면 입주 날짜, 예산, 체류 기간, 인원, 확인 질문을 정리해 보여줄 예정입니다.",
      summary: {
        total: "전체 문의",
        new: "새 문의",
        needsReview: "확인 필요",
        waitingLandlord: "임대인 답변 대기",
        reservationReview: "예약 검토",
      },
      statusLabels: {
        new: "새 문의",
        needsReview: "확인 필요",
        waitingLandlord: "임대인 답변 대기",
        waitingTenant: "세입자 확인 대기",
        reservationReview: "예약 검토",
        closed: "종료",
      },
      fields: {
        type: "구분",
        listing: "매물명",
        inquirer: "문의자",
        replyStatus: "답변 상태",
        note: "비고",
        detail: "상세",
      },
      action: "상세 보기",
      detailComingSoon: "상세 mock 예정",
      items: [
        {
          id: "INQ-2026-001",
          status: "new",
          listing: "Koreatown 1BR 코지 스튜디오",
          inquirer: "MEHA KIM",
          replyStatus: "확인 전",
          note: "입주 가능일과 초기 입금액 확인 필요",
        },
        {
          id: "INQ-2026-002",
          status: "needsReview",
          listing: "North York 역세권 룸렌트",
          inquirer: "JIWON PARK",
          replyStatus: "확인 항목 정리 중",
          note: "룸메이트 구성과 공용공간 규칙 확인 필요",
        },
        {
          id: "INQ-2026-003",
          status: "waitingLandlord",
          listing: "Downtown furnished studio",
          inquirer: "MINSEO LEE",
          replyStatus: "임대인 답변 대기",
          note: "포함 항목과 추가 비용 문의 완료",
        },
        {
          id: "INQ-2026-004",
          status: "waitingTenant",
          listing: "Finch station shared house",
          inquirer: "HANA CHOI",
          replyStatus: "답변 도착",
          note: "세입자에게 답변 설명 예정",
        },
        {
          id: "INQ-2026-005",
          status: "new",
          listing: "Midtown condo room",
          inquirer: "DOYUN JUNG",
          replyStatus: "확인 전",
          note: "예약 가능 여부와 취소 조건 확인 필요",
        },
        {
          id: "INQ-2026-006",
          status: "needsReview",
          listing: "Scarborough basement unit",
          inquirer: "SORA YANG",
          replyStatus: "확인 항목 정리 중",
          note: "채광, 습기, 출입구 분리 여부 확인 필요",
        },
      ],
    },
    profile: {
      title: "임대인 정보",
      subtitle: "추가 매물 등록 때 다시 입력하지 않을 기본 정보를 확인하는 공간입니다.",
      emptyTitle: "아직 임대인 기본 정보가 없습니다.",
      emptyBody: "임대인 등록을 먼저 진행하면 이름, 연락처, 선호 연락 방법이 이곳에 표시됩니다.",
      fields: {
        role: "역할",
        firstName: "이름",
        lastName: "성",
        email: "이메일",
        phone: "전화번호",
        preferredContactMethods: "선호 연락",
        preferredLanguages: "선호 언어",
        memo: "메모",
      },
    },
  },
  en: {
    breadcrumb: { home: "Home", center: "Landlord center" },
    nav: {
      dashboard: "Center home",
      listings: "Listings",
      inquiries: "Inquiry management",
      profile: "Landlord profile",
    },
    common: {
      emptyValue: "Not entered",
      comingSoon: "Coming soon",
      addListing: "Add new listing",
      goRegister: "Go to landlord registration",
      viewDetails: "View details",
      previewPublicPage: "Public preview",
    },
    dashboard: {
      title: "Landlord center",
      subtitle: "Manage your listings, tenant inquiries, and landlord profile in one place.",
      cards: {
        listings: "Listings",
        pendingInquiries: "Pending inquiries",
        needsReview: "Needs review",
        recentUpdates: "Recent updates",
      },
      notice:
        "This is a landlord center MVP preview. Real login, listing storage, and inquiry receiving are not connected yet.",
      emptyTitle: "Landlord registration is not complete yet.",
      emptyBody: "Start by adding your landlord profile and first listing.",
      onboardingButton: "Start landlord registration and first listing",
    },
    listings: {
      title: "Listings",
      subtitle: "Review listing drafts and the future multiple-listing management flow.",
      draftTitle: "Recent first listing draft",
      firstDraftLabel: "First listing draft",
      emptyTitle: "No listing drafts yet.",
      emptyBody: "Start with landlord registration to organize your profile and first listing.",
      startFirstListing: "Start first listing",
      statusLabel: "Not reviewed",
      detailsIncomplete: "Details incomplete",
      detailsPartial: "Some details added",
      completeBeforeInquiry: "Complete before inquiry",
      viewDraft: "View",
      completeDetails: "Complete details",
      noCoverPhoto: "No cover photo",
      fields: {
        listingTitle: "Listing title",
        city: "City",
        area: "Area",
        nearestStation: "Nearest station",
        address: "Detailed address",
        monthlyRent: "Monthly rent",
        availableFrom: "Available from",
        minimumStay: "Minimum stay",
        housingType: "Housing type",
        residentCondition: "Shared-living preference",
        photos: "Photos",
        status: "Status",
        detailsStatus: "Detail status",
      },
    },
    draftDetail: {
      title: "First listing draft",
      subtitle: "Review the first listing draft created from the quick onboarding flow.",
      notice:
        "The first onboarding step keeps listing creation quick. Before moving toward real inquiries, reservations, or agreements, these details should be completed.",
      checklistTitle: "Details to complete",
      cta: "Complete details",
      checklistItems: [
        "Utilities",
        "Deposits",
        "House rules",
        "Pets & smoking",
        "Room & shared-space details",
        "Move-in confirmation questions",
      ],
    },
    detailForm: {
      title: "Complete listing details",
      subtitle:
        "Organize the details that should be confirmed with the tenant before any real inquiry, reservation, or agreement.",
      save: "Save details draft",
      saved: "The detail draft has been saved in this browser.",
      readinessTitle: "Inquiry readiness",
      readinessStatus: "Details needed",
      readinessItems: [
        "Basic information complete",
        "Photos uploaded",
        "Terms incomplete",
        "House rules incomplete",
        "Utilities incomplete",
      ],
      sections: {
        location: "A. Location & property details",
        room: "B. Room & shared spaces",
        living: "C. Living conditions",
        money: "D. Deposits & utilities",
        rules: "E. House rules",
        questions: "F. Move-in confirmation questions",
      },
      fields: {
        unitDetail: "Unit detail",
        floor: "Floor",
        useType: "Use type",
        occupancy: "Occupancy",
        bathroom: "Bathroom",
        kitchen: "Kitchen",
        furnished: "Furnished",
        furniture: "Included furniture",
        bedSize: "Bed size",
        elevator: "Elevator",
        parking: "Parking",
        tenantPetsAllowed: "Are tenant pets allowed?",
        homePets: "Are there pets already living in the home?",
        homePetType: "Pet type",
        smokingCondition: "Smoking policy",
        keyDepositAmount: "Key deposit",
        utilities: "Utilities",
        houseRules: "House rules",
        additionalNote: "Additional note",
        moveInQuestions: "Move-in confirmation questions",
      },
    },
    detailOptions: {
      useTypes: ["Entire unit", "Private room", "Shared room"],
      yesNoConfirm: ["Yes", "No", "To confirm"],
      occupancy: ["1 person", "2 people", "Flexible"],
      bathroom: ["Private bathroom", "Shared bathroom", "Ensuite", "To confirm"],
      kitchen: ["Private kitchen", "Shared kitchen", "None/to confirm"],
      furniture: ["Bed", "Mattress", "Desk", "Chair", "Wardrobe", "Bedding"],
      bedSize: ["Single", "Double", "Queen", "To confirm"],
      petAllowed: ["Allowed", "Not allowed", "To discuss"],
      homePets: ["No", "Yes"],
      smoking: ["No smoking", "Outdoor only", "To discuss"],
      utilities: ["Electricity / Hydro", "Heat", "Water", "Gas", "Internet", "Laundry", "Parking"],
      utilityStatus: ["Included", "Tenant pays separately", "To confirm"],
      houseRules: ["Non-smoking", "Quiet hours", "Visitors by discussion", "Keep shared areas clean", "No parties", "No shoes indoors", "Sort garbage/recycling", "Other to discuss"],
    },
    newListing: {
      title: "Add a new listing",
      subtitle: "Your landlord profile will be reused. Only the new listing information will be organized.",
      cardTitle: "Additional listing flow coming soon",
      cardBody:
        "Additional listing registration will be available after landlord profile setup.",
    },
    inquiries: {
      title: "Inquiry management",
      subtitle: "A mock page for reviewing prospective tenant inquiries organized by MapleHouse.",
      mvpNote: "Real messaging, replies, contracts, and payments are not connected yet.",
      emptyTitle: "No tenant inquiries yet.",
      emptyBody:
        "When tenant inquiries arrive, this page can organize move-in date, budget, length of stay, occupants, and confirmation questions.",
      summary: {
        total: "All inquiries",
        new: "New inquiries",
        needsReview: "Needs review",
        waitingLandlord: "Waiting for landlord reply",
        reservationReview: "Reservation review",
      },
      statusLabels: {
        new: "New inquiry",
        needsReview: "Needs review",
        waitingLandlord: "Waiting for landlord reply",
        waitingTenant: "Waiting for tenant confirmation",
        reservationReview: "Reservation review",
        closed: "Closed",
      },
      fields: {
        type: "Type",
        listing: "Listing",
        inquirer: "Inquirer",
        replyStatus: "Reply status",
        note: "Note",
        detail: "Detail",
      },
      action: "View details",
      detailComingSoon: "Detail mock coming",
      items: [
        {
          id: "INQ-2026-001",
          status: "new",
          listing: "Koreatown 1BR cozy studio",
          inquirer: "MEHA KIM",
          replyStatus: "Not reviewed",
          note: "Confirm availability and initial payment amount",
        },
        {
          id: "INQ-2026-002",
          status: "needsReview",
          listing: "North York transit room rental",
          inquirer: "JIWON PARK",
          replyStatus: "Organizing items to confirm",
          note: "Confirm roommate composition and shared-space rules",
        },
        {
          id: "INQ-2026-003",
          status: "waitingLandlord",
          listing: "Downtown furnished studio",
          inquirer: "MINSEO LEE",
          replyStatus: "Waiting for landlord reply",
          note: "Included items and extra costs already asked",
        },
        {
          id: "INQ-2026-004",
          status: "waitingTenant",
          listing: "Finch station shared house",
          inquirer: "HANA CHOI",
          replyStatus: "Reply received",
          note: "Explain landlord reply to tenant",
        },
        {
          id: "INQ-2026-005",
          status: "new",
          listing: "Midtown condo room",
          inquirer: "DOYUN JUNG",
          replyStatus: "Not reviewed",
          note: "Confirm reservation availability and cancellation terms",
        },
        {
          id: "INQ-2026-006",
          status: "needsReview",
          listing: "Scarborough basement unit",
          inquirer: "SORA YANG",
          replyStatus: "Organizing items to confirm",
          note: "Confirm daylight, moisture, and separate entrance",
        },
      ],
    },
    profile: {
      title: "Landlord profile",
      subtitle: "Review the profile information that can be reused for future listings.",
      emptyTitle: "No landlord profile information yet.",
      emptyBody: "Start landlord registration first to show your name, contact details, and preferences here.",
      fields: {
        role: "Role",
        firstName: "First name",
        lastName: "Last name",
        email: "Email",
        phone: "Phone",
        preferredContactMethods: "Preferred contact",
        preferredLanguages: "Preferred languages",
        memo: "Memo",
      },
    },
  },
  fr: {
    breadcrumb: { home: "Accueil", center: "Espace propriétaire" },
    nav: {
      dashboard: "Accueil du centre",
      listings: "Annonces",
      inquiries: "Gestion des demandes",
      profile: "Profil propriétaire",
    },
    common: {
      emptyValue: "Non renseigné",
      comingSoon: "Bientôt disponible",
      addListing: "Ajouter une annonce",
      goRegister: "Aller à l’inscription propriétaire",
      viewDetails: "Voir le détail",
      previewPublicPage: "Aperçu public",
    },
    dashboard: {
      title: "Espace propriétaire",
      subtitle: "Gérez vos annonces, les demandes des locataires et votre profil propriétaire au même endroit.",
      cards: {
        listings: "Annonces",
        pendingInquiries: "Demandes en attente",
        needsReview: "À vérifier",
        recentUpdates: "Mises à jour récentes",
      },
      notice:
        "Il s’agit d’un aperçu MVP de l’espace propriétaire. La connexion réelle, l’enregistrement des annonces et la réception des demandes ne sont pas encore connectés.",
      emptyTitle: "L’inscription propriétaire n’est pas encore terminée.",
      emptyBody: "Commencez par ajouter votre profil propriétaire et votre première annonce.",
      onboardingButton: "Commencer l’inscription propriétaire et la première annonce",
    },
    listings: {
      title: "Annonces",
      subtitle: "Consultez les brouillons d’annonces et le futur flux de gestion de plusieurs annonces.",
      draftTitle: "Brouillon récent de première annonce",
      firstDraftLabel: "Premier brouillon d’annonce",
      emptyTitle: "Aucun brouillon d’annonce pour le moment.",
      emptyBody: "Commencez par l’inscription propriétaire pour organiser votre profil et votre première annonce.",
      startFirstListing: "Commencer la première annonce",
      statusLabel: "Non examiné",
      detailsIncomplete: "Détails incomplets",
      detailsPartial: "Certains détails ajoutés",
      completeBeforeInquiry: "À compléter avant une demande",
      viewDraft: "Voir",
      completeDetails: "Compléter",
      noCoverPhoto: "Aucune photo principale",
      fields: {
        listingTitle: "Titre de l’annonce",
        city: "Ville",
        area: "Secteur",
        nearestStation: "Station proche",
        address: "Adresse détaillée",
        monthlyRent: "Loyer mensuel",
        availableFrom: "Disponible à partir de",
        minimumStay: "Séjour minimum",
        housingType: "Type de logement",
        residentCondition: "Préférence de cohabitation",
        photos: "Photos",
        status: "Statut",
        detailsStatus: "Statut des détails",
      },
    },
    draftDetail: {
      title: "Premier brouillon d’annonce",
      subtitle: "Consultez le premier brouillon créé avec l’onboarding rapide.",
      notice:
        "La première étape d’inscription reste volontairement rapide. Avant de passer à une demande, une réservation ou un accord réel, ces détails devront être complétés.",
      checklistTitle: "Détails à compléter",
      cta: "Compléter",
      checklistItems: [
        "Services",
        "Dépôts",
        "Règles de la maison",
        "Animaux et tabac",
        "Chambre et espaces partagés",
        "Questions avant l’arrivée",
      ],
    },
    detailForm: {
      title: "Compléter les détails de l’annonce",
      subtitle:
        "Organisez les informations à confirmer avec le locataire avant toute demande, réservation ou accord réel.",
      save: "Enregistrer le brouillon des détails",
      saved: "Le brouillon des détails a été enregistré dans ce navigateur.",
      readinessTitle: "Préparation avant demande",
      readinessStatus: "Détails à compléter",
      readinessItems: [
        "Informations de base complètes",
        "Photos téléversées",
        "Conditions incomplètes",
        "Règles de la maison incomplètes",
        "Services incomplets",
      ],
      sections: {
        location: "A. Emplacement & détails du logement",
        room: "B. Chambre et espaces partagés",
        living: "C. Conditions de vie",
        money: "D. Dépôts & services",
        rules: "E. Règles de la maison",
        questions: "F. Questions avant l’arrivée",
      },
      fields: {
        unitDetail: "Détail du logement",
        floor: "Étage",
        useType: "Type d’usage",
        occupancy: "Occupation",
        bathroom: "Salle de bain",
        kitchen: "Cuisine",
        furnished: "Meublé",
        furniture: "Meubles inclus",
        bedSize: "Taille du lit",
        elevator: "Ascenseur",
        parking: "Stationnement",
        tenantPetsAllowed: "Animaux du locataire acceptés ?",
        homePets: "Y a-t-il déjà des animaux dans le logement ?",
        homePetType: "Type d’animal",
        smokingCondition: "Règle concernant le tabac",
        keyDepositAmount: "Dépôt de clé",
        utilities: "Services",
        houseRules: "Règles de la maison",
        additionalNote: "Note supplémentaire",
        moveInQuestions: "Questions avant l’arrivée",
      },
    },
    detailOptions: {
      useTypes: ["Logement entier", "Chambre privée", "Chambre partagée"],
      yesNoConfirm: ["Oui", "Non", "À confirmer"],
      occupancy: ["1 personne", "2 personnes", "Flexible"],
      bathroom: ["Salle de bain privée", "Salle de bain partagée", "Attenante", "À confirmer"],
      kitchen: ["Cuisine privée", "Cuisine partagée", "Aucune/à confirmer"],
      furniture: ["Lit", "Matelas", "Bureau", "Chaise", "Armoire", "Literie"],
      bedSize: ["Simple", "Double", "Queen", "À confirmer"],
      petAllowed: ["Acceptés", "Non acceptés", "À discuter"],
      homePets: ["Non", "Oui"],
      smoking: ["Non-fumeur", "Extérieur seulement", "À discuter"],
      utilities: ["Électricité / Hydro", "Chauffage", "Eau", "Gaz", "Internet", "Buanderie", "Stationnement"],
      utilityStatus: ["Inclus", "Payé séparément", "À confirmer"],
      houseRules: ["Non-fumeur", "Heures calmes", "Visiteurs à discuter", "Garder les espaces communs propres", "Pas de fêtes", "Pas de chaussures à l’intérieur", "Tri des déchets", "Autre à discuter"],
    },
    newListing: {
      title: "Ajouter une nouvelle annonce",
      subtitle:
        "Votre profil propriétaire sera réutilisé. Seules les informations de la nouvelle annonce seront organisées.",
      cardTitle: "Flux d’ajout d’annonce bientôt disponible",
      cardBody:
        "L’ajout d’annonces supplémentaires sera disponible après la configuration du profil propriétaire.",
    },
    inquiries: {
      title: "Gestion des demandes",
      subtitle: "Écran mock pour consulter au même endroit les demandes de locataires préparées par MapleHouse.",
      mvpNote: "L’envoi réel des messages, les réponses, les contrats et les paiements ne sont pas encore connectés.",
      emptyTitle: "Aucune demande de locataire pour le moment.",
      emptyBody:
        "Lorsque des demandes de locataires arriveront, cette page pourra organiser la date d’arrivée, le budget, la durée du séjour, le nombre d’occupants et les questions de confirmation.",
      summary: {
        total: "Toutes les demandes",
        new: "Nouvelles demandes",
        needsReview: "À vérifier",
        waitingLandlord: "Réponse propriétaire attendue",
        reservationReview: "Réservation à examiner",
      },
      statusLabels: {
        new: "Nouvelle demande",
        needsReview: "À vérifier",
        waitingLandlord: "En attente de réponse du propriétaire",
        waitingTenant: "En attente de confirmation du locataire",
        reservationReview: "Réservation à examiner",
        closed: "Clôturée",
      },
      fields: {
        type: "Type",
        listing: "Logement",
        inquirer: "Demandeur",
        replyStatus: "Statut de réponse",
        note: "Note",
        detail: "Détail",
      },
      action: "Voir le détail",
      detailComingSoon: "Détail mock à venir",
      items: [
        {
          id: "INQ-2026-001",
          status: "new",
          listing: "Studio 1 chambre cozy à Koreatown",
          inquirer: "MEHA KIM",
          replyStatus: "Non vérifié",
          note: "Confirmer la disponibilité et le montant initial",
        },
        {
          id: "INQ-2026-002",
          status: "needsReview",
          listing: "Chambre près du transport à North York",
          inquirer: "JIWON PARK",
          replyStatus: "Points à confirmer en cours",
          note: "Confirmer les colocataires et les règles communes",
        },
        {
          id: "INQ-2026-003",
          status: "waitingLandlord",
          listing: "Studio meublé au centre-ville",
          inquirer: "MINSEO LEE",
          replyStatus: "Réponse propriétaire attendue",
          note: "Éléments inclus et frais supplémentaires déjà demandés",
        },
        {
          id: "INQ-2026-004",
          status: "waitingTenant",
          listing: "Maison partagée près de Finch station",
          inquirer: "HANA CHOI",
          replyStatus: "Réponse reçue",
          note: "Réponse à expliquer au locataire",
        },
        {
          id: "INQ-2026-005",
          status: "new",
          listing: "Chambre en condo à Midtown",
          inquirer: "DOYUN JUNG",
          replyStatus: "Non vérifié",
          note: "Confirmer la réservation et l’annulation",
        },
        {
          id: "INQ-2026-006",
          status: "needsReview",
          listing: "Unité en sous-sol à Scarborough",
          inquirer: "SORA YANG",
          replyStatus: "Points à confirmer en cours",
          note: "Confirmer lumière, humidité et entrée séparée",
        },
      ],
    },
    profile: {
      title: "Profil propriétaire",
      subtitle: "Consultez les informations de profil qui pourront être réutilisées pour de futures annonces.",
      emptyTitle: "Aucune information de profil propriétaire pour le moment.",
      emptyBody:
        "Commencez l’inscription propriétaire pour afficher ici votre nom, vos coordonnées et vos préférences.",
      fields: {
        role: "Rôle",
        firstName: "Prénom",
        lastName: "Nom",
        email: "E-mail",
        phone: "Téléphone",
        preferredContactMethods: "Contact préféré",
        preferredLanguages: "Langues préférées",
        memo: "Note",
      },
    },
  },
};

const CENTER_NAV_ITEMS = [
  { key: "dashboard", icon: Home, route: "dashboard" },
  { key: "listings", icon: Building2, route: "listings" },
  { key: "inquiries", icon: Inbox, route: "inquiries" },
  { key: "profile", icon: UserRound, route: "profile" },
] as const;

export function LocaleLandlordCenterPage({
  locale,
  page,
}: {
  locale: Locale;
  page: LandlordCenterPage;
}) {
  const copy = CENTER_COPY[locale];
  const [draft, setDraft] = useState<LandlordCenterDraft | null>(null);
  const [detailDraft, setDetailDraft] = useState<LandlordListingDetailsDraft | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const rawDraft = window.sessionStorage.getItem(LANDLORD_CENTER_DRAFT_KEY);
      const rawDetailDraft = window.sessionStorage.getItem(LANDLORD_LISTING_DETAILS_DRAFT_KEY);
      setDraft(rawDraft ? (JSON.parse(rawDraft) as LandlordCenterDraft) : null);
      setDetailDraft(
        rawDetailDraft ? (JSON.parse(rawDetailDraft) as LandlordListingDetailsDraft) : null,
      );
    } catch {
      setDraft(null);
      setDetailDraft(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  const hasDraft = useMemo(() => draftHasData(draft), [draft]);
  const hasDetails = useMemo(() => listingDetailsHasData(detailDraft), [detailDraft]);
  const activeNavKey =
    page === "newListing" || page === "listingDraft" || page === "listingDetails"
      ? "listings"
      : page;
  const isDashboard = page === "dashboard";
  const dashboardHasDraft = isDashboard && loaded && hasDraft;
  const heroSubtitle =
    isDashboard && !dashboardHasDraft
      ? `${copy.dashboard.emptyTitle} ${copy.dashboard.emptyBody}`
      : pageSubtitle(copy, page);
  const heroActionHref =
    isDashboard && !dashboardHasDraft
      ? centerRoute(locale, "register")
      : centerRoute(locale, "newListing");
  const heroActionLabel =
    isDashboard && !dashboardHasDraft ? copy.dashboard.onboardingButton : copy.common.addListing;
  const HeroActionIcon = isDashboard && !dashboardHasDraft ? ArrowRight : Plus;

  return (
    <main className="min-h-screen bg-[#F6F7F9] py-10 sm:py-14">
      <Container className="space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Link to={`/${locale}`} className="transition hover:text-primary">
              {copy.breadcrumb.home}
            </Link>
            <span aria-hidden>·</span>
            <span className="text-foreground">{copy.breadcrumb.center}</span>
          </div>
          <div className="flex flex-col gap-4 rounded-[28px] border border-border bg-white p-6 shadow-sm sm:p-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                MapleHouse Landlord Center
              </p>
              <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                {pageTitle(copy, page)}
              </h1>
              <p className="text-base leading-7 text-muted-foreground">
                {heroSubtitle}
              </p>
              {page === "inquiries" ? (
                <p className="inline-flex max-w-full rounded-full border border-primary/20 bg-[#FFF8F1] px-3 py-1.5 text-xs font-bold leading-relaxed text-primary">
                  {copy.inquiries.mvpNote}
                </p>
              ) : null}
            </div>
            {page === "inquiries" ? null : (
              <Link
                to={heroActionHref}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
              >
                <HeroActionIcon className="h-4 w-4" aria-hidden />
                {heroActionLabel}
              </Link>
            )}
          </div>
        </div>

        <nav
          aria-label={copy.breadcrumb.center}
          className="flex gap-2 overflow-x-auto rounded-2xl border border-border bg-white p-2 shadow-sm"
        >
          {CENTER_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.key === activeNavKey;

            return (
              <Link
                key={item.key}
                to={centerRoute(locale, item.route)}
                className={cn(
                  "inline-flex min-w-fit items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition",
                  active
                    ? "bg-[#FFF3E8] text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {copy.nav[item.key]}
              </Link>
            );
          })}
        </nav>

        {page === "dashboard" ? (
          <DashboardPanel copy={copy} locale={locale} hasDraft={hasDraft} loaded={loaded} />
        ) : null}
        {page === "listings" ? (
          <ListingsPanel
            copy={copy}
            locale={locale}
            draft={draft}
            detailDraft={detailDraft}
            hasDraft={hasDraft}
            hasDetails={hasDetails}
            loaded={loaded}
          />
        ) : null}
        {page === "listingDraft" ? (
          <ListingDraftPanel
            copy={copy}
            locale={locale}
            draft={draft}
            detailDraft={detailDraft}
            hasDraft={hasDraft}
            hasDetails={hasDetails}
            loaded={loaded}
          />
        ) : null}
        {page === "listingDetails" ? (
          <ListingDetailsPanel
            copy={copy}
            locale={locale}
            draft={draft}
            detailDraft={detailDraft}
            hasDraft={hasDraft}
            loaded={loaded}
            onDetailsChange={setDetailDraft}
          />
        ) : null}
        {page === "newListing" ? <NewListingPanel copy={copy} /> : null}
        {page === "inquiries" ? <InquiriesPanel copy={copy} /> : null}
        {page === "profile" ? (
          <ProfilePanel copy={copy} locale={locale} draft={draft} hasDraft={hasDraft} loaded={loaded} />
        ) : null}
      </Container>
    </main>
  );
}

function DashboardPanel({
  copy,
  locale,
  hasDraft,
  loaded,
}: {
  copy: CenterCopy;
  locale: Locale;
  hasDraft: boolean;
  loaded: boolean;
}) {
  const count = loaded && hasDraft ? 1 : 0;
  const cards = [
    { label: copy.dashboard.cards.listings, value: count, icon: Building2 },
    { label: copy.dashboard.cards.pendingInquiries, value: 0, icon: Inbox },
    { label: copy.dashboard.cards.needsReview, value: count, icon: ClipboardList },
    { label: copy.dashboard.cards.recentUpdates, value: 0, icon: Home },
  ];

  return (
    <section className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article key={card.label} className="rounded-3xl border border-border bg-white p-5 shadow-sm">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFF3E8] text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <p className="text-sm font-bold text-muted-foreground">{card.label}</p>
              <p className="mt-2 text-3xl font-black text-foreground">{card.value}</p>
            </article>
          );
        })}
      </div>

      {loaded && hasDraft ? (
        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <article className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-foreground">{copy.listings.draftTitle}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {copy.listings.subtitle}
                </p>
              </div>
              <Link
                to={centerRoute(locale, "listings")}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-primary/25 bg-white px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-[#FFF8F1]"
              >
                {copy.common.viewDetails}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </article>

          <aside className="rounded-3xl border border-primary/20 bg-[#FFFDF9] p-6 text-sm leading-6 text-muted-foreground shadow-sm">
            <p className="font-bold text-primary">{copy.breadcrumb.center} MVP</p>
            <p className="mt-2">{copy.dashboard.notice}</p>
          </aside>
        </div>
      ) : (
        <aside className="rounded-3xl border border-primary/20 bg-[#FFFDF9] p-6 text-sm leading-6 text-muted-foreground shadow-sm">
          <p className="font-bold text-primary">{copy.breadcrumb.center} MVP</p>
          <p className="mt-2">{copy.dashboard.notice}</p>
        </aside>
      )}
    </section>
  );
}

function ListingsPanel({
  copy,
  locale,
  draft,
  detailDraft,
  hasDraft,
  hasDetails,
  loaded,
}: {
  copy: CenterCopy;
  locale: Locale;
  draft: LandlordCenterDraft | null;
  detailDraft: LandlordListingDetailsDraft | null;
  hasDraft: boolean;
  hasDetails: boolean;
  loaded: boolean;
}) {
  if (!loaded || !hasDraft || !draft) {
    return (
      <EmptyCard
        title={copy.listings.emptyTitle}
        body={copy.listings.emptyBody}
        actionLabel={copy.listings.startFirstListing}
        actionHref={centerRoute(locale, "register")}
      />
    );
  }

  const title = getListingTitle(copy, draft);
  const coverPhoto = getCoverPhoto(draft);
  const detailStatus = hasDetails ? copy.listings.detailsPartial : copy.listings.detailsIncomplete;
  const rows: Array<[string, unknown]> = [
    [copy.listings.fields.city, draft.city],
    [copy.listings.fields.address, draft.address || draft.area],
    [copy.listings.fields.housingType, draft.housingType],
    [copy.listings.fields.monthlyRent, formatCurrency(draft.monthlyRent)],
    [copy.listings.fields.availableFrom, draft.availableFrom],
    [copy.listings.fields.detailsStatus, detailStatus],
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted-foreground">{copy.listings.subtitle}</p>
        <Link
          to={centerRoute(locale, "newListing")}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {copy.common.addListing}
        </Link>
      </div>

      <article className="rounded-3xl border border-primary/20 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <StatusPill>{copy.listings.firstDraftLabel}</StatusPill>
              <StatusPill>{detailStatus}</StatusPill>
              <StatusPill>{copy.listings.completeBeforeInquiry}</StatusPill>
            </div>
            <h2 className="mt-3 break-words text-2xl font-black leading-tight text-foreground">
              {title}
            </h2>
            <p className="mt-2 text-sm font-bold text-muted-foreground">
              {displayValue(draft.city, copy.common.emptyValue)}
            </p>
          </div>
          <div className="flex min-w-0 flex-wrap gap-2">
            <Link
              to={centerRoute(locale, "listingDraft")}
              className="inline-flex max-w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-primary/25 bg-white px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-[#FFF8F1]"
            >
              {copy.listings.viewDraft}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to={`/${locale}/listings/draft`}
              className="inline-flex max-w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-primary/25 bg-white px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-[#FFF8F1]"
            >
              {copy.common.previewPublicPage}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to={centerRoute(locale, "listingDetails")}
              className="inline-flex max-w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
            >
              {copy.listings.completeDetails}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[236px_minmax(0,1fr)] lg:items-stretch">
          <ListingPhotoFrame
            coverPhoto={coverPhoto}
            label={copy.listings.noCoverPhoto}
            mockSrc={getMockListingThumbnailImage(getDraftMockImageSeed(draft))}
          />

          <div className="min-w-0">
            <dl className="grid h-full gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {rows.map(([label, value]) => (
                <InfoTile
                  key={label}
                  label={label}
                  value={displayValue(value, copy.common.emptyValue)}
                />
              ))}
            </dl>
          </div>
        </div>
      </article>
    </section>
  );
}

function ListingDraftPanel({
  copy,
  locale,
  draft,
  detailDraft,
  hasDraft,
  hasDetails,
  loaded,
}: {
  copy: CenterCopy;
  locale: Locale;
  draft: LandlordCenterDraft | null;
  detailDraft: LandlordListingDetailsDraft | null;
  hasDraft: boolean;
  hasDetails: boolean;
  loaded: boolean;
}) {
  if (!loaded || !hasDraft || !draft) {
    return (
      <EmptyCard
        title={copy.listings.emptyTitle}
        body={copy.listings.emptyBody}
        actionLabel={copy.listings.startFirstListing}
        actionHref={centerRoute(locale, "register")}
      />
    );
  }

  const title = getListingTitle(copy, draft);
  const coverPhoto = getCoverPhoto(draft);
  const rows: Array<[string, unknown]> = [
    [copy.listings.fields.city, draft.city],
    [copy.listings.fields.address, draft.address || draft.area],
    [copy.listings.fields.housingType, draft.housingType],
    [copy.listings.fields.residentCondition, draft.residentCondition],
    [copy.listings.fields.monthlyRent, formatCurrency(draft.monthlyRent)],
    [copy.listings.fields.availableFrom, draft.availableFrom],
    [copy.listings.fields.minimumStay, draft.minimumStay],
    [copy.listings.fields.photos, formatPhotoCount(draft.photos, copy.common.emptyValue)],
    [copy.listings.fields.detailsStatus, hasDetails ? copy.listings.detailsPartial : copy.listings.detailsIncomplete],
  ];

  return (
    <section className="space-y-5">
      <article className="rounded-3xl border border-primary/20 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <StatusPill>{copy.listings.firstDraftLabel}</StatusPill>
            <h2 className="mt-3 break-words text-2xl font-black leading-tight text-foreground">{title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              {copy.draftDetail.notice}
            </p>
          </div>
          <div className="flex min-w-0 flex-wrap gap-2">
            <Link
              to={`/${locale}/listings/draft`}
              className="inline-flex max-w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-primary/25 bg-white px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-[#FFF8F1]"
            >
              {copy.common.previewPublicPage}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to={centerRoute(locale, "listingDetails")}
              className="inline-flex max-w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
            >
              {copy.draftDetail.cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:items-stretch">
          <ListingPhotoFrame
            coverPhoto={coverPhoto}
            label={copy.listings.noCoverPhoto}
            mockSrc={getMockListingThumbnailImage(getDraftMockImageSeed(draft))}
            size="large"
          />

          <div className="min-w-0">
            <dl className="grid h-full gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {rows.map(([label, value]) => (
                <InfoTile
                  key={label}
                  label={label}
                  value={displayValue(value, copy.common.emptyValue)}
                />
              ))}
            </dl>
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-foreground">{copy.draftDetail.checklistTitle}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {copy.draftDetail.checklistItems.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-border bg-[#FAFAFA] p-4"
            >
              <CheckCircle className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <span className="text-sm font-bold text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function ListingDetailsPanel({
  copy,
  locale,
  draft,
  detailDraft,
  hasDraft,
  loaded,
  onDetailsChange,
}: {
  copy: CenterCopy;
  locale: Locale;
  draft: LandlordCenterDraft | null;
  detailDraft: LandlordListingDetailsDraft | null;
  hasDraft: boolean;
  loaded: boolean;
  onDetailsChange: (draft: LandlordListingDetailsDraft) => void;
}) {
  const [form, setForm] = useState<LandlordListingDetailsDraft>(() =>
    buildListingDetailsForm(draft, detailDraft),
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(buildListingDetailsForm(draft, detailDraft));
  }, [draft, detailDraft]);

  if (!loaded || !hasDraft || !draft) {
    return (
      <EmptyCard
        title={copy.listings.emptyTitle}
        body={copy.listings.emptyBody}
        actionLabel={copy.listings.startFirstListing}
        actionHref={centerRoute(locale, "register")}
      />
    );
  }

  const updateField = (field: keyof LandlordListingDetailsDraft, value: string) => {
    setSaved(false);
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateArrayField = (field: "furniture" | "houseRuleItems", value: string) => {
    setSaved(false);
    setForm((current) => ({
      ...current,
      [field]: toggleValue(current[field], value),
    }));
  };

  const updateUtility = (utility: string, status: string) => {
    setSaved(false);
    setForm((current) => ({
      ...current,
      utilityStatuses: { ...current.utilityStatuses, [utility]: status },
    }));
  };

  const handleSave = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(LANDLORD_LISTING_DETAILS_DRAFT_KEY, JSON.stringify(form));
    }
    onDetailsChange(form);
    setSaved(true);
  };

  const title = getListingTitle(copy, draft);
  const coverPhoto = getCoverPhoto(draft);
  const detailStatus = listingDetailsHasData(form)
    ? copy.listings.detailsPartial
    : copy.listings.detailsIncomplete;
  const summaryRows: Array<[string, unknown]> = [
    [copy.listings.fields.city, draft.city],
    [copy.listings.fields.address, draft.address || form.area || draft.area],
    [copy.listings.fields.housingType, draft.housingType],
    [copy.listings.fields.monthlyRent, formatCurrency(draft.monthlyRent)],
    [copy.listings.fields.availableFrom, draft.availableFrom],
    [copy.listings.fields.detailsStatus, detailStatus],
  ];

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-5">
        <article className="rounded-3xl border border-primary/20 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <StatusPill>{copy.listings.firstDraftLabel}</StatusPill>
              <h2 className="mt-3 break-words text-2xl font-black leading-tight text-foreground">{title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                {copy.draftDetail.notice}
              </p>
            </div>
            <div className="flex min-w-0 flex-wrap gap-2">
              <Link
                to={`/${locale}/listings/draft`}
                className="inline-flex max-w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-primary/25 bg-white px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-[#FFF8F1]"
              >
                {copy.common.previewPublicPage}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                to={centerRoute(locale, "listingDetails")}
                className="inline-flex max-w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
              >
                {copy.draftDetail.cta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:items-stretch">
            <ListingPhotoFrame
              coverPhoto={coverPhoto}
              label={copy.listings.noCoverPhoto}
              mockSrc={getMockListingThumbnailImage(getDraftMockImageSeed(draft))}
              size="large"
            />

            <div className="min-w-0">
              <dl className="grid h-full gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {summaryRows.map(([label, value]) => (
                  <InfoTile
                    key={label}
                    label={label}
                    value={displayValue(value, copy.common.emptyValue)}
                  />
                ))}
              </dl>
            </div>
          </div>
        </article>

        <DetailSection title={copy.detailForm.sections.location}>
          <div className="grid gap-4 md:grid-cols-2">
            <CenterField
              label={copy.listings.fields.area}
              value={form.area}
              onChange={(value) => updateField("area", value)}
            />
            <CenterField
              label={copy.listings.fields.nearestStation}
              value={form.nearestStation}
              onChange={(value) => updateField("nearestStation", value)}
            />
            <CenterField
              label={copy.detailForm.fields.unitDetail}
              value={form.unitDetail}
              onChange={(value) => updateField("unitDetail", value)}
            />
            <CenterField
              label={copy.detailForm.fields.floor}
              value={form.floor}
              onChange={(value) => updateField("floor", value)}
            />
            <CenterSelect
              label={copy.detailForm.fields.useType}
              value={form.useType}
              options={copy.detailOptions.useTypes}
              emptyLabel={copy.common.emptyValue}
              onChange={(value) => updateField("useType", value)}
            />
          </div>
        </DetailSection>

        <DetailSection title={copy.detailForm.sections.room}>
          <div className="grid gap-4 md:grid-cols-2">
            <CenterSelect
              label={copy.detailForm.fields.occupancy}
              value={form.occupancy}
              options={copy.detailOptions.occupancy}
              emptyLabel={copy.common.emptyValue}
              onChange={(value) => updateField("occupancy", value)}
            />
            <CenterSelect
              label={copy.detailForm.fields.bathroom}
              value={form.bathroom}
              options={copy.detailOptions.bathroom}
              emptyLabel={copy.common.emptyValue}
              onChange={(value) => updateField("bathroom", value)}
            />
            <CenterSelect
              label={copy.detailForm.fields.kitchen}
              value={form.kitchen}
              options={copy.detailOptions.kitchen}
              emptyLabel={copy.common.emptyValue}
              onChange={(value) => updateField("kitchen", value)}
            />
            <CenterSelect
              label={copy.detailForm.fields.furnished}
              value={form.furnished}
              options={copy.detailOptions.yesNoConfirm}
              emptyLabel={copy.common.emptyValue}
              onChange={(value) => updateField("furnished", value)}
            />
            <CenterChipGroup
              label={copy.detailForm.fields.furniture}
              values={form.furniture}
              options={copy.detailOptions.furniture}
              onToggle={(value) => updateArrayField("furniture", value)}
            />
            <CenterSelect
              label={copy.detailForm.fields.bedSize}
              value={form.bedSize}
              options={copy.detailOptions.bedSize}
              emptyLabel={copy.common.emptyValue}
              onChange={(value) => updateField("bedSize", value)}
            />
            <CenterSelect
              label={copy.detailForm.fields.elevator}
              value={form.elevator}
              options={copy.detailOptions.yesNoConfirm}
              emptyLabel={copy.common.emptyValue}
              onChange={(value) => updateField("elevator", value)}
            />
            <CenterSelect
              label={copy.detailForm.fields.parking}
              value={form.parking}
              options={copy.detailOptions.yesNoConfirm}
              emptyLabel={copy.common.emptyValue}
              onChange={(value) => updateField("parking", value)}
            />
          </div>
        </DetailSection>

        <DetailSection title={copy.detailForm.sections.living}>
          <div className="grid gap-4 md:grid-cols-2">
            <CenterSelect
              label={copy.detailForm.fields.tenantPetsAllowed}
              value={form.tenantPetsAllowed}
              options={copy.detailOptions.petAllowed}
              emptyLabel={copy.common.emptyValue}
              onChange={(value) => updateField("tenantPetsAllowed", value)}
            />
            <CenterSelect
              label={copy.detailForm.fields.homePets}
              value={form.homePets}
              options={copy.detailOptions.homePets}
              emptyLabel={copy.common.emptyValue}
              onChange={(value) => updateField("homePets", value)}
            />
            {isAffirmativeOption(form.homePets) ? (
              <CenterField
                label={copy.detailForm.fields.homePetType}
                value={form.homePetType}
                onChange={(value) => updateField("homePetType", value)}
              />
            ) : null}
            <CenterSelect
              label={copy.detailForm.fields.smokingCondition}
              value={form.smokingCondition}
              options={copy.detailOptions.smoking}
              emptyLabel={copy.common.emptyValue}
              onChange={(value) => updateField("smokingCondition", value)}
            />
          </div>
        </DetailSection>

        <DetailSection title={copy.detailForm.sections.money}>
          <div className="space-y-4">
            <CenterField
              label={copy.detailForm.fields.keyDepositAmount}
              value={form.keyDepositAmount}
              onChange={(value) => updateField("keyDepositAmount", value)}
            />
            <UtilityMatrix
              label={copy.detailForm.fields.utilities}
              utilities={copy.detailOptions.utilities}
              statuses={copy.detailOptions.utilityStatus}
              values={form.utilityStatuses}
              emptyLabel={copy.common.emptyValue}
              onChange={updateUtility}
            />
          </div>
        </DetailSection>

        <DetailSection title={copy.detailForm.sections.rules}>
          <div className="space-y-4">
            <CenterChipGroup
              label={copy.detailForm.fields.houseRules}
              values={form.houseRuleItems}
              options={copy.detailOptions.houseRules}
              onToggle={(value) => updateArrayField("houseRuleItems", value)}
            />
            <CenterTextarea
              label={copy.detailForm.fields.additionalNote}
              value={form.additionalNote}
              onChange={(value) => updateField("additionalNote", value)}
            />
          </div>
        </DetailSection>

        <DetailSection title={copy.detailForm.sections.questions}>
          <CenterTextarea
            label={copy.detailForm.fields.moveInQuestions}
            value={form.moveInQuestions}
            onChange={(value) => updateField("moveInQuestions", value)}
          />
        </DetailSection>
      </div>

      <aside className="h-fit space-y-4 rounded-3xl border border-primary/20 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black text-foreground">{copy.detailForm.readinessTitle}</h2>
        <p className="text-sm font-bold text-primary">{copy.detailForm.readinessStatus}</p>
        <div className="space-y-3">
          {copy.detailForm.readinessItems.map((item, index) => {
            const checked = getReadinessState(index, draft, form);
            return (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-border bg-[#FAFAFA] p-3"
              >
                <CheckCircle
                  className={cn("h-5 w-5 shrink-0", checked ? "text-primary" : "text-muted-foreground/50")}
                  aria-hidden
                />
                <span className="text-sm font-bold text-foreground">{item}</span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
        >
          <Save className="h-4 w-4" aria-hidden />
          {copy.detailForm.save}
        </button>
        {saved ? (
          <p className="rounded-2xl border border-primary/20 bg-[#FFF8F1] p-3 text-sm font-bold text-primary">
            {copy.detailForm.saved}
          </p>
        ) : null}
      </aside>
    </section>
  );
}

function NewListingPanel({ copy }: { copy: CenterCopy }) {
  return (
    <section className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <div className="flex max-w-3xl flex-col gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF3E8] text-primary">
          <Plus className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <h2 className="text-xl font-black text-foreground">{copy.newListing.cardTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy.newListing.cardBody}</p>
        </div>
        <span className="inline-flex w-fit items-center justify-center rounded-full border border-primary/20 bg-[#FFF8F1] px-3 py-1 text-xs font-extrabold text-primary">
          {copy.common.comingSoon}
        </span>
      </div>
    </section>
  );
}

const INQUIRY_SUMMARY_VALUES: Array<{
  key: LandlordInquirySummaryKey;
  value: number;
  tone: "neutral" | "attention" | "muted";
}> = [
  { key: "total", value: 6, tone: "neutral" },
  { key: "new", value: 2, tone: "attention" },
  { key: "needsReview", value: 2, tone: "attention" },
  { key: "waitingLandlord", value: 1, tone: "attention" },
  { key: "reservationReview", value: 0, tone: "muted" },
];

const INQUIRY_STATUS_STYLES: Record<LandlordInquiryStatusKey, string> = {
  new: "border-primary/25 bg-[#FFF3E8] text-primary",
  needsReview: "border-amber-200 bg-amber-50 text-amber-800",
  waitingLandlord: "border-sky-200 bg-sky-50 text-sky-800",
  waitingTenant: "border-violet-200 bg-violet-50 text-violet-800",
  reservationReview: "border-orange-200 bg-orange-50 text-orange-800",
  closed: "border-border bg-[#F4F4F5] text-muted-foreground",
};

function InquiriesPanel({ copy }: { copy: CenterCopy }) {
  const inquiries = copy.inquiries.items;

  if (!inquiries.length) {
    return (
      <EmptyCard
        title={copy.inquiries.emptyTitle}
        body={copy.inquiries.emptyBody}
        actionLabel={copy.common.goRegister}
        actionHref="#"
      />
    );
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {INQUIRY_SUMMARY_VALUES.map((summary) => (
          <article
            key={summary.key}
            className={cn(
              "rounded-3xl border bg-white p-4 text-center shadow-sm",
              summary.tone === "attention"
                ? "border-primary/30 bg-[#FFF9F3]"
                : summary.tone === "muted"
                  ? "border-border/70 bg-[#F7F7F7]"
                  : "border-border",
            )}
          >
            <p
              className={cn(
                "text-xs font-semibold leading-snug",
                summary.tone === "attention"
                  ? "text-primary"
                  : summary.tone === "muted"
                    ? "text-muted-foreground"
                    : "text-foreground",
              )}
            >
              {copy.inquiries.summary[summary.key]}
            </p>
            <p
              className={cn(
                "mt-2 text-2xl font-bold leading-none",
                summary.tone === "attention"
                  ? "text-primary"
                  : summary.tone === "muted"
                    ? "text-muted-foreground"
                    : "text-foreground",
              )}
            >
              {summary.value}
            </p>
          </article>
        ))}
      </div>

      <section className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
        <div className="hidden grid-cols-[126px_minmax(0,1.35fr)_118px_142px_minmax(0,1fr)_104px] gap-3 border-b border-border bg-[#FAFAFA] px-4 py-3 text-center text-[12px] font-semibold text-muted-foreground lg:grid">
          <span className="min-w-0">{copy.inquiries.fields.type}</span>
          <span className="min-w-0">{copy.inquiries.fields.listing}</span>
          <span className="min-w-0">{copy.inquiries.fields.inquirer}</span>
          <span className="min-w-0">{copy.inquiries.fields.replyStatus}</span>
          <span className="min-w-0">{copy.inquiries.fields.note}</span>
          <span className="min-w-0">{copy.inquiries.fields.detail}</span>
        </div>

        <div className="divide-y divide-border/80">
          {inquiries.map((inquiry) => (
            <article
              key={inquiry.id}
              className="grid gap-3 px-4 py-4 lg:grid-cols-[126px_minmax(0,1.35fr)_118px_142px_minmax(0,1fr)_104px] lg:items-center lg:gap-3 lg:text-center"
            >
              <div className="min-w-0 lg:text-center">
                <p className="text-[12px] font-semibold tracking-[0.04em] text-muted-foreground">
                  {inquiry.id}
                </p>
                <span
                  className={cn(
                    "mt-1 inline-flex max-w-full items-center justify-center rounded-full border px-2.5 py-1 text-center text-[11px] font-semibold leading-tight",
                    INQUIRY_STATUS_STYLES[inquiry.status],
                  )}
                >
                  {copy.inquiries.statusLabels[inquiry.status]}
                </span>
              </div>

              <div className="min-w-0">
                <p className="mb-1 text-[11px] font-bold text-muted-foreground lg:hidden">
                  {copy.inquiries.fields.listing}
                </p>
                <p className="mx-auto min-w-0 break-words text-[13px] font-medium leading-snug text-foreground">
                  {inquiry.listing}
                </p>
              </div>

              <div className="min-w-0">
                <p className="mb-1 text-[11px] font-bold text-muted-foreground lg:hidden">
                  {copy.inquiries.fields.inquirer}
                </p>
                <p className="truncate text-[13px] font-medium text-foreground">
                  {inquiry.inquirer}
                </p>
              </div>

              <div className="min-w-0">
                <p className="mb-1 text-[11px] font-bold text-muted-foreground lg:hidden">
                  {copy.inquiries.fields.replyStatus}
                </p>
                <p className="mx-auto min-w-0 break-words text-[13px] font-medium leading-snug text-foreground">
                  {inquiry.replyStatus}
                </p>
              </div>

              <div className="min-w-0">
                <p className="mb-1 text-[11px] font-bold text-muted-foreground lg:hidden">
                  {copy.inquiries.fields.note}
                </p>
                <p className="mx-auto min-w-0 break-words text-[13px] font-normal leading-snug text-muted-foreground">
                  {inquiry.note}
                </p>
              </div>

              <div className="flex items-center justify-start lg:justify-center">
                <button
                  type="button"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-primary/25 bg-white px-3 py-1.5 text-[12px] font-semibold text-primary transition hover:bg-[#FFF8F1]"
                >
                  {copy.inquiries.action}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function ProfilePanel({
  copy,
  locale,
  draft,
  hasDraft,
  loaded,
}: {
  copy: CenterCopy;
  locale: Locale;
  draft: LandlordCenterDraft | null;
  hasDraft: boolean;
  loaded: boolean;
}) {
  if (!loaded || !hasDraft || !draft) {
    return (
      <EmptyCard
        title={copy.profile.emptyTitle}
        body={copy.profile.emptyBody}
        actionLabel={copy.common.goRegister}
        actionHref={centerRoute(locale, "register")}
      />
    );
  }

  const rows = [
    [copy.profile.fields.role, draft.role],
    [copy.profile.fields.firstName, draft.firstName],
    [copy.profile.fields.lastName, draft.lastName || draft.name],
    [copy.profile.fields.email, getEmail(draft)],
    [copy.profile.fields.phone, getPhone(draft)],
    [copy.profile.fields.preferredContactMethods, joinValues(draft.preferredContactMethods)],
    [copy.profile.fields.preferredLanguages, joinValues(draft.preferredLanguages || (draft.preferredLanguage ? [draft.preferredLanguage] : []))],
    [copy.profile.fields.memo, draft.shortMessage],
  ];

  return (
    <section className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground">{copy.profile.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.profile.subtitle}</p>
        </div>
        <button
          type="button"
          disabled
          className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-border bg-muted px-3 py-2 text-xs font-bold text-muted-foreground"
        >
          {copy.common.comingSoon}
        </button>
      </div>
      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-border bg-[#FAFAFA] p-4">
            <dt className="text-xs font-bold text-muted-foreground">{label}</dt>
            <dd className="mt-1 min-h-5 break-words text-sm font-bold text-foreground">
              {displayValue(value, copy.common.emptyValue)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function EmptyCard({
  title,
  body,
  actionLabel,
  actionHref,
}: {
  title: string;
  body: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <section className="rounded-3xl border border-border bg-white p-6 text-center shadow-sm sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF3E8] text-primary">
        <ClipboardList className="h-7 w-7" aria-hidden />
      </div>
      <h2 className="mt-5 text-xl font-black text-foreground">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{body}</p>
      <Link
        to={actionHref}
        className="mt-6 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </section>
  );
}

function StatusPill({ children }: { children: string }) {
  return (
    <span className="inline-flex max-w-full items-center rounded-full border border-primary/20 bg-[#FFF8F1] px-3 py-1 text-xs font-extrabold leading-tight text-primary [overflow-wrap:break-word]">
      {children}
    </span>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-border bg-[#FAFAFA] p-4">
      <dt className="text-xs font-bold leading-snug text-muted-foreground [overflow-wrap:break-word]">{label}</dt>
      <dd className="mt-1 min-h-5 break-words text-sm font-bold text-foreground">{value}</dd>
    </div>
  );
}

function ListingPhotoFrame({
  coverPhoto,
  label,
  mockSrc,
  size = "card",
}: {
  coverPhoto: LandlordCenterPhoto | null;
  label: string;
  mockSrc?: string;
  size?: "card" | "large";
}) {
  const imageSrc = coverPhoto?.dataUrl || mockSrc;

  return (
    <ListingImageFrame
      src={imageSrc}
      alt=""
      className={cn(
        "flex w-full items-center justify-center rounded-2xl border border-border bg-[#F8FAFC] shadow-sm",
        size === "large"
          ? "aspect-[16/9] lg:h-[220px] lg:w-[290px] lg:aspect-auto"
          : "aspect-[16/9] lg:h-[170px] lg:w-[236px] lg:aspect-auto",
      )}
      fallback={
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-4 text-center text-primary">
          <Camera className={cn("h-8 w-8", size === "large" ? "sm:h-10 sm:w-10" : "")} aria-hidden />
          <span className="text-xs font-extrabold uppercase tracking-[0.12em]">
            {label}
          </span>
        </div>
      }
    >
    </ListingImageFrame>
  );
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-black text-foreground">{title}</h2>
      <div className="mt-5">{children}</div>
    </article>
  );
}

function CenterField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-0 space-y-2">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}

function CenterSelect({
  label,
  value,
  options,
  emptyLabel,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  emptyLabel: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-0 space-y-2">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
      >
        <option value="">{emptyLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function CenterTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-0 space-y-2">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full resize-y rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold leading-6 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}

function CenterChipGroup({
  label,
  values,
  options,
  onToggle,
}: {
  label: string;
  values: string[];
  options: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-2 md:col-span-2">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={cn(
                "rounded-full border px-3 py-2 text-xs font-bold transition",
                selected
                  ? "border-primary bg-[#FFF8F1] text-primary"
                  : "border-border bg-white text-muted-foreground hover:border-primary/30 hover:text-foreground",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function UtilityMatrix({
  label,
  utilities,
  statuses,
  values,
  emptyLabel,
  onChange,
}: {
  label: string;
  utilities: string[];
  statuses: string[];
  values: Record<string, string>;
  emptyLabel: string;
  onChange: (utility: string, status: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <div className="grid gap-3 md:grid-cols-2">
        {utilities.map((utility) => (
          <label
            key={utility}
            className="grid gap-2 rounded-2xl border border-border bg-[#FAFAFA] p-3 sm:grid-cols-[1fr_180px] sm:items-center"
          >
            <span className="text-sm font-bold text-foreground">{utility}</span>
            <select
              value={values[utility] || ""}
              onChange={(event) => onChange(utility, event.target.value)}
              className="h-11 min-w-0 rounded-xl border border-border bg-white px-3 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            >
              <option value="">{emptyLabel}</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
}

function pageTitle(copy: CenterCopy, page: LandlordCenterPage) {
  if (page === "listings") return copy.listings.title;
  if (page === "listingDraft") return copy.draftDetail.title;
  if (page === "listingDetails") return copy.detailForm.title;
  if (page === "newListing") return copy.newListing.title;
  if (page === "inquiries") return copy.inquiries.title;
  if (page === "profile") return copy.profile.title;
  return copy.dashboard.title;
}

function pageSubtitle(copy: CenterCopy, page: LandlordCenterPage) {
  if (page === "listings") return copy.listings.subtitle;
  if (page === "listingDraft") return copy.draftDetail.subtitle;
  if (page === "listingDetails") return copy.detailForm.subtitle;
  if (page === "newListing") return copy.newListing.subtitle;
  if (page === "inquiries") return copy.inquiries.subtitle;
  if (page === "profile") return copy.profile.subtitle;
  return copy.dashboard.subtitle;
}

function centerRoute(
  locale: Locale,
  page:
    | (typeof CENTER_NAV_ITEMS)[number]["route"]
    | "newListing"
    | "listingDraft"
    | "listingDetails"
    | "register",
) {
  const base = `/${locale}/landlords/center`;
  if (page === "dashboard") return base;
  if (page === "listings") return `${base}/listings`;
  if (page === "newListing") return `${base}/listings/new`;
  if (page === "listingDraft") return `${base}/listings/draft`;
  if (page === "listingDetails") return `${base}/listings/draft/details`;
  if (page === "register") return `${base}/register`;
  return `${base}/${page}`;
}

function draftHasData(draft: LandlordCenterDraft | null) {
  if (!draft) return false;

  return Boolean(
    draft.role ||
      draft.firstName ||
      draft.lastName ||
      draft.name ||
      draft.email ||
      draft.emailLocal ||
      draft.contact ||
      draft.phoneNumber ||
      draft.city ||
      draft.area ||
      draft.nearestStation ||
      draft.housingType ||
      draft.listingTitle ||
      draft.monthlyRent,
  );
}

function displayValue(value: unknown, emptyValue: string) {
  if (typeof value !== "string") return emptyValue;
  const trimmed = value.trim();
  return trimmed || emptyValue;
}

function joinValues(values?: string[]) {
  return values?.filter(Boolean).join(", ") || "";
}

function formatCurrency(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return "";
  const digits = trimmed.replace(/,/g, "");
  if (!/^\d+$/.test(digits)) return trimmed;
  return `$${Number(digits).toLocaleString("en-CA")} CAD`;
}

function getEmail(draft: LandlordCenterDraft) {
  if (draft.email?.trim()) return draft.email.trim();
  if (draft.emailLocal?.trim() && draft.emailDomain?.trim()) {
    return `${draft.emailLocal.trim()}@${draft.emailDomain.trim()}`;
  }
  return "";
}

function getPhone(draft: LandlordCenterDraft) {
  if (draft.contact?.trim()) return draft.contact.trim();

  const countryCode =
    draft.phoneCountryCode === "__custom__"
      ? draft.phoneCountryCodeCustom?.trim()
      : draft.phoneCountryCode?.trim();

  return [countryCode, draft.phoneNumber?.trim()].filter(Boolean).join(" ");
}

function getListingTitle(copy: CenterCopy, draft: LandlordCenterDraft) {
  return draft.listingTitle?.trim() || copy.listings.firstDraftLabel;
}

function getCoverPhoto(draft: LandlordCenterDraft) {
  const photos = draft.photos?.filter((photo) => photo.dataUrl || photo.name) || [];
  if (!photos.length) return null;
  return photos.find((photo) => photo.id && photo.id === draft.coverPhotoId) || photos[0];
}

function getDraftMockImageSeed(draft: LandlordCenterDraft) {
  return [
    "landlord-center-listing",
    draft.listingTitle,
    draft.city,
    draft.area,
    draft.nearestStation,
  ]
    .filter(Boolean)
    .join("|");
}

function formatPhotoCount(photos: LandlordCenterPhoto[] | undefined, emptyValue: string) {
  if (!photos?.length) return emptyValue;
  return String(photos.length);
}

function buildListingDetailsForm(
  draft: LandlordCenterDraft | null,
  details: LandlordListingDetailsDraft | null,
): LandlordListingDetailsDraft {
  return {
    area: details?.area ?? draft?.area ?? "",
    nearestStation: details?.nearestStation ?? draft?.nearestStation ?? "",
    unitDetail: details?.unitDetail ?? draft?.unitDetail ?? "",
    floor: details?.floor ?? draft?.floor ?? "",
    useType: details?.useType ?? draft?.useType ?? "",
    occupancy: details?.occupancy ?? draft?.occupancy ?? "",
    bathroom: details?.bathroom ?? draft?.bathroom ?? "",
    kitchen: details?.kitchen ?? draft?.kitchen ?? "",
    furnished: details?.furnished ?? draft?.furnished ?? "",
    elevator: details?.elevator ?? draft?.elevator ?? "",
    parking: details?.parking ?? draft?.parking ?? "",
    tenantPetsAllowed: details?.tenantPetsAllowed ?? draft?.tenantPetsAllowed ?? "",
    homePets: details?.homePets ?? draft?.homePets ?? "",
    homePetType: details?.homePetType ?? draft?.homePetType ?? "",
    smokingCondition: details?.smokingCondition ?? draft?.smokingCondition ?? "",
    keyDepositAmount: details?.keyDepositAmount ?? draft?.keyDepositAmount ?? "",
    utilityStatuses: details?.utilityStatuses ?? draft?.utilityStatuses ?? {},
    houseRuleItems: details?.houseRuleItems ?? draft?.houseRuleItems ?? [],
    additionalNote: details?.additionalNote ?? draft?.additionalNote ?? "",
    moveInQuestions: details?.moveInQuestions ?? draft?.moveInQuestions ?? "",
    furniture: details?.furniture ?? draft?.furniture ?? [],
    bedSize: details?.bedSize ?? draft?.bedSize ?? "",
  };
}

function listingDetailsHasData(details: LandlordListingDetailsDraft | null) {
  if (!details) return false;

  return Boolean(
    details.area.trim() ||
      details.nearestStation.trim() ||
      details.unitDetail.trim() ||
      details.floor.trim() ||
      details.useType.trim() ||
      details.occupancy.trim() ||
      details.bathroom.trim() ||
      details.kitchen.trim() ||
      details.furnished.trim() ||
      details.elevator.trim() ||
      details.parking.trim() ||
      details.tenantPetsAllowed.trim() ||
      details.homePets.trim() ||
      details.homePetType.trim() ||
      details.smokingCondition.trim() ||
      details.keyDepositAmount.trim() ||
      details.additionalNote.trim() ||
      details.moveInQuestions.trim() ||
      details.furniture.length > 0 ||
      details.houseRuleItems.length > 0 ||
      Object.values(details.utilityStatuses).some((value) => value.trim()),
  );
}

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function isAffirmativeOption(value: string) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;
  if (normalized === "yes" || normalized === "oui") return true;
  if (normalized.includes("있")) return true;
  return false;
}

function getReadinessState(
  index: number,
  draft: LandlordCenterDraft,
  details: LandlordListingDetailsDraft,
) {
  if (index === 0) return draftHasData(draft);
  if (index === 1) return Boolean(draft.photos?.length);
  if (index === 2) {
    return Boolean(
      details.tenantPetsAllowed ||
        details.homePets ||
        details.smokingCondition ||
        details.occupancy ||
        details.bathroom ||
        details.kitchen,
    );
  }
  if (index === 3) return details.houseRuleItems.length > 0 || Boolean(details.additionalNote.trim());
  if (index === 4) {
    return Boolean(
      details.keyDepositAmount.trim() ||
        Object.values(details.utilityStatuses).some((value) => value.trim()),
    );
  }
  return false;
}
