import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useBlocker, useLocation } from "@tanstack/react-router";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Home,
  Mail,
  MapPin,
  MapPinned,
  MessageSquareText,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { ListingImageFrame } from "@/components/ui/listing-image-frame";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import {
  buildSelectedInquiryPayload,
  MOCK_INQUIRY_DRAFT_STORAGE_KEY,
  readSelectedInquiryPayload,
  saveSelectedInquiryPayload,
  type MockInquiryDraftPayload,
  type SelectedInquiryPayload,
} from "@/lib/mockInquiryStorage";
import { getStableMockListingGalleryImages } from "@/lib/mockListingImages";
import { MOCK_LISTINGS } from "./LocaleListingsPage";

type FormState = {
  name: string;
  email: string;
  contact: string;
  currentLocation: string;
  city: string;
  purpose: string;
  housingType: string;
  budget: string;
  moveInDate: string;
  people: string;
  area: string;
  conditions: string;
  requests: string;
};

type FieldKey = keyof FormState;

type KoreanApplyFormState = {
  name: string;
  email: string;
  contact: string;
  currentLocation: string;
  arrivalPlan: string;
  moveInDate: string;
  stayPeriod: string;
  people: string;
  budget: string;
  landlordQuestions: string;
};

type SelectedListingApplySummary = {
  listingId: string;
  title: string;
  area: string;
  housingType: string;
  rent: number;
  currency: "CAD";
  rentKRW: number;
  capacity: number;
  lastChecked: string;
  verificationStatus: "verified" | "needs_check" | "preparing";
  thumbnail: string;
};

type SelectedInquiryApplyFormState = {
  name: string;
  email: string;
  phone: string;
  preferredMoveInDate: string;
  stayLength: string;
  people: string;
  questions: string;
  request: string;
};

type InquiryApplyMethod = "assisted" | "direct";

type SelectedInquiryApplyCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  selectedTitle: string;
  detailsTitle: string;
  noListingTitle: string;
  noListingBody: string;
  fallback: string;
  summaryLabels: {
    listingTitle: string;
    area: string;
    rent: string;
    housingType: string;
    room: string;
    moveInDate: string;
    people: string;
  };
  fields: Record<keyof SelectedInquiryApplyFormState, FieldText>;
  agreementTitle: string;
  agreements: string[];
  submit: string;
  successTitle: string;
  successBody: string;
  backToListings: string;
};

type ApplyDatePickerCopy = {
  title: string;
  previousMonth: string;
  nextMonth: string;
  weekdays: string[];
  unavailableLabel: string;
  reset: string;
  apply: string;
  close: string;
};

type LeaveInquiryModalCopy = {
  title: string;
  description: string;
  leave: string;
  saveDraft: string;
  keepWriting: string;
};

type ApplyCompleteCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  inquirerSummaryTitle: string;
  inquirySummaryTitle: string;
  mvpNoticeTitle: string;
  mvpNoticeBody: string;
  nextStepsTitle: string;
  nextSteps: string[];
  emptyTitle: string;
  emptyBody: string;
  backToDetail: string;
  viewListings: string;
  viewHistory: string;
  mvpPlanned: string;
  submittedAt: string;
};

type SavedSelectedInquiryDraft = {
  listingId: string;
  locale: Locale;
  mode: InquiryApplyMethod;
  form: SelectedInquiryApplyFormState;
  checked: boolean[];
  name?: string;
  email?: string;
  phone?: string;
  moveInDate?: string;
  stayDuration?: string;
  people?: string;
  confirmText?: string;
  requestText?: string;
  checkboxes?: boolean[];
  savedAt: string;
};

type MockInquiryCompletionPayload = {
  locale: Locale;
  inquiryMethod?: InquiryApplyMethod;
  selectedInquiry: SelectedInquiryPayload;
  form: SelectedInquiryApplyFormState;
  submittedAt: string;
};

type MockApplyProfile = {
  name: string;
  email: string;
  phone: string;
};

type FieldText = {
  label: string;
  placeholder: string;
  required?: boolean;
};

type ApplyPageContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  mvpNotice: string;
  sections: {
    basic: string;
    housing: string;
    consultation: string;
    confirmation: string;
  };
  fields: Record<FieldKey, FieldText>;
  checkboxes: string[];
  options: {
    city: string[];
    purpose: string[];
    housingType: string[];
    budget: string[];
    people: string[];
  };
  selectPlaceholder: string;
  button: string;
  previewTitle: string;
  previewBody: string;
  summaryTitle: string;
  emptyValue: string;
  helperTitle: string;
  helperItems: string[];
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  contact: "",
  currentLocation: "",
  city: "",
  purpose: "",
  housingType: "",
  budget: "",
  moveInDate: "",
  people: "",
  area: "",
  conditions: "",
  requests: "",
};

const KO_SELECTED_LISTING_STORAGE_KEY = "maplehouse.apply.selectedListing.ko";

const EMPTY_KO_APPLY_FORM: KoreanApplyFormState = {
  name: "",
  email: "",
  contact: "",
  currentLocation: "",
  arrivalPlan: "",
  moveInDate: "",
  stayPeriod: "",
  people: "",
  budget: "",
  landlordQuestions: "",
};

const EMPTY_SELECTED_INQUIRY_FORM: SelectedInquiryApplyFormState = {
  name: "",
  email: "",
  phone: "",
  preferredMoveInDate: "",
  stayLength: "",
  people: "",
  questions: "",
  request: "",
};

const MOCK_APPLY_PROFILE_STORAGE_KEY = "maplehouse_mock_current_user_profile";
const DEFAULT_MOCK_APPLY_PROFILE: MockApplyProfile = {
  name: "MEHA KIM",
  email: "name@example.com",
  phone: "",
};

const HISTORY_BACK_PENDING_HREF = "__maplehouse_apply_history_back__";
const MOCK_INQUIRY_COMPLETION_STORAGE_KEY_PREFIX = "maplehouse.applyCompletion";

const SELECTED_INQUIRY_DETAIL_BUTTON: Record<Locale, string> = {
  ko: "매물 상세 페이지로 이동",
  en: "Go to listing detail",
  fr: "Voir la page du logement",
};

const SELECTED_INQUIRY_DRAFT_RESTORE_NOTICE: Record<Locale, string> = {
  ko: "임시 저장된 문의 내용을 불러왔습니다.",
  en: "Your saved inquiry draft has been restored.",
  fr: "Votre brouillon de demande a été restauré.",
};

const LEAVE_INQUIRY_MODAL_COPY: Record<Locale, LeaveInquiryModalCopy> = {
  ko: {
    title: "문의 작성을 중단할까요?",
    description:
      "작성 중인 문의 내용이 있습니다. 나가면 입력한 내용이 사라질 수 있습니다.",
    leave: "나가기",
    saveDraft: "임시 저장하기",
    keepWriting: "계속 작성하기",
  },
  en: {
    title: "Stop writing this inquiry?",
    description:
      "You have an inquiry draft in progress. If you leave, your entered content may be lost.",
    leave: "Leave",
    saveDraft: "Save draft",
    keepWriting: "Keep writing",
  },
  fr: {
    title: "Arrêter la rédaction de cette demande ?",
    description:
      "Vous avez une demande en cours de rédaction. Si vous quittez cette page, les informations saisies peuvent être perdues.",
    leave: "Quitter",
    saveDraft: "Enregistrer le brouillon",
    keepWriting: "Continuer",
  },
};

const SELECTED_INQUIRY_COPY: Record<Locale, SelectedInquiryApplyCopy> = {
  ko: {
    eyebrow: "MapleHouse 문의",
    title: "문의 신청",
    subtitle: "선택한 매물과 방 정보를 바탕으로 문의 내용을 정리합니다. 실제 전송은 아직 연결되어 있지 않습니다.",
    selectedTitle: "선택한 매물",
    detailsTitle: "매물 상세 정보",
    noListingTitle: "선택한 매물이 없습니다.",
    noListingBody: "매물 상세페이지에서 문의할 매물을 먼저 선택해 주세요.",
    fallback: "확인 필요",
    summaryLabels: {
      listingTitle: "매물",
      area: "지역",
      rent: "월세",
      housingType: "주거 형태",
      room: "선택한 방",
      moveInDate: "입주 희망일",
      people: "인원",
    },
    fields: {
      name: { label: "이름", placeholder: "예: MEHA KIM", required: true },
      email: { label: "이메일", placeholder: "name@example.com", required: true },
      phone: { label: "전화번호", placeholder: "숫자 중심으로 입력해 주세요" },
      preferredMoveInDate: { label: "입주 희망일", placeholder: "" },
      stayLength: { label: "체류 기간", placeholder: "예: 6개월 / 1년" },
      people: { label: "인원", placeholder: "예: 1명" },
      questions: { label: "꼭 확인하고 싶은 내용", placeholder: "계약 조건, 공과금, 룸메이트, 주소 등 확인할 내용을 적어주세요." },
      request: { label: "추가 요청사항", placeholder: "추가로 MapleHouse에 전달할 내용을 적어주세요." },
    },
    agreementTitle: "MVP 안내 확인",
    agreements: [
      "MapleHouse는 현재 MVP 단계에서 문의 확인 흐름을 미리보기로 제공하며, 실제 계약·결제·송금 기능은 아직 연결되어 있지 않음을 이해했습니다.",
      "최종 계약 여부, 입금 여부, 입주 여부는 사용자가 직접 확인해야 함을 이해했습니다.",
    ],
    submit: "문의 초안 만들기",
    successTitle: "문의 초안이 생성되었습니다.",
    successBody: "실제 전송, 결제, 예약, 계약 기능은 아직 연결되어 있지 않습니다.",
    backToListings: "매물 보러가기",
  },
  en: {
    eyebrow: "MapleHouse inquiry",
    title: "Inquiry request",
    subtitle: "We will organize your inquiry based on the selected listing and room. Real sending is not connected yet.",
    selectedTitle: "Selected listing",
    detailsTitle: "Listing details",
    noListingTitle: "No listing selected.",
    noListingBody: "Please choose a listing from the listing detail page first.",
    fallback: "To confirm",
    summaryLabels: {
      listingTitle: "Listing",
      area: "Area",
      rent: "Rent",
      housingType: "Housing type",
      room: "Selected room",
      moveInDate: "Preferred move-in date",
      people: "People",
    },
    fields: {
      name: { label: "Name", placeholder: "Your name", required: true },
      email: { label: "Email", placeholder: "name@example.com", required: true },
      phone: { label: "Phone number", placeholder: "Enter your phone number" },
      preferredMoveInDate: { label: "Preferred move-in date", placeholder: "" },
      stayLength: { label: "Stay length", placeholder: "Example: 6 months / 1 year" },
      people: { label: "Number of people", placeholder: "Example: 1" },
      questions: { label: "Questions to confirm", placeholder: "Contract terms, utilities, roommates, exact address, and other details." },
      request: { label: "Additional request", placeholder: "Anything else you want MapleHouse to know." },
    },
    agreementTitle: "MVP scope confirmation",
    agreements: [
      "I understand that MapleHouse currently provides this inquiry flow as an MVP preview, and real contract, payment, and payout features are not connected yet.",
      "I understand that final contract, payment, and move-in decisions must be confirmed by the user.",
    ],
    submit: "Create inquiry draft",
    successTitle: "Inquiry draft created.",
    successBody: "Real sending, payment, reservation, and contract features are not connected yet.",
    backToListings: "View listings",
  },
  fr: {
    eyebrow: "Demande MapleHouse",
    title: "Demande de renseignements",
    subtitle: "Nous organisons votre demande à partir de l’annonce et de la chambre choisies. L’envoi réel n’est pas encore connecté.",
    selectedTitle: "Logement sélectionné",
    detailsTitle: "Détails du logement",
    noListingTitle: "Aucun logement sélectionné.",
    noListingBody: "Choisissez d’abord un logement depuis la page de détail.",
    fallback: "À confirmer",
    summaryLabels: {
      listingTitle: "Logement",
      area: "Secteur",
      rent: "Loyer",
      housingType: "Type de logement",
      room: "Chambre choisie",
      moveInDate: "Date d’arrivée souhaitée",
      people: "Personnes",
    },
    fields: {
      name: { label: "Nom", placeholder: "Votre nom", required: true },
      email: { label: "E-mail", placeholder: "nom@example.com", required: true },
      phone: { label: "Numéro de téléphone", placeholder: "Votre numéro" },
      preferredMoveInDate: { label: "Date d’arrivée souhaitée", placeholder: "" },
      stayLength: { label: "Durée du séjour", placeholder: "Ex. 6 mois / 1 an" },
      people: { label: "Nombre de personnes", placeholder: "Ex. 1" },
      questions: { label: "Questions à vérifier", placeholder: "Contrat, charges, colocataires, adresse exacte et autres détails." },
      request: { label: "Demande supplémentaire", placeholder: "Autre information à transmettre à MapleHouse." },
    },
    agreementTitle: "Confirmation du périmètre MVP",
    agreements: [
      "Je comprends que MapleHouse propose actuellement ce flux de demande comme aperçu MVP, et que les fonctions réelles de contrat, paiement et virement ne sont pas encore connectées.",
      "Je comprends que la décision finale de contrat, de paiement et d’arrivée doit être vérifiée par l’utilisateur.",
    ],
    submit: "Créer un brouillon de demande",
    successTitle: "Brouillon de demande créé.",
    successBody: "L’envoi réel, le paiement, la réservation et le contrat ne sont pas encore connectés.",
    backToListings: "Voir les logements",
  },
};

const DIRECT_SELECTED_INQUIRY_COPY_OVERRIDES: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    fields: Partial<Record<keyof SelectedInquiryApplyFormState, FieldText>>;
    agreements: string[];
    submit: string;
    successTitle: string;
    successBody: string;
  }
> = {
  ko: {
    eyebrow: "직접 문의",
    title: "집주인에게 직접 문의하기",
    subtitle:
      "선택한 매물에 대해 임대인에게 직접 전달할 문의 내용을 작성하는 MVP mock 화면입니다. 실제 메시지 발송, 채팅, 번역 기능은 아직 연결되어 있지 않습니다.",
    fields: {
      questions: {
        label: "문의 내용",
        placeholder: "임대인에게 직접 확인하고 싶은 내용을 적어주세요.",
      },
      request: {
        label: "추가 요청사항",
        placeholder: "추가로 남기고 싶은 요청사항이 있다면 적어주세요.",
      },
    },
    agreements: [
      "MapleHouse는 현재 MVP 단계에서 직접 문의 내용을 미리보기로 접수하며, 실제 메시지 발송, 채팅, 번역 기능은 아직 연결되어 있지 않음을 이해했습니다.",
      "최종 계약 여부, 입금 여부, 입주 여부는 사용자가 직접 확인해야 함을 이해했습니다.",
    ],
    submit: "직접 문의 접수하기",
    successTitle: "직접 문의 내용이 접수되었습니다.",
    successBody:
      "실제 메시지 발송, 채팅, 번역 기능은 아직 연결되어 있지 않습니다.",
  },
  en: {
    eyebrow: "Direct inquiry",
    title: "Contact the landlord directly",
    subtitle:
      "Write the inquiry you want to send directly to the landlord for the selected listing. This is an MVP mock screen. Real messaging, chat, and translation are not connected yet.",
    fields: {
      questions: {
        label: "Inquiry message",
        placeholder: "Write what you want to ask the landlord directly.",
      },
      request: {
        label: "Extra request",
        placeholder: "Add any extra request if needed.",
      },
    },
    agreements: [
      "I understand that MapleHouse currently receives this direct inquiry as an MVP preview, and real messaging, chat, and translation are not connected yet.",
      "I understand that final contract, payment, and move-in decisions must be confirmed by the user.",
    ],
    submit: "Submit direct inquiry",
    successTitle: "Direct inquiry received.",
    successBody: "Real messaging, chat, and translation are not connected yet.",
  },
  fr: {
    eyebrow: "Demande directe",
    title: "Contacter directement le propriétaire",
    subtitle:
      "Rédigez la demande à transmettre directement au propriétaire pour le logement choisi. Ceci est un écran mock MVP. La messagerie réelle, le chat et la traduction ne sont pas encore connectés.",
    fields: {
      questions: {
        label: "Message de demande",
        placeholder: "Écrivez ce que vous souhaitez demander directement au propriétaire.",
      },
      request: {
        label: "Demande supplémentaire",
        placeholder: "Ajoutez une demande supplémentaire si nécessaire.",
      },
    },
    agreements: [
      "Je comprends que MapleHouse reçoit actuellement cette demande directe comme aperçu MVP, et que la messagerie réelle, le chat et la traduction ne sont pas encore connectés.",
      "Je comprends que la décision finale de contrat, de paiement et d’arrivée doit être vérifiée par l’utilisateur.",
    ],
    submit: "Envoyer la demande directe",
    successTitle: "Demande directe reçue.",
    successBody: "La messagerie réelle, le chat et la traduction ne sont pas encore connectés.",
  },
};

function getSelectedInquiryApplyCopy(locale: Locale, method: InquiryApplyMethod) {
  const base = SELECTED_INQUIRY_COPY[locale];
  if (method === "assisted") return base;

  const direct = DIRECT_SELECTED_INQUIRY_COPY_OVERRIDES[locale];
  return {
    ...base,
    ...direct,
    fields: {
      ...base.fields,
      ...direct.fields,
    },
  };
}

const APPLY_COMPLETE_COPY: Record<Locale, ApplyCompleteCopy> = {
  ko: {
    eyebrow: "MapleHouse MVP 문의",
    title: "문의 신청이 접수되었습니다",
    subtitle:
      "아래 내용은 MVP mock 접수 화면입니다. 실제 전송이나 계약 절차는 아직 연결되어 있지 않습니다.",
    inquirerSummaryTitle: "문의자 정보 요약",
    inquirySummaryTitle: "문의 내용 요약",
    mvpNoticeTitle: "MVP 안내",
    mvpNoticeBody: "실제 전송, 결제, 계약, 송금은 아직 연결되어 있지 않습니다.",
    nextStepsTitle: "문의 진행 순서",
    nextSteps: [
      "MapleHouse가 고객님이 입력해주신 정보와 조건을 파악합니다.",
      "해당 정보, 조건뿐 아니라 고객님에게 예상될 수 있는 추가 문의사항까지 MapleHouse가 임대인에게 자세한 문의를 보낸 후 답변을 기다립니다.",
      "임대인의 답변이 오면 해당 답변을 고객님이 이해하실 수 있게 자세하게 풀어 설명해드립니다. 이후 예약 진행 여부를 정하실 수 있습니다.\n마이페이지에서 문의 진행 상황을 확인할 수 있습니다.",
    ],
    emptyTitle: "접수된 문의 정보를 찾을 수 없습니다.",
    emptyBody: "매물 상세페이지나 매물 목록에서 문의할 매물을 다시 선택해 주세요.",
    backToDetail: "매물 상세로 돌아가기",
    viewListings: "매물 목록 보기",
    viewHistory: "나의 문의내역 보기",
    mvpPlanned: "MVP 예정",
    submittedAt: "접수 시각",
  },
  en: {
    eyebrow: "MapleHouse MVP inquiry",
    title: "Your inquiry has been received",
    subtitle:
      "This is an MVP mock completion screen. Real sending, contracts, and payments are not connected yet.",
    inquirerSummaryTitle: "Inquirer summary",
    inquirySummaryTitle: "Inquiry summary",
    mvpNoticeTitle: "MVP note",
    mvpNoticeBody: "Real sending, payment, contract, and payout features are not connected yet.",
    nextStepsTitle: "Inquiry progress",
    nextSteps: [
      "MapleHouse reviews the information and conditions you submitted.",
      "MapleHouse sends a detailed inquiry to the landlord, including likely follow-up questions based on your situation, and waits for the reply.",
      "When the landlord replies, MapleHouse explains the answer clearly so you can understand it and decide whether to proceed with a reservation.\nIn the real operation stage, you can check inquiry progress in My Page.",
    ],
    emptyTitle: "No received inquiry information was found.",
    emptyBody: "Please choose a listing again from the listing detail page or listing list.",
    backToDetail: "Back to listing detail",
    viewListings: "View listings",
    viewHistory: "My inquiries",
    mvpPlanned: "MVP planned",
    submittedAt: "Submitted at",
  },
  fr: {
    eyebrow: "Demande MVP MapleHouse",
    title: "Votre demande a été reçue",
    subtitle:
      "Ceci est un écran de confirmation mock MVP. L’envoi réel, les contrats et les paiements ne sont pas encore connectés.",
    inquirerSummaryTitle: "Résumé du demandeur",
    inquirySummaryTitle: "Résumé de la demande",
    mvpNoticeTitle: "Note MVP",
    mvpNoticeBody: "L’envoi réel, le paiement, le contrat et le virement ne sont pas encore connectés.",
    nextStepsTitle: "Suivi de la demande",
    nextSteps: [
      "MapleHouse examine les informations et les conditions que vous avez envoyées.",
      "MapleHouse transmet une demande détaillée au propriétaire, avec les questions complémentaires qui peuvent être utiles selon votre situation, puis attend sa réponse.",
      "Lorsque le propriétaire répond, MapleHouse vous explique la réponse clairement afin que vous puissiez décider si vous souhaitez poursuivre la réservation.\nDans la phase réelle, le suivi de la demande pourra être consulté dans Mon espace.",
    ],
    emptyTitle: "Aucune information de demande reçue n’a été trouvée.",
    emptyBody: "Veuillez choisir de nouveau un logement depuis la page de détail ou la liste.",
    backToDetail: "Retour au détail du logement",
    viewListings: "Voir les logements",
    viewHistory: "Mes demandes",
    mvpPlanned: "Prévu MVP",
    submittedAt: "Reçu le",
  },
};

const DIRECT_APPLY_COMPLETE_COPY_OVERRIDES: Record<
  Locale,
  Pick<ApplyCompleteCopy, "eyebrow" | "title" | "subtitle" | "nextStepsTitle" | "nextSteps">
> = {
  ko: {
    eyebrow: "직접 문의 MVP",
    title: "직접 문의 내용이 접수되었습니다",
    subtitle:
      "아래 내용은 MVP mock 접수 화면입니다. 실제 메시지 발송, 채팅, 번역 기능은 아직 연결되어 있지 않습니다.",
    nextStepsTitle: "직접 문의 진행 안내",
    nextSteps: [
      "입력하신 직접 문의 내용이 MVP mock 상태로 정리되었습니다.",
      "실제 운영 단계에서는 임대인 메시지 전송, 채팅, 번역 지원을 연결할 예정입니다.",
      "문의 진행 상황은 나의 문의내역에서 확인할 수 있습니다.",
    ],
  },
  en: {
    eyebrow: "Direct inquiry MVP",
    title: "Your direct inquiry has been received",
    subtitle:
      "This is an MVP mock completion screen. Real messaging, chat, and translation are not connected yet.",
    nextStepsTitle: "Direct inquiry progress",
    nextSteps: [
      "Your direct inquiry content has been saved in this MVP mock flow.",
      "In the real operation stage, landlord messaging, chat, and translation support can be connected.",
      "You can check inquiry progress in My inquiries.",
    ],
  },
  fr: {
    eyebrow: "Demande directe MVP",
    title: "Votre demande directe a été reçue",
    subtitle:
      "Ceci est un écran de confirmation mock MVP. La messagerie réelle, le chat et la traduction ne sont pas encore connectés.",
    nextStepsTitle: "Suivi de la demande directe",
    nextSteps: [
      "Le contenu de votre demande directe est enregistré dans ce flux mock MVP.",
      "Dans la phase réelle, la messagerie avec le propriétaire, le chat et l’aide à la traduction pourront être connectés.",
      "Vous pouvez suivre la demande dans Mes demandes.",
    ],
  },
};

function getApplyCompleteCopy(locale: Locale, method: InquiryApplyMethod) {
  const base = APPLY_COMPLETE_COPY[locale];
  if (method === "assisted") return base;
  return {
    ...base,
    ...DIRECT_APPLY_COMPLETE_COPY_OVERRIDES[locale],
  };
}

const APPLY_DATE_PICKER_COPY: Record<Locale, ApplyDatePickerCopy> = {
  ko: {
    title: "입주 희망일 선택",
    previousMonth: "이전 달",
    nextMonth: "다음 달",
    weekdays: ["일", "월", "화", "수", "목", "금", "토"],
    unavailableLabel: "선택 불가 예시 날짜",
    reset: "초기화",
    apply: "적용하기",
    close: "닫기",
  },
  en: {
    title: "Select preferred move-in date",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    unavailableLabel: "Example unavailable dates",
    reset: "Reset",
    apply: "Apply",
    close: "Close",
  },
  fr: {
    title: "Choisir la date d’arrivée souhaitée",
    previousMonth: "Mois précédent",
    nextMonth: "Mois suivant",
    weekdays: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    unavailableLabel: "Exemples de dates indisponibles",
    reset: "Réinitialiser",
    apply: "Appliquer",
    close: "Fermer",
  },
};

const KO_SELECTED_LISTING_STATUS_LABEL: Record<SelectedListingApplySummary["verificationStatus"], string> = {
  verified: "확인 완료",
  needs_check: "추가 확인 필요",
  preparing: "확인 준비 중",
};

const KO_LISTING_CHECK_ITEMS = [
  "실제 주소와 주변 위치",
  "현재 입주 가능 여부",
  "총 월세와 포함 항목",
  "보증금 / 첫 달 / 마지막 달 월세 조건",
  "룸메이트 또는 공용공간 조건",
  "가구 포함 여부",
  "인터넷 / 전기 / 수도 / 난방 포함 여부",
  "사진과 실제 상태 차이",
  "계약 전 추가로 확인할 내용",
];

const KO_SERVICE_SCOPE_ITEMS = [
  "MapleHouse는 계약 당사자가 아니며, 문의 내용을 정리하고 확인을 돕는 서비스임을 이해했습니다.",
  "실제 계약 여부와 송금 여부는 사용자가 직접 판단해야 함을 이해했습니다.",
  "현재 MVP 단계에서는 실제 결제, 송금, 전자서명을 진행하지 않음을 이해했습니다.",
  "집주인 또는 주거 제공자의 응답 가능 여부와 응답 시간은 보장되지 않을 수 있음을 이해했습니다.",
];

const CONTENT: Record<Locale, ApplyPageContent> = {
  ko: {
    eyebrow: "신청하기",
    title: "상담/예약 신청",
    subtitle:
      "원하는 주거 조건과 상담 정보를 남겨주시면 메이플하우스가 확인 후 안내드리는 흐름입니다.",
    mvpNotice: "현재는 MVP 미리보기 단계입니다. 입력 내용은 실제로 저장되지 않습니다.",
    sections: {
      basic: "기본 정보",
      housing: "희망 주거 조건",
      consultation: "상담 내용",
      confirmation: "확인 항목",
    },
    fields: {
      name: { label: "이름", placeholder: "예: 김메이플", required: true },
      email: { label: "이메일", placeholder: "name@example.com", required: true },
      contact: {
        label: "연락 가능한 메신저 또는 연락처",
        placeholder: "카카오톡, WhatsApp, 전화번호 등",
        required: true,
      },
      currentLocation: {
        label: "현재 거주 국가 또는 도시",
        placeholder: "예: 한국 서울 / 캐나다 토론토",
      },
      city: { label: "희망 도시", placeholder: "" },
      purpose: { label: "체류 목적", placeholder: "" },
      housingType: { label: "주거 형태", placeholder: "" },
      budget: { label: "월세 예산", placeholder: "" },
      moveInDate: { label: "입주 희망일", placeholder: "" },
      people: { label: "거주 인원", placeholder: "" },
      area: { label: "관심 있는 매물 또는 지역", placeholder: "예: 노스욕, 다운타운, 학교 근처" },
      conditions: {
        label: "꼭 확인하고 싶은 조건",
        placeholder: "교통, 안전, 계약 기간, 가구 포함 여부 등",
      },
      requests: {
        label: "추가 요청사항",
        placeholder: "상담 전에 알려주고 싶은 내용을 적어주세요.",
      },
    },
    checkboxes: [
      "실제 결제와 계약은 아직 진행되지 않는 MVP 단계임을 이해했습니다.",
      "상담 내용은 확인 후 안내되는 흐름임을 이해했습니다.",
      "입력 정보가 실제 저장되지 않는 미리보기 단계임을 이해했습니다.",
    ],
    options: {
      city: ["Toronto", "Vancouver", "Montreal", "Quebec City", "Other"],
      purpose: [
        "Study",
        "Working holiday",
        "Work / business trip",
        "Immigration / settlement",
        "Short-term stay",
        "Other",
      ],
      housingType: ["Room", "Condo", "House", "Share house", "Not sure yet"],
      budget: [
        "Under CA$1,000",
        "CA$1,000 - CA$1,500",
        "CA$1,500 - CA$2,000",
        "CA$2,000 - CA$3,000",
        "Over CA$3,000",
        "Not sure yet",
      ],
      people: ["1", "2", "3", "4+", "Family"],
    },
    selectPlaceholder: "선택하세요",
    button: "상담/예약 신청 미리보기",
    previewTitle: "신청 미리보기가 준비되었습니다",
    previewBody: "이 내용은 화면에서만 확인할 수 있으며 아직 저장되거나 전송되지 않습니다.",
    summaryTitle: "입력 요약",
    emptyValue: "미입력",
    helperTitle: "이 페이지에서 할 수 있는 것",
    helperItems: [
      "상담에 필요한 기본 정보를 한 번에 정리합니다.",
      "도시, 예산, 입주일 등 주거 조건을 미리 맞춰봅니다.",
      "실제 저장과 제출은 다음 단계에서 연결됩니다.",
    ],
  },
  en: {
    eyebrow: "Apply",
    title: "Apply for Consultation / Reservation",
    subtitle:
      "Share your housing conditions and consultation details so MapleHouse can guide the next step.",
    mvpNotice: "This is an MVP preview. Your input is not actually saved yet.",
    sections: {
      basic: "Basic information",
      housing: "Housing preferences",
      consultation: "Consultation details",
      confirmation: "Confirmation",
    },
    fields: {
      name: { label: "Name", placeholder: "Your name", required: true },
      email: { label: "Email", placeholder: "name@example.com", required: true },
      contact: {
        label: "Messenger or contact",
        placeholder: "WhatsApp, KakaoTalk, phone number, etc.",
        required: true,
      },
      currentLocation: {
        label: "Current country or city",
        placeholder: "e.g. Seoul, Korea / Toronto, Canada",
      },
      city: { label: "Preferred city", placeholder: "" },
      purpose: { label: "Stay purpose", placeholder: "" },
      housingType: { label: "Housing type", placeholder: "" },
      budget: { label: "Monthly budget", placeholder: "" },
      moveInDate: { label: "Preferred move-in date", placeholder: "" },
      people: { label: "People", placeholder: "" },
      area: {
        label: "Listing or area of interest",
        placeholder: "e.g. North York, downtown, near campus",
      },
      conditions: {
        label: "Conditions to check",
        placeholder: "Transit, safety, contract length, furnished room, etc.",
      },
      requests: {
        label: "Additional requests",
        placeholder: "Anything MapleHouse should know before the consultation.",
      },
    },
    checkboxes: [
      "I understand that real payments and contracts are not active in this MVP stage.",
      "I understand that consultation details will be reviewed before guidance is provided.",
      "I understand that the input is not actually saved in this preview stage.",
    ],
    options: {
      city: ["Toronto", "Vancouver", "Montreal", "Quebec City", "Other"],
      purpose: [
        "Study",
        "Working holiday",
        "Work / business trip",
        "Immigration / settlement",
        "Short-term stay",
        "Other",
      ],
      housingType: ["Room", "Condo", "House", "Share house", "Not sure yet"],
      budget: [
        "Under CA$1,000",
        "CA$1,000 - CA$1,500",
        "CA$1,500 - CA$2,000",
        "CA$2,000 - CA$3,000",
        "Over CA$3,000",
        "Not sure yet",
      ],
      people: ["1", "2", "3", "4+", "Family"],
    },
    selectPlaceholder: "Select",
    button: "Preview consultation request",
    previewTitle: "Request preview prepared",
    previewBody: "This preview is visible on this page only. It has not been saved or submitted.",
    summaryTitle: "Request summary",
    emptyValue: "Not entered",
    helperTitle: "What this preview helps with",
    helperItems: [
      "Collect the basic details needed for a consultation.",
      "Organize city, budget, move-in date, and household size.",
      "Real saving and submission will be connected in a later stage.",
    ],
  },
  fr: {
    eyebrow: "Faire une demande",
    title: "Demande de consultation / réservation",
    subtitle:
      "Indiquez vos conditions de logement et vos informations de consultation afin que MapleHouse puisse préparer l’étape suivante.",
    mvpNotice: "Ceci est un aperçu MVP. Les informations saisies ne sont pas encore enregistrées.",
    sections: {
      basic: "Informations de base",
      housing: "Conditions de logement souhaitées",
      consultation: "Détails de consultation",
      confirmation: "Confirmation",
    },
    fields: {
      name: { label: "Nom", placeholder: "Votre nom", required: true },
      email: { label: "Email", placeholder: "nom@example.com", required: true },
      contact: {
        label: "Messagerie ou contact",
        placeholder: "WhatsApp, KakaoTalk, téléphone, etc.",
        required: true,
      },
      currentLocation: {
        label: "Pays ou ville actuelle",
        placeholder: "ex. Séoul, Corée / Toronto, Canada",
      },
      city: { label: "Ville souhaitée", placeholder: "" },
      purpose: { label: "Objectif du séjour", placeholder: "" },
      housingType: { label: "Type de logement", placeholder: "" },
      budget: { label: "Budget mensuel", placeholder: "" },
      moveInDate: { label: "Date d’arrivée souhaitée", placeholder: "" },
      people: { label: "Personnes", placeholder: "" },
      area: {
        label: "Annonce ou quartier d’intérêt",
        placeholder: "ex. North York, centre-ville, près du campus",
      },
      conditions: {
        label: "Conditions à vérifier",
        placeholder: "Transport, sécurité, durée du bail, logement meublé, etc.",
      },
      requests: {
        label: "Demandes supplémentaires",
        placeholder: "Ce que MapleHouse doit savoir avant la consultation.",
      },
    },
    checkboxes: [
      "Je comprends que les paiements et contrats réels ne sont pas actifs dans cette étape MVP.",
      "Je comprends que les informations de consultation seront vérifiées avant l’accompagnement.",
      "Je comprends que les informations saisies ne sont pas réellement enregistrées dans cet aperçu.",
    ],
    options: {
      city: ["Toronto", "Vancouver", "Montréal", "Ville de Québec", "Autre"],
      purpose: [
        "Études",
        "PVT",
        "Travail / déplacement professionnel",
        "Immigration / installation",
        "Court séjour",
        "Autre",
      ],
      housingType: ["Chambre", "Condo", "Maison", "Colocation", "Pas encore sûr"],
      budget: [
        "Moins de 1 000 CA$",
        "1 000 - 1 500 CA$",
        "1 500 - 2 000 CA$",
        "2 000 - 3 000 CA$",
        "Plus de 3 000 CA$",
        "Pas encore sûr",
      ],
      people: ["1", "2", "3", "4+", "Famille"],
    },
    selectPlaceholder: "Choisir",
    button: "Aperçu de la demande",
    previewTitle: "Aperçu de la demande préparé",
    previewBody:
      "Cet aperçu est visible uniquement sur cette page. Il n’a pas été enregistré ni envoyé.",
    summaryTitle: "Résumé de la demande",
    emptyValue: "Non renseigné",
    helperTitle: "Ce que cet aperçu permet",
    helperItems: [
      "Regrouper les informations utiles pour une consultation.",
      "Organiser la ville, le budget, la date d’arrivée et le nombre de personnes.",
      "L’enregistrement réel et l’envoi seront connectés plus tard.",
    ],
  },
};

const TEXT_FIELDS: FieldKey[] = ["name", "email", "contact", "currentLocation"];
const SELECT_FIELDS: Array<{
  key: FieldKey;
  optionsKey: keyof ApplyPageContent["options"];
}> = [
  { key: "city", optionsKey: "city" },
  { key: "purpose", optionsKey: "purpose" },
  { key: "housingType", optionsKey: "housingType" },
  { key: "budget", optionsKey: "budget" },
  { key: "people", optionsKey: "people" },
];
const TEXTAREA_FIELDS: FieldKey[] = ["area", "conditions", "requests"];

function buildSelectedInquiryFromMockListing(locale: Locale, listingId: string) {
  const listing = MOCK_LISTINGS.find((item) => item.id === listingId);
  if (!listing) return null;

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
    roomName: SELECTED_INQUIRY_COPY[locale].fallback,
    roomType: listing.roomType[locale],
    selectedMoveInDate: "",
    selectedGuestCount: listing.maxPeople,
    thumbnailUrl: galleryUrls[0] ?? listing.imagePath,
    galleryUrls,
    source: "listings_drawer",
  });
}

function normalizeSearchString(searchStr?: string) {
  if (searchStr !== undefined) return searchStr.startsWith("?") ? searchStr.slice(1) : searchStr;
  if (typeof window === "undefined") return "";
  return window.location.search.startsWith("?") ? window.location.search.slice(1) : window.location.search;
}

function getInitialSelectedInquiryState(locale: Locale, searchStr?: string) {
  const params = new URLSearchParams(normalizeSearchString(searchStr));
  const requestedMode = params.get("mode");
  const inquiryMethod: InquiryApplyMethod | null =
    requestedMode === "direct"
      ? "direct"
      : requestedMode === "assisted"
        ? "assisted"
        : null;
  const queryListingId = params.get("listingId");
  if (!inquiryMethod) {
    return { loaded: true, shouldRender: false, inquiry: null, inquiryMethod: "assisted" as const };
  }

  try {
    const storedInquiry = readSelectedInquiryPayload({ locale, listingId: queryListingId });
    if (storedInquiry) {
      return {
        loaded: true,
        shouldRender: true,
        inquiry: storedInquiry,
        inquiryMethod,
      };
    }

    if (queryListingId) {
      const restoredInquiry = buildSelectedInquiryFromMockListing(locale, queryListingId);
      if (restoredInquiry) {
        saveSelectedInquiryPayload(restoredInquiry);
        return { loaded: true, shouldRender: true, inquiry: restoredInquiry, inquiryMethod };
      }
    }

    return { loaded: true, shouldRender: true, inquiry: null, inquiryMethod };
  } catch {
    return { loaded: true, shouldRender: true, inquiry: null, inquiryMethod };
  }
}

function readMockApplyProfile(): MockApplyProfile {
  if (typeof window === "undefined") return DEFAULT_MOCK_APPLY_PROFILE;

  try {
    const raw = window.sessionStorage.getItem(MOCK_APPLY_PROFILE_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<MockApplyProfile>) : null;
    return {
      name: typeof parsed?.name === "string" && parsed.name.trim()
        ? parsed.name
        : DEFAULT_MOCK_APPLY_PROFILE.name,
      email: typeof parsed?.email === "string" && parsed.email.trim()
        ? parsed.email
        : DEFAULT_MOCK_APPLY_PROFILE.email,
      phone: typeof parsed?.phone === "string"
        ? parsed.phone
        : DEFAULT_MOCK_APPLY_PROFILE.phone,
    };
  } catch {
    return DEFAULT_MOCK_APPLY_PROFILE;
  }
}

function getSelectedInquiryDraftKey(locale: Locale, listingId: string, method: InquiryApplyMethod) {
  return `maplehouse.applyDraft.${locale}.${method}.${listingId}`;
}

function readSelectedInquiryDraft(locale: Locale, listingId: string, method: InquiryApplyMethod) {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(getSelectedInquiryDraftKey(locale, listingId, method));
    const parsed = raw ? (JSON.parse(raw) as Partial<SavedSelectedInquiryDraft>) : null;
    const parsedLocale = typeof parsed?.locale === "string" ? parsed.locale : null;
    if (
      !parsed ||
      parsed.mode !== method ||
      parsed.listingId !== listingId ||
      (parsedLocale !== null && parsedLocale !== locale)
    ) {
      return null;
    }

    return {
      listingId,
      locale,
      mode: method,
      form: {
        ...EMPTY_SELECTED_INQUIRY_FORM,
        ...(parsed.form ?? {}),
        name: parsed.form?.name ?? parsed.name ?? EMPTY_SELECTED_INQUIRY_FORM.name,
        email: parsed.form?.email ?? parsed.email ?? EMPTY_SELECTED_INQUIRY_FORM.email,
        phone: parsed.form?.phone ?? parsed.phone ?? EMPTY_SELECTED_INQUIRY_FORM.phone,
        preferredMoveInDate:
          parsed.form?.preferredMoveInDate ??
          parsed.moveInDate ??
          EMPTY_SELECTED_INQUIRY_FORM.preferredMoveInDate,
        stayLength:
          parsed.form?.stayLength ??
          parsed.stayDuration ??
          EMPTY_SELECTED_INQUIRY_FORM.stayLength,
        people: parsed.form?.people ?? parsed.people ?? EMPTY_SELECTED_INQUIRY_FORM.people,
        questions:
          parsed.form?.questions ??
          parsed.confirmText ??
          EMPTY_SELECTED_INQUIRY_FORM.questions,
        request:
          parsed.form?.request ??
          parsed.requestText ??
          EMPTY_SELECTED_INQUIRY_FORM.request,
      },
      checked: Array.isArray(parsed.checked)
        ? parsed.checked.map(Boolean)
        : Array.isArray(parsed.checkboxes)
          ? parsed.checkboxes.map(Boolean)
          : [],
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : "",
    };
  } catch {
    return null;
  }
}

function saveSelectedInquiryDraft(
  locale: Locale,
  listingId: string,
  method: InquiryApplyMethod,
  form: SelectedInquiryApplyFormState,
  checked: boolean[],
) {
  if (typeof window === "undefined") return;

  const draft: SavedSelectedInquiryDraft = {
    listingId,
    locale,
    mode: method,
    form,
    checked,
    name: form.name,
    email: form.email,
    phone: form.phone,
    moveInDate: form.preferredMoveInDate,
    stayDuration: form.stayLength,
    people: form.people,
    confirmText: form.questions,
    requestText: form.request,
    checkboxes: checked,
    savedAt: new Date().toISOString(),
  };
  window.sessionStorage.setItem(getSelectedInquiryDraftKey(locale, listingId, method), JSON.stringify(draft));
}

function clearSelectedInquiryDraft(locale: Locale, listingId: string, method: InquiryApplyMethod) {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(getSelectedInquiryDraftKey(locale, listingId, method));
}

function getMockInquiryCompletionKey(locale: Locale) {
  return `${MOCK_INQUIRY_COMPLETION_STORAGE_KEY_PREFIX}.${locale}`;
}

function saveMockInquiryCompletion(payload: MockInquiryCompletionPayload) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    getMockInquiryCompletionKey(payload.locale),
    JSON.stringify(payload),
  );
}

function readMockInquiryCompletion(locale: Locale) {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(getMockInquiryCompletionKey(locale));
    const parsed = raw ? (JSON.parse(raw) as Partial<MockInquiryCompletionPayload>) : null;
    if (!parsed || parsed.locale !== locale || !parsed.selectedInquiry || !parsed.form) {
      return null;
    }
    return parsed as MockInquiryCompletionPayload;
  } catch {
    return null;
  }
}

function isValidSelectedInquiryEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function useSelectedInquiryForApply(locale: Locale, searchStr?: string) {
  const [state, setState] = useState(() => getInitialSelectedInquiryState(locale, searchStr));

  useEffect(() => {
    setState(getInitialSelectedInquiryState(locale, searchStr));
  }, [locale, searchStr]);

  return state;
}

export function LocaleApplyPage({ locale }: { locale: Locale }) {
  const location = useLocation() as { searchStr?: string };
  const selectedInquiryState = useSelectedInquiryForApply(locale, location.searchStr);
  if (selectedInquiryState.shouldRender) {
    return (
      <SelectedInquiryApplyPage
        locale={locale}
        loaded={selectedInquiryState.loaded}
        selectedInquiry={selectedInquiryState.inquiry}
        inquiryMethod={selectedInquiryState.inquiryMethod}
      />
    );
  }

  if (locale === "ko") {
    return <KoreanSelectedListingApplyPage />;
  }

  return <StandardApplyPage locale={locale} />;
}

export function LocaleApplyCompletePage({ locale }: { locale: Locale }) {
  const [completion, setCompletion] = useState<MockInquiryCompletionPayload | null>(null);
  const [loaded, setLoaded] = useState(false);
  const inquiryMethod = completion?.inquiryMethod ?? "assisted";
  const copy = getApplyCompleteCopy(locale, inquiryMethod);
  const inquiryCopy = getSelectedInquiryApplyCopy(locale, inquiryMethod);

  useEffect(() => {
    setCompletion(readMockInquiryCompletion(locale));
    setLoaded(true);
  }, [locale]);

  if (!loaded) {
    return (
      <main className="bg-background">
        <Container className="py-12 sm:py-16">
          <section className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-muted-foreground">{inquiryCopy.fallback}</p>
          </section>
        </Container>
      </main>
    );
  }

  if (!completion) {
    return (
      <main className="bg-background">
        <Container className="py-12 sm:py-16">
          <section className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
            <CheckCircle2 className="mx-auto h-10 w-10 text-primary" aria-hidden />
            <h1 className="mt-5 text-2xl font-bold text-foreground">{copy.emptyTitle}</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {copy.emptyBody}
            </p>
            <Button asChild size="lg" className="mt-6">
              <a href={`/${locale}/listings`}>{copy.viewListings}</a>
            </Button>
          </section>
        </Container>
      </main>
    );
  }

  const { selectedInquiry, form, submittedAt } = completion;
  const isDirectCompletion = inquiryMethod === "direct";
  const inquirerRows = [
    { label: inquiryCopy.fields.name.label, value: form.name },
    { label: inquiryCopy.fields.email.label, value: form.email },
    { label: inquiryCopy.fields.phone.label, value: form.phone },
    ...(!isDirectCompletion
      ? [
          {
            label: inquiryCopy.fields.preferredMoveInDate.label,
            value: formatSelectedDateLabel(locale, form.preferredMoveInDate, inquiryCopy.fallback),
          },
          { label: inquiryCopy.fields.stayLength.label, value: form.stayLength },
          { label: inquiryCopy.fields.people.label, value: form.people },
        ]
      : []),
    { label: copy.submittedAt, value: formatApplyCompletionTimestamp(locale, submittedAt) },
  ];
  const inquiryRows = [
    { label: inquiryCopy.fields.questions.label, value: form.questions },
    { label: inquiryCopy.fields.request.label, value: form.request },
  ];
  const detailHref = `/${locale}/listings/${selectedInquiry.listingId}`;

  return (
    <main className="bg-background">
      <Container className="py-12 sm:py-16 lg:py-18">
        <section className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {copy.eyebrow}
          </p>
          <CheckCircle2 className="mx-auto mt-5 h-12 w-12 text-primary" aria-hidden />
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {copy.title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {copy.subtitle}
          </p>
        </section>

        <div className="mx-auto mt-10 max-w-5xl space-y-6">
          <SelectedInquiryListingVisualCard
            selectedInquiry={selectedInquiry}
            title={inquiryCopy.selectedTitle}
            detailLabel={SELECTED_INQUIRY_DETAIL_BUTTON[locale]}
            detailHref={detailHref}
            fallback={inquiryCopy.fallback}
          />
          <CompletionSummaryCard
            title={copy.inquirerSummaryTitle}
            icon={<UserRound className="h-5 w-5" />}
            rows={inquirerRows}
            fallback={inquiryCopy.fallback}
          />
          <CompletionSummaryCard
            title={copy.inquirySummaryTitle}
            icon={<MessageSquareText className="h-5 w-5" />}
            rows={inquiryRows}
            fallback={inquiryCopy.fallback}
            singleColumn
          />

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">{copy.nextStepsTitle}</h2>
            <ol className="mt-4 space-y-3">
              {copy.nextSteps.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/30 text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    {step.split("\n").map((line, lineIndex) => (
                      <span
                        key={`${step}-${lineIndex}`}
                        className={cn("block", lineIndex > 0 && "mt-1")}
                      >
                        {line}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <div className="grid gap-3 pt-2 md:grid-cols-3">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full whitespace-nowrap border-border bg-white text-foreground hover:bg-[#FFF8F2] hover:text-foreground"
            >
              <a href={detailHref}>{copy.backToDetail}</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full whitespace-nowrap border-border bg-white text-foreground hover:bg-[#FFF8F2] hover:text-foreground"
            >
              <a href={`/${locale}/listings`}>{copy.viewListings}</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full whitespace-nowrap border-primary/30 bg-[#FFF7ED] text-primary hover:bg-[#FFF1E6] hover:text-primary"
            >
              <a href={`/${locale}/my/inquiries`}>{copy.viewHistory}</a>
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}

function StandardApplyPage({ locale }: { locale: Locale }) {
  const t = CONTENT[locale];
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [checked, setChecked] = useState<boolean[]>(() => t.checkboxes.map(() => false));
  const [previewVisible, setPreviewVisible] = useState(false);

  const summaryRows = useMemo(
    () => [
      { label: t.fields.name.label, value: form.name },
      { label: t.fields.email.label, value: form.email },
      { label: t.fields.contact.label, value: form.contact },
      { label: t.fields.city.label, value: form.city },
      { label: t.fields.purpose.label, value: form.purpose },
      { label: t.fields.housingType.label, value: form.housingType },
      { label: t.fields.budget.label, value: form.budget },
      { label: t.fields.moveInDate.label, value: form.moveInDate },
      { label: t.fields.people.label, value: form.people },
      { label: t.fields.area.label, value: form.area },
    ],
    [form, t],
  );

  const updateField = (key: FieldKey, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPreviewVisible(true);
  };

  return (
    <main className="bg-background">
      <Container className="py-12 sm:py-16 lg:py-18">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {t.title}
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t.subtitle}
          </p>
          <div className="mx-auto mt-5 inline-flex max-w-full rounded-full border border-primary/25 bg-primary/5 px-4 py-2 text-xs font-medium text-primary">
            {t.mvpNotice}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:p-7"
          >
            <FormSection title={t.sections.basic} icon={<UserRound />}>
              <div className="grid gap-4 sm:grid-cols-2">
                {TEXT_FIELDS.map((key) => (
                  <TextField
                    key={key}
                    id={`${locale}-${key}`}
                    field={t.fields[key]}
                    value={form[key]}
                    onChange={(value) => updateField(key, value)}
                    type={key === "email" ? "email" : "text"}
                  />
                ))}
              </div>
            </FormSection>

            <FormSection title={t.sections.housing} icon={<Home />}>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {SELECT_FIELDS.slice(0, 4).map(({ key, optionsKey }) => (
                  <SelectField
                    key={key}
                    id={`${locale}-${key}`}
                    field={t.fields[key]}
                    value={form[key]}
                    options={t.options[optionsKey]}
                    placeholder={t.selectPlaceholder}
                    onChange={(value) => updateField(key, value)}
                  />
                ))}
                <TextField
                  id={`${locale}-moveInDate`}
                  field={t.fields.moveInDate}
                  value={form.moveInDate}
                  onChange={(value) => updateField("moveInDate", value)}
                  type="date"
                />
                <SelectField
                  id={`${locale}-people`}
                  field={t.fields.people}
                  value={form.people}
                  options={t.options.people}
                  placeholder={t.selectPlaceholder}
                  onChange={(value) => updateField("people", value)}
                />
              </div>
            </FormSection>

            <FormSection title={t.sections.consultation} icon={<MessageSquareText />}>
              <div className="grid gap-4">
                {TEXTAREA_FIELDS.map((key) => (
                  <TextareaField
                    key={key}
                    id={`${locale}-${key}`}
                    field={t.fields[key]}
                    value={form[key]}
                    onChange={(value) => updateField(key, value)}
                  />
                ))}
              </div>
            </FormSection>

            <FormSection title={t.sections.confirmation} icon={<ClipboardList />}>
              <div className="grid gap-3 rounded-2xl border border-border bg-secondary/60 p-4">
                {t.checkboxes.map((item, index) => (
                  <CheckboxItem
                    key={item}
                    id={`${locale}-confirm-${index}`}
                    label={item}
                    checked={checked[index] ?? false}
                    onChange={(value) =>
                      setChecked((current) =>
                        current.map((currentValue, currentIndex) =>
                          currentIndex === index ? value : currentValue,
                        ),
                      )
                    }
                  />
                ))}
              </div>
            </FormSection>

            <div className="mt-7 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-muted-foreground">{t.mvpNotice}</p>
              <Button type="submit" size="lg" className="min-h-11 px-5">
                {t.button}
              </Button>
            </div>

            {previewVisible && (
              <PreviewPanel
                title={t.previewTitle}
                body={t.previewBody}
                summaryTitle={t.summaryTitle}
                emptyValue={t.emptyValue}
                rows={summaryRows}
              />
            )}
          </form>

          <aside className="space-y-4">
            <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-foreground">{t.helperTitle}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {t.helperItems.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </Container>
    </main>
  );
}

function SelectedInquiryApplyPage({
  locale,
  loaded,
  selectedInquiry,
  inquiryMethod,
}: {
  locale: Locale;
  loaded: boolean;
  selectedInquiry: SelectedInquiryPayload | null;
  inquiryMethod: InquiryApplyMethod;
}) {
  const t = useMemo(
    () => getSelectedInquiryApplyCopy(locale, inquiryMethod),
    [locale, inquiryMethod],
  );
  const dateCopy = APPLY_DATE_PICKER_COPY[locale];
  const [form, setForm] = useState<SelectedInquiryApplyFormState>(EMPTY_SELECTED_INQUIRY_FORM);
  const [checked, setChecked] = useState<boolean[]>(() => t.agreements.map(() => false));
  const [successVisible, setSuccessVisible] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [pendingNavigationHref, setPendingNavigationHref] = useState<string | null>(null);
  const allowNavigationRef = useRef(false);
  const historyGuardActiveRef = useRef(false);
  const shouldProtectLeaving = Boolean(selectedInquiry) && !successVisible;
  const routeBlocker = useBlocker({
    disabled: !shouldProtectLeaving,
    enableBeforeUnload: false,
    withResolver: true,
    shouldBlockFn: ({ current, next }) =>
      shouldProtectLeaving &&
      !allowNavigationRef.current &&
      (current.pathname !== next.pathname ||
        JSON.stringify(current.search) !== JSON.stringify(next.search)),
  });

  useEffect(() => {
    if (!selectedInquiry) return;
    const restoredDraft = readSelectedInquiryDraft(locale, selectedInquiry.listingId, inquiryMethod);
    if (restoredDraft) {
      setForm(restoredDraft.form);
      setChecked(t.agreements.map((_, index) => restoredDraft.checked[index] ?? false));
      setDraftRestored(true);
      setSuccessVisible(false);
      return;
    }

    const profile = readMockApplyProfile();
    setForm({
      ...EMPTY_SELECTED_INQUIRY_FORM,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      preferredMoveInDate: selectedInquiry.selectedMoveInDate || "",
      people: selectedInquiry.selectedGuestCount
        ? String(selectedInquiry.selectedGuestCount)
        : "",
    });
    setChecked(t.agreements.map(() => false));
    setDraftRestored(false);
    setSuccessVisible(false);
  }, [inquiryMethod, locale, selectedInquiry, t.agreements]);

  const updateField = (key: keyof SelectedInquiryApplyFormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const isDirectInquiry = inquiryMethod === "direct";
  const canSubmit =
    form.name.trim().length > 0 &&
    isValidSelectedInquiryEmail(form.email) &&
    checked.every(Boolean);

  const summaryRows = selectedInquiry
    ? [
        { label: t.summaryLabels.listingTitle, value: selectedInquiry.listingTitle || t.fallback },
        { label: t.summaryLabels.area, value: selectedInquiry.area || t.fallback },
        {
          label: t.summaryLabels.rent,
          value: formatSelectedInquiryRent(locale, selectedInquiry.rentCad, selectedInquiry.rentKrw),
        },
        { label: t.summaryLabels.housingType, value: selectedInquiry.housingType || t.fallback },
        { label: t.summaryLabels.room, value: selectedInquiry.roomName || t.fallback },
        { label: t.summaryLabels.moveInDate, value: formatSelectedDateLabel(locale, form.preferredMoveInDate, t.fallback) },
        {
          label: t.summaryLabels.people,
          value: form.people
            ? form.people
            : selectedInquiry.selectedGuestCount
              ? String(selectedInquiry.selectedGuestCount)
            : t.fallback,
        },
      ]
    : [];

  const draftRows = [
    { label: t.fields.name.label, value: form.name },
    { label: t.fields.email.label, value: form.email },
    { label: t.fields.phone.label, value: form.phone },
    { label: t.fields.preferredMoveInDate.label, value: form.preferredMoveInDate },
    { label: t.fields.stayLength.label, value: form.stayLength },
    { label: t.fields.people.label, value: form.people },
    { label: t.fields.questions.label, value: form.questions },
    { label: t.fields.request.label, value: form.request },
  ];

  const detailHref = selectedInquiry
    ? `/${locale}/listings/${selectedInquiry.listingId}`
    : `/${locale}/listings`;

  const navigateToHref = (href: string) => {
    if (typeof window === "undefined") return;
    allowNavigationRef.current = true;
    window.location.href = href;
  };

  const requestNavigation = (href: string) => {
    if (typeof window === "undefined") return;
    const destination = new URL(href, window.location.origin).href;

    if (shouldProtectLeaving) {
      setPendingNavigationHref(destination);
      return;
    }

    navigateToHref(destination);
  };

  const saveCurrentDraft = () => {
    if (!selectedInquiry) return;
    saveSelectedInquiryDraft(locale, selectedInquiry.listingId, inquiryMethod, form, checked);
  };

  const handleLeaveWithoutSaving = () => {
    const destination = pendingNavigationHref;
    setPendingNavigationHref(null);
    if (routeBlocker.status === "blocked") {
      allowNavigationRef.current = true;
      routeBlocker.proceed();
      return;
    }
    if (destination === HISTORY_BACK_PENDING_HREF && typeof window !== "undefined") {
      allowNavigationRef.current = true;
      window.history.go(-2);
      return;
    }
    if (destination) navigateToHref(destination);
  };

  const handleSaveDraftAndLeave = () => {
    const destination = pendingNavigationHref;
    saveCurrentDraft();
    setPendingNavigationHref(null);
    if (routeBlocker.status === "blocked") {
      allowNavigationRef.current = true;
      routeBlocker.proceed();
      return;
    }
    if (destination === HISTORY_BACK_PENDING_HREF && typeof window !== "undefined") {
      allowNavigationRef.current = true;
      window.history.go(-2);
      return;
    }
    if (destination) navigateToHref(destination);
  };

  const handleKeepWriting = () => {
    if (routeBlocker.status === "blocked") routeBlocker.reset();
    setPendingNavigationHref(null);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (shouldProtectLeaving && !historyGuardActiveRef.current) {
      window.history.pushState({ maplehouseApplyGuard: true }, "", window.location.href);
      historyGuardActiveRef.current = true;
    }
    if (!shouldProtectLeaving) {
      historyGuardActiveRef.current = false;
    }
  }, [shouldProtectLeaving]);

  useEffect(() => {
    if (!shouldProtectLeaving || typeof window === "undefined") return;

    const handlePopState = () => {
      if (allowNavigationRef.current) return;
      setPendingNavigationHref(HISTORY_BACK_PENDING_HREF);
      window.history.pushState({ maplehouseApplyGuard: true }, "", window.location.href);
      historyGuardActiveRef.current = true;
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [shouldProtectLeaving]);

  useEffect(() => {
    if (!shouldProtectLeaving || typeof window === "undefined") return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (allowNavigationRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldProtectLeaving]);

  useEffect(() => {
    if (!shouldProtectLeaving || typeof document === "undefined" || typeof window === "undefined") return;

    const handleDocumentClick = (event: globalThis.MouseEvent) => {
      if (allowNavigationRef.current || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const rawHref = anchor.getAttribute("href") ?? "";
      const normalizedHref = rawHref.trim().toLowerCase();
      if (
        normalizedHref === "" ||
        normalizedHref.startsWith("#") ||
        normalizedHref.startsWith("mailto:") ||
        normalizedHref.startsWith("tel:")
      ) {
        return;
      }

      const destination = new URL(rawHref || anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search &&
        destination.hash === window.location.hash
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setPendingNavigationHref(destination.href);
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [shouldProtectLeaving]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedInquiry || !canSubmit) return;

    const selectedInquiryForCompletion = {
      ...selectedInquiry,
      selectedMoveInDate: form.preferredMoveInDate,
      selectedGuestCount: Number(form.people) || selectedInquiry.selectedGuestCount,
    };
    const draft: MockInquiryDraftPayload = {
      selectedInquiry: {
        ...selectedInquiryForCompletion,
      },
      form,
      createdAt: new Date().toISOString(),
    };
    const completion: MockInquiryCompletionPayload = {
      locale,
      inquiryMethod,
      selectedInquiry: selectedInquiryForCompletion,
      form,
      submittedAt: draft.createdAt,
    };

    try {
      window.sessionStorage.setItem(MOCK_INQUIRY_DRAFT_STORAGE_KEY, JSON.stringify(draft));
      saveMockInquiryCompletion(completion);
    } catch {
      // MVP preview only; the success state still communicates that no real sending happened.
    }
    clearSelectedInquiryDraft(locale, selectedInquiry.listingId, inquiryMethod);
    setDraftRestored(false);
    setSuccessVisible(true);
    allowNavigationRef.current = true;
    window.location.href = `/${locale}/apply/complete`;
  };

  if (!loaded) {
    return (
      <main className="bg-background">
        <Container className="py-12 sm:py-16">
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-muted-foreground">{t.fallback}</p>
          </div>
        </Container>
      </main>
    );
  }

  if (!selectedInquiry) {
    return (
      <main className="bg-background">
        <Container className="py-12 sm:py-16">
          <section className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary">
              <Home className="h-6 w-6" />
            </span>
            <h1 className="mt-5 text-2xl font-bold text-foreground">{t.noListingTitle}</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {t.noListingBody}
            </p>
            <Button asChild size="lg" className="mt-6">
              <a href={`/${locale}/listings`}>{t.backToListings}</a>
            </Button>
          </section>
        </Container>
      </main>
    );
  }

  return (
    <main className="bg-background">
      <Container className="py-12 sm:py-16 lg:py-18">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {t.title}
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t.subtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:p-7"
          >
            <SelectedInquiryListingVisualCard
              selectedInquiry={selectedInquiry}
              title={t.selectedTitle}
              detailLabel={SELECTED_INQUIRY_DETAIL_BUTTON[locale]}
              detailHref={detailHref}
              fallback={t.fallback}
              onDetailClick={() => requestNavigation(detailHref)}
            />

            {draftRestored ? (
              <p className="mt-4 rounded-2xl border border-primary/20 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold leading-relaxed text-primary">
                {SELECTED_INQUIRY_DRAFT_RESTORE_NOTICE[locale]}
              </p>
            ) : null}

            <FormSection title={t.title} icon={<MessageSquareText />}>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  id={`${locale}-inquiry-name`}
                  field={t.fields.name}
                  value={form.name}
                  onChange={(value) => updateField("name", value)}
                />
                <TextField
                  id={`${locale}-inquiry-email`}
                  field={t.fields.email}
                  value={form.email}
                  onChange={(value) => updateField("email", value)}
                  type="email"
                />
                <TextField
                  id={`${locale}-inquiry-phone`}
                  field={t.fields.phone}
                  value={form.phone}
                  onChange={(value) => updateField("phone", value)}
                />
                {!isDirectInquiry ? (
                  <>
                    <DateSelectField
                      id={`${locale}-inquiry-move-in`}
                      field={t.fields.preferredMoveInDate}
                      value={form.preferredMoveInDate}
                      locale={locale}
                      fallback={t.fallback}
                      onOpen={() => setDatePickerOpen(true)}
                    />
                    <TextField
                      id={`${locale}-inquiry-stay-length`}
                      field={t.fields.stayLength}
                      value={form.stayLength}
                      onChange={(value) => updateField("stayLength", value)}
                    />
                    <TextField
                      id={`${locale}-inquiry-people`}
                      field={t.fields.people}
                      value={form.people}
                      onChange={(value) => updateField("people", value)}
                    />
                  </>
                ) : null}
              </div>
              <div className="mt-4 grid gap-4">
                <TextareaField
                  id={`${locale}-inquiry-questions`}
                  field={t.fields.questions}
                  value={form.questions}
                  onChange={(value) => updateField("questions", value)}
                />
                <TextareaField
                  id={`${locale}-inquiry-request`}
                  field={t.fields.request}
                  value={form.request}
                  onChange={(value) => updateField("request", value)}
                />
              </div>
            </FormSection>

            <FormSection title={t.agreementTitle} icon={<CheckCircle2 />}>
              <div className="grid gap-3 rounded-2xl border border-border bg-secondary/60 p-4">
                {t.agreements.map((item, index) => (
                  <CheckboxItem
                    key={item}
                    id={`${locale}-inquiry-agreement-${index}`}
                    label={item}
                    checked={checked[index] ?? false}
                    required
                    onChange={(value) => {
                      setChecked((current) =>
                        current.map((currentValue, currentIndex) =>
                          currentIndex === index ? value : currentValue,
                        ),
                      );
                    }}
                  />
                ))}
              </div>
            </FormSection>

            <div className="mt-7 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-muted-foreground">{t.subtitle}</p>
              <Button type="submit" size="lg" className="min-h-11 px-5" disabled={!canSubmit}>
                {t.submit}
              </Button>
            </div>

            {successVisible ? (
              <PreviewPanel
                title={t.successTitle}
                body={t.successBody}
                summaryTitle={t.selectedTitle}
                emptyValue={t.fallback}
                rows={draftRows}
              />
            ) : null}
          </form>

          <aside className="space-y-4">
            <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <ClipboardList className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                <span>{t.detailsTitle}</span>
              </h2>
              <dl className="mt-4 space-y-2.5">
                <SummaryIconRow icon={<Home className="h-4 w-4" />} label={summaryRows[0]?.label ?? t.summaryLabels.listingTitle} value={summaryRows[0]?.value ?? t.fallback} />
                <SummaryIconRow icon={<MapPin className="h-4 w-4" />} label={summaryRows[1]?.label ?? t.summaryLabels.area} value={summaryRows[1]?.value ?? t.fallback} />
                <SummaryIconRow icon={<Mail className="h-4 w-4" />} label={summaryRows[2]?.label ?? t.summaryLabels.rent} value={summaryRows[2]?.value ?? t.fallback} />
                <SummaryIconRow icon={<ClipboardList className="h-4 w-4" />} label={summaryRows[3]?.label ?? t.summaryLabels.housingType} value={summaryRows[3]?.value ?? t.fallback} />
                <SummaryIconRow icon={<Home className="h-4 w-4" />} label={summaryRows[4]?.label ?? t.summaryLabels.room} value={summaryRows[4]?.value ?? t.fallback} />
                <SummaryIconRow icon={<CalendarDays className="h-4 w-4" />} label={summaryRows[5]?.label ?? t.summaryLabels.moveInDate} value={summaryRows[5]?.value ?? t.fallback} />
                <SummaryIconRow icon={<UserRound className="h-4 w-4" />} label={summaryRows[6]?.label ?? t.summaryLabels.people} value={summaryRows[6]?.value ?? t.fallback} />
              </dl>
            </section>
          </aside>
        </div>

        {datePickerOpen ? (
          <ApplyDatePickerModal
            copy={dateCopy}
            locale={locale}
            selectedDate={form.preferredMoveInDate}
            onSelectDate={(value) => updateField("preferredMoveInDate", value)}
            onClose={() => setDatePickerOpen(false)}
            onApply={() => setDatePickerOpen(false)}
          />
        ) : null}

        {pendingNavigationHref || routeBlocker.status === "blocked" ? (
          <LeaveInquiryConfirmModal
            copy={LEAVE_INQUIRY_MODAL_COPY[locale]}
            onLeave={handleLeaveWithoutSaving}
            onSaveDraft={handleSaveDraftAndLeave}
            onKeepWriting={handleKeepWriting}
          />
        ) : null}
      </Container>
    </main>
  );
}

function getSelectedInquiryImageUrls(selectedInquiry: SelectedInquiryPayload) {
  const urls = [selectedInquiry.thumbnailUrl, ...selectedInquiry.galleryUrls]
    .map((url) => url.trim())
    .filter(Boolean);
  return Array.from(new Set(urls));
}

function SelectedInquiryListingVisualCard({
  selectedInquiry,
  title,
  detailLabel,
  detailHref,
  fallback,
  onDetailClick,
}: {
  selectedInquiry: SelectedInquiryPayload;
  title: string;
  detailLabel: string;
  detailHref: string;
  fallback: string;
  onDetailClick?: () => void;
}) {
  const linkClassName =
    "h-auto shrink-0 rounded-none bg-transparent px-0 py-0 text-xs font-semibold text-[#FA7000] shadow-none hover:bg-transparent hover:text-[#E76600] hover:underline focus-visible:ring-[#FA7000]";

  return (
    <section className="rounded-3xl border border-primary/20 bg-[#FFFDF9] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{title}</p>
        {onDetailClick ? (
          <Button type="button" size="sm" className={linkClassName} onClick={onDetailClick}>
            {detailLabel}
          </Button>
        ) : (
          <Button asChild size="sm" className={linkClassName}>
            <a href={detailHref}>{detailLabel}</a>
          </Button>
        )}
      </div>
      <SelectedListingMiniGallery
        className="mt-4"
        title={selectedInquiry.listingTitle}
        images={getSelectedInquiryImageUrls(selectedInquiry)}
        fallback={fallback}
      />
    </section>
  );
}

function SelectedListingMiniGallery({
  title,
  images,
  fallback,
  className,
}: {
  title: string;
  images: string[];
  fallback: string;
  className?: string;
}) {
  const imageSlots = images.slice(0, 5);
  const singleImage = imageSlots.length <= 1;

  if (singleImage) {
    return (
      <div className={cn("h-[220px] overflow-hidden rounded-2xl border border-border bg-secondary sm:h-[260px]", className)}>
        <ListingImageFrame
          src={imageSlots[0]}
          alt={title}
          fit="cover"
          className="h-full w-full"
          fallback={<SelectedListingGalleryFallback fallback={fallback} />}
        />
      </div>
    );
  }

  return (
    <div className={cn("grid h-[240px] gap-2 overflow-hidden rounded-2xl sm:h-[280px] md:grid-cols-[minmax(0,1.35fr)_minmax(180px,0.85fr)]", className)}>
      <ListingImageFrame
        src={imageSlots[0]}
        alt={title}
        fit="cover"
        className="min-h-0 rounded-2xl border border-border bg-secondary"
        fallback={<SelectedListingGalleryFallback fallback={fallback} />}
      />
      <div className="grid min-h-0 grid-cols-2 gap-2 md:grid-rows-2">
        {imageSlots.slice(1, 5).map((src, index) => (
          <ListingImageFrame
            key={`${src}-${index}`}
            src={src}
            alt={title}
            fit="cover"
            className="min-h-0 rounded-2xl border border-border bg-secondary"
            fallback={<SelectedListingGalleryFallback fallback={fallback} compact />}
          />
        ))}
      </div>
    </div>
  );
}

function SelectedListingGalleryFallback({
  fallback,
  compact = false,
}: {
  fallback: string;
  compact?: boolean;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-accent px-3 text-center text-primary">
      <Home className={cn("shrink-0", compact ? "h-5 w-5" : "h-8 w-8")} aria-hidden />
      {!compact ? <span className="text-xs font-semibold">{fallback}</span> : null}
    </div>
  );
}

function DateSelectField({
  id,
  field,
  value,
  locale,
  fallback,
  onOpen,
}: {
  id: string;
  field: FieldText;
  value: string;
  locale: Locale;
  fallback: string;
  onOpen: () => void;
}) {
  return (
    <div>
      <FieldLabel field={field} />
      <button
        id={id}
        type="button"
        onClick={onOpen}
        className={cn(
          "mt-1.5 flex h-11 w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-input bg-background px-3 text-left text-sm outline-none transition-colors hover:border-primary/45 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary",
          value ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <span className="min-w-0 truncate">{value ? formatSelectedDateLabel(locale, value, fallback) : fallback}</span>
        <CalendarDays className="h-4 w-4 shrink-0 text-primary" aria-hidden />
      </button>
    </div>
  );
}

function SummaryIconRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 gap-3 rounded-2xl border border-border bg-background px-3 py-2.5">
      <span className="mt-0.5 shrink-0 text-primary" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] font-medium leading-tight text-muted-foreground">{label}</dt>
        <dd className="mt-1 min-w-0 break-words text-sm font-semibold leading-snug text-foreground">{value}</dd>
      </div>
    </div>
  );
}

function LeaveInquiryConfirmModal({
  copy,
  onLeave,
  onSaveDraft,
  onKeepWriting,
}: {
  copy: LeaveInquiryModalCopy;
  onLeave: () => void;
  onSaveDraft: () => void;
  onKeepWriting: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/40 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onKeepWriting();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-inquiry-title"
        className="w-full max-w-lg rounded-3xl border border-border bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
              MapleHouse
            </p>
            <h2 id="leave-inquiry-title" className="mt-2 break-words text-xl font-bold text-foreground">
              {copy.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onKeepWriting}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label={copy.keepWriting}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{copy.description}</p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl border-border text-muted-foreground hover:text-foreground"
            onClick={onLeave}
          >
            {copy.leave}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl border-[#FA7000] text-[#FA7000] hover:bg-[#FFF8F1] hover:text-[#FA7000]"
            onClick={onSaveDraft}
          >
            {copy.saveDraft}
          </Button>
          <Button
            type="button"
            className="rounded-2xl bg-[#FA7000] text-white hover:bg-[#E76600]"
            onClick={onKeepWriting}
          >
            {copy.keepWriting}
          </Button>
        </div>
      </section>
    </div>
  );
}

function ApplyDatePickerModal({
  copy,
  locale,
  selectedDate,
  onSelectDate,
  onClose,
  onApply,
}: {
  copy: ApplyDatePickerCopy;
  locale: Locale;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onClose: () => void;
  onApply: () => void;
}) {
  const [baseMonth, setBaseMonth] = useState(() => new Date(2026, 7, 1));
  const months = [baseMonth, new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1, 1)];
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
        aria-labelledby="apply-date-picker-title"
        className="w-full max-w-3xl rounded-3xl border border-border bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex min-w-0 items-start justify-between gap-4">
          <h2 id="apply-date-picker-title" className="break-words text-xl font-bold text-foreground">
            {copy.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label={copy.close}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setBaseMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary"
            aria-label={copy.previousMonth}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <div className="h-px flex-1" />
          <button
            type="button"
            onClick={() => setBaseMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary"
            aria-label={copy.nextMonth}
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {months.map((month) => (
            <ApplyCalendarMonth
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
            {copy.unavailableLabel}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="rounded-2xl" onClick={() => onSelectDate("")}>
              {copy.reset}
            </Button>
            <Button
              type="button"
              className="rounded-2xl bg-[#FA7000] text-white hover:bg-[#E76600]"
              onClick={onApply}
            >
              {copy.apply}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ApplyCalendarMonth({
  copy,
  locale,
  month,
  unavailableDates,
  selectedDate,
  onSelectDate,
}: {
  copy: ApplyDatePickerCopy;
  locale: Locale;
  month: Date;
  unavailableDates: Set<string>;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}) {
  const days = buildApplyCalendarDays(month);

  return (
    <div className="min-w-0 rounded-3xl border border-border bg-white p-4">
      <h3 className="text-center text-sm font-semibold text-foreground">
        {formatApplyMonthLabel(month, locale)}
      </h3>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
        {copy.weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} className="h-9" />;
          const key = toApplyDateKey(day);
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

function buildApplyCalendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const days: Array<Date | null> = Array.from({ length: firstDay.getDay() }, () => null);

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(month.getFullYear(), month.getMonth(), day));
  }

  return days;
}

function toApplyDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function formatApplyMonthLabel(date: Date, locale: Locale) {
  if (locale === "ko") return new Intl.DateTimeFormat("ko-KR", { month: "long", year: "numeric" }).format(date);
  if (locale === "fr") return new Intl.DateTimeFormat("fr-CA", { month: "long", year: "numeric" }).format(date);
  return new Intl.DateTimeFormat("en-CA", { month: "long", year: "numeric" }).format(date);
}

function formatSelectedDateLabel(locale: Locale, dateKey: string, fallback: string) {
  if (!dateKey) return fallback;
  const date = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateKey;
  if (locale === "ko") return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(date);
  if (locale === "fr") return new Intl.DateTimeFormat("fr-CA", { dateStyle: "medium" }).format(date);
  return new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(date);
}

function formatSelectedInquiryRent(locale: Locale, rentCad: number, rentKrw: number) {
  const cad = `C$${rentCad.toLocaleString("en-CA")}`;
  if (locale === "ko" && rentKrw > 0) {
    return `${cad} / 약 ${rentKrw.toLocaleString("ko-KR")}원`;
  }
  return cad;
}

function formatApplyCompletionTimestamp(locale: Locale, value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(
    locale === "ko" ? "ko-KR" : locale === "fr" ? "fr-CA" : "en-CA",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

function KoreanSelectedListingApplyPage() {
  const [selectedListing, setSelectedListing] = useState<SelectedListingApplySummary | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState<KoreanApplyFormState>(EMPTY_KO_APPLY_FORM);
  const [selectedChecks, setSelectedChecks] = useState<string[]>([]);
  const [scopeChecked, setScopeChecked] = useState<boolean[]>(() =>
    KO_SERVICE_SCOPE_ITEMS.map(() => false),
  );
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoaded(true);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const isAssistedMode = params.get("mode") === "assisted";
    const listingId = params.get("listingId");

    if (!isAssistedMode || !listingId) {
      setLoaded(true);
      return;
    }

    try {
      const raw = window.sessionStorage.getItem(KO_SELECTED_LISTING_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Partial<SelectedListingApplySummary>) : null;
      if (
        parsed?.listingId === listingId &&
        typeof parsed.title === "string" &&
        typeof parsed.area === "string" &&
        typeof parsed.housingType === "string" &&
        typeof parsed.rent === "number" &&
        typeof parsed.rentKRW === "number" &&
        typeof parsed.capacity === "number" &&
        typeof parsed.lastChecked === "string" &&
        typeof parsed.thumbnail === "string" &&
        (parsed.verificationStatus === "verified" ||
          parsed.verificationStatus === "needs_check" ||
          parsed.verificationStatus === "preparing")
      ) {
        setSelectedListing(parsed as SelectedListingApplySummary);
      }
    } catch {
      setSelectedListing(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  const summaryRows = useMemo(
    () => [
      { label: "선택한 매물", value: selectedListing?.title ?? "" },
      { label: "이름", value: form.name },
      { label: "이메일", value: form.email },
      { label: "연락처", value: form.contact },
      { label: "현재 거주 국가", value: form.currentLocation },
      { label: "예상 출국/입국일", value: form.arrivalPlan },
      { label: "희망 입주일", value: form.moveInDate },
      { label: "예상 거주 기간", value: form.stayPeriod },
      { label: "거주 인원", value: form.people },
      { label: "월세 예산", value: form.budget },
      { label: "확인 요청 항목", value: selectedChecks.join(", ") },
    ],
    [form, selectedChecks, selectedListing],
  );

  const updateField = (key: keyof KoreanApplyFormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleCheckItem = (item: string, checked: boolean) => {
    setSelectedChecks((current) =>
      checked ? [...current, item] : current.filter((currentItem) => currentItem !== item),
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPreviewVisible(true);
  };

  if (!loaded) {
    return (
      <main className="bg-background">
        <Container className="py-12 sm:py-16">
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-muted-foreground">선택한 매물 정보를 불러오고 있습니다.</p>
          </div>
        </Container>
      </main>
    );
  }

  if (!selectedListing) {
    return <KoreanApplyEmptyState />;
  }

  return (
    <main className="bg-background">
      <Container className="py-12 sm:py-16 lg:py-18">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-primary/25 bg-card p-5 shadow-sm sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                선택한 매물
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
                <img
                  src={selectedListing.thumbnail}
                  alt={selectedListing.title}
                  className="h-36 w-full rounded-2xl border border-border bg-secondary object-cover sm:h-full"
                />
                <div className="min-w-0">
                  <h1 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
                    메이플하우스와 함께 이 매물을 확인해볼까요?
                  </h1>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    선택한 매물에 대해 집주인 또는 주거 제공자에게 확인하고 싶은 내용을
                    정리해 주세요. 아직 실제 결제나 계약은 진행되지 않습니다.
                  </p>
                  <div className="mt-4 rounded-2xl border border-border bg-background p-4">
                    <h2 className="text-base font-bold text-foreground">{selectedListing.title}</h2>
                    <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <ListingSummaryItem label="지역" value={selectedListing.area} />
                      <ListingSummaryItem label="주거 형태" value={selectedListing.housingType} />
                      <ListingSummaryItem
                        label="월세"
                        value={`CA$${selectedListing.rent.toLocaleString("en-CA")} / 약 ${selectedListing.rentKRW.toLocaleString("ko-KR")}원`}
                      />
                      <ListingSummaryItem label="거주 인원" value={`${selectedListing.capacity}명까지`} />
                      <ListingSummaryItem label="최근 확인일" value={selectedListing.lastChecked} />
                      <ListingSummaryItem
                        label="확인 상태"
                        value={KO_SELECTED_LISTING_STATUS_LABEL[selectedListing.verificationStatus]}
                      />
                    </dl>
                  </div>
                </div>
              </div>
            </section>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:p-7"
            >
              <FormSection title="기본 정보" icon={<UserRound />}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    id="ko-selected-name"
                    field={{ label: "이름", placeholder: "예: 김메이플", required: true }}
                    value={form.name}
                    onChange={(value) => updateField("name", value)}
                  />
                  <TextField
                    id="ko-selected-email"
                    field={{ label: "이메일", placeholder: "name@example.com", required: true }}
                    value={form.email}
                    onChange={(value) => updateField("email", value)}
                    type="email"
                  />
                  <TextField
                    id="ko-selected-contact"
                    field={{
                      label: "전화번호 또는 카카오톡 ID",
                      placeholder: "카카오톡 ID, WhatsApp, 전화번호 등",
                      required: true,
                    }}
                    value={form.contact}
                    onChange={(value) => updateField("contact", value)}
                  />
                  <TextField
                    id="ko-selected-location"
                    field={{ label: "현재 거주 국가", placeholder: "예: 한국 / 캐나다" }}
                    value={form.currentLocation}
                    onChange={(value) => updateField("currentLocation", value)}
                  />
                  <TextField
                    id="ko-selected-arrival"
                    field={{ label: "예상 출국일 또는 입국일", placeholder: "" }}
                    value={form.arrivalPlan}
                    onChange={(value) => updateField("arrivalPlan", value)}
                    type="date"
                  />
                </div>
              </FormSection>

              <FormSection title="입주 정보" icon={<Home />}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    id="ko-selected-move-in"
                    field={{ label: "희망 입주일", placeholder: "" }}
                    value={form.moveInDate}
                    onChange={(value) => updateField("moveInDate", value)}
                    type="date"
                  />
                  <TextField
                    id="ko-selected-period"
                    field={{ label: "예상 거주 기간", placeholder: "예: 6개월 / 1년" }}
                    value={form.stayPeriod}
                    onChange={(value) => updateField("stayPeriod", value)}
                  />
                  <SelectField
                    id="ko-selected-people"
                    field={{ label: "거주 인원", placeholder: "" }}
                    value={form.people}
                    options={["1명", "2명", "3명", "4명 이상", "가족"]}
                    placeholder="선택"
                    onChange={(value) => updateField("people", value)}
                  />
                  <SelectField
                    id="ko-selected-budget"
                    field={{ label: "월세 예산 범위", placeholder: "" }}
                    value={form.budget}
                    options={[
                      "C$1,000 이하",
                      "C$1,000-1,500",
                      "C$1,500-2,000",
                      "C$2,000-3,000",
                      "C$3,000 이상",
                      "아직 확실하지 않음",
                    ]}
                    placeholder="선택"
                    onChange={(value) => updateField("budget", value)}
                  />
                </div>
              </FormSection>

              <FormSection title="이 매물에서 꼭 확인하고 싶은 것" icon={<ClipboardList />}>
                <div className="grid gap-2 sm:grid-cols-2">
                  {KO_LISTING_CHECK_ITEMS.map((item) => (
                    <CheckboxItem
                      key={item}
                      id={`ko-listing-check-${item}`}
                      label={item}
                      checked={selectedChecks.includes(item)}
                      onChange={(checked) => toggleCheckItem(item, checked)}
                    />
                  ))}
                </div>
              </FormSection>

              <FormSection title="집주인에게 대신 물어봐줬으면 하는 질문" icon={<MessageSquareText />}>
                <TextareaField
                  id="ko-selected-landlord-questions"
                  field={{
                    label: "추가 질문",
                    placeholder:
                      "예: 실제 입주 가능일, 방 크기, 공용공간 사용 규칙, 추가 비용이 궁금합니다.",
                  }}
                  value={form.landlordQuestions}
                  onChange={(value) => updateField("landlordQuestions", value)}
                />
              </FormSection>

              <FormSection title="서비스 범위 확인" icon={<CheckCircle2 />}>
                <div className="grid gap-3 rounded-2xl border border-border bg-secondary/60 p-4">
                  {KO_SERVICE_SCOPE_ITEMS.map((item, index) => (
                    <CheckboxItem
                      key={item}
                      id={`ko-service-scope-${index}`}
                      label={item}
                      checked={scopeChecked[index] ?? false}
                      required
                      onChange={(value) =>
                        setScopeChecked((current) =>
                          current.map((currentValue, currentIndex) =>
                            currentIndex === index ? value : currentValue,
                          ),
                        )
                      }
                    />
                  ))}
                </div>
              </FormSection>

              <div className="mt-7 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  입력 내용은 현재 화면에서만 미리보기로 확인되며, 실제 전송이나 저장은 하지 않습니다.
                </p>
                <Button type="submit" size="lg" className="min-h-11 px-5">
                  확인 요청서 미리보기
                </Button>
              </div>

              {previewVisible && (
                <PreviewPanel
                  title="요청서 초안이 준비되었습니다."
                  body="현재 MVP에서는 실제 전송하지 않습니다. 입력한 내용은 이 화면에서만 확인할 수 있습니다."
                  summaryTitle="요청 요약"
                  emptyValue="미입력"
                  rows={summaryRows}
                />
              )}
            </form>
          </div>

          <aside className="space-y-4">
            <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                <MapPinned className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-foreground">
                MapleHouse가 정리해볼 내용
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {[
                  "집주인에게 확인할 질문을 정리합니다.",
                  "계약 전 확인할 항목을 빠뜨리지 않게 돕습니다.",
                  "실제 계약, 결제, 송금은 진행하지 않습니다.",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </Container>
    </main>
  );
}

function KoreanApplyEmptyState() {
  return (
    <main className="bg-background">
      <Container className="py-12 sm:py-16">
        <section className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary">
            <Home className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-foreground">
            선택한 매물이 없습니다
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            매물 리스트에서 관심 있는 매물을 먼저 선택하면, 이곳에서 확인 요청서를 작성할 수 있습니다.
          </p>
          <Button asChild size="lg" className="mt-6">
            <a href="/ko/listings">매물 보러가기</a>
          </Button>
        </section>
      </Container>
    </main>
  );
}

function ListingSummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card px-3 py-2">
      <dt className="text-[11px] font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function PreviewPanel({
  title,
  body,
  summaryTitle,
  emptyValue,
  rows,
}: {
  title: string;
  body: string;
  summaryTitle: string;
  emptyValue: string;
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <section
      className="mt-5 rounded-3xl border border-primary/35 bg-primary/5 p-5 shadow-sm"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Mail className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
        </div>
      </div>
      <h3 className="mt-5 text-sm font-semibold text-foreground">{summaryTitle}</h3>
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="rounded-xl bg-card px-3 py-2">
            <dt className="text-[11px] font-medium text-muted-foreground">{row.label}</dt>
            <dd className="mt-0.5 text-sm font-medium text-foreground">
              {row.value.trim() || emptyValue}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function CompletionSummaryCard({
  title,
  icon,
  rows,
  fallback,
  singleColumn = false,
}: {
  title: string;
  icon: ReactNode;
  rows: Array<{ label: string; value: string }>;
  fallback: string;
  singleColumn?: boolean;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <span className="inline-flex shrink-0 text-primary [&_svg]:stroke-[1.8]" aria-hidden>
          {icon}
        </span>
        <span>{title}</span>
      </h2>
      <dl className={cn("mt-4 grid gap-3", singleColumn ? "grid-cols-1" : "sm:grid-cols-2")}>
        {rows.map((row) => (
          <div key={row.label} className="rounded-2xl border border-border bg-background px-3 py-2.5">
            <dt className="text-[11px] font-medium leading-tight text-muted-foreground">{row.label}</dt>
            <dd className="mt-1 min-w-0 break-words text-sm font-semibold leading-snug text-foreground">
              {row.value.trim() || fallback}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function FormSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-border py-6 first:pt-0 last:border-b-0 last:pb-0">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="inline-flex shrink-0 items-center justify-center text-primary [&_svg]:h-5 [&_svg]:w-5 [&_svg]:stroke-[1.8]">
          {icon}
        </span>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function TextField({
  id,
  field,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  field: FieldText;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "date";
}) {
  return (
    <label htmlFor={id} className="block">
      <FieldLabel field={field} />
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
        placeholder={type === "date" ? undefined : field.placeholder}
      />
    </label>
  );
}

function SelectField({
  id,
  field,
  value,
  options,
  placeholder,
  onChange,
}: {
  id: string;
  field: FieldText;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="block">
      <FieldLabel field={field} />
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary",
          value ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextareaField({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: FieldText;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="block">
      <FieldLabel field={field} />
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 min-h-28 w-full resize-y rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
        placeholder={field.placeholder}
      />
    </label>
  );
}

function FieldLabel({ field }: { field: FieldText }) {
  return (
    <span className="block text-xs font-medium text-muted-foreground">
      {field.label}
      {field.required && <span className="ml-1 text-primary">*</span>}
    </span>
  );
}

function CheckboxItem({
  id,
  label,
  checked,
  required,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  required?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        required={required}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
          checked
            ? "border-primary bg-primary text-white"
            : "border-input bg-white text-transparent",
        )}
      >
        <Check className="h-3 w-3 stroke-[3]" />
      </span>
      <span className="leading-relaxed">{label}</span>
    </label>
  );
}
