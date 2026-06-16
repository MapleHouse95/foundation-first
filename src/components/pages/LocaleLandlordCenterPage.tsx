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

type LandlordInquiryProgressKey =
  | "new"
  | "review"
  | "waitingLandlord"
  | "waitingTenant"
  | "reservationReview"
  | "closed";

type LandlordInquiryMethod = "assisted" | "direct";

type LandlordInquiryDetailData = {
  id: string;
  inquiryMethod?: LandlordInquiryMethod;
  status: LandlordInquiryStatusKey;
  progress: LandlordInquiryProgressKey;
  receivedAt: string;
  inquirer: string;
  email: string;
  phone: string;
  moveIn: string;
  people: string;
  stay: string;
  listing: string;
  area: string;
  unit: string;
  rent: string;
  housingType: string;
  availableFrom: string;
  mustConfirm: string;
  request: string;
  note: string;
  reviewItems: string[];
  responseItems: Record<"availableFrom" | "includedItems" | "initialPayment" | "extraNote", string>;
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

const INQUIRY_DETAIL_COPY: Record<
  Locale,
  {
    breadcrumb: { detail: string };
    backToList: string;
    title: string;
    subtitle: string;
    mvpNote: string;
    emptyTitle: string;
    emptyBody: string;
    keyInfo: {
      id: string;
      status: string;
      receivedAt: string;
      inquirer: string;
      listing: string;
    };
    sections: {
      basics: string;
      listing: string;
      content: string;
      review: string;
      response: string;
      progress: string;
    };
    fields: {
      inquirer: string;
      email: string;
      phone: string;
      moveIn: string;
      people: string;
      stay: string;
      receivedAt: string;
      listing: string;
      area: string;
      unit: string;
      rent: string;
      housingType: string;
      availableFrom: string;
      mustConfirm: string;
      request: string;
      note: string;
    };
    reviewDescription: string;
    responseDescription: string;
    responseFields: {
      availableFrom: string;
      includedItems: string;
      initialPayment: string;
      extraNote: string;
    };
    mockSave: string;
    mockSaveNote: string;
    actions: {
      list: string;
      listings: string;
      save: string;
    };
    progress: Record<LandlordInquiryProgressKey, string>;
    details: Record<string, LandlordInquiryDetailData>;
  }
> = {
  ko: {
    breadcrumb: { detail: "문의 상세" },
    backToList: "문의 목록으로 돌아가기",
    title: "문의 상세",
    subtitle: "예비 입주자 문의 내용을 확인하는 mock 화면입니다.",
    mvpNote: "실제 메시지 발송, 답변, 계약, 결제는 아직 연결되어 있지 않습니다.",
    emptyTitle: "문의 정보를 찾을 수 없습니다.",
    emptyBody: "선택한 문의 ID에 해당하는 mock 문의가 없습니다.",
    keyInfo: {
      id: "문의 ID",
      status: "현재 상태",
      receivedAt: "접수일",
      inquirer: "문의자",
      listing: "매물명",
    },
    sections: {
      basics: "문의 기본 정보",
      listing: "선택 매물 정보",
      content: "문의 내용",
      review: "MapleHouse 확인 항목",
      response: "임대인이 답변할 항목",
      progress: "문의 진행 상태",
    },
    fields: {
      inquirer: "문의자",
      email: "이메일",
      phone: "전화번호",
      moveIn: "입주 희망일",
      people: "인원",
      stay: "체류 기간",
      receivedAt: "접수일",
      listing: "매물명",
      area: "지역",
      unit: "선택 방/유닛",
      rent: "월세",
      housingType: "주거 형태",
      availableFrom: "입주 가능일",
      mustConfirm: "꼭 확인하고 싶은 내용",
      request: "추가 요청사항",
      note: "비고",
    },
    reviewDescription:
      "아래 항목은 고객 문의를 바탕으로 MapleHouse가 임대인에게 확인할 내용입니다.",
    responseDescription:
      "아래 입력 영역은 실제 저장 없이 답변 항목을 보여주는 MVP mock 영역입니다.",
    responseFields: {
      availableFrom: "입주 가능일 답변",
      includedItems: "포함 항목 답변",
      initialPayment: "초기 입금액 / 보증금 답변",
      extraNote: "기타 전달사항",
    },
    mockSave: "답변 저장 · MVP 예정",
    mockSaveNote:
      "실제 운영 단계에서는 이 답변이 문의 흐름에 맞게 예비 입주자에게 전달됩니다.",
    actions: {
      list: "문의 목록으로 돌아가기",
      listings: "해당 매물 관리로 이동",
      save: "답변 저장 · MVP 예정",
    },
    progress: {
      new: "새 문의",
      review: "확인 항목 정리",
      waitingLandlord: "임대인 답변 대기",
      waitingTenant: "세입자 확인 대기",
      reservationReview: "예약 검토",
      closed: "종료",
    },
    details: {
      "inq-2026-001": {
        id: "INQ-2026-001",
        inquiryMethod: "assisted",
        status: "new",
        progress: "new",
        receivedAt: "2026. 6. 16.",
        inquirer: "MEHA KIM",
        email: "name@example.com",
        phone: "확인 필요",
        moveIn: "확인 필요",
        people: "1",
        stay: "확인 필요",
        listing: "Koreatown 1BR 코지 스튜디오",
        area: "Koreatown",
        unit: "전체 유닛",
        rent: "C$1,850 / 월",
        housingType: "1베드",
        availableFrom: "확인 필요",
        mustConfirm:
          "입주 가능일, 공과금 포함 여부, 보증금 조건을 확인하고 싶습니다.",
        request: "입금 전에 초기 입금액과 환불 조건을 알고 싶습니다.",
        note: "입주 가능일과 초기 입금액 확인 필요",
        reviewItems: [
          "실제 입주 가능일 확인",
          "월세에 포함되는 항목 확인",
          "보증금 또는 초기 입금액 조건 확인",
          "입주 전 입금이 필요한 경우 금액과 환불 조건 확인",
          "사진과 실제 공간 차이 여부 확인",
          "계약 또는 예약 전 추가로 확인해야 할 규칙 확인",
        ],
        responseItems: {
          availableFrom: "임대인이 실제 입주 가능일을 확인해야 합니다.",
          includedItems: "월세 포함 항목과 별도 비용을 정리해야 합니다.",
          initialPayment: "초기 입금액, 보증금, 환불 조건 확인이 필요합니다.",
          extraNote: "사진과 실제 공간 차이가 있는지도 함께 확인합니다.",
        },
      },
      "inq-2026-002": {
        id: "INQ-2026-002",
        inquiryMethod: "direct",
        status: "needsReview",
        progress: "review",
        receivedAt: "2026. 6. 15.",
        inquirer: "JIWON PARK",
        email: "jiwon@example.com",
        phone: "확인 필요",
        moveIn: "2026. 7. 초",
        people: "1",
        stay: "3개월 이상",
        listing: "North York 역세권 룸렌트",
        area: "North York",
        unit: "룸렌트",
        rent: "C$980 / 월",
        housingType: "룸렌트",
        availableFrom: "확인 필요",
        mustConfirm: "룸메이트 구성과 공용공간 사용 규칙을 알고 싶습니다.",
        request: "조용한 생활이 가능한지와 방문객 규칙을 확인하고 싶습니다.",
        note: "룸메이트 구성과 공용공간 규칙 확인 필요",
        reviewItems: [
          "현재 거주 인원과 성별 구성 확인",
          "주방, 욕실, 세탁 공간 사용 규칙 확인",
          "방문객과 소음 관련 규칙 확인",
          "열쇠 보증금 또는 초기 입금 조건 확인",
          "입주 가능일과 최소 거주 기간 확인",
        ],
        responseItems: {
          availableFrom: "입주 가능일과 최소 거주 기간을 확인해야 합니다.",
          includedItems: "공용공간, 세탁, 인터넷 포함 여부를 확인해야 합니다.",
          initialPayment: "첫 달 월세 외 추가 입금이 있는지 확인해야 합니다.",
          extraNote: "룸메이트 구성과 생활 규칙을 구체적으로 적어야 합니다.",
        },
      },
      "inq-2026-003": {
        id: "INQ-2026-003",
        status: "waitingLandlord",
        progress: "waitingLandlord",
        receivedAt: "2026. 6. 14.",
        inquirer: "MINSEO LEE",
        email: "minseo@example.com",
        phone: "입력됨",
        moveIn: "2026. 8. 1.",
        people: "1",
        stay: "6개월",
        listing: "Downtown furnished studio",
        area: "Downtown Toronto",
        unit: "전체 유닛",
        rent: "C$2,050 / 월",
        housingType: "스튜디오",
        availableFrom: "임대인 답변 대기",
        mustConfirm: "가구, 인터넷, 공과금 포함 범위를 확인하고 싶습니다.",
        request: "추가 비용과 건물 규칙을 함께 알려주세요.",
        note: "포함 항목과 추가 비용 문의 완료",
        reviewItems: [
          "가구 포함 범위 확인",
          "인터넷, 전기, 수도, 난방 포함 여부 확인",
          "입주 전 필요한 결제 항목 확인",
          "건물 이용 규칙 확인",
          "임대인 답변 수신 후 예비 입주자에게 설명",
        ],
        responseItems: {
          availableFrom: "임대인 답변을 기다리는 상태입니다.",
          includedItems: "포함 항목 답변을 기다리는 상태입니다.",
          initialPayment: "추가 비용 답변을 기다리는 상태입니다.",
          extraNote: "건물 규칙과 전달사항 답변을 기다리는 상태입니다.",
        },
      },
      "inq-2026-004": {
        id: "INQ-2026-004",
        status: "waitingTenant",
        progress: "waitingTenant",
        receivedAt: "2026. 6. 13.",
        inquirer: "HANA CHOI",
        email: "hana@example.com",
        phone: "입력됨",
        moveIn: "2026. 7. 15.",
        people: "1",
        stay: "4개월",
        listing: "Finch station shared house",
        area: "Finch",
        unit: "개인 방",
        rent: "C$920 / 월",
        housingType: "쉐어하우스",
        availableFrom: "답변 도착",
        mustConfirm: "임대인의 답변을 이해하기 쉽게 정리받고 싶습니다.",
        request: "예약 전에 남은 확인 항목을 알려주세요.",
        note: "세입자에게 답변 설명 예정",
        reviewItems: [
          "임대인 답변 요약",
          "세입자가 이해하기 어려운 비용 항목 설명",
          "예약 전 추가 확인 항목 분류",
          "공용공간 규칙 재확인",
          "세입자 예약 진행 여부 확인 대기",
        ],
        responseItems: {
          availableFrom: "입주 가능일 답변이 도착했습니다.",
          includedItems: "포함 항목 답변이 도착했습니다.",
          initialPayment: "초기 입금 조건 답변이 도착했습니다.",
          extraNote: "세입자에게 설명할 내용으로 정리 중입니다.",
        },
      },
      "inq-2026-005": {
        id: "INQ-2026-005",
        status: "new",
        progress: "new",
        receivedAt: "2026. 6. 12.",
        inquirer: "DOYUN JUNG",
        email: "doyun@example.com",
        phone: "확인 필요",
        moveIn: "확인 필요",
        people: "1",
        stay: "확인 필요",
        listing: "Midtown condo room",
        area: "Midtown",
        unit: "콘도 룸",
        rent: "C$1,250 / 월",
        housingType: "콘도 룸렌트",
        availableFrom: "확인 필요",
        mustConfirm: "예약 가능 여부와 취소 조건을 확인하고 싶습니다.",
        request: "건물 편의시설 이용 가능 여부도 함께 알고 싶습니다.",
        note: "예약 가능 여부와 취소 조건 확인 필요",
        reviewItems: [
          "예약 가능 여부 확인",
          "취소 조건과 환불 가능 범위 확인",
          "콘도 편의시설 이용 가능 여부 확인",
          "키/출입카드 보증금 확인",
          "입주 전 입금 항목 확인",
        ],
        responseItems: {
          availableFrom: "예약 가능 날짜를 확인해야 합니다.",
          includedItems: "건물 편의시설과 포함 항목을 확인해야 합니다.",
          initialPayment: "예약금, 보증금, 환불 조건 확인이 필요합니다.",
          extraNote: "취소 조건을 명확히 적어야 합니다.",
        },
      },
      "inq-2026-006": {
        id: "INQ-2026-006",
        status: "needsReview",
        progress: "review",
        receivedAt: "2026. 6. 11.",
        inquirer: "SORA YANG",
        email: "sora@example.com",
        phone: "확인 필요",
        moveIn: "2026. 7. 말",
        people: "1",
        stay: "6개월 이상",
        listing: "Scarborough basement unit",
        area: "Scarborough",
        unit: "베이스먼트 유닛",
        rent: "C$1,350 / 월",
        housingType: "베이스먼트",
        availableFrom: "확인 필요",
        mustConfirm: "채광, 습기, 천장 높이, 출입구 분리 여부를 확인하고 싶습니다.",
        request: "방문 전 실제 사진이나 영상이 있으면 받고 싶습니다.",
        note: "채광, 습기, 출입구 분리 여부 확인 필요",
        reviewItems: [
          "채광과 창문 상태 확인",
          "습기, 냄새, 난방 상태 확인",
          "천장 높이와 출입구 분리 여부 확인",
          "사진과 실제 공간 차이 확인",
          "입주 전 수리 또는 청소 여부 확인",
        ],
        responseItems: {
          availableFrom: "입주 가능일과 청소 상태를 확인해야 합니다.",
          includedItems: "난방, 인터넷, 공과금 포함 여부를 확인해야 합니다.",
          initialPayment: "초기 입금 조건과 환불 가능 여부를 확인해야 합니다.",
          extraNote: "채광, 습기, 출입구 정보를 자세히 적어야 합니다.",
        },
      },
    },
  },
  en: {
    breadcrumb: { detail: "Inquiry detail" },
    backToList: "Back to inquiry list",
    title: "Inquiry detail",
    subtitle: "A mock page for reviewing a prospective tenant inquiry.",
    mvpNote: "Real messaging, replies, contracts, and payments are not connected yet.",
    emptyTitle: "Inquiry information was not found.",
    emptyBody: "There is no mock inquiry for the selected inquiry ID.",
    keyInfo: {
      id: "Inquiry ID",
      status: "Current status",
      receivedAt: "Received",
      inquirer: "Inquirer",
      listing: "Listing",
    },
    sections: {
      basics: "Inquiry basics",
      listing: "Selected listing",
      content: "Inquiry content",
      review: "MapleHouse review items",
      response: "Items for landlord response",
      progress: "Inquiry progress",
    },
    fields: {
      inquirer: "Inquirer",
      email: "Email",
      phone: "Phone",
      moveIn: "Preferred move-in",
      people: "People",
      stay: "Stay period",
      receivedAt: "Received",
      listing: "Listing",
      area: "Area",
      unit: "Room/unit",
      rent: "Rent",
      housingType: "Housing type",
      availableFrom: "Available from",
      mustConfirm: "Must confirm",
      request: "Additional request",
      note: "Note",
    },
    reviewDescription:
      "These are the items MapleHouse would organize and ask the landlord based on the tenant inquiry.",
    responseDescription:
      "This is a mock response area only. Nothing is saved or sent.",
    responseFields: {
      availableFrom: "Available-from response",
      includedItems: "Included-items response",
      initialPayment: "Initial payment / deposit response",
      extraNote: "Other note",
    },
    mockSave: "Save response · MVP coming",
    mockSaveNote:
      "In the real operation stage, this reply would be delivered to the prospective tenant according to the inquiry flow.",
    actions: {
      list: "Back to inquiry list",
      listings: "Go to listing management",
      save: "Save response · MVP coming",
    },
    progress: {
      new: "New inquiry",
      review: "Organize review items",
      waitingLandlord: "Waiting for landlord reply",
      waitingTenant: "Waiting for tenant confirmation",
      reservationReview: "Reservation review",
      closed: "Closed",
    },
    details: {
      "inq-2026-001": {
        id: "INQ-2026-001",
        inquiryMethod: "assisted",
        status: "new",
        progress: "new",
        receivedAt: "Jun 16, 2026",
        inquirer: "MEHA KIM",
        email: "name@example.com",
        phone: "Needs confirmation",
        moveIn: "Needs confirmation",
        people: "1",
        stay: "Needs confirmation",
        listing: "Koreatown 1BR cozy studio",
        area: "Koreatown",
        unit: "Entire unit",
        rent: "C$1,850 / month",
        housingType: "1BR",
        availableFrom: "Needs confirmation",
        mustConfirm: "I want to confirm the available date, utilities, and deposit terms.",
        request: "I want to know the initial payment amount and refund terms before sending money.",
        note: "Confirm availability and initial payment amount",
        reviewItems: [
          "Confirm the real available move-in date",
          "Confirm what is included in the monthly rent",
          "Confirm deposit or initial payment terms",
          "Confirm amount and refund terms if payment is needed before move-in",
          "Confirm whether photos differ from the actual space",
          "Confirm any rules to review before contract or reservation",
        ],
        responseItems: {
          availableFrom: "The landlord needs to confirm the real available date.",
          includedItems: "Utilities and any separate costs should be clarified.",
          initialPayment: "Initial payment, deposit, and refund terms need confirmation.",
          extraNote: "Also confirm whether the photos match the current space.",
        },
      },
      "inq-2026-002": {
        id: "INQ-2026-002",
        inquiryMethod: "direct",
        status: "needsReview",
        progress: "review",
        receivedAt: "Jun 15, 2026",
        inquirer: "JIWON PARK",
        email: "jiwon@example.com",
        phone: "Needs confirmation",
        moveIn: "Early Jul 2026",
        people: "1",
        stay: "3+ months",
        listing: "North York transit room rental",
        area: "North York",
        unit: "Room rental",
        rent: "C$980 / month",
        housingType: "Room rent",
        availableFrom: "Needs confirmation",
        mustConfirm: "I want to understand roommate composition and shared-space rules.",
        request: "Please confirm whether the home is quiet and how visitor rules work.",
        note: "Confirm roommate composition and shared-space rules",
        reviewItems: [
          "Confirm current residents and roommate composition",
          "Confirm kitchen, bathroom, and laundry rules",
          "Confirm visitor and noise rules",
          "Confirm key deposit or initial payment terms",
          "Confirm move-in date and minimum stay",
        ],
        responseItems: {
          availableFrom: "Move-in date and minimum stay need confirmation.",
          includedItems: "Shared spaces, laundry, and internet should be clarified.",
          initialPayment: "Confirm whether anything is required beyond first month rent.",
          extraNote: "Roommate composition and living rules should be specific.",
        },
      },
      "inq-2026-003": {
        id: "INQ-2026-003",
        status: "waitingLandlord",
        progress: "waitingLandlord",
        receivedAt: "Jun 14, 2026",
        inquirer: "MINSEO LEE",
        email: "minseo@example.com",
        phone: "Entered",
        moveIn: "Aug 1, 2026",
        people: "1",
        stay: "6 months",
        listing: "Downtown furnished studio",
        area: "Downtown Toronto",
        unit: "Entire unit",
        rent: "C$2,050 / month",
        housingType: "Studio",
        availableFrom: "Waiting for landlord reply",
        mustConfirm: "I want to confirm furniture, internet, and utility coverage.",
        request: "Please also explain extra costs and building rules.",
        note: "Included items and extra costs already asked",
        reviewItems: [
          "Confirm included furniture",
          "Confirm internet, electricity, water, and heat coverage",
          "Confirm payment items needed before move-in",
          "Confirm building rules",
          "Explain the landlord reply after it arrives",
        ],
        responseItems: {
          availableFrom: "Waiting for the landlord's available-date reply.",
          includedItems: "Waiting for the landlord's included-items reply.",
          initialPayment: "Waiting for the landlord's extra-cost reply.",
          extraNote: "Waiting for building rules and other notes.",
        },
      },
      "inq-2026-004": {
        id: "INQ-2026-004",
        status: "waitingTenant",
        progress: "waitingTenant",
        receivedAt: "Jun 13, 2026",
        inquirer: "HANA CHOI",
        email: "hana@example.com",
        phone: "Entered",
        moveIn: "Jul 15, 2026",
        people: "1",
        stay: "4 months",
        listing: "Finch station shared house",
        area: "Finch",
        unit: "Private room",
        rent: "C$920 / month",
        housingType: "Shared house",
        availableFrom: "Reply received",
        mustConfirm: "I want the landlord's reply explained clearly.",
        request: "Please tell me what remains to confirm before reservation.",
        note: "Explain landlord reply to tenant",
        reviewItems: [
          "Summarize landlord reply",
          "Explain difficult cost items",
          "Organize remaining items before reservation",
          "Recheck shared-space rules",
          "Wait for tenant decision on whether to proceed",
        ],
        responseItems: {
          availableFrom: "Available-date reply was received.",
          includedItems: "Included-items reply was received.",
          initialPayment: "Initial payment reply was received.",
          extraNote: "MapleHouse is organizing the reply for the tenant.",
        },
      },
      "inq-2026-005": {
        id: "INQ-2026-005",
        status: "new",
        progress: "new",
        receivedAt: "Jun 12, 2026",
        inquirer: "DOYUN JUNG",
        email: "doyun@example.com",
        phone: "Needs confirmation",
        moveIn: "Needs confirmation",
        people: "1",
        stay: "Needs confirmation",
        listing: "Midtown condo room",
        area: "Midtown",
        unit: "Condo room",
        rent: "C$1,250 / month",
        housingType: "Condo room rent",
        availableFrom: "Needs confirmation",
        mustConfirm: "I want to confirm reservation availability and cancellation terms.",
        request: "Please also confirm access to building amenities.",
        note: "Confirm reservation availability and cancellation terms",
        reviewItems: [
          "Confirm reservation availability",
          "Confirm cancellation and refund terms",
          "Confirm condo amenity access",
          "Confirm key or access-card deposit",
          "Confirm payment items before move-in",
        ],
        responseItems: {
          availableFrom: "Reservation dates need confirmation.",
          includedItems: "Amenities and included items need confirmation.",
          initialPayment: "Reservation fee, deposit, and refund terms need confirmation.",
          extraNote: "Cancellation terms should be written clearly.",
        },
      },
      "inq-2026-006": {
        id: "INQ-2026-006",
        status: "needsReview",
        progress: "review",
        receivedAt: "Jun 11, 2026",
        inquirer: "SORA YANG",
        email: "sora@example.com",
        phone: "Needs confirmation",
        moveIn: "Late Jul 2026",
        people: "1",
        stay: "6+ months",
        listing: "Scarborough basement unit",
        area: "Scarborough",
        unit: "Basement unit",
        rent: "C$1,350 / month",
        housingType: "Basement",
        availableFrom: "Needs confirmation",
        mustConfirm: "I want to confirm daylight, moisture, ceiling height, and entrance.",
        request: "If possible, please ask for current photos or a short video before viewing.",
        note: "Confirm daylight, moisture, and separate entrance",
        reviewItems: [
          "Confirm daylight and window condition",
          "Confirm moisture, smell, and heating condition",
          "Confirm ceiling height and entrance separation",
          "Confirm whether photos differ from actual space",
          "Confirm cleaning or repair before move-in",
        ],
        responseItems: {
          availableFrom: "Move-in date and cleaning condition need confirmation.",
          includedItems: "Heating, internet, and utilities need confirmation.",
          initialPayment: "Initial payment terms and refund possibility need confirmation.",
          extraNote: "Daylight, moisture, and entrance details should be specific.",
        },
      },
    },
  },
  fr: {
    breadcrumb: { detail: "Détail de la demande" },
    backToList: "Retour à la liste des demandes",
    title: "Détail de la demande",
    subtitle: "Écran mock pour consulter une demande de locataire potentielle.",
    mvpNote: "L’envoi réel des messages, les réponses, les contrats et les paiements ne sont pas encore connectés.",
    emptyTitle: "Impossible de trouver cette demande.",
    emptyBody: "Aucune demande mock ne correspond à cet identifiant.",
    keyInfo: {
      id: "ID de demande",
      status: "Statut actuel",
      receivedAt: "Reçue le",
      inquirer: "Demandeur",
      listing: "Logement",
    },
    sections: {
      basics: "Informations de base",
      listing: "Logement sélectionné",
      content: "Contenu de la demande",
      review: "Points à vérifier par MapleHouse",
      response: "Points à répondre par le propriétaire",
      progress: "Progression de la demande",
    },
    fields: {
      inquirer: "Demandeur",
      email: "E-mail",
      phone: "Téléphone",
      moveIn: "Arrivée souhaitée",
      people: "Personnes",
      stay: "Durée du séjour",
      receivedAt: "Reçue le",
      listing: "Logement",
      area: "Secteur",
      unit: "Chambre/unité",
      rent: "Loyer",
      housingType: "Type de logement",
      availableFrom: "Disponible à partir de",
      mustConfirm: "À confirmer",
      request: "Demande supplémentaire",
      note: "Note",
    },
    reviewDescription:
      "Ces éléments seraient organisés par MapleHouse avant de poser les questions au propriétaire.",
    responseDescription:
      "Cette zone de réponse est un mock MVP. Rien n’est enregistré ni envoyé.",
    responseFields: {
      availableFrom: "Réponse sur la disponibilité",
      includedItems: "Réponse sur les éléments inclus",
      initialPayment: "Réponse sur le paiement initial / dépôt",
      extraNote: "Autre note",
    },
    mockSave: "Enregistrer la réponse · MVP à venir",
    mockSaveNote:
      "En phase réelle, cette réponse serait transmise au locataire potentiel selon le flux de demande.",
    actions: {
      list: "Retour à la liste des demandes",
      listings: "Voir dans la gestion du logement",
      save: "Enregistrer la réponse · MVP à venir",
    },
    progress: {
      new: "Nouvelle demande",
      review: "Organisation des points",
      waitingLandlord: "Réponse propriétaire attendue",
      waitingTenant: "Confirmation locataire attendue",
      reservationReview: "Réservation à examiner",
      closed: "Terminée",
    },
    details: {
      "inq-2026-001": {
        id: "INQ-2026-001",
        inquiryMethod: "assisted",
        status: "new",
        progress: "new",
        receivedAt: "16 juin 2026",
        inquirer: "MEHA KIM",
        email: "name@example.com",
        phone: "À confirmer",
        moveIn: "À confirmer",
        people: "1",
        stay: "À confirmer",
        listing: "Studio 1 chambre cozy à Koreatown",
        area: "Koreatown",
        unit: "Logement entier",
        rent: "1 850 $ CA / mois",
        housingType: "1 chambre",
        availableFrom: "À confirmer",
        mustConfirm:
          "Je veux confirmer la date d’arrivée, les charges incluses et les conditions de dépôt.",
        request:
          "Je veux connaître le montant initial et les conditions de remboursement avant tout paiement.",
        note: "Confirmer la disponibilité et le montant initial",
        reviewItems: [
          "Confirmer la vraie date d’arrivée possible",
          "Confirmer ce qui est inclus dans le loyer",
          "Confirmer les conditions de dépôt ou de paiement initial",
          "Confirmer le montant et les conditions de remboursement si un paiement est demandé avant l’arrivée",
          "Confirmer si les photos correspondent à l’espace actuel",
          "Confirmer les règles à revoir avant contrat ou réservation",
        ],
        responseItems: {
          availableFrom: "Le propriétaire doit confirmer la date réelle de disponibilité.",
          includedItems: "Les charges incluses et les frais séparés doivent être précisés.",
          initialPayment: "Le paiement initial, le dépôt et les conditions de remboursement doivent être confirmés.",
          extraNote: "Vérifier aussi si les photos correspondent à l’état actuel.",
        },
      },
      "inq-2026-002": {
        id: "INQ-2026-002",
        inquiryMethod: "direct",
        status: "needsReview",
        progress: "review",
        receivedAt: "15 juin 2026",
        inquirer: "JIWON PARK",
        email: "jiwon@example.com",
        phone: "À confirmer",
        moveIn: "Début juillet 2026",
        people: "1",
        stay: "3 mois ou plus",
        listing: "Chambre près du transport à North York",
        area: "North York",
        unit: "Chambre à louer",
        rent: "980 $ CA / mois",
        housingType: "Chambre à louer",
        availableFrom: "À confirmer",
        mustConfirm: "Je veux comprendre la composition des colocataires et les règles des espaces communs.",
        request: "Merci de confirmer si le logement est calme et comment fonctionnent les règles de visiteurs.",
        note: "Confirmer les colocataires et les règles communes",
        reviewItems: [
          "Confirmer les occupants actuels et la composition des colocataires",
          "Confirmer les règles de cuisine, salle de bain et buanderie",
          "Confirmer les règles de visiteurs et de bruit",
          "Confirmer le dépôt de clé ou les paiements initiaux",
          "Confirmer la date d’arrivée et la durée minimale",
        ],
        responseItems: {
          availableFrom: "La date d’arrivée et la durée minimale doivent être confirmées.",
          includedItems: "Les espaces communs, la buanderie et l’internet doivent être précisés.",
          initialPayment: "Confirmer s’il faut payer autre chose que le premier mois.",
          extraNote: "La composition des colocataires et les règles de vie doivent être précises.",
        },
      },
      "inq-2026-003": {
        id: "INQ-2026-003",
        status: "waitingLandlord",
        progress: "waitingLandlord",
        receivedAt: "14 juin 2026",
        inquirer: "MINSEO LEE",
        email: "minseo@example.com",
        phone: "Renseigné",
        moveIn: "1 août 2026",
        people: "1",
        stay: "6 mois",
        listing: "Studio meublé au centre-ville",
        area: "Downtown Toronto",
        unit: "Logement entier",
        rent: "2 050 $ CA / mois",
        housingType: "Studio",
        availableFrom: "Réponse propriétaire attendue",
        mustConfirm: "Je veux confirmer les meubles, l’internet et les charges incluses.",
        request: "Merci d’expliquer aussi les frais supplémentaires et les règles du bâtiment.",
        note: "Éléments inclus et frais supplémentaires déjà demandés",
        reviewItems: [
          "Confirmer les meubles inclus",
          "Confirmer internet, électricité, eau et chauffage",
          "Confirmer les paiements nécessaires avant l’arrivée",
          "Confirmer les règles du bâtiment",
          "Expliquer la réponse du propriétaire après réception",
        ],
        responseItems: {
          availableFrom: "En attente de la réponse du propriétaire sur la disponibilité.",
          includedItems: "En attente de la réponse sur les éléments inclus.",
          initialPayment: "En attente de la réponse sur les frais supplémentaires.",
          extraNote: "En attente des règles du bâtiment et des notes.",
        },
      },
      "inq-2026-004": {
        id: "INQ-2026-004",
        status: "waitingTenant",
        progress: "waitingTenant",
        receivedAt: "13 juin 2026",
        inquirer: "HANA CHOI",
        email: "hana@example.com",
        phone: "Renseigné",
        moveIn: "15 juillet 2026",
        people: "1",
        stay: "4 mois",
        listing: "Maison partagée près de Finch station",
        area: "Finch",
        unit: "Chambre privée",
        rent: "920 $ CA / mois",
        housingType: "Maison partagée",
        availableFrom: "Réponse reçue",
        mustConfirm: "Je veux une explication claire de la réponse du propriétaire.",
        request: "Merci d’indiquer ce qu’il reste à confirmer avant réservation.",
        note: "Réponse à expliquer au locataire",
        reviewItems: [
          "Résumer la réponse du propriétaire",
          "Expliquer les coûts difficiles à comprendre",
          "Organiser les éléments restants avant réservation",
          "Revérifier les règles des espaces communs",
          "Attendre la décision du locataire",
        ],
        responseItems: {
          availableFrom: "La réponse sur la disponibilité est arrivée.",
          includedItems: "La réponse sur les éléments inclus est arrivée.",
          initialPayment: "La réponse sur le paiement initial est arrivée.",
          extraNote: "MapleHouse organise la réponse pour le locataire.",
        },
      },
      "inq-2026-005": {
        id: "INQ-2026-005",
        status: "new",
        progress: "new",
        receivedAt: "12 juin 2026",
        inquirer: "DOYUN JUNG",
        email: "doyun@example.com",
        phone: "À confirmer",
        moveIn: "À confirmer",
        people: "1",
        stay: "À confirmer",
        listing: "Chambre en condo à Midtown",
        area: "Midtown",
        unit: "Chambre en condo",
        rent: "1 250 $ CA / mois",
        housingType: "Chambre en condo",
        availableFrom: "À confirmer",
        mustConfirm: "Je veux confirmer la disponibilité de réservation et les conditions d’annulation.",
        request: "Merci de confirmer aussi l’accès aux commodités du bâtiment.",
        note: "Confirmer la réservation et l’annulation",
        reviewItems: [
          "Confirmer la disponibilité de réservation",
          "Confirmer les conditions d’annulation et de remboursement",
          "Confirmer l’accès aux commodités du condo",
          "Confirmer le dépôt pour clé ou carte d’accès",
          "Confirmer les paiements avant l’arrivée",
        ],
        responseItems: {
          availableFrom: "Les dates de réservation doivent être confirmées.",
          includedItems: "Les commodités et éléments inclus doivent être confirmés.",
          initialPayment: "Les frais de réservation, dépôt et remboursements doivent être confirmés.",
          extraNote: "Les conditions d’annulation doivent être écrites clairement.",
        },
      },
      "inq-2026-006": {
        id: "INQ-2026-006",
        status: "needsReview",
        progress: "review",
        receivedAt: "11 juin 2026",
        inquirer: "SORA YANG",
        email: "sora@example.com",
        phone: "À confirmer",
        moveIn: "Fin juillet 2026",
        people: "1",
        stay: "6 mois ou plus",
        listing: "Unité en sous-sol à Scarborough",
        area: "Scarborough",
        unit: "Unité en sous-sol",
        rent: "1 350 $ CA / mois",
        housingType: "Sous-sol",
        availableFrom: "À confirmer",
        mustConfirm: "Je veux confirmer la lumière, l’humidité, la hauteur du plafond et l’entrée.",
        request: "Si possible, merci de demander des photos récentes ou une courte vidéo avant la visite.",
        note: "Confirmer lumière, humidité et entrée séparée",
        reviewItems: [
          "Confirmer la lumière et l’état des fenêtres",
          "Confirmer l’humidité, les odeurs et le chauffage",
          "Confirmer la hauteur du plafond et l’entrée séparée",
          "Confirmer si les photos diffèrent de l’espace actuel",
          "Confirmer le nettoyage ou les réparations avant l’arrivée",
        ],
        responseItems: {
          availableFrom: "La date d’arrivée et l’état de nettoyage doivent être confirmés.",
          includedItems: "Le chauffage, l’internet et les charges doivent être confirmés.",
          initialPayment: "Les conditions de paiement initial et de remboursement doivent être confirmées.",
          extraNote: "La lumière, l’humidité et l’entrée doivent être décrites précisément.",
        },
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
        {page === "inquiries" ? <InquiriesPanel copy={copy} locale={locale} /> : null}
        {page === "profile" ? (
          <ProfilePanel copy={copy} locale={locale} draft={draft} hasDraft={hasDraft} loaded={loaded} />
        ) : null}
      </Container>
    </main>
  );
}

export function LocaleLandlordInquiryDetailPage({
  locale,
  inquiryId,
}: {
  locale: Locale;
  inquiryId: string;
}) {
  const copy = CENTER_COPY[locale];
  const detailCopy = INQUIRY_DETAIL_COPY[locale];
  const inquiry = detailCopy.details[toInquirySlug(inquiryId)];
  const listHref = centerRoute(locale, "inquiries");
  const inquiryMethod = inquiry ? getInquiryMethod(inquiry) : "assisted";
  const structureCopy = getInquiryDetailStructureCopy(locale, inquiryMethod);

  return (
    <main className="min-h-screen bg-[#F7F7F8] py-10 sm:py-14">
      <Container className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link to={`/${locale}`} className="transition hover:text-foreground">
            {copy.breadcrumb.home}
          </Link>
          <span aria-hidden>·</span>
          <Link to={centerRoute(locale, "dashboard")} className="transition hover:text-foreground">
            {copy.breadcrumb.center}
          </Link>
          <span aria-hidden>·</span>
          <Link to={listHref} className="transition hover:text-foreground">
            {copy.nav.inquiries}
          </Link>
          <span aria-hidden>·</span>
          <span className="font-semibold text-foreground">{detailCopy.breadcrumb.detail}</span>
        </div>

        <section className="rounded-3xl border border-primary/15 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                MAPLEHOUSE LANDLORD CENTER
              </p>
              <h1 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                {detailCopy.title}
              </h1>
              <p className="text-sm leading-7 text-muted-foreground">{detailCopy.subtitle}</p>
              <p className="inline-flex max-w-full rounded-full border border-primary/20 bg-[#FFF8F1] px-3 py-1.5 text-xs font-semibold leading-relaxed text-primary">
                {detailCopy.mvpNote}
              </p>
            </div>
          </div>
        </section>

        <nav
          aria-label={copy.breadcrumb.center}
          className="flex gap-2 overflow-x-auto rounded-2xl border border-border bg-white p-2 shadow-sm"
        >
          {CENTER_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.key === "inquiries";

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

        {!inquiry ? (
          <EmptyCard
            title={detailCopy.emptyTitle}
            body={detailCopy.emptyBody}
            actionLabel={detailCopy.actions.list}
            actionHref={listHref}
          />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div className="min-w-0 space-y-5">
              <InquiryMetadataStrip
                items={[
                  { label: detailCopy.keyInfo.id, value: inquiry.id },
                  { label: detailCopy.keyInfo.listing, value: inquiry.listing },
                  { label: detailCopy.keyInfo.receivedAt, value: inquiry.receivedAt },
                  { label: detailCopy.keyInfo.inquirer, value: inquiry.inquirer },
                ]}
              />

              <InquiryListingProfileCard
                inquiry={inquiry}
                actionLabel={structureCopy.listingAction}
                actionHref={centerRoute(locale, "listings")}
              />

              <InquiryDetailSection title={detailCopy.sections.basics}>
                <InquiryDetailRows
                  items={[
                    [detailCopy.fields.inquirer, inquiry.inquirer],
                    [detailCopy.fields.email, inquiry.email],
                    [detailCopy.fields.phone, inquiry.phone],
                    [detailCopy.fields.moveIn, inquiry.moveIn],
                    [detailCopy.fields.people, inquiry.people],
                    [detailCopy.fields.stay, inquiry.stay],
                    [detailCopy.fields.receivedAt, inquiry.receivedAt],
                  ]}
                />
              </InquiryDetailSection>

              <InquiryDetailSection title={detailCopy.sections.listing}>
                <InquiryDetailRows
                  items={[
                    [detailCopy.fields.listing, inquiry.listing],
                    [detailCopy.fields.area, inquiry.area],
                    [detailCopy.fields.unit, inquiry.unit],
                    [detailCopy.fields.rent, inquiry.rent],
                    [detailCopy.fields.housingType, inquiry.housingType],
                    [detailCopy.fields.availableFrom, inquiry.availableFrom],
                  ]}
                />
              </InquiryDetailSection>

              <InquiryDetailSection
                title={structureCopy.itemsTitle}
                description={structureCopy.itemsDescription}
              >
                <InquiryQuestionItems
                  customerLabel={structureCopy.customerContentLabel}
                  questionLabel={structureCopy.questionListLabel}
                  customerItems={[
                    [detailCopy.fields.mustConfirm, inquiry.mustConfirm],
                    [detailCopy.fields.request, inquiry.request],
                    [detailCopy.fields.note, inquiry.note],
                  ]}
                  questions={inquiry.reviewItems}
                />
              </InquiryDetailSection>

              <InquiryDetailSection
                title={structureCopy.responseTitle}
                description={structureCopy.responseDescription}
              >
                <InquiryResponseMock
                  locale={locale}
                  questions={inquiry.reviewItems}
                  values={getInquiryResponseValues(inquiry)}
                  note={structureCopy.responseNote}
                  emptyPlaceholder={structureCopy.responsePlaceholder}
                />
              </InquiryDetailSection>

              <section className="flex flex-col gap-3 rounded-3xl border border-border bg-white p-4 shadow-sm sm:flex-row">
                <Link
                  to={listHref}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-[#FFF8F1] hover:text-primary"
                >
                  {detailCopy.actions.list}
                </Link>
                <Link
                  to={centerRoute(locale, "listings")}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary"
                >
                  {structureCopy.listingAction}
                </Link>
                <button
                  type="button"
                  disabled
                  className="inline-flex flex-1 cursor-not-allowed items-center justify-center rounded-2xl border border-primary/20 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold text-primary/70"
                >
                  {detailCopy.actions.save}
                </button>
              </section>
            </div>

            <aside className="h-fit rounded-3xl border border-primary/15 bg-white p-5 shadow-sm xl:sticky xl:top-24">
              <div className="mb-4 border-b border-border/70 pb-3">
                <h2 className="text-sm font-bold text-foreground">{detailCopy.sections.progress}</h2>
              </div>
              <InquiryProgressFlow
                labels={detailCopy.progress}
                current={inquiry.progress}
              />
              <div className="mt-5 border-t border-border/70 pt-4">
                <Link
                  to={listHref}
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-[#FFF8F1] hover:text-primary"
                >
                  {detailCopy.backToList}
                </Link>
              </div>
            </aside>
          </div>
        )}
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

function InquiriesPanel({ copy, locale }: { copy: CenterCopy; locale: Locale }) {
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
                <Link
                  to={
                    locale === "ko"
                      ? "/ko/landlords/center/inquiries/$inquiryId"
                      : locale === "en"
                        ? "/en/landlords/center/inquiries/$inquiryId"
                        : "/fr/landlords/center/inquiries/$inquiryId"
                  }
                  params={{ inquiryId: toInquirySlug(inquiry.id) }}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-primary/25 bg-white px-3 py-1.5 text-[12px] font-semibold text-primary transition hover:bg-[#FFF8F1]"
                >
                  {copy.inquiries.action}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function getInquiryMethod(inquiry: LandlordInquiryDetailData): LandlordInquiryMethod {
  return inquiry.inquiryMethod ?? "assisted";
}

function getInquiryDetailStructureCopy(locale: Locale, method: LandlordInquiryMethod) {
  const shared = {
    ko: {
      listingAction: "해당 매물 관리로 이동",
      customerContentLabel: "고객 문의 내용",
      assistedQuestionLabel: "임대인에게 확인할 질문",
      directQuestionLabel: "질문 목록",
      responseTitle: "임대인 답변 내용",
      responseDescription:
        "문의 질문별로 임대인 답변을 확인하는 MVP mock 영역입니다.",
      responsePlaceholder: "임대인이 답변을 입력하는 mock 영역",
      assistedNote:
        "실제 운영 단계에서는 이 답변이 MapleHouse 검토 후 예비 입주자에게 전달됩니다.",
      directNote:
        "실제 운영 단계에서는 임대인이 작성한 답변이 예비 입주자에게 전달됩니다.",
    },
    en: {
      listingAction: "Go to listing management",
      customerContentLabel: "Customer inquiry content",
      assistedQuestionLabel: "Questions to ask the landlord",
      directQuestionLabel: "Question list",
      responseTitle: "Landlord response",
      responseDescription:
        "This MVP mock area shows landlord replies by inquiry question.",
      responsePlaceholder: "Mock area for the landlord reply",
      assistedNote:
        "In the real operation stage, MapleHouse would review this reply and deliver it to the prospective tenant.",
      directNote:
        "In the real operation stage, the landlord's written reply would be delivered to the prospective tenant.",
    },
    fr: {
      listingAction: "Voir dans la gestion du logement",
      customerContentLabel: "Contenu envoyé par le client",
      assistedQuestionLabel: "Questions à poser au propriétaire",
      directQuestionLabel: "Liste de questions",
      responseTitle: "Réponse du propriétaire",
      responseDescription:
        "Cette zone mock MVP affiche les réponses du propriétaire par question.",
      responsePlaceholder: "Zone mock pour la réponse du propriétaire",
      assistedNote:
        "En phase réelle, MapleHouse vérifierait cette réponse puis la transmettrait au locataire potentiel.",
      directNote:
        "En phase réelle, la réponse écrite du propriétaire serait transmise au locataire potentiel.",
    },
  }[locale];

  if (method === "direct") {
    return {
      ...shared,
      itemsTitle:
        locale === "ko"
          ? "고객 직접 문의 내용"
          : locale === "en"
            ? "Direct inquiry content"
            : "Contenu de la demande directe",
      itemsDescription:
        locale === "ko"
          ? "고객이 임대인에게 직접 전달하려는 문의 내용을 확인하는 mock 영역입니다."
          : locale === "en"
            ? "A mock area for the inquiry content the customer wants to send directly to the landlord."
            : "Zone mock pour le contenu que le client souhaite envoyer directement au propriétaire.",
      questionListLabel: shared.directQuestionLabel,
      responseNote: shared.directNote,
    };
  }

  return {
    ...shared,
    itemsTitle:
      locale === "ko"
        ? "MapleHouse 대리 문의 항목"
        : locale === "en"
          ? "MapleHouse assisted inquiry items"
          : "Points de demande assistée par MapleHouse",
    itemsDescription:
      locale === "ko"
        ? "고객이 입력한 내용을 바탕으로 MapleHouse가 임대인에게 확인할 질문을 정리한 mock 영역입니다."
        : locale === "en"
          ? "A mock area where MapleHouse organizes questions to ask the landlord based on the customer's inquiry."
          : "Zone mock où MapleHouse organise les questions à poser au propriétaire à partir de la demande du client.",
    questionListLabel: shared.assistedQuestionLabel,
    responseNote: shared.assistedNote,
  };
}

function getInquiryAnswerLabel(locale: Locale, index: number) {
  const number = index + 1;

  if (locale === "ko") return `질문 ${number}에 대한 답변`;
  if (locale === "en") return `Answer to question ${number}`;
  return `Réponse à la question ${number}`;
}

function getInquiryResponseValues(inquiry: LandlordInquiryDetailData) {
  return Object.values(inquiry.responseItems);
}

function InquiryDetailSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <div className="space-y-2">
        <h2 className="text-[17px] font-bold text-foreground">{title}</h2>
        {description ? (
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function InquiryListingProfileCard({
  inquiry,
  actionLabel,
  actionHref,
}: {
  inquiry: LandlordInquiryDetailData;
  actionLabel: string;
  actionHref: string;
}) {
  const imageSrc = getMockListingThumbnailImage(`inquiry-${inquiry.id}-${inquiry.listing}`);
  const secondaryText = [inquiry.area, inquiry.unit].filter(Boolean).join(" · ");

  return (
    <section className="rounded-3xl border border-primary/15 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <ListingImageFrame
          src={imageSrc}
          alt={inquiry.listing}
          className="aspect-[4/3] w-full flex-none rounded-2xl border border-border bg-[#F8FAFC] sm:h-28 sm:w-40"
          fallback={
            <div className="flex h-full w-full items-center justify-center text-primary">
              <Building2 className="h-8 w-8" aria-hidden />
            </div>
          }
        />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="break-words text-base font-bold leading-6 text-foreground">
            {inquiry.listing}
          </p>
          {secondaryText ? (
            <p className="break-words text-sm leading-6 text-muted-foreground">
              {secondaryText}
            </p>
          ) : null}
          <Link
            to={actionHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary/80"
          >
            {actionLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

function InquiryMetadataStrip({
  items,
}: {
  items: Array<{ label: string; value: ReactNode }>;
}) {
  return (
    <section className="rounded-3xl border border-border bg-white px-5 py-4 shadow-sm">
      <dl className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm leading-6">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              "inline-flex min-w-0 items-baseline gap-1.5",
              index > 0 ? "before:mr-1 before:text-border before:content-['·']" : "",
            )}
          >
            <dt className="flex-none whitespace-nowrap text-[12px] font-semibold text-muted-foreground">
              {item.label}
            </dt>
            <dd className="min-w-0 break-words text-[13px] font-medium text-foreground">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function InquiryQuestionItems({
  customerLabel,
  questionLabel,
  customerItems,
  questions,
}: {
  customerLabel: string;
  questionLabel: string;
  customerItems: Array<[string, string]>;
  questions: string[];
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[12px] font-bold leading-6 text-foreground">{customerLabel}</p>
        <div className="mt-2 rounded-2xl border border-border/80 px-4">
          <InquiryTextRows items={customerItems} />
        </div>
      </div>
      <div className="border-t border-border/70 pt-4">
        <p className="text-[12px] font-bold leading-6 text-foreground">{questionLabel}</p>
        <div className="mt-2">
          <InquiryReviewList items={questions} />
        </div>
      </div>
    </div>
  );
}

function InquiryDetailRows({ items }: { items: Array<[string, string]> }) {
  return (
    <dl className="divide-y divide-border/70">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="grid gap-1 py-3 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5"
        >
          <dt className="text-[12px] font-semibold leading-6 text-muted-foreground">
            {label}
          </dt>
          <dd className="min-w-0 break-words text-sm font-medium leading-6 text-foreground">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function InquiryTextRows({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="divide-y divide-border/70">
      {items.map(([label, value]) => (
        <div key={label} className="py-3">
          <p className="text-[12px] font-semibold leading-6 text-muted-foreground">{label}</p>
          <p className="mt-1 break-words text-sm leading-7 text-foreground">{value}</p>
        </div>
      ))}
    </div>
  );
}

function InquiryReviewList({ items }: { items: string[] }) {
  return (
    <ul className="divide-y divide-border/70">
      {items.map((item) => (
        <li key={item} className="flex gap-3 py-3 text-sm leading-6 text-foreground">
          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary" aria-hidden />
          <span className="min-w-0 break-words">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InquiryResponseMock({
  locale,
  questions,
  values,
  note,
  emptyPlaceholder,
}: {
  locale: Locale;
  questions: string[];
  values: string[];
  note: string;
  emptyPlaceholder: string;
}) {
  return (
    <div className="space-y-4">
      <div className="divide-y divide-border/70">
        {questions.map((question, index) => (
          <label
            key={`${question}-${index}`}
            className="grid gap-3 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-5"
          >
            <span className="space-y-1">
              <span className="block text-[12px] font-semibold leading-6 text-foreground">
                {getInquiryAnswerLabel(locale, index)}
              </span>
              <span className="block break-words text-xs leading-5 text-muted-foreground">
                {question}
              </span>
            </span>
            <textarea
              value={values[index] ?? ""}
              placeholder={emptyPlaceholder}
              readOnly
              rows={3}
              className="min-h-[70px] w-full resize-none rounded-2xl border border-border bg-white px-4 py-3 text-sm leading-6 text-foreground outline-none"
            />
          </label>
        ))}
      </div>
      <div className="border-t border-border/70 pt-4">
        <p className="text-xs leading-6 text-muted-foreground">{note}</p>
      </div>
    </div>
  );
}

function InquiryProgressFlow({
  labels,
  current,
}: {
  labels: Record<LandlordInquiryProgressKey, string>;
  current: LandlordInquiryProgressKey;
}) {
  const steps: LandlordInquiryProgressKey[] = [
    "new",
    "review",
    "waitingLandlord",
    "waitingTenant",
    "reservationReview",
    "closed",
  ];
  const currentIndex = steps.indexOf(current);

  return (
    <ol className="space-y-3">
      {steps.map((step, index) => {
        const active = step === current;
        const complete = index < currentIndex;

        return (
          <li key={step} className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-7 w-7 flex-none items-center justify-center rounded-full border text-xs font-bold",
                active
                  ? "border-primary bg-[#FFF3E8] text-primary"
                  : complete
                    ? "border-primary/30 bg-white text-primary"
                    : "border-border bg-[#FAFAFA] text-muted-foreground",
              )}
            >
              {index + 1}
            </span>
            <span
              className={cn(
                "text-sm leading-6",
                active ? "font-semibold text-primary" : "font-medium text-muted-foreground",
              )}
            >
              {labels[step]}
            </span>
          </li>
        );
      })}
    </ol>
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

function toInquirySlug(inquiryId: string) {
  return inquiryId.trim().toLowerCase();
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
