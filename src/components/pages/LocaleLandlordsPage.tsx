import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Building2,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  HelpCircle,
  Home,
  ImagePlus,
  Info,
  MessageSquareText,
  Search,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LANDLORD_DRAFT_KEY = "maplehouse.landlordDraft.v1";

export type LandlordRoutePage =
  | "landing"
  | "guide"
  | "register"
  | "property"
  | "rooms"
  | "terms"
  | "preview";

type RouteKey = LandlordRoutePage;
type LandlordRegistrationRouteBase = "public" | "center";

type LandlordDraft = {
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
  laundry: string;
  residentCondition: string;
  tenantPetsAllowed: string;
  homePets: string;
  homePetType: string;
  smokingCondition: string;
  photos: LandlordPhoto[];
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
  lastMonthDeposit: string;
  keyDepositAmount: string;
  utilitiesIncluded: string[];
  utilitiesSeparate: string[];
  utilityStatuses: Record<string, string>;
  houseRules: string;
  houseRuleItems: string[];
  additionalNote: string;
  moveInQuestions: string;
  communicationMethod: string;
};

type LandlordPhoto = {
  id: string;
  name: string;
  dataUrl?: string;
};

type FieldRequirement = "required" | "optional" | "conditional";
type LandlordCityKey = "toronto" | "vancouver" | "calgary";

type LandlordContent = {
  homeLabel: string;
  landlordsLabel: string;
  guideLabel: string;
  routeLabels: Record<RouteKey, string>;
  landing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    benefits: Array<{ title: string; body: string }>;
    concernsTitle?: string;
    concerns?: Array<{ title: string; body: string }>;
    infoTitle: string;
    infoItems: string[];
    afterTitle?: string;
    afterSteps?: string[];
    notice: string;
  };
  guide: {
    title: string;
    subtitle: string;
    processTitle: string;
    process: string[];
    termsTitle: string;
    termsBody: string;
    cta: string;
  };
  flow: {
    selectPlaceholder: string;
    labels: string[];
    next: string;
    back: string;
    startOver: string;
    draftNoticeTitle: string;
    draftNoticeBody: string;
    backToStart: string;
    requiredHelper: string;
    sectionEyebrow: string;
    start: {
      title: string;
      description: string;
      helpTitle: string;
      helpBody: string;
    };
    property: {
      title: string;
      description: string;
      addressHelper: string;
      stationPlaceholder?: string;
      stationSearchPlaceholder?: string;
      stationNotClose?: string;
      stationNotSure?: string;
    };
    rooms: {
      title: string;
      description: string;
      minimumStayTooltip?: string;
    };
    terms: {
      title: string;
      description: string;
      notice: string;
      lastMonthInfo?: string;
    };
    preview: {
      title: string;
      description: string;
      checkbox: string;
      submit: string;
      successTitle: string;
      successBody: string;
      edit: string;
      sections: {
        contact: string;
        property: string;
        room: string;
        terms: string;
        notes?: string;
        photos?: string;
        rules?: string;
      };
      empty: string;
    };
    photos?: {
      title: string;
      helper: string;
      coverLabel: string;
      uploadCta: string;
      maxNotice: string;
      remove: string;
      setCover: string;
    };
  };
  fields: Record<string, string>;
  options: {
    roles: string[];
    preferredLanguages: string[];
    cityOptions?: string[];
    housingTypes: string[];
    useTypes: string[];
    residentConditions?: string[];
    petAllowed?: string[];
    homePets?: string[];
    smoking?: string[];
    yesNoConfirm: string[];
    minimumStay: string[];
    occupancy: string[];
    bathroom: string[];
    kitchen: string[];
    furniture: string[];
    bedSize?: string[];
    utilities: string[];
    deposit: string[];
    communication: string[];
    utilityStatus: string[];
    houseRules?: string[];
  };
};

const DEFAULT_DRAFT: LandlordDraft = {
  role: "",
  name: "",
  firstName: "",
  lastName: "",
  email: "",
  emailLocal: "",
  emailDomain: "",
  contact: "",
  phoneCountryCode: "",
  phoneCountryCodeCustom: "",
  phoneNumber: "",
  preferredLanguage: "",
  preferredLanguages: [],
  preferredContactMethods: [],
  shortMessage: "",
  city: "",
  area: "",
  nearestStation: "",
  address: "",
  housingType: "",
  unitDetail: "",
  floor: "",
  useType: "",
  furnished: "",
  elevator: "",
  parking: "",
  laundry: "",
  residentCondition: "",
  tenantPetsAllowed: "",
  homePets: "",
  homePetType: "",
  smokingCondition: "",
  photos: [],
  coverPhotoId: "",
  listingTitle: "",
  monthlyRent: "",
  availableFrom: "",
  minimumStay: "",
  occupancy: "",
  bathroom: "",
  kitchen: "",
  furniture: [],
  bedSize: "",
  lastMonthDeposit: "",
  keyDepositAmount: "",
  utilitiesIncluded: [],
  utilitiesSeparate: [],
  utilityStatuses: {},
  houseRules: "",
  houseRuleItems: [],
  additionalNote: "",
  moveInQuestions: "",
  communicationMethod: "",
};

const CONTENT: Record<Locale, LandlordContent> = {
  ko: {
    homeLabel: "홈",
    landlordsLabel: "임대인 등록",
    guideLabel: "등록 안내",
    routeLabels: {
      landing: "임대인 등록",
      guide: "등록 안내",
      register: "시작",
      property: "매물 정보",
      rooms: "월세·사진",
      terms: "조건",
      preview: "미리보기",
    },
    landing: {
      eyebrow: "LANDLORDS / HOUSING PROVIDERS",
      title: "임대인에게는 무료입니다",
      subtitle:
        "MapleHouse는 캐나다에서 출국 전 주거를 찾는 예비 입주자와 임대인·주거 제공자를 연결합니다.",
      primaryCta: "임대인 등록 및 첫 매물 등록하기",
      secondaryCta: "임대인 센터 보기",
      benefits: [
        {
          title: "리스팅 비용 $0",
          body: "현재 의도한 구조에서 MapleHouse는 임대인에게 등록비나 성공 수수료를 부과하지 않습니다.",
        },
        {
          title: "출국 전 입주 수요 연결",
          body: "캐나다 도착 전 집을 찾는 사용자에게 매물 정보를 보여주고 문의 흐름을 정리합니다.",
        },
        {
          title: "문의 정보 표준화",
          body: "입주 희망일, 체류 기간, 인원, 예산, 확인 질문을 정리해 전달할 수 있습니다.",
        },
        {
          title: "노쇼 불확실성 완화",
          body: "예약 의사와 확인 절차를 명확히 하여 불확실한 일정 조율을 줄이는 방향을 지원합니다.",
        },
      ],
      infoTitle: "매물 등록 전에 준비하면 좋은 정보",
      infoItems: [
        "매물 지역",
        "가까운 역",
        "주거 형태",
        "월세",
        "입주 가능일",
        "최소 체류 기간",
        "포함 공과금",
        "가구·침구 포함 여부",
        "사진",
        "연락 방식",
      ],
      afterTitle: "등록 후 흐름",
      afterSteps: [
        "매물 정보 입력",
        "MapleHouse 검토용 미리보기",
        "입주자 문의 정보 정리",
        "확인·예약 의사 조율",
      ],
      notice:
        "MapleHouse는 MVP 흐름에서 계약 당사자, 법률 자문가, 중개인 또는 결제 보증인이 아닙니다. 최종 계약, 입금, 결제, 입주 여부는 당사자가 직접 확인하고 결정해야 합니다.",
    },
    guide: {
      title: "매물 등록 전에 확인할 것",
      subtitle:
        "등록 문의를 시작하기 전에 매물 정보, 월세 조건, 입주 가능일, 확인 질문을 미리 정리해두면 문의가 더 명확해집니다.",
      processTitle: "등록 문의 흐름",
      process: [
        "기본 정보 입력",
        "공간과 방 정보 정리",
        "월세·입주 조건 확인",
        "MapleHouse 검토용 미리보기 제출",
      ],
      termsTitle: "캐나다/Ontario 임대 조건 참고",
      termsBody:
        "캐나다/Ontario 주거 임대 조건은 한국식 보증금·관리비 구조와 다를 수 있습니다. MapleHouse 등록 화면에서는 월세, 마지막 달 월세 보증금, 환불 가능한 키 보증금, 포함 공과금, 별도 공과금을 나누어 확인합니다. 실제 계약 전에는 최신 현지 규정과 계약서를 반드시 확인해야 합니다.",
      cta: "등록 문의 시작하기",
    },
    flow: {
      selectPlaceholder: "선택하세요",
      labels: ["시작", "매물 정보", "월세·사진", "미리보기"],
      next: "다음",
      back: "이전",
      startOver: "처음부터 다시",
      draftNoticeTitle: "아직 시작된 등록 초안이 없습니다",
      draftNoticeBody:
        "이 단계는 등록 문의 초안을 기반으로 합니다. 바로 입력할 수 있지만, 시작 단계에서 기본 정보를 먼저 정리하는 것을 권장합니다.",
      backToStart: "시작 단계로 이동",
      requiredHelper: "역할, 이름, 연락 가능한 정보를 입력하면 다음 단계로 이동할 수 있습니다.",
      sectionEyebrow: "LANDLORD REGISTRATION",
      start: {
        title: "임대인 기본 정보를 입력하세요",
        description:
          "첫 매물 등록에 필요한 기본 연락처만 먼저 확인합니다. 추후 회원가입 정보와 연동될 예정입니다.",
        helpTitle: "먼저 확인할 정보",
        helpBody:
          "역할, 이름, 이메일, 전화번호만 있으면 첫 매물 초안을 시작할 수 있습니다.",
      },
      property: {
        title: "첫 매물의 기본 정보를 입력하세요",
        description:
          "도시, 상세 주소, 주거 형태, 함께 사는 조건만 먼저 정리합니다.",
        addressHelper: "출입 코드, 비밀번호, 정확한 유닛 출입 정보처럼 민감한 정보는 입력하지 마세요.",
      },
      rooms: {
        title: "월세, 입주 가능일, 사진을 등록하세요",
        description:
          "입주자가 먼저 확인하는 핵심 정보만 빠르게 등록합니다.",
      },
      terms: {
        title: "상세 조건은 나중에 보완할 수 있습니다",
        description:
          "보증금, 공과금, 하우스 룰, 입주 전 확인 질문은 임대인 센터에서 매물 상세 정보로 추가할 수 있습니다.",
        notice:
          "실제 계약 전에는 월세, 마지막 달 월세 보증금, 키 보증금, 공과금 포함 여부, 입주 가능일을 당사자가 직접 확인해야 합니다.",
      },
      preview: {
        title: "첫 매물 초안 미리보기",
        description:
          "첫 온보딩에서 입력한 핵심 정보만 요약합니다. 상세 조건은 임대인 센터에서 나중에 보완할 수 있습니다.",
        checkbox:
          "이 MVP에서는 실제 매물 등록, 계약, 결제, 송금, 파일 업로드 기능이 아직 연결되어 있지 않음을 이해했습니다.",
        submit: "미리보기 제출하기",
        successTitle: "미리보기 제출 화면입니다",
        successBody:
          "실제 접수는 아직 연결되어 있지 않습니다. 다음 단계에서는 MapleHouse 검토 상태와 입주자 문의 흐름을 연결할 예정입니다.",
        edit: "수정",
        sections: {
          contact: "연락처 / 역할",
          property: "공간 정보",
          room: "방과 월세",
          terms: "조건과 공과금",
          notes: "메모",
        },
        empty: "미입력",
      },
    },
    fields: {
      role: "역할",
      name: "이름",
      email: "이메일",
      contact: "전화번호 또는 선호 연락 방식",
      preferredLanguage: "선호 언어",
      shortMessage: "짧은 메시지",
      city: "도시",
      area: "지역 / 동네",
      nearestStation: "가까운 역",
      address: "상세 주소",
      housingType: "주거 형태",
      useType: "이용 형태",
      furnished: "가구 포함",
      elevator: "엘리베이터",
      parking: "주차",
      laundry: "세탁",
      listingTitle: "매물 제목",
      monthlyRent: "월세",
      availableFrom: "입주 가능일",
      minimumStay: "최소 체류 기간",
      occupancy: "인원",
      bathroom: "욕실",
      kitchen: "주방",
      furniture: "포함 가구",
      lastMonthDeposit: "마지막 달 월세 보증금",
      keyDepositAmount: "환급 가능한 키 보증금",
      utilitiesIncluded: "월세에 포함된 공과금",
      utilitiesSeparate: "입주자가 별도 납부하는 공과금",
      houseRules: "하우스 룰 / 메모",
      moveInQuestions: "입주 전 확인 질문",
      communicationMethod: "선호 연락 방식",
    },
    options: {
      roles: ["임대인", "부동산/매니저", "홈스테이 제공자", "기타"],
      preferredLanguages: ["한국어", "English", "Français", "상관없음"],
      housingTypes: [
        "콘도",
        "아파트",
        "하우스",
        "타운하우스",
        "베이스먼트",
        "홈스테이",
        "룸렌트/쉐어",
        "코리빙",
        "기타",
      ],
      useTypes: ["전체 유닛", "개인실", "공유실", "홈스테이형"],
      yesNoConfirm: ["예", "아니요", "확인 필요"],
      minimumStay: ["2주 이상", "1개월 이상", "3개월 이상", "6개월 이상", "1년 이상", "협의"],
      occupancy: ["1명", "2명", "협의"],
      bathroom: ["개인 욕실", "공용 욕실", "방 안 욕실", "협의"],
      kitchen: ["개인 주방", "공용 주방", "간이 주방", "없음/협의"],
      furniture: ["침대", "매트리스", "책상", "의자", "옷장", "침구", "조명"],
      utilities: ["전기/hydro", "난방", "수도", "가스", "인터넷", "세탁", "주차"],
      deposit: ["필요", "필요 없음", "확인 필요"],
      communication: ["이메일", "전화", "KakaoTalk", "WhatsApp", "기타"],
      utilityStatus: ["월세 포함", "입주자 별도", "확인 필요"],
    },
  },
  en: {
    homeLabel: "Home",
    landlordsLabel: "Landlords",
    guideLabel: "Listing guide",
    routeLabels: {
      landing: "Landlords",
      guide: "Listing guide",
      register: "Start",
      property: "Listing basics",
      rooms: "Rent & photos",
      terms: "Terms",
      preview: "Preview",
    },
    landing: {
      eyebrow: "LANDLORDS / HOUSING PROVIDERS",
      title: "Free for landlords",
      subtitle:
        "MapleHouse connects landlords and housing providers with tenants looking for housing before arrival in Canada.",
      primaryCta: "Register as a landlord and add your first listing",
      secondaryCta: "View landlord center",
      benefits: [
        {
          title: "$0 listing fee",
          body: "In the current intended model, MapleHouse does not charge landlords a listing fee or success commission.",
        },
        {
          title: "Pre-arrival tenant demand",
          body: "Show your housing information to people preparing their housing before arriving in Canada.",
        },
        {
          title: "Standardized inquiries",
          body: "Move-in date, stay length, occupants, budget, and confirmation questions can be organized before contact.",
        },
        {
          title: "Lower no-show uncertainty",
          body: "Clearer reservation intent and confirmation steps can help reduce uncertain scheduling.",
        },
      ],
      infoTitle: "Information to prepare before listing",
      infoItems: [
        "Property area",
        "Nearest station",
        "Housing type",
        "Monthly rent",
        "Available date",
        "Minimum stay",
        "Included utilities",
        "Furniture and bedding",
        "Photos",
        "Contact method",
      ],
      afterTitle: "After you submit",
      afterSteps: [
        "Enter listing information",
        "Preview for MapleHouse review",
        "Organize tenant inquiry context",
        "Coordinate confirmation and reservation intent",
      ],
      notice:
        "MapleHouse is not a contracting party, legal advisor, broker, or payment guarantor in this MVP flow. Final agreement, deposit, payment, and move-in decisions must be confirmed by the parties.",
    },
    guide: {
      title: "Before submitting a listing inquiry",
      subtitle:
        "Prepare the property details, rent terms, move-in timing, and confirmation questions before starting the registration flow.",
      processTitle: "Simple registration flow",
      process: [
        "Enter basic details",
        "Organize property and room information",
        "Confirm rent and move-in terms",
        "Submit a preview for MapleHouse review",
      ],
      termsTitle: "Canada/Ontario rental terms helper",
      termsBody:
        "Rental terms in Canada/Ontario may differ from Korean-style deposit and maintenance-fee structures. MapleHouse separates monthly rent, last month's rent deposit, refundable key deposit, included utilities, and separate utilities. Current local rules and the lease should be checked before signing.",
      cta: "Start registration inquiry",
    },
    flow: {
      selectPlaceholder: "Select",
      labels: ["Start", "Listing basics", "Rent & photos", "Preview"],
      next: "Next",
      back: "Back",
      startOver: "Start over",
      draftNoticeTitle: "Draft not started yet",
      draftNoticeBody:
        "This step works best with a registration draft. You can still enter details here, but starting with basic contact information is recommended.",
      backToStart: "Go to start",
      requiredHelper: "Enter role, name, and email or contact method to continue.",
      sectionEyebrow: "LANDLORD REGISTRATION",
      start: {
        title: "Enter your landlord information",
        description:
          "Start with only the basic contact details needed for your first listing. These can later be linked to account information.",
        helpTitle: "What to prepare first",
        helpBody:
          "Your role, name, email, and phone number are enough to start a first listing draft.",
      },
      property: {
        title: "Add listing basics",
        description:
          "Add the city, detailed address, housing type, and shared-living preference first.",
        addressHelper: "Do not enter access codes, passwords, or sensitive unit access details.",
      },
      rooms: {
        title: "Add rent, availability, and photos",
        description:
          "Quickly add the key details tenants check first.",
      },
      terms: {
        title: "Detailed conditions can be added later",
        description:
          "Deposits, utilities, house rules, and move-in questions can be added later from the landlord center as detailed listing information.",
        notice:
          "Before any agreement, the parties should directly confirm rent, last month's rent deposit, key deposit, utilities, and move-in date.",
      },
      preview: {
        title: "First listing draft preview",
        description:
          "This preview summarizes only the quick onboarding essentials. Detailed conditions can be added later from the landlord center.",
        checkbox:
          "I understand that this MVP does not yet process real listing submission, contracts, payments, payouts, or file uploads.",
        submit: "Submit preview",
        successTitle: "Preview submitted locally",
        successBody:
          "This is a preview submission only. Real intake is not connected yet. A later version can connect MapleHouse review status and tenant inquiry flow.",
        edit: "Edit",
        sections: {
          contact: "Contact / role",
          property: "Property",
          room: "Room and rent",
          terms: "Terms and utilities",
          notes: "Notes",
        },
        empty: "Not entered",
      },
    },
    fields: {
      role: "Role",
      name: "Name",
      email: "Email",
      contact: "Phone or preferred contact",
      preferredLanguage: "Preferred language",
      shortMessage: "Short message",
      city: "City",
      area: "Area / neighborhood",
      nearestStation: "Nearest station",
      address: "Detailed address",
      housingType: "Housing type",
      useType: "Use type",
      furnished: "Furnished?",
      elevator: "Elevator?",
      parking: "Parking?",
      laundry: "Laundry?",
      listingTitle: "Listing title",
      monthlyRent: "Monthly rent",
      availableFrom: "Available from",
      minimumStay: "Minimum stay",
      occupancy: "Occupancy",
      bathroom: "Bathroom",
      kitchen: "Kitchen",
      furniture: "Included furniture",
      lastMonthDeposit: "Last month's rent deposit",
      keyDepositAmount: "Refundable key deposit",
      utilitiesIncluded: "Utilities included in rent",
      utilitiesSeparate: "Utilities paid separately by tenant",
      houseRules: "House rules / notes",
      moveInQuestions: "Move-in confirmation questions",
      communicationMethod: "Preferred communication method",
    },
    options: {
      roles: ["Landlord", "Property manager", "Homestay provider", "Other"],
      preferredLanguages: ["Korean", "English", "French", "No preference"],
      housingTypes: [
        "Condo",
        "Apartment",
        "House",
        "Townhouse",
        "Basement",
        "Homestay",
        "Room rental/shared housing",
        "Co-living",
        "Other",
      ],
      useTypes: ["Entire unit", "Private room", "Shared room", "Homestay-style"],
      yesNoConfirm: ["Yes", "No", "To confirm"],
      minimumStay: ["2+ weeks", "1+ month", "3+ months", "6+ months", "1+ year", "Flexible"],
      occupancy: ["1 person", "2 people", "Flexible"],
      bathroom: ["Private bathroom", "Shared bathroom", "Ensuite", "To confirm"],
      kitchen: ["Private kitchen", "Shared kitchen", "Kitchenette", "None/to confirm"],
      furniture: ["bed", "mattress", "desk", "chair", "wardrobe", "bedding", "lamp"],
      utilities: ["electricity/hydro", "heat", "water", "gas", "internet", "laundry", "parking"],
      deposit: ["Required", "Not required", "To confirm"],
      communication: ["Email", "Phone", "KakaoTalk", "WhatsApp", "Other"],
      utilityStatus: ["Included", "Tenant pays separately", "To confirm"],
    },
  },
  fr: {
    homeLabel: "Accueil",
    landlordsLabel: "Propriétaires",
    guideLabel: "Guide",
    routeLabels: {
      landing: "Propriétaires",
      guide: "Guide",
      register: "Début",
      property: "Infos annonce",
      rooms: "Loyer & photos",
      terms: "Conditions",
      preview: "Aperçu",
    },
    landing: {
      eyebrow: "PROPRIÉTAIRES / FOURNISSEURS DE LOGEMENT",
      title: "Gratuit pour les propriétaires",
      subtitle:
        "MapleHouse met en relation les propriétaires et fournisseurs de logement avec des locataires qui cherchent un logement avant leur arrivée au Canada.",
      primaryCta: "S’inscrire comme propriétaire et ajouter une première annonce",
      secondaryCta: "Voir l’espace propriétaire",
      benefits: [
        {
          title: "Aucun frais d’annonce",
          body: "Dans le modèle prévu, MapleHouse ne facture pas de frais d’annonce ni de commission de réussite aux propriétaires.",
        },
        {
          title: "Demande avant l’arrivée",
          body: "Présentez votre logement à des personnes qui cherchent avant leur arrivée au Canada.",
        },
        {
          title: "Demandes mieux structurées",
          body: "Date d’entrée, durée du séjour, occupants, budget et questions peuvent être organisés avant le contact.",
        },
        {
          title: "Moins d’incertitude liée aux absences",
          body: "Une intention de réservation plus claire peut réduire les rendez-vous inutiles et les malentendus.",
        },
      ],
      infoTitle: "Informations à préparer avant l’annonce",
      infoItems: [
        "Secteur du logement",
        "Station la plus proche",
        "Type de logement",
        "Loyer mensuel",
        "Date disponible",
        "Séjour minimum",
        "Services inclus",
        "Meubles et literie",
        "Photos",
        "Méthode de contact",
      ],
      afterTitle: "Après l’envoi",
      afterSteps: [
        "Renseigner les informations du logement",
        "Aperçu pour examen par MapleHouse",
        "Organiser le contexte de demande du locataire",
        "Coordonner la confirmation et l’intention de réservation",
      ],
      notice:
        "MapleHouse n’est pas partie au contrat, conseiller juridique, courtier ni garant de paiement dans ce flux MVP. Les décisions finales concernant le contrat, le dépôt, le paiement et l’emménagement doivent être confirmées par les parties.",
    },
    guide: {
      title: "Avant d’envoyer une demande d’annonce",
      subtitle:
        "Préparez les informations du logement, le loyer, la date d’arrivée et les questions à confirmer avant de commencer.",
      processTitle: "Parcours simple",
      process: [
        "Renseigner les informations de base",
        "Organiser les informations du logement et de la chambre",
        "Confirmer le loyer et les conditions d’arrivée",
        "Envoyer un aperçu pour examen par MapleHouse",
      ],
      termsTitle: "Repères Canada/Ontario",
      termsBody:
        "Les conditions de location au Canada/Ontario peuvent différer des structures coréennes de dépôt et de frais de gestion. MapleHouse distingue le loyer mensuel, le dépôt du dernier mois, le dépôt de clé remboursable, les services inclus et les services séparés. Les règles locales à jour et le bail doivent être vérifiés avant signature.",
      cta: "Commencer la demande",
    },
    flow: {
      selectPlaceholder: "Choisir",
      labels: ["Début", "Infos annonce", "Loyer & photos", "Aperçu"],
      next: "Suivant",
      back: "Retour",
      startOver: "Recommencer",
      draftNoticeTitle: "Aucun brouillon commencé",
      draftNoticeBody:
        "Cette étape fonctionne mieux avec un brouillon. Vous pouvez continuer ici, mais il est recommandé de commencer par les informations de contact.",
      backToStart: "Aller au début",
      requiredHelper: "Indiquez le rôle, le nom et l’e-mail ou un contact pour continuer.",
      sectionEyebrow: "INSCRIPTION PROPRIÉTAIRE",
      start: {
        title: "Renseignez vos informations propriétaire",
        description:
          "Commencez avec les coordonnées de base nécessaires à votre première annonce. Elles pourront plus tard être liées au compte.",
        helpTitle: "À préparer d’abord",
        helpBody:
          "Votre rôle, votre nom, votre e-mail et votre téléphone suffisent pour démarrer un premier brouillon.",
      },
      property: {
        title: "Ajouter les informations de base de l’annonce",
        description:
          "Ajoutez d’abord la ville, l’adresse détaillée, le type de logement et la préférence de cohabitation.",
        addressHelper: "N’indiquez pas de codes d’accès, mots de passe ou informations sensibles d’accès.",
      },
      rooms: {
        title: "Ajoutez le loyer, la disponibilité et les photos",
        description:
          "Ajoutez rapidement les informations essentielles que les locataires consultent en premier.",
      },
      terms: {
        title: "Les conditions détaillées pourront être ajoutées plus tard",
        description:
          "Les dépôts, les services, les règles de la maison et les questions avant l’arrivée pourront être ajoutés plus tard depuis l’espace propriétaire.",
        notice:
          "Avant tout accord, les parties doivent confirmer directement le loyer, le dépôt du dernier mois, le dépôt de clé, les services et la date d’arrivée.",
      },
      preview: {
        title: "Aperçu du premier brouillon d’annonce",
        description:
          "Cet aperçu résume seulement les informations essentielles de l’onboarding rapide. Les conditions détaillées pourront être ajoutées plus tard depuis l’espace propriétaire.",
        checkbox:
          "Je comprends que ce MVP ne traite pas encore les annonces réelles, les contrats, les paiements, les versements ou les téléversements de fichiers.",
        submit: "Envoyer l’aperçu",
        successTitle: "Aperçu envoyé localement",
        successBody:
          "Il s’agit seulement d’un envoi d’aperçu. La réception réelle n’est pas encore connectée. Une version ultérieure pourra relier le statut d’examen MapleHouse et le flux de demande du locataire.",
        edit: "Modifier",
        sections: {
          contact: "Contact / rôle",
          property: "Logement",
          room: "Chambre et loyer",
          terms: "Conditions et services",
          notes: "Notes",
        },
        empty: "Non renseigné",
      },
    },
    fields: {
      role: "Rôle",
      name: "Nom",
      email: "E-mail",
      contact: "Téléphone ou contact préféré",
      preferredLanguage: "Langue préférée",
      shortMessage: "Message court",
      city: "Ville",
      area: "Secteur / quartier",
      nearestStation: "Station la plus proche",
      address: "Adresse détaillée",
      housingType: "Type de logement",
      useType: "Type d’utilisation",
      furnished: "Meublé?",
      elevator: "Ascenseur?",
      parking: "Stationnement?",
      laundry: "Buanderie?",
      listingTitle: "Titre de l’annonce",
      monthlyRent: "Loyer mensuel",
      availableFrom: "Disponible à partir de",
      minimumStay: "Séjour minimum",
      occupancy: "Occupation",
      bathroom: "Salle de bain",
      kitchen: "Cuisine",
      furniture: "Meubles inclus",
      lastMonthDeposit: "Dépôt du dernier mois",
      keyDepositAmount: "Dépôt de clé remboursable",
      utilitiesIncluded: "Services inclus dans le loyer",
      utilitiesSeparate: "Services payés séparément",
      houseRules: "Règles / notes",
      moveInQuestions: "Questions avant l’arrivée",
      communicationMethod: "Méthode de contact préférée",
    },
    options: {
      roles: ["Propriétaire", "Gestionnaire", "Fournisseur de famille d’accueil", "Autre"],
      preferredLanguages: ["Coréen", "Anglais", "Français", "Sans préférence"],
      housingTypes: [
        "Condo",
        "Appartement",
        "Maison",
        "Maison en rangée",
        "Sous-sol",
        "Famille d’accueil",
        "Chambre/location partagée",
        "Coliving",
        "Autre",
      ],
      useTypes: ["Logement entier", "Chambre privée", "Chambre partagée", "Style famille d’accueil"],
      yesNoConfirm: ["Oui", "Non", "À confirmer"],
      minimumStay: [
        "2 semaines ou plus",
        "1 mois ou plus",
        "3 mois ou plus",
        "6 mois ou plus",
        "1 an ou plus",
        "Flexible",
      ],
      occupancy: ["1 personne", "2 personnes", "Flexible"],
      bathroom: ["Salle de bain privée", "Salle de bain partagée", "Attenante", "À confirmer"],
      kitchen: ["Cuisine privée", "Cuisine partagée", "Kitchenette", "Aucune/à confirmer"],
      furniture: ["lit", "matelas", "bureau", "chaise", "armoire", "literie", "lampe"],
      utilities: ["électricité/hydro", "chauffage", "eau", "gaz", "internet", "buanderie", "stationnement"],
      deposit: ["Requis", "Non requis", "À confirmer"],
      communication: ["E-mail", "Téléphone", "KakaoTalk", "WhatsApp", "Autre"],
      utilityStatus: ["Inclus", "Payé séparément", "À confirmer"],
    },
  },
};

type LandlordRefinementContent = {
  landingConcernsTitle: string;
  landingConcerns: Array<{ title: string; body: string }>;
  fields: Record<string, string>;
  sections: Record<string, string>;
  helpers: Record<string, string>;
  options: {
    roles: string[];
    preferredContactMethods: string[];
    preferredLanguages: string[];
    cityOptions: string[];
    housingTypes: string[];
    useTypes: string[];
    residentConditions: string[];
    petAllowed: string[];
    homePets: string[];
    smoking: string[];
    yesNoConfirm: string[];
    minimumStay: string[];
    occupancy: string[];
    bathroom: string[];
    kitchen: string[];
    furniture: string[];
    bedSize: string[];
    utilities: string[];
    utilityStatus: string[];
    houseRules: string[];
  };
};

const LANDLORD_REFINEMENTS: Record<Locale, LandlordRefinementContent> = {
  ko: {
    landingConcernsTitle: "임대인이 궁금해하는 것들",
    landingConcerns: [
      {
        title: "등록비와 성공 수수료가 있나요?",
        body: "현재 의도한 구조에서는 임대인에게 매물 등록비나 임대인 성공 수수료를 부과하지 않습니다.",
      },
      {
        title: "어떤 문의를 받게 되나요?",
        body: "입주 희망일, 예산, 체류 기간, 인원, 확인 질문이 정리된 문의 흐름을 지향합니다.",
      },
      {
        title: "매물 등록이 복잡한가요?",
        body: "사진, 위치, 월세, 포함 항목, 입주 조건을 표준 형식으로 정리합니다.",
      },
      {
        title: "불필요한 방문을 줄일 수 있나요?",
        body: "사진과 조건을 더 명확히 보여주고, tenant inquiry context를 정리해 불확실성을 줄이는 방향입니다.",
      },
    ],
    fields: {
      role: "역할",
      lastName: "성 / Last name",
      firstName: "이름 / First name",
      email: "이메일",
      contact: "전화번호 또는 연락처",
      preferredContactMethods: "선호 연락 방법",
      preferredLanguages: "선호 언어 (복수 선택 가능)",
      shortMessage: "간단한 메모",
      city: "도시/지역",
      area: "지역 / 동네",
      nearestStation: "가까운 지하철/전철역",
      address: "상세 주소",
      housingType: "주거 형태",
      useType: "이용 형태",
      residentCondition: "거주 조건",
      furnished: "가구 포함",
      elevator: "엘리베이터",
      parking: "주차",
      laundry: "세탁",
      tenantPetsAllowed: "입주자 반려동물 가능 여부",
      homePets: "현재 집에 반려동물이 있나요?",
      homePetType: "동물 종류를 적어주세요",
      smokingCondition: "흡연 조건",
      listingTitle: "매물 제목",
      monthlyRent: "월세",
      availableFrom: "입주 가능일",
      minimumStay: "최소 체류 기간",
      occupancy: "인원",
      bathroom: "욕실",
      kitchen: "주방",
      furniture: "포함 가구",
      bedSize: "침대 크기",
      keyDepositAmount: "열쇠 보증금",
      utilitiesIncluded: "공과금",
      houseRuleItems: "하우스 룰",
      additionalNote: "추가 메모",
      moveInQuestions: "입주 전 확인 질문",
    },
    sections: {
      location: "A. 위치",
      housing: "B. 주거 형태",
      living: "C. 생활 조건",
      pets: "D. 반려동물 및 알레르기 관련 정보",
      photos: "E. 매물 사진",
      contact: "A. 임대인 정보",
      property: "B. 위치·공간",
      room: "C. 방·월세",
      terms: "D. 조건·공과금",
      rules: "E. 사진·하우스 룰·확인 질문",
      startRole: "1. 역할",
      startIdentity: "2. 이름과 연락처",
      startPreferences: "3. 선호 설정",
      startMemo: "4. 선택 메모",
    },
    helpers: {
      startDescription: "임대인 기본 정보와 첫 번째 매물 정보를 함께 정리합니다. 이후 추가 매물은 임대인 센터에서 관리하는 구조로 확장될 예정입니다.",
      onboardingLiteNote:
        "필수 정보만 먼저 입력해도 첫 매물 초안을 만들 수 있습니다. 상세 조건은 임대인 센터에서 나중에 보완할 수 있습니다.",
      propertyDescription: "첫 매물 초안에 필요한 위치와 주거 조건만 간단히 입력합니다.",
      roomsDescription: "입주자가 먼저 확인하는 월세, 입주 가능일, 사진만 빠르게 등록합니다.",
      termsDescription: "계약 전에 서로 확인해야 할 비용, 공과금, 생활 규칙을 정리합니다.",
      termsLiteNote:
        "공과금, 보증금, 하우스 룰은 나중에 임대인 센터에서 보완할 수 있습니다. 다만 실제 계약 전에는 반드시 입주자와 서로 확인해야 합니다.",
      previewDescription: "첫 온보딩에서 입력한 핵심 정보만 요약합니다. 상세 조건은 임대인 센터에서 나중에 보완할 수 있습니다.",
      requiredHelper:
        "역할, 이름, 이메일, 전화번호를 입력하면 다음 단계로 이동할 수 있습니다.",
      addressHelper: "출입 코드, 비밀번호, 정확한 유닛 출입 정보처럼 민감한 정보는 입력하지 마세요.",
      residentHelper: "룸렌트, 쉐어, 홈스테이처럼 함께 사는 경우에 특히 중요한 정보입니다.",
      stationPlaceholder: "가까운 TTC 역 선택",
      stationSearchPlaceholder: "역 이름 검색",
      stationAutoHelper:
        "지도 연동 후에는 상세 주소를 기준으로 가까운 역을 자동 추천할 예정입니다.",
      quickPropertyNote:
        "가까운 역, 층수, 공과금, 하우스 룰 같은 상세 정보는 임대인 센터에서 나중에 보완할 수 있습니다.",
      quickDetailLaterNote:
        "상세 조건은 임대인 센터에서 나중에 보완할 수 있습니다.",
      termsPreviewCta: "미리보기로 이동",
      stationNotClose: "TTC 역과 거리가 멉니다",
      stationNotSure: "아직 모르겠습니다",
      minimumStayTooltip: "협의가 불가능하거나 최소 기간이 길어질수록 매칭 확률이 줄어들 수 있어요.",
      lastMonthInfo:
        "마지막 달 보증금은 계약 전 입주자와 임대인이 직접 확인하는 항목입니다.",
      guideTermsBody:
        "월세, 마지막 달 보증금, 열쇠 보증금, 공과금 포함 여부는 계약 전 당사자가 직접 확인해야 합니다. MapleHouse는 계약 당사자, 법률 자문, 중개 또는 결제 보증을 제공하지 않습니다.",
      photosTitle: "사진 업로드",
      photosHelper: "최대 20장까지 추가할 수 있습니다. 대표사진을 1장 선택해주세요.",
      uploadCta: "사진 선택",
      coverLabel: "대표사진",
      setCover: "대표로 선택",
      remove: "삭제",
      maxNotice: "사진은 최대 20장까지 선택할 수 있습니다.",
      previewCheckbox:
        "이 화면은 매물 정보 미리보기이며, 실제 매물 등록·계약·결제·송금·파일 업로드 기능은 아직 연결되어 있지 않음을 이해했습니다.",
      previewSuccess:
        "미리보기 제출 화면입니다. 다음 단계에서는 MapleHouse 검토 상태와 입주자 문의 흐름이 연결될 예정입니다.",
      previewSuccessTitle: "미리보기 제출 화면입니다",
      submitPreview: "미리보기 제출하기",
      edit: "수정",
      empty: "미입력",
      canAddLater: "나중에 보완 가능",
      toDiscuss: "협의",
      listingTitleFallback: "첫 매물 초안",
      startOver: "처음부터 다시",
    },
    options: {
      roles: ["임대인", "부동산/매니저", "홈스테이 제공자", "기타"],
      preferredContactMethods: ["이메일", "전화", "KakaoTalk", "WhatsApp", "기타"],
      preferredLanguages: ["한국어", "English", "Français", "상관없음"],
      cityOptions: ["토론토", "밴쿠버", "캘거리"],
      housingTypes: ["콘도", "아파트", "하우스", "타운하우스", "베이스먼트", "홈스테이", "룸렌트 / 쉐어", "코리빙", "기타"],
      useTypes: ["전체 유닛", "개인 방", "공유 방", "홈스테이형"],
      residentConditions: ["성별 무관", "여성 전용", "남성 전용", "협의 필요"],
      petAllowed: ["가능", "불가", "협의 필요"],
      homePets: ["없음", "있음"],
      smoking: ["금연", "실외만 가능", "협의 필요"],
      yesNoConfirm: ["예", "아니오", "확인 필요"],
      minimumStay: ["1개월", "2개월", "3개월", "6개월", "기간 협의"],
      occupancy: ["1명", "2명", "협의"],
      bathroom: ["개인 욕실", "공용 욕실", "방 안 욕실", "협의"],
      kitchen: ["개인 주방", "공용 주방", "없음/협의"],
      furniture: ["침대", "매트리스", "책상", "의자", "옷장", "침구", "조명"],
      bedSize: ["싱글", "더블", "퀸", "확인 필요"],
      utilities: ["전기/hydro", "난방", "수도", "가스", "인터넷", "세탁", "주차"],
      utilityStatus: ["월세 포함", "입주자 별도", "확인 필요"],
      houseRules: ["금연", "조용한 시간 준수", "방문객 사전 협의", "공용공간 정리", "파티 불가", "실내 신발 착용 금지", "쓰레기 분리배출", "기타 협의"],
    },
  },
  en: {
    landingConcernsTitle: "What landlords usually want to know",
    landingConcerns: [
      {
        title: "Are there listing fees or success commissions?",
        body: "In the current intended model, MapleHouse does not charge landlords a listing fee or landlord success commission.",
      },
      {
        title: "What kind of inquiries can I receive?",
        body: "The flow is designed around move-in timing, budget, stay length, occupants, and confirmation questions.",
      },
      {
        title: "Is listing complicated?",
        body: "Photos, location, rent, included items, and move-in conditions are organized in a standard format.",
      },
      {
        title: "Can this reduce wasted viewings?",
        body: "Clear photos and conditions can help reduce uncertainty before tenant inquiries and viewing coordination.",
      },
    ],
    fields: {
      role: "Role",
      lastName: "Last name",
      firstName: "First name",
      email: "Email",
      contact: "Phone or contact",
      preferredContactMethods: "Preferred contact methods",
      preferredLanguages: "Preferred languages (multiple selection)",
      shortMessage: "Short message",
      city: "City / area",
      area: "Area / neighborhood",
      nearestStation: "Nearest rapid transit station",
      address: "Detailed address",
      housingType: "Housing type",
      useType: "Use type",
      residentCondition: "Shared-living preference",
      furnished: "Furnished",
      elevator: "Elevator",
      parking: "Parking",
      laundry: "Laundry",
      tenantPetsAllowed: "Are tenant pets allowed?",
      homePets: "Are there pets already living in the home?",
      homePetType: "Pet type",
      smokingCondition: "Smoking policy",
      listingTitle: "Listing title",
      monthlyRent: "Monthly rent",
      availableFrom: "Available from",
      minimumStay: "Minimum stay",
      occupancy: "Occupancy",
      bathroom: "Bathroom",
      kitchen: "Kitchen",
      furniture: "Included furniture",
      bedSize: "Bed size",
      keyDepositAmount: "Key deposit",
      utilitiesIncluded: "Utilities",
      houseRuleItems: "House rules",
      additionalNote: "Additional note",
      moveInQuestions: "Questions to confirm before move-in",
    },
    sections: {
      location: "A. Location",
      housing: "B. Housing type",
      living: "C. Living condition",
      pets: "D. Pets and allergy-related information",
      photos: "E. Listing photos",
      contact: "Contact",
      property: "Location & property",
      room: "Room & rent",
      terms: "Terms & utilities",
      rules: "Photos, rules & questions",
      startRole: "1. Role",
      startIdentity: "2. Name and contact",
      startPreferences: "3. Preferences",
      startMemo: "4. Optional memo",
    },
    helpers: {
      startDescription: "Organize your landlord information and first listing together. Future additional listings can be managed through a landlord center.",
      onboardingLiteNote:
        "You can create a first listing draft with only the required basics. Detailed conditions can be added later from the landlord center.",
      propertyDescription: "Enter only the location and housing basics needed for a first listing draft.",
      roomsDescription: "Quickly add the rent, available date, and photos tenants check first.",
      termsDescription: "Organize costs, utilities, and house rules that both parties should confirm later.",
      termsLiteNote:
        "Utilities, deposits, and house rules can be completed later from the landlord center. They should still be confirmed with the tenant before any agreement.",
      previewDescription: "This preview summarizes only the quick onboarding essentials. Detailed conditions can be added later from the landlord center.",
      requiredHelper:
        "Enter your role, name, email, and phone number to continue.",
      addressHelper: "Do not enter access codes, passwords, or sensitive unit access details.",
      residentHelper: "Especially important for room rentals and shared housing.",
      stationPlaceholder: "Select nearest TTC station",
      stationSearchPlaceholder: "Search station name",
      stationAutoHelper:
        "After map integration, the nearest station can be suggested automatically from the detailed address.",
      quickPropertyNote:
        "Nearest station, floor, utilities, and house rules can be added later from the landlord center.",
      quickDetailLaterNote:
        "Detailed conditions can be added later from the landlord center.",
      termsPreviewCta: "Go to preview",
      stationNotClose: "Not close to a TTC station",
      stationNotSure: "Not sure yet",
      minimumStayTooltip: "Listings with a very long or non-flexible minimum stay may receive fewer matches.",
      lastMonthInfo:
        "Last month's rent deposit should be confirmed directly by the tenant and landlord before any agreement.",
      guideTermsBody:
        "Monthly rent, last month’s rent deposit, key deposit, and utility responsibility should be confirmed directly by the parties before any agreement. MapleHouse does not provide legal advice, brokerage, or payment guarantees.",
      photosTitle: "Photo upload",
      photosHelper: "You can add up to 20 photos. Choose one representative photo.",
      uploadCta: "Choose photos",
      coverLabel: "Cover photo",
      setCover: "Set cover",
      remove: "Remove",
      maxNotice: "You can select up to 20 photos.",
      previewCheckbox:
        "I understand this is a listing information preview and that real listing submission, contracts, payments, payouts, and file uploads are not connected yet.",
      previewSuccess:
        "This is a preview submission. A later version can connect MapleHouse review status and tenant inquiry flow.",
      previewSuccessTitle: "Preview submitted",
      submitPreview: "Submit preview",
      edit: "Edit",
      empty: "Not entered",
      canAddLater: "Can be added later",
      toDiscuss: "To discuss",
      listingTitleFallback: "First listing draft",
      startOver: "Start over",
    },
    options: {
      roles: ["Landlord", "Property manager", "Homestay provider", "Other"],
      preferredContactMethods: ["Email", "Phone", "KakaoTalk", "WhatsApp", "Other"],
      preferredLanguages: ["Korean", "English", "Français", "No preference"],
      cityOptions: ["Toronto", "Vancouver", "Calgary"],
      housingTypes: ["Condo", "Apartment", "House", "Townhouse", "Basement", "Homestay", "Room rental / shared housing", "Co-living", "Other"],
      useTypes: ["Entire unit", "Private room", "Shared room", "Homestay-style"],
      residentConditions: ["All genders welcome", "Women only", "Men only", "To discuss"],
      petAllowed: ["Allowed", "Not allowed", "To discuss"],
      homePets: ["No", "Yes"],
      smoking: ["No smoking", "Outdoor only", "To discuss"],
      yesNoConfirm: ["Yes", "No", "To confirm"],
      minimumStay: ["1 month", "2 months", "3 months", "6 months", "Flexible"],
      occupancy: ["1 person", "2 people", "Flexible"],
      bathroom: ["Private bathroom", "Shared bathroom", "Ensuite", "To confirm"],
      kitchen: ["Private kitchen", "Shared kitchen", "None/to confirm"],
      furniture: ["Bed", "Mattress", "Desk", "Chair", "Wardrobe", "Bedding", "Lamp"],
      bedSize: ["Single", "Double", "Queen", "To confirm"],
      utilities: ["Electricity / Hydro", "Heat", "Water", "Gas", "Internet", "Laundry", "Parking"],
      utilityStatus: ["Included", "Tenant pays separately", "To confirm"],
      houseRules: ["Non-smoking", "Quiet hours", "Visitors by discussion", "Keep shared areas clean", "No parties", "No shoes indoors", "Sort garbage/recycling", "Other to discuss"],
    },
  },
  fr: {
    landingConcernsTitle: "Ce que les propriétaires veulent savoir",
    landingConcerns: [
      {
        title: "Y a-t-il des frais d’annonce?",
        body: "Dans le modèle prévu, MapleHouse ne facture pas de frais d’annonce ni de commission de réussite au propriétaire.",
      },
      {
        title: "Quel type de demandes vais-je recevoir?",
        body: "Le flux organise la date d’arrivée, le budget, la durée du séjour, les occupants et les questions à confirmer.",
      },
      {
        title: "L’annonce est-elle difficile à préparer?",
        body: "Photos, emplacement, loyer, inclusions et conditions d’arrivée sont structurés dans un format simple.",
      },
      {
        title: "Peut-on réduire les visites inutiles?",
        body: "Des photos et conditions plus claires peuvent réduire l’incertitude avant les demandes et les visites.",
      },
    ],
    fields: {
      role: "Rôle",
      lastName: "Nom de famille",
      firstName: "Prénom",
      email: "E-mail",
      contact: "Téléphone ou contact",
      preferredContactMethods: "Méthodes de contact préférées",
      preferredLanguages: "Langues préférées (choix multiple)",
      shortMessage: "Message court",
      city: "Ville / secteur",
      area: "Secteur / quartier",
      nearestStation: "Station de transport rapide la plus proche",
      address: "Adresse détaillée",
      housingType: "Type de logement",
      useType: "Type d’usage",
      residentCondition: "Préférence de cohabitation",
      furnished: "Meublé",
      elevator: "Ascenseur",
      parking: "Stationnement",
      laundry: "Buanderie",
      tenantPetsAllowed: "Animaux du locataire acceptés ?",
      homePets: "Y a-t-il déjà des animaux dans le logement ?",
      homePetType: "Type d’animal",
      smokingCondition: "Règle concernant le tabac",
      listingTitle: "Titre de l’annonce",
      monthlyRent: "Loyer mensuel",
      availableFrom: "Disponible à partir de",
      minimumStay: "Séjour minimum",
      occupancy: "Occupation",
      bathroom: "Salle de bain",
      kitchen: "Cuisine",
      furniture: "Meubles inclus",
      bedSize: "Taille du lit",
      keyDepositAmount: "Dépôt de clé",
      utilitiesIncluded: "Services",
      houseRuleItems: "Règles de la maison",
      additionalNote: "Note supplémentaire",
      moveInQuestions: "Questions à confirmer avant l’arrivée",
    },
    sections: {
      location: "A. Emplacement",
      housing: "B. Type de logement",
      living: "C. Conditions de vie",
      pets: "D. Animaux et informations liées aux allergies",
      photos: "E. Photos de l’annonce",
      contact: "Contact",
      property: "Emplacement & logement",
      room: "Chambre & loyer",
      terms: "Conditions & services",
      rules: "Photos, règles & questions",
      startRole: "1. Rôle",
      startIdentity: "2. Nom et coordonnées",
      startPreferences: "3. Préférences",
      startMemo: "4. Note facultative",
    },
    helpers: {
      startDescription: "Renseignez vos informations de propriétaire et votre première annonce. Les annonces supplémentaires pourront être gérées depuis un espace propriétaire.",
      onboardingLiteNote:
        "Vous pouvez créer un premier brouillon d’annonce avec les informations essentielles. Les détails pourront être ajoutés plus tard depuis l’espace propriétaire.",
      propertyDescription: "Ajoutez seulement l’emplacement et les informations de base nécessaires au premier brouillon.",
      roomsDescription: "Ajoutez rapidement le loyer, la date disponible et les photos consultés en premier.",
      termsDescription: "Organisez les coûts, services et règles à confirmer entre les parties.",
      termsLiteNote:
        "Les services, dépôts et règles de la maison pourront être complétés plus tard depuis l’espace propriétaire. Ils devront toutefois être confirmés avec le locataire avant tout accord.",
      previewDescription: "Cet aperçu résume seulement les informations essentielles de l’onboarding rapide. Les conditions détaillées pourront être ajoutées plus tard depuis l’espace propriétaire.",
      requiredHelper:
        "Renseignez votre rôle, votre nom, votre e-mail et votre téléphone pour continuer.",
      addressHelper: "N’indiquez pas de codes d’accès, mots de passe ou informations sensibles d’accès.",
      residentHelper: "Particulièrement important pour les chambres et les logements partagés.",
      stationPlaceholder: "Choisir la station TTC la plus proche",
      stationSearchPlaceholder: "Rechercher une station",
      stationAutoHelper:
        "Après l’intégration de la carte, la station la plus proche pourra être suggérée automatiquement à partir de l’adresse détaillée.",
      quickPropertyNote:
        "La station la plus proche, l’étage, les services et les règles de la maison pourront être ajoutés plus tard depuis l’espace propriétaire.",
      quickDetailLaterNote:
        "Les conditions détaillées pourront être ajoutées plus tard depuis l’espace propriétaire.",
      termsPreviewCta: "Aller à l’aperçu",
      stationNotClose: "Pas proche d’une station TTC",
      stationNotSure: "Pas encore sûr",
      minimumStayTooltip: "Une durée minimale très longue ou non flexible peut réduire les possibilités de mise en relation.",
      lastMonthInfo:
        "Le dépôt du dernier mois doit être confirmé directement par le locataire et le propriétaire avant tout accord.",
      guideTermsBody:
        "Le loyer, le dépôt du dernier mois, le dépôt de clé et les services doivent être confirmés directement par les parties avant tout accord. MapleHouse ne fournit pas de conseil juridique, de courtage ni de garantie de paiement.",
      photosTitle: "Téléversement des photos",
      photosHelper: "Vous pouvez ajouter jusqu’à 20 photos. Choisissez une photo principale.",
      uploadCta: "Choisir des photos",
      coverLabel: "Photo principale",
      setCover: "Définir comme principale",
      remove: "Retirer",
      maxNotice: "Vous pouvez sélectionner jusqu’à 20 photos.",
      previewCheckbox:
        "Je comprends qu’il s’agit d’un aperçu des informations de l’annonce et que l’envoi réel, les contrats, les paiements, les versements et les téléversements de fichiers ne sont pas encore connectés.",
      previewSuccess:
        "Il s’agit d’un envoi d’aperçu. Une version ultérieure pourra relier le statut d’examen MapleHouse et le flux de demande du locataire.",
      previewSuccessTitle: "Aperçu envoyé",
      submitPreview: "Envoyer l’aperçu",
      edit: "Modifier",
      empty: "Non renseigné",
      canAddLater: "Peut être ajouté plus tard",
      toDiscuss: "À discuter",
      listingTitleFallback: "Premier brouillon d’annonce",
      startOver: "Recommencer",
    },
    options: {
      roles: ["Propriétaire", "Gestionnaire", "Fournisseur de famille d’accueil", "Autre"],
      preferredContactMethods: ["E-mail", "Téléphone", "KakaoTalk", "WhatsApp", "Autre"],
      preferredLanguages: ["Coréen", "Anglais", "Français", "Sans préférence"],
      cityOptions: ["Toronto", "Vancouver", "Calgary"],
      housingTypes: ["Condo", "Appartement", "Maison", "Maison en rangée", "Sous-sol", "Famille d’accueil", "Chambre / logement partagé", "Coliving", "Autre"],
      useTypes: ["Logement entier", "Chambre privée", "Chambre partagée", "Style famille d’accueil"],
      residentConditions: ["Aucune préférence", "Femmes seulement", "Hommes seulement", "À discuter"],
      petAllowed: ["Acceptés", "Non acceptés", "À discuter"],
      homePets: ["Non", "Oui"],
      smoking: ["Non-fumeur", "Extérieur seulement", "À discuter"],
      yesNoConfirm: ["Oui", "Non", "À confirmer"],
      minimumStay: ["1 mois", "2 mois", "3 mois", "6 mois", "Flexible"],
      occupancy: ["1 personne", "2 personnes", "Flexible"],
      bathroom: ["Salle de bain privée", "Salle de bain partagée", "Attenante", "À confirmer"],
      kitchen: ["Cuisine privée", "Cuisine partagée", "Aucune/à confirmer"],
      furniture: ["Lit", "Matelas", "Bureau", "Chaise", "Armoire", "Literie", "Lampe"],
      bedSize: ["Simple", "Double", "Queen", "À confirmer"],
      utilities: ["Électricité / hydro", "Chauffage", "Eau", "Gaz", "Internet", "Buanderie", "Stationnement"],
      utilityStatus: ["Inclus", "Payé séparément", "À confirmer"],
      houseRules: ["Non-fumeur", "Heures calmes", "Visiteurs à discuter", "Garder les espaces communs propres", "Pas de fêtes", "Pas de chaussures à l’intérieur", "Tri des déchets/recyclage", "Autre à discuter"],
    },
  },
};

const TORONTO_TTC_STATIONS = [
  "Aga Khan Park & Museum",
  "Albion",
  "Avenue",
  "Bathurst",
  "Bay",
  "Bayview",
  "Bessarion",
  "Birchmount",
  "Bloor-Yonge",
  "Broadview",
  "Caledonia",
  "Castle Frank",
  "Cedarvale",
  "Chaplin",
  "Chester",
  "Christie",
  "College",
  "Coxwell",
  "Davisville",
  "Don Mills",
  "Don Valley",
  "Donlands",
  "Downsview Park",
  "Driftwood",
  "Dufferin",
  "Duncanwoods",
  "Dundas West",
  "Dupont",
  "Eglinton",
  "Emery",
  "Fairbank",
  "Finch",
  "Finch West",
  "Forest Hill",
  "Glencairn",
  "Golden Mile",
  "Greenwood",
  "Hakimi Lebovic",
  "High Park",
  "Highway 407",
  "Humber College",
  "Ionview",
  "Islington",
  "Jane",
  "Jane and Finch",
  "Keele",
  "Keelesdale",
  "Kennedy",
  "King",
  "Kipling",
  "Laird",
  "Lansdowne",
  "Lawrence",
  "Lawrence West",
  "Leaside",
  "Leslie",
  "Main Street",
  "Martin Grove",
  "Milvan Rumike",
  "Mount Dennis",
  "Mount Olive",
  "Mount Pleasant",
  "Museum",
  "Norfinch Oakdale",
  "North York Centre",
  "Oakwood",
  "O'Connor",
  "Old Mill",
  "Osgoode",
  "Ossington",
  "Pape",
  "Pearldale",
  "Pharmacy",
  "Pioneer Village",
  "Queen",
  "Queen's Park",
  "Rosedale",
  "Rowntree Mills",
  "Royal York",
  "Runnymede",
  "Sentinel",
  "Sheppard West",
  "Sheppard-Yonge",
  "Sherbourne",
  "Signet Arrow",
  "Sloane",
  "Spadina",
  "St Andrew",
  "St Clair",
  "St Clair West",
  "St George",
  "St Patrick",
  "Stevenson",
  "Summerhill",
  "Sunnybrook Park",
  "TMU",
  "Tobermory",
  "Union",
  "Vaughan Metropolitan Centre",
  "Victoria Park",
  "Warden",
  "Wellesley",
  "Westmore",
  "Wilson",
  "Woodbine",
  "Wynford",
  "York Mills",
  "York University",
  "Yorkdale",
].sort((a, b) => a.localeCompare(b));

const VANCOUVER_SKYTRAIN_STATIONS = [
  "22nd Street",
  "29th Avenue",
  "Aberdeen",
  "Braid",
  "Brentwood Town Centre",
  "Bridgeport",
  "Broadway-City Hall",
  "Burquitlam",
  "Burrard",
  "Capstan",
  "Columbia",
  "Commercial-Broadway",
  "Coquitlam Central",
  "Edmonds",
  "Gateway",
  "Gilmore",
  "Granville",
  "Holdom",
  "Inlet Centre",
  "Joyce-Collingwood",
  "King Edward",
  "King George",
  "Lafarge Lake-Douglas",
  "Lake City Way",
  "Langara-49th Avenue",
  "Lansdowne",
  "Lincoln",
  "Lougheed Town Centre",
  "Main Street-Science World",
  "Marine Drive",
  "Metrotown",
  "Moody Centre",
  "Nanaimo",
  "New Westminster",
  "Oakridge-41st Avenue",
  "Olympic Village",
  "Patterson",
  "Production Way-University",
  "Renfrew",
  "Richmond-Brighouse",
  "Royal Oak",
  "Rupert",
  "Sapperton",
  "Scott Road",
  "Sea Island Centre",
  "Sperling-Burnaby Lake",
  "Stadium-Chinatown",
  "Surrey Central",
  "Templeton",
  "Vancouver City Centre",
  "VCC-Clark",
  "Waterfront",
  "Yaletown-Roundhouse",
  "YVR-Airport",
].sort((a, b) => a.localeCompare(b));

const CALGARY_CTRAIN_STATIONS = [
  "1 Street SW",
  "3 Street SW",
  "4 Street SW",
  "6 Street SW",
  "7 Street SW",
  "8 Street SW",
  "39 Avenue",
  "45 Street",
  "69 Street",
  "Anderson",
  "Banff Trail",
  "Barlow/Max Bell",
  "Brentwood",
  "Bridgeland/Memorial",
  "Calgary Zoo",
  "Canyon Meadows",
  "Centre Street",
  "Chinook",
  "City Hall/Bow Valley College",
  "Crowfoot",
  "Dalhousie",
  "Downtown West-Kerby",
  "Erlton/Stampede",
  "Fish Creek-Lacombe",
  "Franklin",
  "Heritage",
  "Lions Park",
  "Marlborough",
  "Martindale",
  "McKnight-Westwinds",
  "Rundle",
  "SAIT/AUArts/Jubilee",
  "Saddletowne",
  "Shaganappi Point",
  "Shawnessy",
  "Sirocco",
  "Somerset-Bridlewood",
  "Southland",
  "Sunalta",
  "Sunnyside",
  "Tuscany",
  "University",
  "Victoria Park/Stampede",
  "Westbrook",
  "Whitehorn",
].sort((a, b) => a.localeCompare(b));

const BENEFIT_ICONS = [Building2, MessageSquareText, ClipboardList, ShieldCheck];

const LANDLORD_FORM_COPY = {
  ko: {
    select: "선택하세요",
    summaryName: "이름",
    summaryContact: "연락처",
    emailEntered: "이메일 입력됨",
    contactEntered: "전화번호 입력됨",
    missingSummary: "입력 대기",
    unitDetailLabel: "세부 형식",
    floorLabel: "층수",
    floorSuffix: "층",
    unitDetailPlaceholder: "세부 형식을 입력해주세요",
    residentHelper: "룸렌트나 쉐어처럼 함께 사는 경우에 특히 중요한 정보입니다.",
    cityOptions: ["토론토", "밴쿠버", "캘거리"],
    housingTypes: ["하우스 / 룸렌트 / 쉐어", "콘도 / 아파트", "스튜디오", "기타"],
    unitDetailHouse: ["개인 방", "공유 방", "베이스먼트", "1BR", "전체 하우스", "기타"],
    unitDetailCondo: ["1BR", "1BR + Den", "2BR", "2BR + Den", "Den", "기타"],
    unitDetailStudio: ["스튜디오", "기타"],
    floorHouse: ["B1", "1층", "2층", "3층", "4층", "5층"],
    useTypes: ["전체 유닛", "개인 방", "공유 방"],
    minimumStay: ["1개월", "2개월", "3개월", "6개월", "기간 협의"],
    occupancy: ["1명", "2명", "협의"],
    bathroom: ["개인 욕실", "공용 욕실", "방 안 욕실", "협의"],
    kitchen: ["개인 주방", "공용 주방", "없음/협의"],
    furniture: ["침대", "매트리스", "책상", "의자", "옷장", "침구"],
    keyDepositLabel: "열쇠 보증금",
  },
  en: {
    select: "Select",
    summaryName: "Name",
    summaryContact: "Contact",
    emailEntered: "Email entered",
    contactEntered: "Phone/contact entered",
    missingSummary: "Waiting for input",
    unitDetailLabel: "Unit detail",
    floorLabel: "Floor",
    floorSuffix: "floor",
    unitDetailPlaceholder: "Enter unit detail",
    residentHelper: "Especially important for room rentals and shared housing.",
    cityOptions: ["Toronto", "Vancouver", "Calgary"],
    housingTypes: ["House / room rental / share", "Condo / apartment", "Studio", "Other"],
    unitDetailHouse: ["Private room", "Shared room", "Basement", "1BR", "Entire house", "Other"],
    unitDetailCondo: ["1BR", "1BR + Den", "2BR", "2BR + Den", "Den", "Other"],
    unitDetailStudio: ["Studio", "Other"],
    floorHouse: ["B1", "1st floor", "2nd floor", "3rd floor", "4th floor", "5th floor"],
    useTypes: ["Entire unit", "Private room", "Shared room"],
    minimumStay: ["1 month", "2 months", "3 months", "6 months", "Flexible"],
    occupancy: ["1 person", "2 people", "Flexible"],
    bathroom: ["Private bathroom", "Shared bathroom", "Ensuite", "To confirm"],
    kitchen: ["Private kitchen", "Shared kitchen", "None/to confirm"],
    furniture: ["Bed", "Mattress", "Desk", "Chair", "Wardrobe", "Bedding"],
    keyDepositLabel: "Key deposit",
  },
  fr: {
    select: "Choisir",
    summaryName: "Nom",
    summaryContact: "Contact",
    emailEntered: "E-mail renseigné",
    contactEntered: "Contact renseigné",
    missingSummary: "En attente",
    unitDetailLabel: "Détail du logement",
    floorLabel: "Étage",
    floorSuffix: "étage",
    unitDetailPlaceholder: "Indiquez le détail du logement",
    residentHelper: "Important surtout pour les chambres et colocations.",
    cityOptions: ["Toronto", "Vancouver", "Calgary"],
    housingTypes: ["Maison / chambre / colocation", "Condo / appartement", "Studio", "Autre"],
    unitDetailHouse: ["Chambre privée", "Chambre partagée", "Sous-sol", "1 chambre", "Maison entière", "Autre"],
    unitDetailCondo: ["1 chambre", "1 chambre + den", "2 chambres", "2 chambres + den", "Den", "Autre"],
    unitDetailStudio: ["Studio", "Autre"],
    floorHouse: ["B1", "1er étage", "2e étage", "3e étage", "4e étage", "5e étage"],
    useTypes: ["Logement entier", "Chambre privée", "Chambre partagée"],
    minimumStay: ["1 mois", "2 mois", "3 mois", "6 mois", "Flexible"],
    occupancy: ["1 personne", "2 personnes", "Flexible"],
    bathroom: ["Salle de bain privée", "Salle de bain partagée", "Attenante", "À confirmer"],
    kitchen: ["Cuisine privée", "Cuisine partagée", "Aucune/à confirmer"],
    furniture: ["Lit", "Matelas", "Bureau", "Chaise", "Armoire", "Literie"],
    keyDepositLabel: "Dépôt de clé",
  },
} satisfies Record<
  Locale,
  {
    select: string;
    summaryName: string;
    summaryContact: string;
    emailEntered: string;
    contactEntered: string;
    missingSummary: string;
    unitDetailLabel: string;
    floorLabel: string;
    floorSuffix: string;
    unitDetailPlaceholder: string;
    residentHelper: string;
    cityOptions: string[];
    housingTypes: string[];
    unitDetailHouse: string[];
    unitDetailCondo: string[];
    unitDetailStudio: string[];
    floorHouse: string[];
    useTypes: string[];
    minimumStay: string[];
    occupancy: string[];
    bathroom: string[];
    kitchen: string[];
    furniture: string[];
    keyDepositLabel: string;
  }
>;

const CUSTOM_SELECT_VALUE = "__custom__";

const LANDLORD_CONTACT_COPY = {
  ko: {
    emailLabel: "이메일",
    emailLocalPlaceholder: "아이디",
    emailDomainCustom: "직접 입력",
    emailDomainPlaceholder: "domain.com",
    phoneLabel: "전화번호",
    phoneNumberPlaceholder: "전화번호 입력",
    customCountryCodePlaceholder: "+",
    countryCodes: [
      { label: "대한민국 +82", value: "+82" },
      { label: "캐나다·미국 +1", value: "+1" },
      { label: "프랑스 +33", value: "+33" },
      { label: "영국 +44", value: "+44" },
      { label: "호주 +61", value: "+61" },
      { label: "뉴질랜드 +64", value: "+64" },
      { label: "일본 +81", value: "+81" },
      { label: "중국 +86", value: "+86" },
      { label: "홍콩 +852", value: "+852" },
      { label: "대만 +886", value: "+886" },
      { label: "기타 직접입력", value: CUSTOM_SELECT_VALUE },
    ],
    emailDomains: [
      "gmail.com",
      "naver.com",
      "daum.net",
      "hanmail.net",
      "kakao.com",
      "outlook.com",
      "hotmail.com",
      "icloud.com",
      "yahoo.com",
    ],
  },
  en: {
    emailLabel: "Email",
    emailLocalPlaceholder: "name",
    emailDomainCustom: "Custom",
    emailDomainPlaceholder: "domain.com",
    phoneLabel: "Phone number",
    phoneNumberPlaceholder: "Phone number",
    customCountryCodePlaceholder: "+",
    countryCodes: [
      { label: "Korea +82", value: "+82" },
      { label: "Canada/US +1", value: "+1" },
      { label: "France +33", value: "+33" },
      { label: "United Kingdom +44", value: "+44" },
      { label: "Australia +61", value: "+61" },
      { label: "New Zealand +64", value: "+64" },
      { label: "Japan +81", value: "+81" },
      { label: "China +86", value: "+86" },
      { label: "Hong Kong +852", value: "+852" },
      { label: "Taiwan +886", value: "+886" },
      { label: "Other / custom", value: CUSTOM_SELECT_VALUE },
    ],
    emailDomains: [
      "gmail.com",
      "outlook.com",
      "hotmail.com",
      "icloud.com",
      "yahoo.com",
      "naver.com",
      "daum.net",
      "kakao.com",
    ],
  },
  fr: {
    emailLabel: "E-mail",
    emailLocalPlaceholder: "nom",
    emailDomainCustom: "Saisie personnalisée",
    emailDomainPlaceholder: "domaine.com",
    phoneLabel: "Numéro de téléphone",
    phoneNumberPlaceholder: "Numéro",
    customCountryCodePlaceholder: "+",
    countryCodes: [
      { label: "Corée +82", value: "+82" },
      { label: "Canada/États-Unis +1", value: "+1" },
      { label: "France +33", value: "+33" },
      { label: "Royaume-Uni +44", value: "+44" },
      { label: "Australie +61", value: "+61" },
      { label: "Nouvelle-Zélande +64", value: "+64" },
      { label: "Japon +81", value: "+81" },
      { label: "Chine +86", value: "+86" },
      { label: "Hong Kong +852", value: "+852" },
      { label: "Taïwan +886", value: "+886" },
      { label: "Autre / personnalisé", value: CUSTOM_SELECT_VALUE },
    ],
    emailDomains: [
      "gmail.com",
      "outlook.com",
      "hotmail.com",
      "icloud.com",
      "yahoo.com",
      "naver.com",
      "daum.net",
      "kakao.com",
    ],
  },
} satisfies Record<
  Locale,
  {
    emailLabel: string;
    emailLocalPlaceholder: string;
    emailDomainCustom: string;
    emailDomainPlaceholder: string;
    phoneLabel: string;
    phoneNumberPlaceholder: string;
    customCountryCodePlaceholder: string;
    countryCodes: Array<{ label: string; value: string }>;
    emailDomains: string[];
  }
>;

const LANDLORD_LEAVE_COPY = {
  ko: {
    title: "임대인 등록 작성을 중단할까요?",
    body: "작성 중인 매물 등록 정보가 있습니다. 나가면 입력한 내용이 사라질 수 있습니다.",
    leave: "나가기",
    stay: "계속 작성하기",
    save: "임시 저장하기",
  },
  en: {
    title: "Leave landlord registration?",
    body: "You have listing information in progress. If you leave, your entered details may be lost.",
    leave: "Leave",
    stay: "Keep writing",
    save: "Save draft",
  },
  fr: {
    title: "Quitter l’inscription propriétaire ?",
    body: "Vous avez des informations d’annonce en cours de saisie. Si vous quittez, elles peuvent être perdues.",
    leave: "Quitter",
    stay: "Continuer",
    save: "Enregistrer le brouillon",
  },
} satisfies Record<
  Locale,
  {
    title: string;
    body: string;
    leave: string;
    stay: string;
    save: string;
  }
>;

const LANDLORD_CENTER_REGISTER_COPY = {
  ko: {
    centerLabel: "임대인 센터",
    registrationLabel: "임대인 등록",
    title: "임대인 기본 정보를 입력하세요",
    description:
      "첫 매물 등록에 필요한 기본 연락처만 먼저 확인합니다. 추후 회원가입 정보와 연동될 예정입니다.",
    backToCenter: "임대인 센터로 돌아가기",
  },
  en: {
    centerLabel: "Landlord center",
    registrationLabel: "Landlord registration",
    title: "Enter your landlord information",
    description:
      "Start with only the basic contact details needed for your first listing. These can later be linked to account information.",
    backToCenter: "Back to landlord center",
  },
  fr: {
    centerLabel: "Espace propriétaire",
    registrationLabel: "Inscription propriétaire",
    title: "Renseignez vos informations propriétaire",
    description:
      "Commencez avec les coordonnées de base nécessaires à votre première annonce. Elles pourront plus tard être liées au compte.",
    backToCenter: "Retour à l’espace propriétaire",
  },
} satisfies Record<
  Locale,
  {
    centerLabel: string;
    registrationLabel: string;
    title: string;
    description: string;
    backToCenter: string;
  }
>;

const LANDLORD_REQUIREMENT_COPY = {
  ko: {
    required: "필수",
    optional: "선택",
    conditional: "조건부 필수",
  },
  en: {
    required: "Required",
    optional: "Optional",
    conditional: "Required if applicable",
  },
  fr: {
    required: "Obligatoire",
    optional: "Facultatif",
    conditional: "Obligatoire si applicable",
  },
} satisfies Record<Locale, Record<FieldRequirement, string>>;

const LANDLORD_DATE_COPY = {
  ko: {
    placeholder: "날짜 선택",
    previousMonth: "이전 달",
    nextMonth: "다음 달",
    weekdays: ["월", "화", "수", "목", "금", "토", "일"],
  },
  en: {
    placeholder: "Select date",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  fr: {
    placeholder: "Choisir une date",
    previousMonth: "Mois précédent",
    nextMonth: "Mois suivant",
    weekdays: ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."],
  },
} satisfies Record<
  Locale,
  {
    placeholder: string;
    previousMonth: string;
    nextMonth: string;
    weekdays: string[];
  }
>;

const LANDLORD_MONTH_NAMES = {
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  fr: [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ],
} as const;

const LANDLORD_VALIDATION_COPY = {
  ko: {
    numbersOnly: "숫자만 입력해주세요.",
    currency: "숫자만 입력해주세요.",
    emailLocal: "이메일 아이디 형식이 올바르지 않습니다.",
    emailDomain: "올바른 도메인 형식이 아닙니다.",
    phone: "숫자만 입력해주세요.",
    countryCode: "국가 번호 형식이 올바르지 않습니다.",
    requiredFormat: "필수 항목을 올바른 형식으로 입력해주세요.",
    stationForCity: "선택한 도시의 역을 선택해주세요.",
  },
  en: {
    numbersOnly: "Enter numbers only.",
    currency: "Enter numbers only.",
    emailLocal: "Enter a valid email name.",
    emailDomain: "Enter a valid domain, such as gmail.com.",
    phone: "Enter numbers only.",
    countryCode: "Enter a valid country code.",
    requiredFormat: "Complete required fields in the correct format.",
    stationForCity: "Select a station for the selected city.",
  },
  fr: {
    numbersOnly: "Saisissez uniquement des chiffres.",
    currency: "Saisissez uniquement des chiffres.",
    emailLocal: "Saisissez un identifiant e-mail valide.",
    emailDomain: "Saisissez un domaine valide, par exemple gmail.com.",
    phone: "Saisissez uniquement des chiffres.",
    countryCode: "Saisissez un indicatif pays valide.",
    requiredFormat: "Renseignez les champs obligatoires au bon format.",
    stationForCity: "Choisissez une station correspondant à la ville sélectionnée.",
  },
} satisfies Record<
  Locale,
  {
    numbersOnly: string;
    currency: string;
    emailLocal: string;
    emailDomain: string;
    phone: string;
    countryCode: string;
    requiredFormat: string;
    stationForCity: string;
  }
>;

const LANDLORD_STATION_COPY = {
  ko: {
    genericPlaceholder: "도시를 먼저 선택해주세요",
    searchPlaceholder: "역 이름 검색",
    placeholders: {
      toronto: "가까운 TTC 역 선택",
      vancouver: "가까운 SkyTrain 역 선택",
      calgary: "가까운 CTrain 역 선택",
    },
  },
  en: {
    genericPlaceholder: "Select a city first",
    searchPlaceholder: "Search station name",
    placeholders: {
      toronto: "Select nearest TTC station",
      vancouver: "Select nearest SkyTrain station",
      calgary: "Select nearest CTrain station",
    },
  },
  fr: {
    genericPlaceholder: "Choisir d’abord une ville",
    searchPlaceholder: "Rechercher une station",
    placeholders: {
      toronto: "Choisir la station TTC la plus proche",
      vancouver: "Choisir la station SkyTrain la plus proche",
      calgary: "Choisir la station CTrain la plus proche",
    },
  },
} satisfies Record<
  Locale,
  {
    genericPlaceholder: string;
    searchPlaceholder: string;
    placeholders: Record<LandlordCityKey, string>;
  }
>;

function parseIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatLandlordMonthLabel(locale: Locale, date: Date) {
  if (locale === "ko") {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  }

  if (locale === "fr") {
    return `${LANDLORD_MONTH_NAMES.fr[date.getMonth()]} ${date.getFullYear()}`;
  }

  return `${LANDLORD_MONTH_NAMES.en[date.getMonth()]} ${date.getFullYear()}`;
}

function formatLandlordDisplayDate(locale: Locale, value: string) {
  const date = parseIsoDate(value);
  if (!date) {
    return value;
  }

  if (locale === "ko") {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  }

  if (locale === "fr") {
    return `${date.getDate()} ${LANDLORD_MONTH_NAMES.fr[date.getMonth()]} ${date.getFullYear()}`;
  }

  return `${LANDLORD_MONTH_NAMES.en[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

const LANDLORD_DISABLED_HELPER_COPY = {
  ko: {
    general: "필수 항목을 모두 입력하면 다음 단계로 이동할 수 있습니다.",
    photo: "사진은 최소 1장 이상 등록해주세요.",
    keyDeposit: "열쇠 보증금이 없으면 0을 입력해주세요.",
    houseRules: "하우스 룰은 최소 1개 이상 선택해주세요.",
    houseRulesNotice:
      "하우스 룰과 생활 조건을 충분히 적지 않아 생기는 분쟁이나 오해는 임대인이 직접 확인·관리해야 합니다.",
    bedSize: "침대를 선택했다면 침대 크기도 선택해주세요.",
  },
  en: {
    general: "Complete all required fields to continue.",
    photo: "Please add at least one photo.",
    keyDeposit: "Enter 0 if there is no key deposit.",
    houseRules: "Select at least one house rule.",
    houseRulesNotice:
      "If house rules or living conditions are not described clearly, any later misunderstanding or dispute should be handled and confirmed by the landlord.",
    bedSize: "Select a bed size if a bed is included.",
  },
  fr: {
    general: "Renseignez tous les champs obligatoires pour continuer.",
    photo: "Veuillez ajouter au moins une photo.",
    keyDeposit: "Indiquez 0 s’il n’y a pas de dépôt de clé.",
    houseRules: "Sélectionnez au moins une règle de la maison.",
    houseRulesNotice:
      "Si les règles de la maison ou les conditions de vie ne sont pas décrites clairement, tout malentendu ou litige ultérieur doit être confirmé et géré par le propriétaire.",
    bedSize: "Sélectionnez la taille du lit si un lit est inclus.",
  },
} satisfies Record<
  Locale,
  {
    general: string;
    photo: string;
    keyDeposit: string;
    houseRules: string;
    houseRulesNotice: string;
    bedSize: string;
  }
>;

const LANDLORD_START_OVER_COPY = {
  ko: {
    title: "처음부터 다시 시작할까요?",
    body: "현재 입력한 임대인 등록 정보가 모두 초기화됩니다. 계속 진행할까요?",
    cancel: "계속 작성하기",
    confirm: "처음부터 다시",
  },
  en: {
    title: "Start over?",
    body: "All landlord registration information you entered will be cleared. Do you want to continue?",
    cancel: "Keep writing",
    confirm: "Start over",
  },
  fr: {
    title: "Recommencer ?",
    body: "Toutes les informations d’inscription propriétaire saisies seront effacées. Voulez-vous continuer ?",
    cancel: "Continuer",
    confirm: "Recommencer",
  },
} satisfies Record<
  Locale,
  {
    title: string;
    body: string;
    cancel: string;
    confirm: string;
  }
>;

const LANDLORD_ROOM_SECTION_TITLES = {
  ko: {
    rent: "A. 월세·입주 가능일",
    living: "B. 생활 조건",
    furniture: "C. 포함 가구",
  },
  en: {
    rent: "A. Rent & availability",
    living: "B. Living condition",
    furniture: "C. Included furniture",
  },
  fr: {
    rent: "A. Loyer & disponibilité",
    living: "B. Conditions de vie",
    furniture: "C. Mobilier inclus",
  },
} satisfies Record<Locale, { rent: string; living: string; furniture: string }>;

const LANDLORD_TERMS_SECTION_TITLES = {
  ko: {
    deposit: "A. 보증금",
    utilities: "B. 공과금 (선택)",
    rules: "C. 하우스 룰 (선택)",
    questions: "D. 입주 전 확인 질문 (선택)",
  },
  en: {
    deposit: "A. Deposit",
    utilities: "B. Utilities (Optional)",
    rules: "C. House rules (Optional)",
    questions: "D. Questions before move-in (Optional)",
  },
  fr: {
    deposit: "A. Dépôt",
    utilities: "B. Services (Facultatif)",
    rules: "C. Règles de la maison (Facultatif)",
    questions: "D. Questions avant l’arrivée (Facultatif)",
  },
} satisfies Record<
  Locale,
  { deposit: string; utilities: string; rules: string; questions: string }
>;

export function LocaleLandlordsPage({
  locale,
  page = "landing",
  registrationBase = "public",
}: {
  locale: Locale;
  page?: LandlordRoutePage;
  registrationBase?: LandlordRegistrationRouteBase;
}) {
  if (page === "guide") {
    return <LandlordGuidePage locale={locale} />;
  }

  if (page !== "landing") {
    return <LandlordRegisterPage locale={locale} page={page} routeBase={registrationBase} />;
  }

  return <LandlordLandingPage locale={locale} />;
}

function LandlordLandingPage({ locale }: { locale: Locale }) {
  const t = CONTENT[locale];
  const r = LANDLORD_REFINEMENTS[locale];

  return (
    <main className="bg-background [word-break:keep-all]">
      <Container className="py-8 sm:py-10 lg:py-12">
        <LandlordBreadcrumb locale={locale} page="landing" />

        <section className="mt-5 overflow-hidden rounded-[2rem] border border-border/80 bg-white shadow-sm">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-10">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                {t.landing.eyebrow}
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
                {t.landing.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t.landing.subtitle}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={landlordRoute(locale, "landing", "center")}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
                >
                  {t.landing.primaryCta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-border/80 bg-[#FCFCFB] p-5">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  MapleHouse Listing
                </p>
                <div className="mt-5 grid gap-3">
                  {t.landing.infoItems.slice(0, 5).map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-border/70 bg-[#FCFCFB] px-4 py-3 text-sm font-semibold text-foreground"
                    >
                      <CheckCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span className="min-w-0">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {t.landing.benefits.map((benefit, index) => {
              const Icon = BENEFIT_ICONS[index] ?? Building2;
              return (
                <article
                  key={benefit.title}
                  className="rounded-2xl border border-border/80 bg-[#FCFCFB] p-5 shadow-sm"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFF3E6] text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h2 className="mt-4 text-base font-extrabold text-foreground">
                    {benefit.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {benefit.body}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
            LANDLORD QUESTIONS
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {r.landingConcernsTitle}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {r.landingConcerns.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-border/80 bg-[#FCFCFB] p-5"
              >
                <h3 className="text-base font-extrabold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
            LISTING INFORMATION
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {t.landing.infoTitle}
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {t.landing.infoItems.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-primary/20 bg-[#FFF8F1] px-3 py-1.5 text-sm font-bold text-primary"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}

function LandlordGuidePage({ locale }: { locale: Locale }) {
  const t = CONTENT[locale];
  const r = LANDLORD_REFINEMENTS[locale];

  return (
    <main className="bg-background [word-break:keep-all]">
      <Container className="py-8 sm:py-10 lg:py-12">
        <LandlordBreadcrumb locale={locale} page="guide" />

        <section className="mt-5 rounded-[2rem] border border-border/80 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
            LISTING GUIDE
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
            {t.guide.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.guide.subtitle}
          </p>
          <a
            href={landlordRoute(locale, "register")}
            className="mt-7 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
          >
            {t.guide.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
              PROCESS
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {t.guide.processTitle}
            </h2>
          </div>

          <div className="grid gap-3">
            {t.guide.process.map((step, index) => (
              <article
                key={step}
                className="flex gap-4 rounded-2xl border border-border/80 bg-white p-5 shadow-sm"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-extrabold text-white">
                  {index + 1}
                </span>
                <h3 className="min-w-0 text-base font-extrabold text-foreground">{step}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex gap-4">
            <Info className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <div className="min-w-0">
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                {t.guide.termsTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {r.helpers.guideTermsBody}
              </p>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}

function LandlordRegisterPage({
  locale,
  page,
  routeBase,
}: {
  locale: Locale;
  page: Exclude<LandlordRoutePage, "landing" | "guide">;
  routeBase: LandlordRegistrationRouteBase;
}) {
  const t = CONTENT[locale];
  const { draft, loaded, updateDraft, clearDraft } = useLandlordDraft();
  const [pendingLeaveHref, setPendingLeaveHref] = useState<string | null>(null);
  const bypassLeaveGuardRef = useRef(false);
  const stepIndex = stepIndexForPage(page);
  const draftStarted = isDraftStarted(draft);
  const shouldProtectLeave = loaded && draftStarted;
  const route = (targetPage: RouteKey) => landlordRoute(locale, targetPage, routeBase);

  useEffect(() => {
    if (!shouldProtectLeave || typeof window === "undefined") {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (bypassLeaveGuardRef.current) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldProtectLeave]);

  useEffect(() => {
    if (!shouldProtectLeave || typeof window === "undefined") {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as Element | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const hrefAttribute = anchor.getAttribute("href") || "";
      if (!hrefAttribute || hrefAttribute.startsWith("#")) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }

      if (isLandlordRegistrationPath(url.pathname)) {
        return;
      }

      event.preventDefault();
      setPendingLeaveHref(`${url.pathname}${url.search}${url.hash}`);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [shouldProtectLeave]);

  const closeLeaveDialog = () => setPendingLeaveHref(null);
  const goToPendingHref = () => {
    const href = pendingLeaveHref;
    setPendingLeaveHref(null);
    if (href && typeof window !== "undefined") {
      bypassLeaveGuardRef.current = true;
      window.location.href = href;
    }
  };
  const saveDraftAndLeave = () => {
    writeLandlordDraftStorage(draft);
    goToPendingHref();
  };
  const clearDraftAndLeave = () => {
    clearDraft();
    goToPendingHref();
  };

  return (
    <main className="bg-background [word-break:keep-all]">
      <Container className="py-8 sm:py-10 lg:py-12">
        <LandlordBreadcrumb locale={locale} page={page} registrationBase={routeBase} />
        <LandlordProgress locale={locale} activeIndex={stepIndex} />

        {loaded && !draftStarted && page !== "register" ? (
          <LandlordNotice className="mt-5">
            <strong className="block text-foreground">{t.flow.draftNoticeTitle}</strong>
            <span className="mt-1 block">{t.flow.draftNoticeBody}</span>
            <a
              href={route("register")}
              className="mt-3 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white"
            >
              {t.flow.backToStart}
            </a>
          </LandlordNotice>
        ) : null}

        {page === "register" ? (
          <RegisterStartStep
            locale={locale}
            draft={draft}
            routeBase={routeBase}
            updateDraft={updateDraft}
          />
        ) : null}
        {page === "property" ? (
          <PropertyStep
            locale={locale}
            draft={draft}
            routeBase={routeBase}
            updateDraft={updateDraft}
          />
        ) : null}
        {page === "rooms" ? (
          <RoomsStep
            locale={locale}
            draft={draft}
            routeBase={routeBase}
            updateDraft={updateDraft}
          />
        ) : null}
        {page === "terms" ? (
          <TermsStep
            locale={locale}
            draft={draft}
            routeBase={routeBase}
            updateDraft={updateDraft}
          />
        ) : null}
        {page === "preview" ? (
          <PreviewStep
            locale={locale}
            draft={draft}
            routeBase={routeBase}
            clearDraft={clearDraft}
          />
        ) : null}
      </Container>
      {pendingLeaveHref ? (
        <LandlordLeaveDialog
          locale={locale}
          onStay={closeLeaveDialog}
          onSave={saveDraftAndLeave}
          onLeave={clearDraftAndLeave}
        />
      ) : null}
    </main>
  );
}

function RegisterStartStep({
  locale,
  draft,
  routeBase,
  updateDraft,
}: {
  locale: Locale;
  draft: LandlordDraft;
  routeBase: LandlordRegistrationRouteBase;
  updateDraft: (patch: Partial<LandlordDraft>) => void;
}) {
  const t = CONTENT[locale];
  const r = LANDLORD_REFINEMENTS[locale];
  const contactCopy = LANDLORD_CONTACT_COPY[locale];
  const disabledCopy = LANDLORD_DISABLED_HELPER_COPY[locale];
  const validationCopy = LANDLORD_VALIDATION_COPY[locale];
  const displayLastName = draft.lastName || draft.name;
  const trimmedFirstName = draft.firstName.trim();
  const trimmedLastName = displayLastName.trim();
  const trimmedEmailLocal = draft.emailLocal.trim();
  const trimmedEmailDomain = draft.emailDomain.trim();
  const resolvedPhoneCountryCode = getResolvedPhoneCountryCode(draft);
  const activePhoneCountryCode = draft.phoneCountryCode === CUSTOM_SELECT_VALUE
    ? draft.phoneCountryCodeCustom.trim()
    : resolvedPhoneCountryCode;
  const trimmedPhoneNumber = draft.phoneNumber.trim();
  const emailLocalValid = Boolean(trimmedEmailLocal && validateEmailLocal(trimmedEmailLocal));
  const emailDomainValid = Boolean(trimmedEmailDomain && validateEmailDomain(trimmedEmailDomain));
  const phoneCountryCodeValid = Boolean(
    activePhoneCountryCode && validateCountryCode(activePhoneCountryCode),
  );
  const phoneNumberValid = Boolean(trimmedPhoneNumber && validatePhoneNumber(trimmedPhoneNumber));
  const identityHasFormatError = Boolean(
    (trimmedEmailLocal && !emailLocalValid) ||
      (trimmedEmailDomain && !emailDomainValid) ||
      (activePhoneCountryCode && !phoneCountryCodeValid),
  );
  const roleComplete = Boolean(draft.role.trim());
  const identityComplete = Boolean(
    trimmedFirstName &&
      trimmedLastName &&
      emailLocalValid &&
      emailDomainValid &&
      phoneCountryCodeValid &&
      phoneNumberValid,
  );
  const showContactSection = roleComplete;
  const canContinue = Boolean(
    roleComplete && identityComplete,
  );
  const startDisabledHelper = identityHasFormatError
    ? validationCopy.requiredFormat
    : disabledCopy.general;
  const centerRegisterCopy = LANDLORD_CENTER_REGISTER_COPY[locale];
  const isCenterFlow = routeBase === "center";
  const updateEmailParts = (patch: Partial<Pick<LandlordDraft, "emailLocal" | "emailDomain">>) => {
    const emailLocal = (patch.emailLocal ?? draft.emailLocal).replace(/@/g, "");
    const emailDomain = (patch.emailDomain ?? draft.emailDomain).replace(/@/g, "").trim();
    updateDraft({
      ...patch,
      emailLocal,
      emailDomain,
      email: emailLocal.trim() && emailDomain.trim()
        ? `${emailLocal.trim()}@${emailDomain.trim()}`
        : "",
    });
  };
  const updatePhoneParts = (
    patch: Partial<
      Pick<LandlordDraft, "phoneCountryCode" | "phoneCountryCodeCustom" | "phoneNumber">
    >,
  ) => {
    const normalizedPatch = { ...patch };
    if (patch.phoneNumber !== undefined) {
      normalizedPatch.phoneNumber = normalizePhoneNumber(patch.phoneNumber);
    }
    const nextDraft = { ...draft, ...normalizedPatch };
    const countryCode = getResolvedPhoneCountryCode(nextDraft);
    const phoneNumber = nextDraft.phoneNumber.trim();
    updateDraft({
      ...normalizedPatch,
      contact: countryCode && phoneNumber ? `${countryCode} ${phoneNumber}` : "",
    });
  };

  return (
    <LandlordStepLayout
      locale={locale}
      page="register"
      title={isCenterFlow ? centerRegisterCopy.title : t.flow.start.title}
      description={isCenterFlow ? centerRegisterCopy.description : r.helpers.startDescription}
      asideTitle={t.flow.start.helpTitle}
      asideBody={t.flow.start.helpBody}
      icon={<ClipboardCheck className="h-5 w-5" aria-hidden />}
    >
      <ProgressiveRevealSections
        sections={[
          {
            id: "role",
            title: r.sections.startRole,
            complete: roleComplete,
            children: (
              <OptionCardField
                locale={locale}
                label={r.fields.role}
                value={draft.role}
                options={r.options.roles}
                onChange={(role) => updateDraft({ role })}
                requirement="required"
              />
            ),
          },
          ...(showContactSection
            ? [
                {
                  id: "identity",
                  title: r.sections.startIdentity,
                  complete: identityComplete,
                  children: (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextField
                        locale={locale}
                        label={r.fields.firstName}
                        value={draft.firstName}
                        onChange={(firstName) => updateDraft({ firstName })}
                        requirement="required"
                        autoComplete="off"
                      />
                      <TextField
                        locale={locale}
                        label={r.fields.lastName}
                        value={displayLastName}
                        onChange={(lastName) => updateDraft({ lastName, name: lastName })}
                        requirement="required"
                        autoComplete="off"
                      />
                      <EmailSplitField
                        locale={locale}
                        label={contactCopy.emailLabel}
                        localValue={draft.emailLocal}
                        domainValue={draft.emailDomain}
                        onLocalChange={(emailLocal) => updateEmailParts({ emailLocal })}
                        onDomainChange={(emailDomain) => updateEmailParts({ emailDomain })}
                        requirement="required"
                        localError={trimmedEmailLocal && !emailLocalValid ? validationCopy.emailLocal : undefined}
                        domainError={trimmedEmailDomain && !emailDomainValid ? validationCopy.emailDomain : undefined}
                      />
                      <PhoneSplitField
                        locale={locale}
                        label={contactCopy.phoneLabel}
                        countryCode={draft.phoneCountryCode}
                        customCountryCode={draft.phoneCountryCodeCustom}
                        phoneNumber={draft.phoneNumber}
                        onChange={updatePhoneParts}
                        requirement="required"
                        countryCodeError={
                          activePhoneCountryCode && !phoneCountryCodeValid
                            ? validationCopy.countryCode
                            : undefined
                        }
                      />
                    </div>
                  ),
                },
              ]
            : []),
        ]}
      />
      <FlowActions
        locale={locale}
        backHref={landlordRoute(locale, "landing", routeBase)}
        nextHref={landlordRoute(locale, "property", routeBase)}
        nextDisabled={!canContinue}
        disabledHelper={startDisabledHelper}
      />
    </LandlordStepLayout>
  );
}

function PropertyStep({
  locale,
  draft,
  routeBase,
  updateDraft,
}: {
  locale: Locale;
  draft: LandlordDraft;
  routeBase: LandlordRegistrationRouteBase;
  updateDraft: (patch: Partial<LandlordDraft>) => void;
}) {
  const t = CONTENT[locale];
  const r = LANDLORD_REFINEMENTS[locale];
  const form = LANDLORD_FORM_COPY[locale];
  const disabledCopy = LANDLORD_DISABLED_HELPER_COPY[locale];
  const locationComplete = Boolean(
    draft.city.trim() &&
      draft.address.trim(),
  );
  const housingComplete = Boolean(draft.housingType.trim());
  const livingComplete = Boolean(draft.residentCondition.trim());
  const showHousingSection = locationComplete;
  const showLivingSection = locationComplete && housingComplete;
  const corePropertyComplete = locationComplete && housingComplete && livingComplete;
  const canContinue = corePropertyComplete;
  const propertyDisabledHelper = disabledCopy.general;

  return (
    <LandlordStepLayout
      locale={locale}
      page="property"
      title={t.flow.property.title}
      description={r.helpers.propertyDescription}
      asideTitle={t.routeLabels.property}
      asideBody={t.flow.property.addressHelper}
      icon={<Home className="h-5 w-5" aria-hidden />}
    >
      <ProgressiveRevealSections
        sections={[
          {
            id: "location",
            title: r.sections.location,
            complete: locationComplete,
            children: (
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  locale={locale}
                  label={r.fields.city}
                  value={draft.city}
                  options={form.cityOptions}
                  placeholder={form.select}
                  requirement="required"
                  onChange={(city) => {
                    const nextStations = getRapidTransitStationsForCity(
                      getLandlordCityKey(locale, city),
                    );
                    updateDraft({
                      city,
                      nearestStation: nextStations.includes(draft.nearestStation)
                        ? draft.nearestStation
                        : "",
                    });
                  }}
                />
                <TextField
                  locale={locale}
                  label={r.fields.address}
                  value={draft.address}
                  helper={r.helpers.addressHelper}
                  requirement="required"
                  onChange={(address) => updateDraft({ address })}
                />
                <p className="text-xs font-semibold leading-relaxed text-muted-foreground sm:col-span-2">
                  {r.helpers.quickPropertyNote}
                </p>
              </div>
            ),
          },
          ...(showHousingSection
            ? [
                {
                  id: "housing",
                  title: r.sections.housing,
                  complete: housingComplete,
                  children: (
                    <OptionCardField
                      locale={locale}
                      label={r.fields.housingType}
                      value={draft.housingType}
                      options={form.housingTypes}
                      requirement="required"
                      onChange={(housingType) => updateDraft({ housingType })}
                      compact
                    />
                  ),
                },
              ]
            : []),
          ...(showLivingSection
            ? [
                {
                  id: "living",
                  title: r.sections.living,
                  complete: livingComplete,
                  children: (
                    <>
                      <p className="text-sm font-semibold leading-relaxed text-muted-foreground">
                        {form.residentHelper}
                      </p>
                      <ChipChoiceField
                        locale={locale}
                        label={r.fields.residentCondition}
                        value={draft.residentCondition}
                        options={r.options.residentConditions}
                        requirement="required"
                        onChange={(residentCondition) => updateDraft({ residentCondition })}
                      />
                    </>
                  ),
                },
              ]
            : []),
        ]}
      />
      <FlowActions
        locale={locale}
        backHref={landlordRoute(locale, "register", routeBase)}
        nextHref={landlordRoute(locale, "rooms", routeBase)}
        nextDisabled={!canContinue}
        disabledHelper={propertyDisabledHelper}
      />
    </LandlordStepLayout>
  );
}

function RoomsStep({
  locale,
  draft,
  routeBase,
  updateDraft,
}: {
  locale: Locale;
  draft: LandlordDraft;
  routeBase: LandlordRegistrationRouteBase;
  updateDraft: (patch: Partial<LandlordDraft>) => void;
}) {
  const t = CONTENT[locale];
  const r = LANDLORD_REFINEMENTS[locale];
  const sectionTitles = LANDLORD_ROOM_SECTION_TITLES[locale];
  const disabledCopy = LANDLORD_DISABLED_HELPER_COPY[locale];
  const validationCopy = LANDLORD_VALIDATION_COPY[locale];
  const monthlyRentValid = isValidRequiredCurrencyInput(draft.monthlyRent.trim());
  const monthlyRentHasFormatError = Boolean(
    draft.monthlyRent.trim() && !isValidCurrencyInput(draft.monthlyRent.trim()),
  );
  const photosComplete = Boolean(draft.photos.length && (draft.coverPhotoId || draft.photos[0]?.id));
  const roomRentComplete = Boolean(monthlyRentValid && draft.availableFrom.trim());
  const canContinue = roomRentComplete && photosComplete && !monthlyRentHasFormatError;
  const roomsDisabledHelper = monthlyRentHasFormatError
    ? validationCopy.requiredFormat
    : roomRentComplete
      ? disabledCopy.photo
      : disabledCopy.general;

  return (
    <LandlordStepLayout
      locale={locale}
      page="rooms"
      title={t.flow.rooms.title}
      description={r.helpers.roomsDescription}
      asideTitle={t.routeLabels.rooms}
      asideBody={t.flow.rooms.description}
      icon={<Building2 className="h-5 w-5" aria-hidden />}
    >
      <ProgressiveRevealSections
        sections={[
          {
            id: "rent",
            title: sectionTitles.rent,
            complete: roomRentComplete,
            children: (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <CurrencyField
                    locale={locale}
                    label={r.fields.monthlyRent}
                    value={draft.monthlyRent}
                    requirement="required"
                    onChange={(monthlyRent) => updateDraft({ monthlyRent })}
                    error={monthlyRentHasFormatError ? validationCopy.currency : undefined}
                  />
                  <LandlordDateField
                    locale={locale}
                    label={r.fields.availableFrom}
                    value={draft.availableFrom}
                    requirement="required"
                    onChange={(availableFrom) => updateDraft({ availableFrom })}
                  />
                </div>
              </>
            ),
          },
          {
            id: "photos",
            title: r.helpers.photosTitle,
            complete: photosComplete,
            children: (
              <PhotoUploadField
                locale={locale}
                photos={draft.photos}
                coverPhotoId={draft.coverPhotoId}
                requirement="required"
                onChange={(photos, coverPhotoId) => updateDraft({ photos, coverPhotoId })}
              />
            ),
          },
        ]}
      />
      <FlowActions
        locale={locale}
        backHref={landlordRoute(locale, "property", routeBase)}
        nextHref={landlordRoute(locale, "preview", routeBase)}
        nextDisabled={!canContinue}
        disabledHelper={roomsDisabledHelper}
      />
    </LandlordStepLayout>
  );
}

function TermsStep({
  locale,
  draft,
  routeBase,
  updateDraft,
}: {
  locale: Locale;
  draft: LandlordDraft;
  routeBase: LandlordRegistrationRouteBase;
  updateDraft: (patch: Partial<LandlordDraft>) => void;
}) {
  const t = CONTENT[locale];
  const r = LANDLORD_REFINEMENTS[locale];

  return (
    <LandlordStepLayout
      locale={locale}
      page="terms"
      title={t.flow.terms.title}
      description={t.flow.terms.description}
      asideTitle={t.routeLabels.terms}
      asideBody={t.flow.terms.notice}
      icon={<ShieldCheck className="h-5 w-5" aria-hidden />}
    >
      <section className="rounded-[1.5rem] border border-primary/15 bg-[#FFF8F1] p-5">
        <h2 className="text-lg font-extrabold text-foreground">
          {t.flow.terms.title}
        </h2>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-muted-foreground">
          {t.flow.terms.description}
        </p>
      </section>
      <FlowActions
        locale={locale}
        backHref={landlordRoute(locale, "rooms", routeBase)}
        nextHref={landlordRoute(locale, "preview", routeBase)}
        nextLabel={r.helpers.termsPreviewCta}
      />
    </LandlordStepLayout>
  );
}

function PreviewStep({
  locale,
  draft,
  routeBase,
  clearDraft,
}: {
  locale: Locale;
  draft: LandlordDraft;
  routeBase: LandlordRegistrationRouteBase;
  clearDraft: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [startOverOpen, setStartOverOpen] = useState(false);
  const t = CONTENT[locale];
  const r = LANDLORD_REFINEMENTS[locale];
  const startOverCopy = LANDLORD_START_OVER_COPY[locale];
  const centerRegisterCopy = LANDLORD_CENTER_REGISTER_COPY[locale];
  const coverPhoto = draft.photos.find((photo) => photo.id === draft.coverPhotoId) || draft.photos[0];
  const listingTitle = draft.listingTitle.trim() || r.helpers.listingTitleFallback;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!confirmed) {
      return;
    }
    setSubmitted(true);
  };

  return (
    <LandlordStepLayout
      locale={locale}
      page="preview"
      title={t.flow.preview.title}
      description={r.helpers.previewDescription}
      asideTitle={t.routeLabels.preview}
      asideBody={t.landing.notice}
      icon={<ClipboardList className="h-5 w-5" aria-hidden />}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <section className="rounded-[1.5rem] border border-primary/15 bg-[#FFF8F1] p-4 sm:p-5">
          <div className="grid gap-5 lg:grid-cols-[240px_1fr] lg:items-stretch">
            <div className="min-h-44 overflow-hidden rounded-2xl border border-primary/15 bg-white">
              {coverPhoto?.dataUrl ? (
                <img
                  src={coverPhoto.dataUrl}
                  alt={coverPhoto.name}
                  className="h-full min-h-44 w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-44 flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
                  <Camera className="h-8 w-8 text-primary" aria-hidden />
                  <span className="text-sm font-extrabold">{r.helpers.photosTitle}</span>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
                MapleHouse Preview
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground">
                {listingTitle}
              </h2>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">
                {[draft.city, draft.address].filter(Boolean).join(" · ") ||
                  r.helpers.empty}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <PreviewMetric label={r.fields.monthlyRent} value={formatCurrencyValue(draft.monthlyRent)} empty={r.helpers.empty} />
                <PreviewMetric
                  label={r.fields.availableFrom}
                  value={formatLandlordDisplayDate(locale, draft.availableFrom)}
                  empty={r.helpers.empty}
                />
                <PreviewMetric label={r.fields.city} value={draft.city} empty={r.helpers.empty} />
                <PreviewMetric label={r.fields.housingType} value={draft.housingType} empty={r.helpers.empty} />
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <DraftSummaryCard
            title={r.sections.contact}
            empty={r.helpers.empty}
            editHref={landlordRoute(locale, "register", routeBase)}
            editLabel={r.helpers.edit}
            rows={[
              [r.fields.role, draft.role],
              [r.fields.firstName, draft.firstName],
              [r.fields.lastName, draft.lastName || draft.name],
              [r.fields.email, draft.email],
              [r.fields.contact, draft.contact],
            ]}
          />
          <DraftSummaryCard
            title={r.sections.property}
            empty={r.helpers.empty}
            editHref={landlordRoute(locale, "property", routeBase)}
            editLabel={r.helpers.edit}
            rows={[
              [r.fields.city, draft.city],
              [r.fields.address, draft.address],
              [r.fields.housingType, draft.housingType],
              [r.fields.residentCondition, draft.residentCondition],
            ]}
          />
          <DraftSummaryCard
            title={r.sections.room}
            empty={r.helpers.empty}
            editHref={landlordRoute(locale, "rooms", routeBase)}
            editLabel={r.helpers.edit}
            rows={[
              [r.fields.monthlyRent, formatCurrencyValue(draft.monthlyRent)],
              [r.fields.availableFrom, formatLandlordDisplayDate(locale, draft.availableFrom)],
              [r.helpers.photosTitle, draft.photos.length ? `${draft.photos.length}` : ""],
              [r.helpers.coverLabel, coverPhoto?.name || ""],
            ]}
          />
        </div>

        <LandlordNotice>{r.helpers.quickDetailLaterNote}</LandlordNotice>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-[#FCFCFB] p-3 text-sm font-semibold leading-relaxed text-foreground">
          <input
            required
            type="checkbox"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
            className="peer sr-only"
          />
          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border bg-white text-white transition peer-checked:border-primary peer-checked:bg-primary">
            <CheckCircle className="h-3.5 w-3.5" aria-hidden />
          </span>
          <span>
            {r.helpers.previewCheckbox}{" "}
            <span className="whitespace-nowrap font-extrabold text-primary">
              ({LANDLORD_REQUIREMENT_COPY[locale].required})
            </span>
          </span>
        </label>

        {submitted ? (
          <div className="rounded-2xl border border-primary/20 bg-[#FFF8F1] p-4">
            <h3 className="text-sm font-extrabold text-foreground">
              {r.helpers.previewSuccessTitle}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {r.helpers.previewSuccess}
            </p>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5">
          <Link
            to={landlordRoute(locale, "rooms", routeBase)}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-foreground transition hover:border-primary/30 hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            {t.flow.back}
          </Link>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStartOverOpen(true)}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-2xl border border-primary/25 bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-[#FFF8F1]"
            >
              {r.helpers.startOver}
            </button>
            <Link
              to={landlordRoute(locale, "landing", "center")}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-2xl border border-primary/25 bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-[#FFF8F1]"
            >
              {centerRegisterCopy.backToCenter}
            </Link>
            <button
              type="submit"
              disabled={!confirmed}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            >
              {r.helpers.submitPreview}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </form>
      {startOverOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
          <section className="w-full max-w-md rounded-3xl border border-primary/20 bg-white p-5 shadow-2xl">
            <h2 className="text-lg font-extrabold text-foreground">
              {startOverCopy.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {startOverCopy.body}
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setStartOverOpen(false)}
                className="rounded-2xl border border-border bg-white px-4 py-2.5 text-sm font-bold text-muted-foreground transition hover:border-primary/30 hover:text-primary"
              >
                {startOverCopy.cancel}
              </button>
              <Link
                to={landlordRoute(locale, "register", "center")}
                onClick={() => {
                  clearDraft();
                  setStartOverOpen(false);
                }}
                className="rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
              >
                {startOverCopy.confirm}
              </Link>
            </div>
          </section>
        </div>
      ) : null}
    </LandlordStepLayout>
  );
}

function LandlordStepLayout({
  locale,
  page,
  title,
  description,
  children,
}: {
  locale: Locale;
  page: Exclude<LandlordRoutePage, "landing" | "guide">;
  title: string;
  description: string;
  asideTitle: string;
  asideBody: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const t = CONTENT[locale];
  const r = LANDLORD_REFINEMENTS[locale];
  const topNote =
    page === "preview"
      ? ""
      : page === "terms"
        ? r.helpers.termsLiteNote
        : r.helpers.onboardingLiteNote;

  return (
    <section className="mx-auto mt-5 max-w-6xl">
      <div className="rounded-[2rem] border border-border/80 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-6 border-b border-border/70 pb-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
            {t.flow.sectionEyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
          {topNote ? <LandlordNotice className="mt-4">{topNote}</LandlordNotice> : null}
        </div>
        <div className="space-y-5">{children}</div>
      </div>
    </section>
  );
}

function LandlordProgress({
  locale,
  activeIndex,
}: {
  locale: Locale;
  activeIndex: number;
}) {
  const t = CONTENT[locale];

  return (
    <nav
      aria-label="landlord registration progress"
      className="mt-5 rounded-[2rem] border border-border/80 bg-white p-3 shadow-sm"
    >
      <ol className="grid gap-2 sm:grid-cols-4">
        {t.flow.labels.map((label, index) => {
          const isActive = index === activeIndex;
          const isComplete = index < activeIndex;
          return (
            <li key={label}>
              <div
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex min-h-12 cursor-default items-center gap-2 rounded-2xl px-3 py-2 text-sm font-extrabold",
                  isActive
                    ? "bg-primary text-white"
                    : isComplete
                      ? "bg-[#FFF3E6] text-primary"
                      : "bg-[#F7F7F5] text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
                    isActive
                      ? "bg-white text-primary"
                      : isComplete
                        ? "bg-primary text-white"
                        : "bg-white text-muted-foreground",
                  )}
                >
                  {index + 1}
                </span>
                <span className="min-w-0 leading-tight">{label}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function FlowActions({
  locale,
  backHref,
  nextHref,
  nextLabel,
  nextDisabled = false,
  disabledHelper,
}: {
  locale: Locale;
  backHref: string;
  nextHref: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  disabledHelper?: string;
}) {
  const t = CONTENT[locale];

  return (
    <div className="border-t border-border/70 pt-5">
      {nextDisabled && disabledHelper ? (
        <p className="mb-3 rounded-2xl bg-[#FFF8F1] p-3 text-sm font-semibold leading-relaxed text-muted-foreground">
          {disabledHelper}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={backHref}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-foreground transition hover:border-primary/30 hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          {t.flow.back}
        </Link>
        {nextDisabled ? (
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-muted px-5 py-3 text-sm font-bold text-muted-foreground"
          >
            {nextLabel || t.flow.next}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        ) : (
          <Link
            to={nextHref}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
          >
            {nextLabel || t.flow.next}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}

function FormSection({
  title,
  helper,
  children,
}: {
  title: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-border/80 bg-[#FCFCFB] p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-base font-extrabold text-foreground">{title}</h2>
        {helper ? (
          <p className="mt-1 text-sm font-semibold leading-relaxed text-muted-foreground">
            {helper}
          </p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 pt-2 first:pt-0">
      <h2 className="text-sm font-extrabold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function ProgressiveRevealSections({
  sections,
}: {
  sections: Array<{
    id: string;
    title: string;
    complete?: boolean;
    children: React.ReactNode;
  }>;
}) {
  return (
    <div className="space-y-3">
      {sections.map((section, index) => {
        const isComplete = Boolean(section.complete);

        return (
          <section
            key={section.id}
            style={{ zIndex: sections.length - index }}
            className={cn(
              "relative overflow-visible rounded-[1.5rem] border bg-white shadow-sm transition",
              isComplete ? "border-primary/20" : "border-border/80",
              index > 0 && "mh-landlord-reveal",
            )}
          >
            <div
              className={cn(
                "rounded-t-[1.5rem] border-b px-4 py-3 sm:px-5",
                isComplete
                  ? "border-primary/10 bg-[#FFF8F1]"
                  : "border-border/70 bg-[#FCFCFB]",
              )}
            >
              <h2 className="min-w-0 text-sm font-extrabold text-foreground">
                {section.title}
              </h2>
            </div>
            <div className="px-4 py-4 sm:px-5">
              <div className="space-y-4">{section.children}</div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function LandlordLeaveDialog({
  locale,
  onStay,
  onSave,
  onLeave,
}: {
  locale: Locale;
  onStay: () => void;
  onSave: () => void;
  onLeave: () => void;
}) {
  const copy = LANDLORD_LEAVE_COPY[locale];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
      <section className="w-full max-w-md rounded-3xl border border-primary/20 bg-white p-5 shadow-2xl">
        <h2 className="text-lg font-extrabold text-foreground">{copy.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {copy.body}
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onLeave}
            className="rounded-2xl border border-border bg-white px-4 py-2.5 text-sm font-bold text-muted-foreground transition hover:border-primary/30 hover:text-primary"
          >
            {copy.leave}
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-2xl border border-primary/25 bg-white px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-[#FFF8F1]"
          >
            {copy.save}
          </button>
          <button
            type="button"
            onClick={onStay}
            className="rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
          >
            {copy.stay}
          </button>
        </div>
      </section>
    </div>
  );
}

function AccordionSections({
  sections,
}: {
  sections: Array<{
    id: string;
    title: string;
    helper?: string;
    complete?: boolean;
    children: React.ReactNode;
  }>;
}) {
  const [openId, setOpenId] = useState(sections[0]?.id || "");

  useEffect(() => {
    if (!sections.some((section) => section.id === openId)) {
      setOpenId(sections[0]?.id || "");
    }
  }, [openId, sections]);

  return (
    <div className="space-y-3">
      {sections.map((section, index) => {
        const isOpen = openId === section.id;
        const isComplete = Boolean(section.complete);

        return (
          <section
            key={section.id}
            className={cn(
              "overflow-hidden rounded-[1.5rem] border shadow-sm transition",
              isOpen || isComplete
                ? "border-primary/20 bg-[#FFF8F1]"
                : "border-border/80 bg-[#FCFCFB]",
            )}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? "" : section.id)}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left sm:px-5"
            >
              <span
                className={cn(
                  "flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold",
                  isComplete
                    ? "bg-primary text-white"
                    : isOpen
                      ? "bg-[#FFF3E6] text-primary"
                      : "bg-white text-muted-foreground",
                )}
              >
                {isComplete ? <CheckCircle className="h-4 w-4" aria-hidden /> : index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold text-foreground">
                  {section.title}
                </span>
                {section.helper ? (
                  <span className="mt-0.5 block text-xs font-semibold leading-relaxed text-muted-foreground">
                    {section.helper}
                  </span>
                ) : null}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition",
                  isOpen && "rotate-180 text-primary",
                )}
                aria-hidden
              />
            </button>
            {isOpen ? (
              <div className="border-t border-primary/10 bg-white px-4 py-4 sm:px-5">
                <div className="space-y-4">{section.children}</div>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

function TextField({
  locale,
  label,
  value,
  onChange,
  helper,
  type = "text",
  required = false,
  requirement,
  placeholder,
  inputMode,
  autoComplete = "off",
}: {
  locale: Locale;
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  type?: "text" | "email" | "number";
  required?: boolean;
  requirement?: FieldRequirement;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
}) {
  return (
    <label className="block min-w-0">
      <LabelText locale={locale} label={label} required={required} requirement={requirement} />
      <input
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "mt-2 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10",
        )}
      />
      {helper ? (
        <span className="mt-1 block text-xs font-semibold leading-relaxed text-muted-foreground">
          {helper}
        </span>
      ) : null}
    </label>
  );
}

function LandlordDateField({
  locale,
  label,
  value,
  onChange,
  requirement,
  helper,
}: {
  locale: Locale;
  label: string;
  value: string;
  onChange: (value: string) => void;
  requirement?: FieldRequirement;
  helper?: string;
}) {
  const copy = LANDLORD_DATE_COPY[locale];
  const selectedDate = parseIsoDate(value);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const baseDate = selectedDate || new Date();
    return new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (selectedDate) {
      setVisibleMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [value]);

  const daysInMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0,
  ).getDate();
  const firstWeekday = (new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
    1,
  ).getDay() + 6) % 7;
  const blanks = Array.from({ length: firstWeekday }, (_, index) => `blank-${index}`);
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  const moveMonth = (offset: number) => {
    setVisibleMonth(
      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1),
    );
  };

  return (
    <div ref={wrapperRef} className={cn("relative min-w-0", open && "z-[120]")}>
      <LabelText locale={locale} label={label} requirement={requirement} />
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="mt-2 flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-border bg-white px-3 text-left text-sm font-semibold text-foreground outline-none transition hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
      >
        <span className={cn("min-w-0 truncate", !value && "text-muted-foreground")}>
          {value ? formatLandlordDisplayDate(locale, value) : copy.placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      </button>
      {helper ? (
        <span className="mt-1 block text-xs font-semibold leading-relaxed text-muted-foreground">
          {helper}
        </span>
      ) : null}
      {open ? (
        <div className="absolute z-[130] mt-2 w-full min-w-[18rem] rounded-2xl border border-border bg-white p-3 shadow-lg sm:min-w-0">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              aria-label={copy.previousMonth}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition hover:border-primary/30 hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <p className="text-sm font-extrabold text-foreground">
              {formatLandlordMonthLabel(locale, visibleMonth)}
            </p>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              aria-label={copy.nextMonth}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition hover:border-primary/30 hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-extrabold text-muted-foreground">
            {copy.weekdays.map((weekday) => (
              <span key={weekday} className="py-1">
                {weekday}
              </span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {blanks.map((blank) => (
              <span key={blank} aria-hidden />
            ))}
            {days.map((day) => {
              const date = new Date(
                visibleMonth.getFullYear(),
                visibleMonth.getMonth(),
                day,
              );
              const isoDate = formatIsoDate(date);
              const selected = value === isoDate;
              return (
                <button
                  key={isoDate}
                  type="button"
                  onClick={() => {
                    onChange(isoDate);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex h-9 items-center justify-center rounded-xl text-xs font-extrabold transition",
                    selected
                      ? "bg-primary text-white"
                      : "text-foreground hover:bg-[#FFF8F1] hover:text-primary",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EmailSplitField({
  locale,
  label,
  localValue,
  domainValue,
  onLocalChange,
  onDomainChange,
  required = false,
  requirement,
  localError,
  domainError,
}: {
  locale: Locale;
  label: string;
  localValue: string;
  domainValue: string;
  onLocalChange: (value: string) => void;
  onDomainChange: (value: string) => void;
  required?: boolean;
  requirement?: FieldRequirement;
  localError?: string;
  domainError?: string;
}) {
  const copy = LANDLORD_CONTACT_COPY[locale];
  const domainOptions = copy.emailDomains;
  const selectedDomain = domainOptions.includes(domainValue)
    ? domainValue
    : CUSTOM_SELECT_VALUE;
  const showCustomDomain = selectedDomain === CUSTOM_SELECT_VALUE;
  const [domainOpen, setDomainOpen] = useState(false);
  const domainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!domainOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!domainRef.current?.contains(event.target as Node)) {
        setDomainOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDomainOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [domainOpen]);

  return (
    <fieldset className="min-w-0 sm:col-span-2">
      <LabelText locale={locale} label={label} required={required} requirement={requirement} />
      <div className="mt-2 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(170px,0.75fr)] sm:items-start">
        <div className="min-w-0">
          <input
            type="text"
            autoComplete="off"
            value={localValue}
            placeholder={copy.emailLocalPlaceholder}
            onChange={(event) => onLocalChange(event.target.value.replace(/@/g, ""))}
            className={cn(
              "h-11 w-full min-w-0 rounded-xl border bg-white px-3 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10",
              localError ? "border-red-300" : "border-border",
            )}
          />
          {localError ? (
            <span className="mt-1 block text-xs font-semibold leading-relaxed text-red-600">
              {localError}
            </span>
          ) : null}
        </div>
        <span className="flex h-4 items-center justify-center text-sm font-extrabold text-muted-foreground sm:h-11">
          @
        </span>
        <div ref={domainRef} className={cn("relative min-w-0", domainOpen && "z-[120]")}>
          <div
            className={cn(
              "flex h-11 min-w-0 overflow-hidden rounded-xl border bg-white transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10",
              domainError ? "border-red-300" : "border-border",
            )}
          >
            {showCustomDomain ? (
              <input
                type="text"
                autoComplete="off"
                value={domainValue}
                placeholder={copy.emailDomainPlaceholder}
                onChange={(event) =>
                  onDomainChange(event.target.value.replace(/@/g, "").trim())
                }
                className="min-w-0 flex-1 bg-white px-3 text-sm font-semibold text-foreground outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => setDomainOpen((current) => !current)}
                className="min-w-0 flex-1 truncate px-3 text-left text-sm font-semibold text-foreground outline-none"
              >
                {domainValue}
              </button>
            )}
            <button
              type="button"
              onClick={() => setDomainOpen((current) => !current)}
              className="flex h-full w-10 shrink-0 items-center justify-center border-l border-border bg-[#FCFCFB] text-muted-foreground transition hover:text-primary"
              aria-label={copy.emailDomainCustom}
            >
              <ChevronDown
                className={cn("h-4 w-4 transition", domainOpen && "rotate-180 text-primary")}
                aria-hidden
              />
            </button>
          </div>
          {domainError ? (
            <span className="mt-1 block text-xs font-semibold leading-relaxed text-red-600">
              {domainError}
            </span>
          ) : null}
          {domainOpen ? (
            <div className="absolute left-0 right-0 top-12 z-[130] max-h-56 overflow-auto rounded-xl border border-border bg-white p-1 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  onDomainChange("");
                  setDomainOpen(false);
                }}
                className={cn(
                  "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-semibold transition hover:bg-[#FFF8F1] hover:text-primary",
                  showCustomDomain ? "bg-[#FFF3E6] text-primary" : "text-foreground",
                )}
              >
                {copy.emailDomainCustom}
              </button>
              {domainOptions.map((domain) => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => {
                    onDomainChange(domain);
                    setDomainOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-semibold transition hover:bg-[#FFF8F1] hover:text-primary",
                    domainValue === domain ? "bg-[#FFF3E6] text-primary" : "text-foreground",
                  )}
                >
                  {domain}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </fieldset>
  );
}

function PhoneSplitField({
  locale,
  label,
  countryCode,
  customCountryCode,
  phoneNumber,
  onChange,
  required = false,
  requirement,
  countryCodeError,
  phoneError,
}: {
  locale: Locale;
  label: string;
  countryCode: string;
  customCountryCode: string;
  phoneNumber: string;
  onChange: (
    patch: Partial<
      Pick<LandlordDraft, "phoneCountryCode" | "phoneCountryCodeCustom" | "phoneNumber">
    >,
  ) => void;
  required?: boolean;
  requirement?: FieldRequirement;
  countryCodeError?: string;
  phoneError?: string;
}) {
  const copy = LANDLORD_CONTACT_COPY[locale];
  const validationCopy = LANDLORD_VALIDATION_COPY[locale];
  const countryCodeOptions = copy.countryCodes;
  const [phoneInputError, setPhoneInputError] = useState("");
  const [countryCodeOpen, setCountryCodeOpen] = useState(false);
  const countryCodeRef = useRef<HTMLDivElement>(null);
  const isKnownCountryCode = countryCodeOptions.some((option) => option.value === countryCode);
  const selectedCountryCode = isKnownCountryCode
    ? countryCode
    : countryCode
      ? CUSTOM_SELECT_VALUE
      : "";
  const showCustomCountryCode = selectedCountryCode === CUSTOM_SELECT_VALUE;
  const selectedCountryCodeLabel =
    countryCodeOptions.find((option) => option.value === selectedCountryCode)?.label ||
    LANDLORD_FORM_COPY[locale].select;
  const visiblePhoneError = phoneInputError || phoneError;

  useEffect(() => {
    if (!countryCodeOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!countryCodeRef.current?.contains(event.target as Node)) {
        setCountryCodeOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCountryCodeOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [countryCodeOpen]);

  return (
    <fieldset className="min-w-0 sm:col-span-2">
      <LabelText locale={locale} label={label} required={required} requirement={requirement} />
      <div className="mt-2 grid gap-2 sm:grid-cols-[minmax(170px,0.55fr)_minmax(0,1fr)] sm:items-start">
        <div
          ref={countryCodeRef}
          className={cn("relative min-w-0", countryCodeOpen && "z-[120]")}
        >
          <div
            className={cn(
              "flex h-11 min-w-0 overflow-hidden rounded-xl border bg-white transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10",
              countryCodeError ? "border-red-300" : "border-border",
            )}
          >
            {showCustomCountryCode ? (
              <input
                type="text"
                inputMode="tel"
                autoComplete="off"
                value={customCountryCode}
                placeholder={copy.customCountryCodePlaceholder}
                onChange={(event) =>
                  onChange({
                    phoneCountryCode: CUSTOM_SELECT_VALUE,
                    phoneCountryCodeCustom: event.target.value.trim(),
                  })
                }
                className="min-w-0 flex-1 bg-white px-3 text-sm font-semibold text-foreground outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => setCountryCodeOpen((current) => !current)}
                className={cn(
                  "min-w-0 flex-1 truncate px-3 text-left text-sm font-semibold outline-none",
                  selectedCountryCode ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {selectedCountryCode ? selectedCountryCodeLabel : LANDLORD_FORM_COPY[locale].select}
              </button>
            )}
            <button
              type="button"
              onClick={() => setCountryCodeOpen((current) => !current)}
              className="flex h-full w-10 shrink-0 items-center justify-center border-l border-border bg-[#FCFCFB] text-muted-foreground transition hover:text-primary"
              aria-label={selectedCountryCodeLabel}
            >
              <ChevronDown
                className={cn("h-4 w-4 transition", countryCodeOpen && "rotate-180 text-primary")}
                aria-hidden
              />
            </button>
          </div>
          {countryCodeError ? (
            <span className="mt-1 block text-xs font-semibold leading-relaxed text-red-600">
              {countryCodeError}
            </span>
          ) : null}
          {countryCodeOpen ? (
            <div className="absolute left-0 right-0 top-12 z-[130] max-h-60 overflow-auto rounded-xl border border-border bg-white p-1 shadow-xl">
              {countryCodeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange({
                      phoneCountryCode: option.value,
                      phoneCountryCodeCustom:
                        option.value === CUSTOM_SELECT_VALUE ? customCountryCode : "",
                    });
                    setCountryCodeOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-semibold transition hover:bg-[#FFF8F1] hover:text-primary",
                    selectedCountryCode === option.value
                      ? "bg-[#FFF3E6] text-primary"
                      : "text-foreground",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="min-w-0">
          <input
            type="text"
            inputMode="tel"
            autoComplete="off"
            value={phoneNumber}
            placeholder={copy.phoneNumberPlaceholder}
            onChange={(event) => {
              const nextValue = event.target.value;
              const digitsOnly = normalizePhoneNumber(nextValue);
              setPhoneInputError(nextValue === digitsOnly ? "" : validationCopy.numbersOnly);
              onChange({ phoneNumber: digitsOnly });
            }}
            className={cn(
              "h-11 w-full min-w-0 rounded-xl border bg-white px-3 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10",
              visiblePhoneError ? "border-red-300" : "border-border",
            )}
          />
          {visiblePhoneError ? (
            <span className="mt-1 block text-xs font-semibold leading-relaxed text-red-600">
              {visiblePhoneError}
            </span>
          ) : null}
        </div>
      </div>
    </fieldset>
  );
}

function CurrencyField({
  locale,
  label,
  value,
  onChange,
  requirement,
  error,
}: {
  locale: Locale;
  label: string;
  value: string;
  onChange: (value: string) => void;
  requirement?: FieldRequirement;
  error?: string;
}) {
  return (
    <label className="block w-full min-w-0 max-w-[260px]">
      <LabelText locale={locale} label={label} requirement={requirement} />
      <div
        className={cn(
          "mt-2 flex h-11 overflow-hidden rounded-xl border bg-white transition focus-within:border-primary",
          error ? "border-red-300" : "border-border",
        )}
      >
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(event) => {
            const nextValue = event.target.value;
            onChange(isValidCurrencyInput(nextValue) ? normalizeCurrencyInput(nextValue) : nextValue);
          }}
          className="min-w-0 flex-1 bg-white px-3 text-right text-sm font-semibold text-foreground outline-none"
        />
        <span className="inline-flex items-center border-l border-border bg-[#FCFCFB] px-3 text-sm font-extrabold text-muted-foreground">
          $
        </span>
      </div>
      {error ? (
        <span className="mt-1 block text-xs font-semibold leading-relaxed text-red-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function SuffixNumberField({
  locale,
  label,
  value,
  suffix,
  onChange,
  requirement,
  error,
}: {
  locale: Locale;
  label: string;
  value: string;
  suffix: string;
  onChange: (value: string) => void;
  requirement?: FieldRequirement;
  error?: string;
}) {
  return (
    <label className="block w-full min-w-0 max-w-[260px]">
      <LabelText locale={locale} label={label} requirement={requirement} />
      <div
        className={cn(
          "mt-2 flex h-11 overflow-hidden rounded-xl border bg-white transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10",
          error ? "border-red-300" : "border-border",
        )}
      >
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-white px-3 text-right text-sm font-semibold text-foreground outline-none"
        />
        <span className="inline-flex items-center border-l border-border bg-[#FCFCFB] px-3 text-sm font-extrabold text-muted-foreground">
          {suffix}
        </span>
      </div>
      {error ? (
        <span className="mt-1 block text-xs font-semibold leading-relaxed text-red-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function TextareaField({
  locale,
  label,
  value,
  onChange,
  requirement,
}: {
  locale: Locale;
  label: string;
  value: string;
  onChange: (value: string) => void;
  requirement?: FieldRequirement;
}) {
  return (
    <label className="block min-w-0">
      <LabelText locale={locale} label={label} requirement={requirement} />
      <textarea
        rows={4}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold leading-relaxed text-foreground outline-none transition focus:border-primary"
      />
    </label>
  );
}

function LabelText({
  locale,
  label,
  required,
  requirement,
  tooltip,
}: {
  locale: Locale;
  label: string;
  required?: boolean;
  requirement?: FieldRequirement;
  tooltip?: string;
}) {
  const resolvedRequirement = requirement ?? (required ? "required" : undefined);

  return (
    <span className="flex min-h-5 min-w-0 items-center gap-1.5 text-sm font-bold text-foreground">
      <span className="min-w-0">{label}</span>
      {resolvedRequirement ? (
        <span className="shrink-0 whitespace-nowrap text-xs font-extrabold text-primary">
          ({LANDLORD_REQUIREMENT_COPY[locale][resolvedRequirement]})
        </span>
      ) : null}
      {tooltip ? (
        <span className="group relative inline-flex shrink-0">
          <span
            className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition group-hover:border-primary group-hover:text-primary"
            aria-label={tooltip}
          >
            <HelpCircle className="h-3.5 w-3.5" aria-hidden />
          </span>
          <span className="pointer-events-none absolute left-1/2 top-7 z-[130] hidden w-64 -translate-x-1/2 rounded-xl border border-border bg-white p-3 text-xs font-semibold leading-relaxed text-muted-foreground shadow-lg group-hover:block group-focus-within:block">
            {tooltip}
          </span>
        </span>
      ) : null}
    </span>
  );
}

function SelectField({
  locale,
  label,
  value,
  options,
  onChange,
  placeholder = "Select",
  tooltip,
  required = false,
  requirement,
}: {
  locale: Locale;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  tooltip?: string;
  required?: boolean;
  requirement?: FieldRequirement;
}) {
  return (
    <label className="block min-w-0">
      <LabelText
        locale={locale}
        label={label}
        required={required}
        requirement={requirement}
        tooltip={tooltip}
      />
      <span className="relative mt-2 block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-border bg-white px-3 pr-12 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
      </span>
    </label>
  );
}

function SearchableStationField({
  label,
  locale,
  city,
  value,
  onChange,
  requirement,
  error,
}: {
  label: string;
  locale: Locale;
  city: string;
  value: string;
  onChange: (value: string) => void;
  requirement?: FieldRequirement;
  error?: string;
}) {
  const cityKey = getLandlordCityKey(locale, city);
  const stationCopy = LANDLORD_STATION_COPY[locale];
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const options = getRapidTransitStationsForCity(cityKey);
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const placeholder = cityKey
    ? stationCopy.placeholders[cityKey]
    : stationCopy.genericPlaceholder;

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className={cn("relative min-w-0", open && "z-[120]")}>
      <LabelText locale={locale} label={label} requirement={requirement} />
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "mt-2 flex h-11 w-full items-center justify-between gap-2 rounded-xl border bg-white px-3 text-left text-sm font-semibold text-foreground outline-none transition hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10",
          error ? "border-red-300" : "border-border",
        )}
      >
        <span className={cn("min-w-0 truncate", !value && "text-muted-foreground")}>
          {value || placeholder}
        </span>
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      </button>
      {error ? (
        <span className="mt-1 block text-xs font-semibold leading-relaxed text-red-600">
          {error}
        </span>
      ) : null}
      {open ? (
        <div className="absolute z-[130] mt-2 w-full rounded-2xl border border-border bg-white p-3 shadow-lg">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={stationCopy.searchPlaceholder}
            className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm font-semibold outline-none transition focus:border-primary"
          />
          <div className="mt-2 max-h-64 overflow-y-auto pr-1">
            {filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                  setQuery("");
                }}
                className={cn(
                  "block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition",
                  value === option
                    ? "bg-[#FFF3E6] text-primary"
                    : "text-foreground hover:bg-[#FFF8F1]",
                )}
              >
                {option}
              </button>
            ))}
            {!filteredOptions.length ? (
              <p className="px-3 py-2 text-sm font-semibold text-muted-foreground">
                {placeholder}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function OptionCardField({
  locale,
  label,
  value,
  options,
  onChange,
  compact = false,
  required = false,
  requirement,
}: {
  locale: Locale;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  compact?: boolean;
  required?: boolean;
  requirement?: FieldRequirement;
}) {
  return (
    <fieldset className="min-w-0">
      <legend>
        <LabelText
          locale={locale}
          label={label}
          required={required}
          requirement={requirement}
        />
      </legend>
      <div className={cn("mt-2 grid gap-2", compact ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={cn(
                "relative min-h-12 rounded-2xl border px-4 py-3 pr-10 text-left text-sm font-extrabold leading-snug transition",
                selected
                  ? "border-primary bg-[#FFF3E6] text-primary shadow-sm"
                  : "border-border bg-white text-foreground hover:border-primary/40 hover:bg-[#FFF8F1]",
              )}
            >
              {selected ? (
                <CheckCircle
                  className="absolute right-3 top-3 h-4 w-4 text-primary"
                  aria-hidden
                />
              ) : null}
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function ChipChoiceField({
  locale,
  label,
  value,
  options,
  onChange,
  compact = false,
  tooltip,
  requirement,
}: {
  locale: Locale;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  compact?: boolean;
  tooltip?: string;
  requirement?: FieldRequirement;
}) {
  return (
    <fieldset className="min-w-0">
      <legend>
        <LabelText
          locale={locale}
          label={label}
          requirement={requirement}
          tooltip={tooltip}
        />
      </legend>
      <div className={cn("mt-2 flex flex-wrap gap-2", compact ? "gap-1.5" : "gap-2")}>
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={cn(
                "inline-flex items-center justify-center rounded-full border text-sm font-bold transition",
                compact ? "px-3 py-1.5" : "px-4 py-2",
                selected
                  ? "border-primary bg-[#FFF3E6] text-primary"
                  : "border-border bg-white text-foreground hover:border-primary/40 hover:text-primary",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function UtilityMatrix({
  locale,
  draft,
  onChange,
}: {
  locale: Locale;
  draft: LandlordDraft;
  onChange: (
    utilityStatuses: Record<string, string>,
    utilitiesIncluded: string[],
    utilitiesSeparate: string[],
  ) => void;
}) {
  const r = LANDLORD_REFINEMENTS[locale];
  const statusKeys = ["included", "separate", "confirm"];

  const currentStatus = (utility: string) => {
    if (draft.utilityStatuses?.[utility]) {
      return draft.utilityStatuses[utility];
    }
    if (draft.utilitiesIncluded.includes(utility)) {
      return "included";
    }
    if (draft.utilitiesSeparate.includes(utility)) {
      return "separate";
    }
    return "";
  };

  const updateStatus = (utility: string, status: string) => {
    const nextStatuses = { ...draft.utilityStatuses, [utility]: status };
    const included = r.options.utilities.filter((item) =>
      item === utility ? status === "included" : currentStatus(item) === "included",
    );
    const separate = r.options.utilities.filter((item) =>
      item === utility ? status === "separate" : currentStatus(item) === "separate",
    );
    onChange(nextStatuses, included, separate);
  };

  return (
    <div className="min-w-0 rounded-2xl border border-border/80 bg-[#FCFCFB] p-4">
      <div className="grid gap-2">
        {r.options.utilities.map((utility) => (
          <div
            key={utility}
            className="grid gap-2 rounded-2xl border border-border/70 bg-white p-3 lg:grid-cols-[0.35fr_0.65fr] lg:items-center"
          >
            <span className="text-sm font-extrabold text-foreground">{utility}</span>
            <div className="flex flex-wrap gap-1.5">
              {statusKeys.map((statusKey, index) => {
                const selected = currentStatus(utility) === statusKey;
                return (
                  <button
                    key={statusKey}
                    type="button"
                    onClick={() => updateStatus(utility, statusKey)}
                    className={cn(
                      "inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-xs font-extrabold transition",
                      selected
                        ? "border-primary bg-[#FFF3E6] text-primary"
                        : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-primary",
                    )}
                  >
                    {r.options.utilityStatus[index]}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MultiChipField({
  locale,
  label,
  options,
  values,
  onChange,
  requirement,
}: {
  locale: Locale;
  label: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
  requirement?: FieldRequirement;
}) {
  const toggle = (option: string) => {
    if (values.includes(option)) {
      onChange(values.filter((value) => value !== option));
      return;
    }
    onChange([...values, option]);
  };

  return (
    <fieldset className="min-w-0">
      <legend>
        <LabelText locale={locale} label={label} requirement={requirement} />
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={cn(
                "inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-sm font-bold transition",
                selected
                  ? "border-primary bg-[#FFF3E6] text-primary"
                  : "border-border bg-white text-foreground hover:border-primary/40 hover:text-primary",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function PhotoUploadField({
  locale,
  photos,
  coverPhotoId,
  onChange,
  requirement,
}: {
  locale: Locale;
  photos: LandlordPhoto[];
  coverPhotoId: string;
  onChange: (photos: LandlordPhoto[], coverPhotoId: string) => void;
  requirement?: FieldRequirement;
}) {
  const r = LANDLORD_REFINEMENTS[locale];

  const addFiles = (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    const remainingSlots = Math.max(0, 20 - photos.length);
    const selectedFiles = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, remainingSlots);

    if (!selectedFiles.length) {
      return;
    }

    Promise.all(
      selectedFiles.map(
        (file) =>
          new Promise<LandlordPhoto>((resolve) => {
            const reader = new FileReader();
            const id = `${Date.now()}-${file.name}-${Math.random().toString(36).slice(2)}`;
            reader.onload = () =>
              resolve({
                id,
                name: file.name,
                dataUrl: typeof reader.result === "string" ? reader.result : undefined,
              });
            reader.onerror = () => resolve({ id, name: file.name });
            reader.readAsDataURL(file);
          }),
      ),
    ).then((newPhotos) => {
      const nextPhotos = [...photos, ...newPhotos].slice(0, 20);
      onChange(nextPhotos, coverPhotoId || nextPhotos[0]?.id || "");
    });
  };

  const removePhoto = (photoId: string) => {
    const nextPhotos = photos.filter((photo) => photo.id !== photoId);
    const nextCoverPhotoId =
      coverPhotoId === photoId ? nextPhotos[0]?.id || "" : coverPhotoId;
    onChange(nextPhotos, nextCoverPhotoId);
  };

  return (
    <div className="min-w-0">
      <div className="rounded-2xl border border-dashed border-primary/30 bg-white p-5 text-center">
        <ImagePlus className="mx-auto h-8 w-8 text-primary" aria-hidden />
        <h3 className="mt-3 flex justify-center">
          <LabelText
            locale={locale}
            label={r.helpers.photosTitle}
            requirement={requirement}
          />
        </h3>
        <p className="mx-auto mt-1 max-w-xl text-sm font-semibold leading-relaxed text-muted-foreground">
          {r.helpers.photosHelper}
        </p>
        <label className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-2xl bg-primary px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-primary/90">
          {r.helpers.uploadCta}
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
        {photos.length >= 20 ? (
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            {r.helpers.maxNotice}
          </p>
        ) : null}
      </div>

      {photos.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {photos.map((photo) => {
            const isCover = photo.id === coverPhotoId;
            return (
              <article
                key={photo.id}
                className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
              >
                <div className="relative h-28 bg-[#F8F7F4]">
                  {photo.dataUrl ? (
                    <img
                      src={photo.dataUrl}
                      alt={photo.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-3 text-center text-xs font-bold text-muted-foreground">
                      {photo.name}
                    </div>
                  )}
                  {isCover ? (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-[11px] font-extrabold text-white">
                      <Star className="h-3 w-3" aria-hidden />
                      {r.helpers.coverLabel}
                    </span>
                  ) : null}
                </div>
                <div className="space-y-2 p-3">
                  <p className="truncate text-xs font-bold text-foreground">{photo.name}</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onChange(photos, photo.id)}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-primary/25 px-2.5 py-1 text-xs font-extrabold text-primary transition hover:bg-[#FFF8F1]"
                    >
                      {r.helpers.setCover}
                    </button>
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full border border-border px-2.5 py-1 text-xs font-extrabold text-muted-foreground transition hover:border-primary/30 hover:text-primary"
                    >
                      <X className="h-3 w-3" aria-hidden />
                      {r.helpers.remove}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function PreviewMetric({
  label,
  value,
  empty,
}: {
  label: string;
  value: string;
  empty: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-extrabold text-foreground">{value || empty}</p>
    </div>
  );
}

function DraftSummaryCard({
  title,
  rows,
  empty,
  editHref,
  editLabel,
}: {
  title: string;
  rows: Array<[string, string]>;
  empty: string;
  editHref?: string;
  editLabel?: string;
}) {
  const markerMatch = title.match(/^([A-E])\.\s*(.+)$/);
  const marker = markerMatch?.[1];
  const titleText = markerMatch?.[2] ?? title;

  return (
    <article className="overflow-hidden rounded-2xl border border-primary/15 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-primary/10 bg-[#FFF3E6] px-4 py-3">
        <h2 className="flex min-w-0 items-center gap-2 text-sm font-extrabold text-foreground">
          {marker ? (
            <span className="inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-primary px-2 text-xs font-extrabold text-white">
              {marker}
            </span>
          ) : null}
          <span className="min-w-0">{titleText}</span>
        </h2>
        {editHref && editLabel ? (
          <Link
            to={editHref}
            className="shrink-0 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-extrabold text-primary transition hover:bg-[#FFF8F1]"
          >
            {editLabel}
          </Link>
        ) : null}
      </div>
      <dl className="space-y-2 bg-white p-4">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 text-sm sm:grid-cols-[0.42fr_0.58fr]">
            <dt className="font-bold text-muted-foreground">{label}</dt>
            <dd className="min-w-0 font-semibold text-foreground">{value || empty}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function formatCurrencyValue(value: string) {
  if (!value) {
    return "";
  }
  const normalized = normalizeCurrencyInput(value);
  return /^\d+$/.test(normalized)
    ? `$${Number(normalized).toLocaleString("en-CA")} CAD`
    : value;
}

function normalizeCurrencyInput(value: string) {
  return value === "" ? "" : value.replace(/,/g, "");
}

function isValidCurrencyInput(value: string) {
  if (value === "") {
    return true;
  }
  return /^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(value);
}

function isValidRequiredCurrencyInput(value: string) {
  return value.trim() !== "" && isValidCurrencyInput(value);
}

function validateEmailLocal(value: string) {
  return /^[A-Za-z0-9._%+-]+$/.test(value);
}

function validateEmailDomain(value: string) {
  if (!/^[A-Za-z0-9.-]+$/.test(value) || value.includes("@")) {
    return false;
  }

  const labels = value.split(".");
  if (labels.length < 2 || labels.some((label) => label.length === 0)) {
    return false;
  }

  return /^[A-Za-z]{2,}$/.test(labels[labels.length - 1]);
}

function normalizePhoneNumber(value: string) {
  return value.replace(/\D/g, "");
}

function hasValidPhoneCharacters(value: string) {
  return /^\d*$/.test(value);
}

function validatePhoneNumber(value: string) {
  if (!hasValidPhoneCharacters(value)) {
    return false;
  }
  const digits = normalizePhoneNumber(value);
  return digits.length >= 7 && digits.length <= 15;
}

function validateCountryCode(value: string) {
  return /^\+\d{1,4}$/.test(value);
}

function isValidDigitsOnlyInput(value: string) {
  return value === "" || /^\d+$/.test(value);
}

function getLandlordCityKey(locale: Locale, city: string): LandlordCityKey | null {
  const cityOptions = LANDLORD_FORM_COPY[locale].cityOptions;
  const index = cityOptions.indexOf(city);

  if (index === 0) {
    return "toronto";
  }
  if (index === 1) {
    return "vancouver";
  }
  if (index === 2) {
    return "calgary";
  }

  return null;
}

function getRapidTransitStationsForCity(cityKey: LandlordCityKey | null) {
  if (cityKey === "vancouver") {
    return VANCOUVER_SKYTRAIN_STATIONS;
  }
  if (cityKey === "calgary") {
    return CALGARY_CTRAIN_STATIONS;
  }
  if (cityKey === "toronto") {
    return TORONTO_TTC_STATIONS;
  }
  return [];
}

function isValidStationForCity(locale: Locale, city: string, station: string) {
  if (!station.trim()) {
    return false;
  }
  return getRapidTransitStationsForCity(getLandlordCityKey(locale, city)).includes(station);
}

function getRapidTransitSystemName(cityKey: LandlordCityKey | null) {
  if (cityKey === "vancouver") {
    return "SkyTrain";
  }
  if (cityKey === "calgary") {
    return "CTrain";
  }
  if (cityKey === "toronto") {
    return "TTC";
  }
  return "";
}

function formatStationSummary(locale: Locale, city: string, station: string) {
  if (!station) {
    return "";
  }

  const cityKey = getLandlordCityKey(locale, city);
  const systemName = getRapidTransitSystemName(cityKey);
  return systemName ? `${city} · ${systemName} · ${station}` : station;
}

function getUnitDetailOptions(locale: Locale, housingType: string) {
  const form = LANDLORD_FORM_COPY[locale];
  if (housingType === form.housingTypes[0]) {
    return form.unitDetailHouse;
  }
  if (housingType === form.housingTypes[1]) {
    return form.unitDetailCondo;
  }
  if (housingType === form.housingTypes[2]) {
    return form.unitDetailStudio;
  }
  return [...form.unitDetailHouse, ...form.unitDetailCondo, ...form.unitDetailStudio].filter(
    (option, index, options) => options.indexOf(option) === index,
  );
}

function getUtilitySummaryRows(locale: Locale, draft: LandlordDraft): Array<[string, string]> {
  const r = LANDLORD_REFINEMENTS[locale];
  const statusLabels: Record<string, string> = {
    included: r.options.utilityStatus[0],
    separate: r.options.utilityStatus[1],
    confirm: r.options.utilityStatus[2],
  };

  return r.options.utilities.map((utility) => {
    const status =
      draft.utilityStatuses?.[utility] ||
      (draft.utilitiesIncluded.includes(utility)
        ? "included"
        : draft.utilitiesSeparate.includes(utility)
          ? "separate"
          : "");

    return [utility, status ? statusLabels[status] : ""];
  });
}

function joinValues(values: string[]) {
  return values.filter(Boolean).join(", ");
}

function LandlordNotice({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.25rem] border border-primary/15 bg-[#FFF8F1] p-4 text-sm font-semibold leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

function LandlordBreadcrumb({
  locale,
  page,
  registrationBase = "public",
}: {
  locale: Locale;
  page: LandlordRoutePage;
  registrationBase?: LandlordRegistrationRouteBase;
}) {
  const t = CONTENT[locale];
  const centerRegisterCopy = LANDLORD_CENTER_REGISTER_COPY[locale];

  if (page !== "landing" && page !== "guide" && registrationBase === "center") {
    const items = [
      { label: t.homeLabel, to: `/${locale}` },
      {
        label: centerRegisterCopy.centerLabel,
        to: landlordRoute(locale, "landing", "center"),
      },
      page === "register"
        ? { label: centerRegisterCopy.registrationLabel, to: undefined }
        : {
            label: centerRegisterCopy.registrationLabel,
            to: landlordRoute(locale, "register", "center"),
          },
    ];

    if (page !== "register") {
      items.push({ label: t.routeLabels[page], to: undefined });
    }

    return <PageBreadcrumb items={items} />;
  }

  const items = [
    { label: t.homeLabel, to: `/${locale}` },
    { label: t.landlordsLabel, to: page === "landing" ? undefined : landlordRoute(locale, "landing") },
  ];

  if (page === "guide") {
    items.push({ label: t.guideLabel, to: undefined });
  }

  if (page !== "landing" && page !== "guide") {
    items.push({ label: t.routeLabels[page], to: undefined });
  }

  return <PageBreadcrumb items={items} />;
}

function useLandlordDraft() {
  const [draft, setDraft] = useState<LandlordDraft>(DEFAULT_DRAFT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const savedDraft = window.sessionStorage.getItem(LANDLORD_DRAFT_KEY);
      if (savedDraft) {
        setDraft(normalizeLandlordDraft(JSON.parse(savedDraft)));
      }
    } catch {
      setDraft(DEFAULT_DRAFT);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded || typeof window === "undefined") {
      return;
    }

    writeLandlordDraftStorage(draft);
  }, [draft, loaded]);

  const updateDraft = useMemo(
    () => (patch: Partial<LandlordDraft>) => {
      setDraft((current) => ({ ...current, ...patch }));
    },
    [],
  );

  const clearDraft = () => {
    setDraft(DEFAULT_DRAFT);
    clearLandlordDraftStorage();
  };

  return { draft, loaded, updateDraft, clearDraft };
}

function isDraftStarted(draft: LandlordDraft) {
  return Boolean(
    draft.role ||
      draft.name ||
      draft.firstName ||
      draft.lastName ||
      draft.email ||
      draft.emailLocal ||
      draft.emailDomain ||
      draft.contact ||
      draft.phoneCountryCode ||
      draft.phoneCountryCodeCustom ||
      draft.phoneNumber ||
      draft.preferredLanguages.length ||
      draft.preferredContactMethods.length ||
      draft.shortMessage ||
      draft.city ||
      draft.area ||
      draft.nearestStation ||
      draft.address ||
      draft.housingType ||
      draft.unitDetail ||
      draft.floor ||
      draft.useType ||
      draft.residentCondition ||
      draft.furnished ||
      draft.elevator ||
      draft.parking ||
      draft.tenantPetsAllowed ||
      draft.homePets ||
      draft.homePetType ||
      draft.smokingCondition ||
      draft.photos.length ||
      draft.listingTitle ||
      draft.monthlyRent ||
      draft.availableFrom ||
      draft.minimumStay ||
      draft.occupancy ||
      draft.bathroom ||
      draft.kitchen ||
      draft.furniture.length ||
      draft.bedSize ||
      draft.keyDepositAmount ||
      draft.utilitiesIncluded.length ||
      draft.utilitiesSeparate.length ||
      Object.keys(draft.utilityStatuses).length ||
      draft.houseRuleItems.length ||
      draft.additionalNote ||
      draft.moveInQuestions,
  );
}

function normalizeLandlordDraft(rawDraft: Partial<LandlordDraft>): LandlordDraft {
  const draft = { ...DEFAULT_DRAFT, ...rawDraft };
  const parsedEmail = parseLegacyEmail(draft.email);
  const parsedPhone = parseLegacyPhone(draft.contact);
  const phoneCountryCode =
    draft.phoneCountryCode ||
    parsedPhone.phoneCountryCode ||
    "";
  const phoneNumber = draft.phoneNumber || parsedPhone.phoneNumber || "";
  return {
    ...draft,
    firstName: draft.firstName || "",
    lastName: draft.lastName || "",
    emailLocal: draft.emailLocal || parsedEmail.emailLocal || "",
    emailDomain: draft.emailDomain || parsedEmail.emailDomain || "",
    phoneCountryCode,
    phoneCountryCodeCustom:
      draft.phoneCountryCodeCustom ||
      (phoneCountryCode === CUSTOM_SELECT_VALUE ? parsedPhone.phoneCountryCodeCustom : "") ||
      "",
    phoneNumber,
    preferredLanguages: Array.isArray(draft.preferredLanguages)
      ? draft.preferredLanguages
      : draft.preferredLanguage
        ? [draft.preferredLanguage]
        : [],
    preferredContactMethods: Array.isArray(draft.preferredContactMethods)
      ? draft.preferredContactMethods
      : draft.communicationMethod
        ? [draft.communicationMethod]
        : [],
    furniture: Array.isArray(draft.furniture) ? draft.furniture : [],
    utilitiesIncluded: Array.isArray(draft.utilitiesIncluded) ? draft.utilitiesIncluded : [],
    utilitiesSeparate: Array.isArray(draft.utilitiesSeparate) ? draft.utilitiesSeparate : [],
    utilityStatuses:
      draft.utilityStatuses && typeof draft.utilityStatuses === "object"
        ? draft.utilityStatuses
        : {},
    photos: Array.isArray(draft.photos) ? draft.photos : [],
    coverPhotoId: draft.coverPhotoId || (Array.isArray(draft.photos) ? draft.photos[0]?.id || "" : ""),
    houseRuleItems: Array.isArray(draft.houseRuleItems)
      ? draft.houseRuleItems
      : draft.houseRules
      ? [draft.houseRules]
      : [],
  };
}

function clearLandlordDraftStorage() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(LANDLORD_DRAFT_KEY);
}

function writeLandlordDraftStorage(draft: LandlordDraft) {
  if (typeof window === "undefined") {
    return;
  }

  if (!isDraftStarted(draft)) {
    clearLandlordDraftStorage();
    return;
  }

  window.sessionStorage.setItem(LANDLORD_DRAFT_KEY, JSON.stringify(draft));
}

function parseLegacyEmail(email?: string) {
  const value = email?.trim() || "";
  const atIndex = value.indexOf("@");

  if (atIndex <= 0 || atIndex === value.length - 1) {
    return { emailLocal: "", emailDomain: "" };
  }

  return {
    emailLocal: value.slice(0, atIndex),
    emailDomain: value.slice(atIndex + 1),
  };
}

function parseLegacyPhone(contact?: string) {
  const value = contact?.trim() || "";
  const match = value.match(/^(\+\d+)\s*(.+)$/);

  if (!match) {
    return {
      phoneCountryCode: "",
      phoneCountryCodeCustom: "",
      phoneNumber: value,
    };
  }

  const knownCodes = new Set(
    Object.values(LANDLORD_CONTACT_COPY).flatMap((copy) =>
      copy.countryCodes
        .map((option) => option.value)
        .filter((value) => value !== CUSTOM_SELECT_VALUE),
    ),
  );
  const parsedCountryCode = match[1];

  return {
    phoneCountryCode: knownCodes.has(parsedCountryCode)
      ? parsedCountryCode
      : CUSTOM_SELECT_VALUE,
    phoneCountryCodeCustom: knownCodes.has(parsedCountryCode) ? "" : parsedCountryCode,
    phoneNumber: match[2],
  };
}

function getResolvedPhoneCountryCode(draft: Pick<LandlordDraft, "phoneCountryCode" | "phoneCountryCodeCustom">) {
  if (draft.phoneCountryCode === CUSTOM_SELECT_VALUE) {
    return draft.phoneCountryCodeCustom.trim();
  }

  return draft.phoneCountryCode.trim();
}

function stepIndexForPage(page: Exclude<LandlordRoutePage, "landing" | "guide">) {
  const pages: Array<Exclude<LandlordRoutePage, "landing" | "guide">> = [
    "register",
    "property",
    "rooms",
    "preview",
  ];
  if (page === "terms") {
    return pages.indexOf("preview");
  }
  return Math.max(0, pages.indexOf(page));
}

function isLandlordRegistrationPath(pathname: string) {
  return /^\/(ko|en|fr)\/landlords\/(?:center\/)?register(\/(property|rooms|terms|preview))?\/?$/.test(
    pathname,
  );
}

function landlordRoute(
  locale: Locale,
  page: RouteKey,
  routeBase: LandlordRegistrationRouteBase = "public",
) {
  const base = `/${locale}/landlords`;
  const registerBase = routeBase === "center" ? `${base}/center/register` : `${base}/register`;

  switch (page) {
    case "landing":
      return routeBase === "center" ? `${base}/center` : base;
    case "guide":
      return `${base}/guide`;
    case "register":
      return registerBase;
    case "property":
      return `${registerBase}/property`;
    case "rooms":
      return `${registerBase}/rooms`;
    case "terms":
      return `${registerBase}/terms`;
    case "preview":
      return `${registerBase}/preview`;
  }
}
