import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Building2,
  Camera,
  CheckCircle,
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

type LandlordDraft = {
  role: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  preferredLanguage: string;
  preferredLanguages: string[];
  preferredContactMethods: string[];
  shortMessage: string;
  city: string;
  area: string;
  nearestStation: string;
  address: string;
  housingType: string;
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
  contact: "",
  preferredLanguage: "",
  preferredLanguages: [],
  preferredContactMethods: [],
  shortMessage: "",
  city: "Toronto",
  area: "",
  nearestStation: "",
  address: "",
  housingType: "",
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
      property: "공간 정보",
      rooms: "방·요금",
      terms: "조건",
      preview: "미리보기",
    },
    landing: {
      eyebrow: "LANDLORDS / HOUSING PROVIDERS",
      title: "임대인에게는 무료입니다",
      subtitle:
        "MapleHouse는 캐나다에서 출국 전 주거를 찾는 예비 입주자와 토론토의 임대인·주거 제공자를 연결합니다.",
      primaryCta: "매물 등록 시작하기",
      secondaryCta: "등록 안내 보기",
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
      labels: ["시작", "공간 정보", "방·요금", "조건", "미리보기"],
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
        title: "임대인 등록 문의를 시작합니다",
        description:
          "현재 화면은 등록 정보를 정리하는 미리보기 단계입니다. 입력한 정보는 브라우저 세션에만 저장됩니다.",
        helpTitle: "먼저 확인할 정보",
        helpBody:
          "임대인 유형, 연락 방식, 선호 언어를 정리하면 이후 매물 정보와 조건을 더 빠르게 입력할 수 있습니다.",
      },
      property: {
        title: "공간과 위치 정보를 입력하세요",
        description:
          "도시, 지역, 가까운 역, 주거 형태를 정리합니다. 민감한 출입 정보나 비밀번호는 입력하지 마세요.",
        addressHelper: "출입 코드, 비밀번호, 정확한 인수처처럼 민감한 정보는 입력하지 마세요.",
      },
      rooms: {
        title: "방, 월세, 입주 가능 정보를 정리하세요",
        description:
          "입주자가 비교할 수 있도록 제목, 월세, 최소 체류 기간, 방·욕실·주방 조건을 간단히 정리합니다.",
      },
      terms: {
        title: "보증금, 공과금, 규칙을 확인하세요",
        description:
          "실제 계약을 만들지 않습니다. 당사자가 확인해야 할 조건을 미리 정리하는 단계입니다.",
        notice:
          "실제 계약 전에는 월세, 마지막 달 월세 보증금, 키 보증금, 공과금 포함 여부, 입주 가능일을 당사자가 직접 확인해야 합니다.",
      },
      preview: {
        title: "등록 문의 미리보기",
        description:
          "MapleHouse가 검토할 수 있는 매물 정보 형태를 미리 확인합니다. 실제 제출이나 저장은 연결되어 있지 않습니다.",
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
      address: "주소 또는 교차로",
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
      property: "Property",
      rooms: "Room & rent",
      terms: "Terms",
      preview: "Preview",
    },
    landing: {
      eyebrow: "LANDLORDS / HOUSING PROVIDERS",
      title: "List with MapleHouse at no cost",
      subtitle:
        "Connect with tenants who are preparing their housing before arriving in Canada.",
      primaryCta: "Start listing inquiry",
      secondaryCta: "View listing guide",
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
      labels: ["Start", "Property", "Room & rent", "Terms", "Preview"],
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
        title: "Start a listing inquiry",
        description:
          "This screen organizes listing information for preview. Your draft stays in this browser session.",
        helpTitle: "What to prepare first",
        helpBody:
          "Role, contact method, and preferred language help structure the rest of the property and terms information.",
      },
      property: {
        title: "Add property and location basics",
        description:
          "Organize the city, area, nearest station, address reference, housing type, and key amenities.",
        addressHelper: "MVP preview only. Do not enter sensitive access codes.",
      },
      rooms: {
        title: "Add room, rent, and availability",
        description:
          "Help tenants compare the listing by entering title, rent, minimum stay, occupancy, bathroom, kitchen, and furniture details.",
      },
      terms: {
        title: "Confirm deposits, utilities, and notes",
        description:
          "This does not create a contract. It only organizes the terms that both parties should confirm later.",
        notice:
          "Before any agreement, the parties should directly confirm rent, last month's rent deposit, key deposit, utilities, and move-in date.",
      },
      preview: {
        title: "Listing inquiry preview",
        description:
          "Review the draft in the format MapleHouse may later use for operator review. Nothing is sent or stored outside this session.",
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
      address: "Address or intersection",
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
      property: "Logement",
      rooms: "Chambre & loyer",
      terms: "Conditions",
      preview: "Aperçu",
    },
    landing: {
      eyebrow: "PROPRIÉTAIRES / FOURNISSEURS DE LOGEMENT",
      title: "Publier avec MapleHouse sans frais",
      subtitle:
        "Mettez votre logement en relation avec des locataires qui préparent leur arrivée au Canada.",
      primaryCta: "Commencer une demande",
      secondaryCta: "Voir le guide",
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
      labels: ["Début", "Logement", "Chambre & loyer", "Conditions", "Aperçu"],
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
        title: "Commencer une demande d’annonce",
        description:
          "Cet écran organise les informations de l’annonce pour aperçu. Le brouillon reste dans cette session de navigateur.",
        helpTitle: "À préparer d’abord",
        helpBody:
          "Le rôle, la méthode de contact et la langue préférée aident à structurer les informations du logement.",
      },
      property: {
        title: "Ajouter les informations du logement",
        description:
          "Organisez la ville, le secteur, la station proche, l’adresse de référence, le type de logement et les équipements.",
        addressHelper: "Aperçu MVP seulement. N’entrez pas de codes d’accès sensibles.",
      },
      rooms: {
        title: "Ajouter la chambre, le loyer et la disponibilité",
        description:
          "Aidez les locataires à comparer avec un titre, un loyer, la durée minimale, les occupants, la salle de bain, la cuisine et les meubles.",
      },
      terms: {
        title: "Confirmer les dépôts, services et notes",
        description:
          "Cela ne crée pas de contrat. Cette étape organise seulement les conditions à confirmer entre les parties.",
        notice:
          "Avant tout accord, les parties doivent confirmer directement le loyer, le dépôt du dernier mois, le dépôt de clé, les services et la date d’arrivée.",
      },
      preview: {
        title: "Aperçu de la demande",
        description:
          "Vérifiez le brouillon sous une forme que MapleHouse pourra utiliser plus tard pour un examen. Rien n’est envoyé ni stocké hors de cette session.",
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
      address: "Adresse ou intersection",
      housingType: "Type de logement",
      useType: "Type d’usage",
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
      nearestStation: "가까운 TTC 역",
      address: "주소 또는 교차로",
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
      keyDepositAmount: "키 보증금",
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
      contact: "임대인 정보",
      property: "위치·공간",
      room: "방·월세",
      terms: "조건·공과금",
      rules: "사진·하우스 룰·확인 질문",
    },
    helpers: {
      startDescription: "매물 등록에 필요한 연락처, 선호 언어, 기본 메모를 먼저 정리합니다.",
      propertyDescription: "입주자가 위치와 생활 조건을 빠르게 판단할 수 있도록 공간 정보를 정리합니다.",
      roomsDescription: "월세, 입주 가능일, 최소 체류 기간, 방 조건을 비교하기 쉽게 입력합니다.",
      termsDescription: "계약 전에 서로 확인해야 할 비용, 공과금, 생활 규칙을 정리합니다.",
      previewDescription: "입력한 매물 정보를 실제 등록 전 검토 화면처럼 확인합니다.",
      requiredHelper: "역할, 성/이름 중 하나, 이메일 또는 연락처를 입력하면 다음 단계로 이동할 수 있습니다.",
      addressHelper: "출입 코드, 비밀번호, 정확한 유닛 출입 정보처럼 민감한 정보는 입력하지 마세요.",
      residentHelper: "룸렌트, 쉐어, 홈스테이처럼 함께 사는 경우에 특히 중요한 정보입니다.",
      stationPlaceholder: "가까운 TTC 역 선택",
      stationSearchPlaceholder: "역 이름 검색",
      stationNotClose: "TTC 역과 거리가 멉니다",
      stationNotSure: "아직 모르겠습니다",
      minimumStayTooltip: "협의가 불가능하거나 최소 기간이 길어질수록 매칭 확률이 줄어들 수 있어요.",
      lastMonthInfo:
        "마지막 달 보증금은 계약 전 입주자와 임대인이 직접 확인하는 항목입니다.",
      guideTermsBody:
        "월세, 마지막 달 보증금, 키 보증금, 공과금 포함 여부는 계약 전 당사자가 직접 확인해야 합니다. MapleHouse는 계약 당사자, 법률 자문, 중개 또는 결제 보증을 제공하지 않습니다.",
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
      startOver: "처음부터 다시",
    },
    options: {
      roles: ["임대인", "부동산/매니저", "홈스테이 제공자", "기타"],
      preferredContactMethods: ["이메일", "전화", "KakaoTalk", "WhatsApp", "기타"],
      preferredLanguages: ["한국어", "English", "Français", "상관없음"],
      cityOptions: [
        "Toronto",
        "North York",
        "Scarborough",
        "Etobicoke",
        "East York",
        "York",
        "Vaughan",
        "Mississauga",
        "Markham",
        "Richmond Hill",
        "Brampton",
        "Oakville",
        "기타",
      ],
      housingTypes: ["콘도", "아파트", "하우스", "타운하우스", "베이스먼트", "홈스테이", "룸렌트 / 쉐어", "코리빙", "기타"],
      useTypes: ["전체 유닛", "개인 방", "공유 방", "홈스테이형"],
      residentConditions: ["성별 무관", "여성 전용", "남성 전용", "협의 필요"],
      petAllowed: ["가능", "불가", "협의 필요"],
      homePets: ["없음", "있음", "확인 필요"],
      smoking: ["금연", "실외만 가능", "협의 필요"],
      yesNoConfirm: ["예", "아니오", "확인 필요"],
      minimumStay: ["6개월 이상", "1년 이상", "협의"],
      occupancy: ["1명", "2명", "협의"],
      bathroom: ["개인 욕실", "공용 욕실", "방 안 욕실", "협의"],
      kitchen: ["개인 주방", "공용 주방", "간이 주방", "없음/협의"],
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
      nearestStation: "Nearest TTC station",
      address: "Address or intersection",
      housingType: "Housing type",
      useType: "Use type",
      residentCondition: "Resident condition",
      furnished: "Furnished",
      elevator: "Elevator",
      parking: "Parking",
      laundry: "Laundry",
      tenantPetsAllowed: "Tenant pets allowed?",
      homePets: "Are there pets already living in the home?",
      homePetType: "Please describe the pet type",
      smokingCondition: "Smoking condition",
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
      pets: "D. Pet and allergy-related information",
      photos: "E. Listing photos",
      contact: "Contact",
      property: "Property",
      room: "Room & rent",
      terms: "Terms & utilities",
      rules: "Photos, rules & questions",
    },
    helpers: {
      startDescription: "Start by organizing contact details, preferred languages, and a short note.",
      propertyDescription: "Organize location and living-condition details so tenants can judge fit quickly.",
      roomsDescription: "Enter rent, availability, minimum stay, and room details in a comparison-friendly format.",
      termsDescription: "Organize costs, utilities, and house rules that both parties should confirm later.",
      previewDescription: "Review the listing information in a wider pre-submission preview.",
      requiredHelper: "Enter role, first or last name, and email or contact to continue.",
      addressHelper: "Do not enter access codes, passwords, or sensitive unit access details.",
      residentHelper: "Especially important for room rentals, shared housing, and homestay-style listings.",
      stationPlaceholder: "Select nearest TTC station",
      stationSearchPlaceholder: "Search station name",
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
      startOver: "Start over",
    },
    options: {
      roles: ["Landlord", "Property manager", "Homestay provider", "Other"],
      preferredContactMethods: ["Email", "Phone", "KakaoTalk", "WhatsApp", "Other"],
      preferredLanguages: ["Korean", "English", "Français", "No preference"],
      cityOptions: [
        "Toronto",
        "North York",
        "Scarborough",
        "Etobicoke",
        "East York",
        "York",
        "Vaughan",
        "Mississauga",
        "Markham",
        "Richmond Hill",
        "Brampton",
        "Oakville",
        "Other",
      ],
      housingTypes: ["Condo", "Apartment", "House", "Townhouse", "Basement", "Homestay", "Room rental / shared housing", "Co-living", "Other"],
      useTypes: ["Entire unit", "Private room", "Shared room", "Homestay-style"],
      residentConditions: ["No gender preference", "Female-only shared space", "Male-only shared space", "To discuss"],
      petAllowed: ["Allowed", "Not allowed", "To discuss"],
      homePets: ["No", "Yes", "To confirm"],
      smoking: ["Non-smoking", "Outdoor only", "To discuss"],
      yesNoConfirm: ["Yes", "No", "To confirm"],
      minimumStay: ["6+ months", "1+ year", "Flexible"],
      occupancy: ["1 person", "2 people", "Flexible"],
      bathroom: ["Private bathroom", "Shared bathroom", "Ensuite", "To confirm"],
      kitchen: ["Private kitchen", "Shared kitchen", "Kitchenette", "None/to confirm"],
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
      nearestStation: "Station TTC la plus proche",
      address: "Adresse ou intersection",
      housingType: "Type de logement",
      useType: "Type d’usage",
      residentCondition: "Condition de cohabitation",
      furnished: "Meublé",
      elevator: "Ascenseur",
      parking: "Stationnement",
      laundry: "Buanderie",
      tenantPetsAllowed: "Animaux du locataire acceptés ?",
      homePets: "Y a-t-il déjà des animaux dans le logement ?",
      homePetType: "Indiquez le type d’animal",
      smokingCondition: "Condition liée au tabac",
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
      pets: "D. Animaux et allergies",
      photos: "E. Photos de l’annonce",
      contact: "Contact",
      property: "Logement",
      room: "Chambre & loyer",
      terms: "Conditions & services",
      rules: "Photos, règles & questions",
    },
    helpers: {
      startDescription: "Commencez par les coordonnées, les langues préférées et une courte note.",
      propertyDescription: "Organisez l’emplacement et les conditions de vie pour aider le locataire à juger rapidement.",
      roomsDescription: "Indiquez le loyer, la disponibilité, la durée minimale et les détails de la chambre.",
      termsDescription: "Organisez les coûts, services et règles à confirmer entre les parties.",
      previewDescription: "Vérifiez les informations dans un aperçu plus large avant l’envoi.",
      requiredHelper: "Indiquez le rôle, un prénom ou nom, et un e-mail ou contact pour continuer.",
      addressHelper: "N’indiquez pas de codes d’accès, mots de passe ou informations sensibles d’accès.",
      residentHelper: "Particulièrement important pour les chambres, logements partagés et familles d’accueil.",
      stationPlaceholder: "Choisir la station TTC la plus proche",
      stationSearchPlaceholder: "Rechercher une station",
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
      startOver: "Recommencer",
    },
    options: {
      roles: ["Propriétaire", "Gestionnaire", "Fournisseur de famille d’accueil", "Autre"],
      preferredContactMethods: ["E-mail", "Téléphone", "KakaoTalk", "WhatsApp", "Autre"],
      preferredLanguages: ["Coréen", "Anglais", "Français", "Sans préférence"],
      cityOptions: [
        "Toronto",
        "North York",
        "Scarborough",
        "Etobicoke",
        "East York",
        "York",
        "Vaughan",
        "Mississauga",
        "Markham",
        "Richmond Hill",
        "Brampton",
        "Oakville",
        "Autre",
      ],
      housingTypes: ["Condo", "Appartement", "Maison", "Maison en rangée", "Sous-sol", "Famille d’accueil", "Chambre / logement partagé", "Coliving", "Autre"],
      useTypes: ["Logement entier", "Chambre privée", "Chambre partagée", "Style famille d’accueil"],
      residentConditions: ["Sans préférence", "Espace partagé réservé aux femmes", "Espace partagé réservé aux hommes", "À discuter"],
      petAllowed: ["Acceptés", "Non acceptés", "À discuter"],
      homePets: ["Non", "Oui", "À confirmer"],
      smoking: ["Non-fumeur", "Extérieur seulement", "À discuter"],
      yesNoConfirm: ["Oui", "Non", "À confirmer"],
      minimumStay: ["6 mois ou plus", "1 an ou plus", "Flexible"],
      occupancy: ["1 personne", "2 personnes", "Flexible"],
      bathroom: ["Salle de bain privée", "Salle de bain partagée", "Attenante", "À confirmer"],
      kitchen: ["Cuisine privée", "Cuisine partagée", "Kitchenette", "Aucune/à confirmer"],
      furniture: ["Lit", "Matelas", "Bureau", "Chaise", "Armoire", "Literie", "Lampe"],
      bedSize: ["Simple", "Double", "Queen", "À confirmer"],
      utilities: ["Électricité / hydro", "Chauffage", "Eau", "Gaz", "Internet", "Buanderie", "Stationnement"],
      utilityStatus: ["Inclus", "Payé séparément", "À confirmer"],
      houseRules: ["Non-fumeur", "Heures calmes", "Visiteurs à discuter", "Garder les espaces communs propres", "Pas de fêtes", "Pas de chaussures à l’intérieur", "Tri des déchets/recyclage", "Autre à discuter"],
    },
  },
};

const TTC_RAPID_TRANSIT_STATIONS = [
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

const BENEFIT_ICONS = [Building2, MessageSquareText, ClipboardList, ShieldCheck];

export function LocaleLandlordsPage({
  locale,
  page = "landing",
}: {
  locale: Locale;
  page?: LandlordRoutePage;
}) {
  if (page === "guide") {
    return <LandlordGuidePage locale={locale} />;
  }

  if (page !== "landing") {
    return <LandlordRegisterPage locale={locale} page={page} />;
  }

  return <LandlordLandingPage locale={locale} />;
}

function LandlordLandingPage({ locale }: { locale: Locale }) {
  const t = CONTENT[locale];
  const r = LANDLORD_REFINEMENTS[locale];

  return (
    <main className="bg-[#F8F7F4] [word-break:keep-all]">
      <Container className="py-8 sm:py-10 lg:py-12">
        <LandlordBreadcrumb locale={locale} page="landing" />

        <section className="mt-5 overflow-hidden rounded-[2rem] border border-primary/15 bg-white shadow-sm">
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
                  href={landlordRoute(locale, "register")}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
                >
                  {t.landing.primaryCta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <a
                  href={landlordRoute(locale, "guide")}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-2xl border border-primary/25 bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-[#FFF8F1]"
                >
                  {t.landing.secondaryCta}
                </a>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-primary/15 bg-[#FFF8F1] p-5">
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
    <main className="bg-[#F8F7F4] [word-break:keep-all]">
      <Container className="py-8 sm:py-10 lg:py-12">
        <LandlordBreadcrumb locale={locale} page="guide" />

        <section className="mt-5 rounded-[2rem] border border-primary/15 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
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
}: {
  locale: Locale;
  page: Exclude<LandlordRoutePage, "landing" | "guide">;
}) {
  const t = CONTENT[locale];
  const { draft, loaded, updateDraft, clearDraft } = useLandlordDraft();
  const stepIndex = stepIndexForPage(page);
  const draftStarted = isDraftStarted(draft);

  return (
    <main className="bg-[#F8F7F4] [word-break:keep-all]">
      <Container className="py-8 sm:py-10 lg:py-12">
        <LandlordBreadcrumb locale={locale} page={page} />
        <LandlordProgress locale={locale} activeIndex={stepIndex} />

        {loaded && !draftStarted && page !== "register" ? (
          <LandlordNotice className="mt-5">
            <strong className="block text-foreground">{t.flow.draftNoticeTitle}</strong>
            <span className="mt-1 block">{t.flow.draftNoticeBody}</span>
            <a
              href={landlordRoute(locale, "register")}
              className="mt-3 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white"
            >
              {t.flow.backToStart}
            </a>
          </LandlordNotice>
        ) : null}

        {page === "register" ? (
          <RegisterStartStep locale={locale} draft={draft} updateDraft={updateDraft} />
        ) : null}
        {page === "property" ? (
          <PropertyStep locale={locale} draft={draft} updateDraft={updateDraft} />
        ) : null}
        {page === "rooms" ? (
          <RoomsStep locale={locale} draft={draft} updateDraft={updateDraft} />
        ) : null}
        {page === "terms" ? (
          <TermsStep locale={locale} draft={draft} updateDraft={updateDraft} />
        ) : null}
        {page === "preview" ? (
          <PreviewStep
            locale={locale}
            draft={draft}
            clearDraft={clearDraft}
          />
        ) : null}
      </Container>
    </main>
  );
}

function RegisterStartStep({
  locale,
  draft,
  updateDraft,
}: {
  locale: Locale;
  draft: LandlordDraft;
  updateDraft: (patch: Partial<LandlordDraft>) => void;
}) {
  const t = CONTENT[locale];
  const r = LANDLORD_REFINEMENTS[locale];
  const displayLastName = draft.lastName || draft.name;
  const canContinue = Boolean(
    draft.role && (draft.firstName || displayLastName) && (draft.email || draft.contact),
  );

  return (
    <LandlordStepLayout
      locale={locale}
      page="register"
      title={t.flow.start.title}
      description={r.helpers.startDescription}
      asideTitle={t.flow.start.helpTitle}
      asideBody={t.flow.start.helpBody}
      icon={<ClipboardCheck className="h-5 w-5" aria-hidden />}
    >
      <OptionCardField
        label={r.fields.role}
        value={draft.role}
        options={r.options.roles}
        onChange={(role) => updateDraft({ role })}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label={r.fields.lastName}
          value={displayLastName}
          onChange={(lastName) => updateDraft({ lastName, name: lastName })}
          required
        />
        <TextField
          label={r.fields.firstName}
          value={draft.firstName}
          onChange={(firstName) => updateDraft({ firstName })}
          required
        />
        <TextField
          label={r.fields.email}
          type="email"
          value={draft.email}
          onChange={(email) => updateDraft({ email })}
        />
        <TextField
          label={r.fields.contact}
          value={draft.contact}
          onChange={(contact) => updateDraft({ contact })}
        />
      </div>
      <MultiChipField
        label={r.fields.preferredContactMethods}
        options={r.options.preferredContactMethods}
        values={draft.preferredContactMethods}
        onChange={(preferredContactMethods) =>
          updateDraft({
            preferredContactMethods,
            communicationMethod: preferredContactMethods[0] || "",
          })
        }
      />
      <MultiChipField
        label={r.fields.preferredLanguages}
        options={r.options.preferredLanguages}
        values={draft.preferredLanguages.length ? draft.preferredLanguages : draft.preferredLanguage ? [draft.preferredLanguage] : []}
        onChange={(preferredLanguages) =>
          updateDraft({
            preferredLanguages,
            preferredLanguage: preferredLanguages[0] || "",
          })
        }
      />
      <TextareaField
        label={r.fields.shortMessage}
        value={draft.shortMessage}
        onChange={(shortMessage) => updateDraft({ shortMessage })}
      />
      {!canContinue ? (
        <p className="rounded-2xl bg-[#FFF8F1] p-3 text-sm font-semibold leading-relaxed text-muted-foreground">
          {r.helpers.requiredHelper}
        </p>
      ) : null}
      <FlowActions
        locale={locale}
        backHref={landlordRoute(locale, "landing")}
        nextHref={landlordRoute(locale, "property")}
        nextDisabled={!canContinue}
      />
    </LandlordStepLayout>
  );
}

function PropertyStep({
  locale,
  draft,
  updateDraft,
}: {
  locale: Locale;
  draft: LandlordDraft;
  updateDraft: (patch: Partial<LandlordDraft>) => void;
}) {
  const t = CONTENT[locale];
  const r = LANDLORD_REFINEMENTS[locale];

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
      <FormSection title={r.sections.location}>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label={r.fields.city}
          value={draft.city}
          options={r.options.cityOptions}
          placeholder={t.flow.selectPlaceholder}
          onChange={(city) => updateDraft({ city })}
        />
        <TextField
          label={r.fields.area}
          value={draft.area}
          onChange={(area) => updateDraft({ area })}
        />
        <SearchableStationField
          label={r.fields.nearestStation}
          locale={locale}
          value={draft.nearestStation}
          onChange={(nearestStation) => updateDraft({ nearestStation })}
        />
        <TextField
          label={r.fields.address}
          value={draft.address}
          helper={r.helpers.addressHelper}
          onChange={(address) => updateDraft({ address })}
        />
      </div>
      </FormSection>
      <FormSection title={r.sections.housing}>
      <OptionCardField
        label={r.fields.housingType}
        value={draft.housingType}
        options={r.options.housingTypes}
        onChange={(housingType) => updateDraft({ housingType })}
        compact
      />
      <ChipChoiceField
        label={r.fields.useType}
        value={draft.useType}
        options={r.options.useTypes}
        onChange={(useType) => updateDraft({ useType })}
      />
      </FormSection>
      <FormSection title={r.sections.living} helper={r.helpers.residentHelper}>
        <ChipChoiceField
          label={r.fields.residentCondition}
          value={draft.residentCondition}
          options={r.options.residentConditions}
          onChange={(residentCondition) => updateDraft({ residentCondition })}
        />
      <div className="grid gap-4 md:grid-cols-2">
        <ChipChoiceField
          label={r.fields.furnished}
          value={draft.furnished}
          options={r.options.yesNoConfirm}
          onChange={(furnished) => updateDraft({ furnished })}
          compact
        />
        <ChipChoiceField
          label={r.fields.elevator}
          value={draft.elevator}
          options={r.options.yesNoConfirm}
          onChange={(elevator) => updateDraft({ elevator })}
          compact
        />
        <ChipChoiceField
          label={r.fields.parking}
          value={draft.parking}
          options={r.options.yesNoConfirm}
          onChange={(parking) => updateDraft({ parking })}
          compact
        />
        <ChipChoiceField
          label={r.fields.laundry}
          value={draft.laundry}
          options={r.options.yesNoConfirm}
          onChange={(laundry) => updateDraft({ laundry })}
          compact
        />
      </div>
      </FormSection>
      <FormSection title={r.sections.pets}>
        <div className="grid gap-4 md:grid-cols-2">
          <ChipChoiceField
            label={r.fields.tenantPetsAllowed}
            value={draft.tenantPetsAllowed}
            options={r.options.petAllowed}
            onChange={(tenantPetsAllowed) => updateDraft({ tenantPetsAllowed })}
            compact
          />
          <ChipChoiceField
            label={r.fields.homePets}
            value={draft.homePets}
            options={r.options.homePets}
            onChange={(homePets) =>
              updateDraft({
                homePets,
                homePetType: homePets === r.options.homePets[1] ? draft.homePetType : "",
              })
            }
            compact
          />
          {draft.homePets === r.options.homePets[1] ? (
            <TextField
              label={r.fields.homePetType}
              value={draft.homePetType}
              onChange={(homePetType) => updateDraft({ homePetType })}
            />
          ) : null}
          <ChipChoiceField
            label={r.fields.smokingCondition}
            value={draft.smokingCondition}
            options={r.options.smoking}
            onChange={(smokingCondition) => updateDraft({ smokingCondition })}
            compact
          />
        </div>
      </FormSection>
      <FormSection title={r.sections.photos}>
        <PhotoUploadField
          locale={locale}
          photos={draft.photos}
          coverPhotoId={draft.coverPhotoId}
          onChange={(photos, coverPhotoId) => updateDraft({ photos, coverPhotoId })}
        />
      </FormSection>
      <FlowActions
        locale={locale}
        backHref={landlordRoute(locale, "register")}
        nextHref={landlordRoute(locale, "rooms")}
      />
    </LandlordStepLayout>
  );
}

function RoomsStep({
  locale,
  draft,
  updateDraft,
}: {
  locale: Locale;
  draft: LandlordDraft;
  updateDraft: (patch: Partial<LandlordDraft>) => void;
}) {
  const t = CONTENT[locale];
  const r = LANDLORD_REFINEMENTS[locale];
  const hasBed = draft.furniture.includes(r.options.furniture[0]);

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
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label={r.fields.listingTitle}
          value={draft.listingTitle}
          onChange={(listingTitle) => updateDraft({ listingTitle })}
        />
        <CurrencyField
          label={r.fields.monthlyRent}
          value={draft.monthlyRent}
          onChange={(monthlyRent) => updateDraft({ monthlyRent })}
        />
        <TextField
          label={r.fields.availableFrom}
          type="date"
          value={draft.availableFrom}
          onChange={(availableFrom) => updateDraft({ availableFrom })}
        />
      </div>
      <ChipChoiceField
        label={r.fields.minimumStay}
        tooltip={r.helpers.minimumStayTooltip}
        value={draft.minimumStay}
        options={r.options.minimumStay}
        onChange={(minimumStay) => updateDraft({ minimumStay })}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <ChipChoiceField
          label={r.fields.occupancy}
          value={draft.occupancy}
          options={r.options.occupancy}
          onChange={(occupancy) => updateDraft({ occupancy })}
          compact
        />
        <ChipChoiceField
          label={r.fields.bathroom}
          value={draft.bathroom}
          options={r.options.bathroom}
          onChange={(bathroom) => updateDraft({ bathroom })}
          compact
        />
        <ChipChoiceField
          label={r.fields.kitchen}
          value={draft.kitchen}
          options={r.options.kitchen}
          onChange={(kitchen) => updateDraft({ kitchen })}
          compact
        />
      </div>
      <MultiChipField
        label={r.fields.furniture}
        options={r.options.furniture}
        values={draft.furniture}
        onChange={(furniture) =>
          updateDraft({
            furniture,
            bedSize: furniture.includes(r.options.furniture[0]) ? draft.bedSize : "",
          })
        }
      />
      {hasBed ? (
        <ChipChoiceField
          label={r.fields.bedSize}
          value={draft.bedSize}
          options={r.options.bedSize}
          onChange={(bedSize) => updateDraft({ bedSize })}
          compact
        />
      ) : null}
      <FlowActions
        locale={locale}
        backHref={landlordRoute(locale, "property")}
        nextHref={landlordRoute(locale, "terms")}
      />
    </LandlordStepLayout>
  );
}

function TermsStep({
  locale,
  draft,
  updateDraft,
}: {
  locale: Locale;
  draft: LandlordDraft;
  updateDraft: (patch: Partial<LandlordDraft>) => void;
}) {
  const t = CONTENT[locale];
  const r = LANDLORD_REFINEMENTS[locale];

  return (
    <LandlordStepLayout
      locale={locale}
      page="terms"
      title={t.flow.terms.title}
      description={r.helpers.termsDescription}
      asideTitle={t.routeLabels.terms}
      asideBody={t.flow.terms.notice}
      icon={<ShieldCheck className="h-5 w-5" aria-hidden />}
    >
      <LandlordNotice>{r.helpers.lastMonthInfo}</LandlordNotice>
      <div className="grid gap-4 sm:grid-cols-2">
        <CurrencyField
          label={r.fields.keyDepositAmount}
          value={draft.keyDepositAmount}
          onChange={(keyDepositAmount) => updateDraft({ keyDepositAmount })}
        />
      </div>
      <UtilityMatrix
        locale={locale}
        draft={draft}
        onChange={(utilityStatuses, utilitiesIncluded, utilitiesSeparate) =>
          updateDraft({ utilityStatuses, utilitiesIncluded, utilitiesSeparate })
        }
      />
      <MultiChipField
        label={r.fields.houseRuleItems}
        options={r.options.houseRules}
        values={draft.houseRuleItems.length ? draft.houseRuleItems : draft.houseRules ? [draft.houseRules] : []}
        onChange={(houseRuleItems) =>
          updateDraft({
            houseRuleItems,
            houseRules: houseRuleItems.join(", "),
          })
        }
      />
      <TextareaField
        label={r.fields.additionalNote}
        value={draft.additionalNote}
        onChange={(additionalNote) => updateDraft({ additionalNote })}
      />
      <TextareaField
        label={r.fields.moveInQuestions}
        value={draft.moveInQuestions}
        onChange={(moveInQuestions) => updateDraft({ moveInQuestions })}
      />
      <FlowActions
        locale={locale}
        backHref={landlordRoute(locale, "rooms")}
        nextHref={landlordRoute(locale, "preview")}
      />
    </LandlordStepLayout>
  );
}

function PreviewStep({
  locale,
  draft,
  clearDraft,
}: {
  locale: Locale;
  draft: LandlordDraft;
  clearDraft: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const t = CONTENT[locale];
  const r = LANDLORD_REFINEMENTS[locale];
  const utilityRows = getUtilitySummaryRows(locale, draft);
  const coverPhoto = draft.photos.find((photo) => photo.id === draft.coverPhotoId) || draft.photos[0];

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
                {draft.listingTitle || r.helpers.empty}
              </h2>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">
                {[draft.area, draft.nearestStation].filter(Boolean).join(" · ") ||
                  r.helpers.empty}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <PreviewMetric label={r.fields.monthlyRent} value={formatCurrencyValue(draft.monthlyRent)} empty={r.helpers.empty} />
                <PreviewMetric label={r.fields.availableFrom} value={draft.availableFrom} empty={r.helpers.empty} />
                <PreviewMetric label={r.fields.housingType} value={draft.housingType} empty={r.helpers.empty} />
                <PreviewMetric label={r.fields.useType} value={draft.useType} empty={r.helpers.empty} />
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <DraftSummaryCard
            title={r.sections.contact}
            empty={r.helpers.empty}
            editHref={landlordRoute(locale, "register")}
            editLabel={r.helpers.edit}
            rows={[
              [r.fields.role, draft.role],
              [r.fields.lastName, draft.lastName || draft.name],
              [r.fields.firstName, draft.firstName],
              [r.fields.email, draft.email],
              [r.fields.contact, draft.contact],
              [r.fields.preferredContactMethods, joinValues(draft.preferredContactMethods)],
              [r.fields.preferredLanguages, joinValues(draft.preferredLanguages)],
              [r.fields.shortMessage, draft.shortMessage],
            ]}
          />
          <DraftSummaryCard
            title={r.sections.property}
            empty={r.helpers.empty}
            editHref={landlordRoute(locale, "property")}
            editLabel={r.helpers.edit}
            rows={[
              [r.fields.city, draft.city],
              [r.fields.area, draft.area],
              [r.fields.nearestStation, draft.nearestStation],
              [r.fields.address, draft.address],
              [r.fields.housingType, draft.housingType],
              [r.fields.useType, draft.useType],
              [r.fields.residentCondition, draft.residentCondition],
              [r.fields.furnished, draft.furnished],
              [r.fields.elevator, draft.elevator],
              [r.fields.parking, draft.parking],
              [r.fields.laundry, draft.laundry],
              [r.fields.tenantPetsAllowed, draft.tenantPetsAllowed],
              [r.fields.homePets, [draft.homePets, draft.homePetType].filter(Boolean).join(" · ")],
              [r.fields.smokingCondition, draft.smokingCondition],
            ]}
          />
          <DraftSummaryCard
            title={r.sections.room}
            empty={r.helpers.empty}
            editHref={landlordRoute(locale, "rooms")}
            editLabel={r.helpers.edit}
            rows={[
              [r.fields.listingTitle, draft.listingTitle],
              [r.fields.monthlyRent, formatCurrencyValue(draft.monthlyRent)],
              [r.fields.availableFrom, draft.availableFrom],
              [r.fields.minimumStay, draft.minimumStay],
              [r.fields.occupancy, draft.occupancy],
              [r.fields.bathroom, draft.bathroom],
              [r.fields.kitchen, draft.kitchen],
              [r.fields.furniture, joinValues(draft.furniture)],
              [r.fields.bedSize, draft.bedSize],
            ]}
          />
          <DraftSummaryCard
            title={r.sections.terms}
            empty={r.helpers.empty}
            editHref={landlordRoute(locale, "terms")}
            editLabel={r.helpers.edit}
            rows={[
              [r.fields.keyDepositAmount, formatCurrencyValue(draft.keyDepositAmount)],
              ...utilityRows,
            ]}
          />
        </div>

        <DraftSummaryCard
          title={r.sections.rules}
          empty={r.helpers.empty}
          editHref={landlordRoute(locale, "terms")}
          editLabel={r.helpers.edit}
          rows={[
            [r.helpers.coverLabel, coverPhoto?.name || ""],
            [r.helpers.photosTitle, draft.photos.length ? `${draft.photos.length}` : ""],
            [r.fields.houseRuleItems, joinValues(draft.houseRuleItems)],
            [r.fields.additionalNote, draft.additionalNote],
            [r.fields.moveInQuestions, draft.moveInQuestions],
          ]}
        />

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
          <span>{r.helpers.previewCheckbox}</span>
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
          <a
            href={landlordRoute(locale, "terms")}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-foreground transition hover:border-primary/30 hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            {t.flow.back}
          </a>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={clearDraft}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-2xl border border-primary/25 bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-[#FFF8F1]"
            >
              {r.helpers.startOver}
            </button>
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
  const pages: Array<Exclude<LandlordRoutePage, "landing" | "guide">> = [
    "register",
    "property",
    "rooms",
    "terms",
    "preview",
  ];

  return (
    <nav
      aria-label="landlord registration progress"
      className="mt-5 rounded-[2rem] border border-border/80 bg-white p-3 shadow-sm"
    >
      <ol className="grid gap-2 sm:grid-cols-5">
        {t.flow.labels.map((label, index) => {
          const isActive = index === activeIndex;
          const isComplete = index < activeIndex;
          return (
            <li key={label}>
              <a
                href={landlordRoute(locale, pages[index])}
                className={cn(
                  "flex min-h-12 items-center gap-2 rounded-2xl px-3 py-2 text-sm font-extrabold transition",
                  isActive
                    ? "bg-primary text-white"
                    : isComplete
                      ? "bg-[#FFF3E6] text-primary"
                      : "bg-[#F7F7F5] text-muted-foreground hover:text-primary",
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
              </a>
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
  nextDisabled = false,
}: {
  locale: Locale;
  backHref: string;
  nextHref: string;
  nextDisabled?: boolean;
}) {
  const t = CONTENT[locale];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5">
      <a
        href={backHref}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-foreground transition hover:border-primary/30 hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        {t.flow.back}
      </a>
      {nextDisabled ? (
        <button
          type="button"
          disabled
          className="inline-flex cursor-not-allowed items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-muted px-5 py-3 text-sm font-bold text-muted-foreground"
        >
          {t.flow.next}
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      ) : (
        <a
          href={nextHref}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
        >
          {t.flow.next}
          <ChevronRight className="h-4 w-4" aria-hidden />
        </a>
      )}
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

function TextField({
  label,
  value,
  onChange,
  helper,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  type?: "text" | "email" | "date" | "number";
  required?: boolean;
}) {
  return (
    <label className="block min-w-0">
      <span className="text-sm font-bold text-foreground">
        {label}
        {required ? <span className="text-primary"> *</span> : null}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
      {helper ? (
        <span className="mt-1 block text-xs font-semibold leading-relaxed text-muted-foreground">
          {helper}
        </span>
      ) : null}
    </label>
  );
}

function CurrencyField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="text-sm font-bold text-foreground">{label}</span>
      <div className="mt-2 flex h-11 overflow-hidden rounded-xl border border-border bg-white transition focus-within:border-primary">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))}
          className="min-w-0 flex-1 bg-white px-3 text-sm font-semibold text-foreground outline-none"
        />
        <span className="inline-flex items-center border-l border-border bg-[#FCFCFB] px-3 text-sm font-extrabold text-muted-foreground">
          $
        </span>
      </div>
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="text-sm font-bold text-foreground">{label}</span>
      <textarea
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold leading-relaxed text-foreground outline-none transition focus:border-primary"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder = "Select",
  required = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block min-w-0">
      <span className="text-sm font-bold text-foreground">
        {label}
        {required ? <span className="text-primary"> *</span> : null}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-semibold text-foreground outline-none transition focus:border-primary"
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
    </label>
  );
}

function SearchableStationField({
  label,
  locale,
  value,
  onChange,
}: {
  label: string;
  locale: Locale;
  value: string;
  onChange: (value: string) => void;
}) {
  const r = LANDLORD_REFINEMENTS[locale];
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const options = useMemo(
    () => [r.helpers.stationNotClose, r.helpers.stationNotSure, ...TTC_RAPID_TRANSIT_STATIONS],
    [r.helpers.stationNotClose, r.helpers.stationNotSure],
  );
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="relative min-w-0">
      <span className="text-sm font-bold text-foreground">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="mt-2 flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-border bg-white px-3 text-left text-sm font-semibold text-foreground outline-none transition hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
      >
        <span className={cn("min-w-0 truncate", !value && "text-muted-foreground")}>
          {value || r.helpers.stationPlaceholder}
        </span>
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      </button>
      {open ? (
        <div className="absolute z-30 mt-2 w-full rounded-2xl border border-border bg-white p-3 shadow-lg">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={r.helpers.stationSearchPlaceholder}
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
          </div>
        </div>
      ) : null}
    </div>
  );
}

function OptionCardField({
  label,
  value,
  options,
  onChange,
  compact = false,
  required = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  compact?: boolean;
  required?: boolean;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-sm font-bold text-foreground">
        {label}
        {required ? <span className="text-primary"> *</span> : null}
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
  label,
  value,
  options,
  onChange,
  compact = false,
  tooltip,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  compact?: boolean;
  tooltip?: string;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="flex items-center gap-1.5 text-sm font-bold text-foreground">
        <span>{label}</span>
        {tooltip ? (
          <span className="group relative inline-flex">
            <button
              type="button"
              className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition hover:border-primary hover:text-primary"
              aria-label={tooltip}
            >
              <HelpCircle className="h-3.5 w-3.5" aria-hidden />
            </button>
            <span className="pointer-events-none absolute left-1/2 top-7 z-20 hidden w-64 -translate-x-1/2 rounded-xl border border-border bg-white p-3 text-xs font-semibold leading-relaxed text-muted-foreground shadow-lg group-hover:block group-focus-within:block">
              {tooltip}
            </span>
          </span>
        ) : null}
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
    <fieldset className="min-w-0 rounded-2xl border border-border/80 bg-[#FCFCFB] p-4">
      <legend className="px-1 text-sm font-extrabold text-foreground">
        {r.fields.utilitiesIncluded}
      </legend>
      <div className="mt-3 grid gap-2">
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
    </fieldset>
  );
}

function MultiChipField({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
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
      <legend className="text-sm font-bold text-foreground">{label}</legend>
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
}: {
  locale: Locale;
  photos: LandlordPhoto[];
  coverPhotoId: string;
  onChange: (photos: LandlordPhoto[], coverPhotoId: string) => void;
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
        <h3 className="mt-3 text-sm font-extrabold text-foreground">
          {r.helpers.photosTitle}
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
  return (
    <article className="rounded-2xl border border-border/80 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-extrabold text-foreground">{title}</h2>
        {editHref && editLabel ? (
          <a
            href={editHref}
            className="shrink-0 whitespace-nowrap text-xs font-extrabold text-primary transition hover:text-primary/80"
          >
            {editLabel}
          </a>
        ) : null}
      </div>
      <dl className="mt-3 space-y-2">
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
  return value ? `$${Number(value).toLocaleString("en-CA")} CAD` : "";
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

function LandlordBreadcrumb({ locale, page }: { locale: Locale; page: LandlordRoutePage }) {
  const t = CONTENT[locale];
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

    window.sessionStorage.setItem(LANDLORD_DRAFT_KEY, JSON.stringify(draft));
  }, [draft, loaded]);

  const updateDraft = useMemo(
    () => (patch: Partial<LandlordDraft>) => {
      setDraft((current) => ({ ...current, ...patch }));
    },
    [],
  );

  const clearDraft = () => {
    setDraft(DEFAULT_DRAFT);
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(LANDLORD_DRAFT_KEY);
    }
  };

  return { draft, loaded, updateDraft, clearDraft };
}

function isDraftStarted(draft: LandlordDraft) {
  return Boolean(draft.role || draft.name || draft.firstName || draft.lastName || draft.email || draft.contact);
}

function normalizeLandlordDraft(rawDraft: Partial<LandlordDraft>): LandlordDraft {
  const draft = { ...DEFAULT_DRAFT, ...rawDraft };
  return {
    ...draft,
    firstName: draft.firstName || "",
    lastName: draft.lastName || "",
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

function stepIndexForPage(page: Exclude<LandlordRoutePage, "landing" | "guide">) {
  const pages: Array<Exclude<LandlordRoutePage, "landing" | "guide">> = [
    "register",
    "property",
    "rooms",
    "terms",
    "preview",
  ];
  return Math.max(0, pages.indexOf(page));
}

function landlordRoute(locale: Locale, page: RouteKey) {
  const base = `/${locale}/landlords`;

  switch (page) {
    case "landing":
      return base;
    case "guide":
      return `${base}/guide`;
    case "register":
      return `${base}/register`;
    case "property":
      return `${base}/register/property`;
    case "rooms":
      return `${base}/register/rooms`;
    case "terms":
      return `${base}/register/terms`;
    case "preview":
      return `${base}/register/preview`;
  }
}
