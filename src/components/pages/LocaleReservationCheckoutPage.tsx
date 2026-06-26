import { Check, CircleHelp, Inbox } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { ListingImageFrame } from "@/components/ui/listing-image-frame";
import type { Locale } from "@/lib/i18n";
import {
  getMockListingRoomOption,
  type MockListingRoomOption,
} from "@/lib/mockListingRooms";
import { cn } from "@/lib/utils";
import paymentLogoManifestRaw from "../../../public/payment-logos/manifest.json";
import { MOCK_LISTINGS, type MockListing } from "./LocaleListingsPage";

type ReservationCurrency = "CAD" | "KRW";

type CheckoutContext = {
  listing: MockListing;
  room: MockListingRoomOption;
};

type PaymentMethodKey = "card" | "transfer" | "quick";

type CompletionState = {
  checkoutSessionId: string;
  listingId: string;
  roomId: string;
  currency: ReservationCurrency;
  paymentMethod: PaymentMethodKey;
  selectedIssuer?: string;
  requestAmount: string;
  requestNumber: string;
  inquiryId?: string;
  status: "received_pending_review";
  submittedAt: string;
  requestedAt: string;
};

type IssuerOption = {
  mark: string;
  name: string;
  logoId?: string;
};

type PaymentLogoManifestEntry = {
  id: string;
  label: string;
  category: string;
  signature: string | null;
  original: string | null;
  fill: string | null;
  alternate?: string | null;
  extra?: string[];
};

type PaymentLogoAsset = {
  alt: string;
  src: string;
};

type CheckoutUiCopy = {
  selectedIssuerLabel: string;
  issuerRequired: string;
  otherIssuerAction: string;
  otherIssuerTitle: string;
  closeAction: string;
  previewPaymentAction: string;
  paymentWindowTitle: string;
  paymentWindowSubtitle: string;
  paymentWindowClose: string;
  paymentWindowNotice: string;
  duplicateTitle: string;
  duplicateBody: string;
  duplicateRedirect: string;
  duplicateViewAction: string;
  processingLabel: string;
  transferBankLabel: string;
  quickPayTitle: string;
  selectedQuickPayLabel: string;
  submittedAtLabel: string;
  processingStatusLabel: string;
  processingStatusValue: string;
  directIssuers: IssuerOption[];
  otherIssuers: IssuerOption[];
  quickProviders: IssuerOption[];
};

type CheckoutCopy = {
  home: string;
  reservation: string;
  checkout: string;
  complete: string;
  backToReservation: string;
  listingDetailsAction: string;
  listingsAction: string;
  heroTitle: string;
  heroSubtitle: string;
  heroNote: string;
  emptyCheckoutTitle: string;
  emptyCheckoutDescription: string;
  emptyCompleteTitle: string;
  emptyCompleteDescription: string;
  metadata: {
    listing: string;
    room: string;
    moveIn: string;
    currency: string;
    inquiry: string;
  };
  values: {
    moveIn: string;
    guests: string;
    stay: string;
    tax: string;
    total: string;
  };
  profile: {
    title: string;
    moveIn: string;
    selectedRoom: string;
  };
  sections: {
    paymentDetails: string;
    paymentMethod: string;
    confirmation: string;
    caution: string;
    cancellation: string;
    summary: string;
    completeReservation: string;
    completePayment: string;
    mvp: string;
    nextSteps: string;
  };
  paymentRows: {
    rent: string;
    deposit: string;
    initialPayment: string;
    supportFee: string;
    tax: string;
    total: string;
  };
  paymentHelp: {
    initialPayment: string;
    supportFee: string;
  };
  paymentMethodNote: string;
  productSummaryTitle: string;
  cardIssuerTitle: string;
  cardIssuerNote: string;
  transferTitle: string;
  transferAccountLabel: string;
  transferHolderLabel: string;
  transferPayerLabel: string;
  transferPayerPlaceholder: string;
  transferNote: string;
  quickPayNote: string;
  receiptEmailLabel: string;
  receiptEmailPlaceholder: string;
  receiptEmailHelper: string;
  selectedMethodBadge: string;
  mvpBadge: string;
  paymentMethods: Array<{
    key: PaymentMethodKey;
    label: string;
    description: string;
  }>;
  cardIssuers: string[];
  disabledFields: string[];
  cautionNotes: string[];
  checklistItems: string[];
  checklistValidation: string;
  cancellationNotes: string[];
  railTitle: string;
  requestPaymentAction: string;
  completeTitle: string;
  completeSubtitle: string;
  completeSections: {
    reservation: string;
    payment: string;
    mvp: string;
    next: string;
  };
  completeRows: {
    listing: string;
    room: string;
    moveIn: string;
    guests: string;
    stay: string;
    paymentStatus: string;
    paymentRequestStatus: string;
    requestAmount: string;
    paymentMethod: string;
    requestNumber: string;
  };
  completeValues: {
    paymentStatus: string;
    paymentRequestStatus: string;
  };
  completeMvpNotes: string[];
  nextSteps: string[];
  inquiryHistoryAction: string;
  reservationHistoryAction: string;
};

const RESERVATION_COMPLETION_STORAGE_KEY = "maplehouse.reservationCompletion.v1";
const CHECKOUT_SESSION_STORAGE_PREFIX = "maplehouse.checkoutSession.v1:";
const CHECKOUT_REQUEST_STORAGE_PREFIX = "maplehouse.checkoutRequest.v1:";
const PAYMENT_LOGO_MANIFEST = (paymentLogoManifestRaw as unknown[]).filter(
  isPaymentLogoManifestEntry,
);
const PAYMENT_LOGO_FALLBACK_IDS: Record<string, string[]> = {
  "citi-card": ["citi-bank"],
  "hana-card": ["hana-bank"],
  "ibk-card": ["ibk-bank"],
  "kb-card": ["kb-bank"],
  "nh-card": ["nh-bank"],
  "sc-card": ["sc-bank"],
  "shinhan-card": ["shinhan-bank"],
  "woori-card": ["woori-bank"],
};

const CHECKOUT_COPY: Record<Locale, CheckoutCopy> = {
  ko: {
    home: "홈",
    reservation: "예약하기",
    checkout: "결제 정보 확인",
    complete: "예약 요청 접수",
    backToReservation: "예약 정보로 돌아가기",
    listingDetailsAction: "매물 상세 페이지로 이동",
    listingsAction: "매물 목록 보기",
    heroTitle: "결제 정보 확인",
    heroSubtitle:
      "예약 요청 전 결제 참고 정보와 확인 항목을 정리했습니다.",
    heroNote:
      "금액과 조건을 확인한 뒤 결제 요청을 접수해 주세요.",
    emptyCheckoutTitle: "결제 정보를 찾을 수 없습니다.",
    emptyCheckoutDescription:
      "매물과 방 정보가 있는 예약 화면에서 다시 진행해 주세요.",
    emptyCompleteTitle: "접수된 예약 요청 정보를 찾을 수 없습니다.",
    emptyCompleteDescription:
      "예약 요청 완료 화면은 결제 요청 접수 이후에 표시됩니다.",
    metadata: {
      listing: "매물명",
      room: "선택한 방",
      moveIn: "입주예정일",
      currency: "통화",
      inquiry: "연결된 문의",
    },
    values: {
      moveIn: "2026. 8. 15.",
      guests: "1명",
      stay: "3개월",
      tax: "조건 확인 후 산정",
      total: "결제 요청 전 확인",
    },
    profile: {
      title: "선택한 매물과 방",
      moveIn: "입주예정일",
      selectedRoom: "선택한 방",
    },
    sections: {
      paymentDetails: "결제 참고 정보",
      paymentMethod: "결제 수단",
      confirmation: "결제 요청 전 확인",
      caution: "결제 전 주의사항",
      cancellation: "취소 및 환불 안내",
      summary: "결제 요약",
      completeReservation: "예약 요청 요약",
      completePayment: "결제 요청 요약",
      mvp: "안내",
      nextSteps: "다음 단계",
    },
    paymentRows: {
      rent: "월세",
      deposit: "보증금",
      initialPayment: "초기 입금액",
      supportFee: "서비스 이용료",
      tax: "부가세·세금",
      total: "총 결제 금액",
    },
    paymentHelp: {
      initialPayment: "첫 월세와 보증금, 마지막 달 월세로 사용될 금액을 기준으로 계산한 금액입니다. 토론토·온타리오 지역 임대 계약에서 자주 사용하는 일반적인 형태를 기준으로 안내합니다. 금액과 조건은 매물 및 임대인 조건에 따라 달라질 수 있습니다.",
      supportFee: "MapleHouse가 문의 정리, 예약 보조, 고객 응대 등의 운영 지원을 위해 부과하는 비용입니다. 서비스 범위에 따라 금액은 달라질 수 있습니다.",
    },
    paymentMethodNote:
      "결제 수단을 선택하고 요청 내용을 확인해 주세요.",
    productSummaryTitle: "예약 상품 요약",
    cardIssuerTitle: "카드사/은행 선택",
    cardIssuerNote: "사용할 카드사 또는 은행을 선택해 주세요.",
    transferTitle: "계좌이체 정보",
    transferAccountLabel: "입금계좌번호",
    transferHolderLabel: "예금주명",
    transferPayerLabel: "입금자명",
    transferPayerPlaceholder: "입금자명을 입력해 주세요",
    transferNote: "계좌번호나 외부 결제링크를 통한 거래를 진행하지 마세요. 결제 요청 접수 후 안내된 절차에 따라 확인됩니다.",
    quickPayNote: "사용할 간편결제 수단을 선택해 주세요.",
    receiptEmailLabel: "영수증 수신 이메일 · 선택",
    receiptEmailPlaceholder: "name@example.com",
    receiptEmailHelper:
      "결제 관련 안내와 영수증 수신에 사용할 이메일을 선택 입력할 수 있습니다.",
    selectedMethodBadge: "선택됨",
    mvpBadge: "선택 가능",
    paymentMethods: [
      {
        key: "card",
        label: "카드 결제",
        description: "카드사 또는 은행을 선택합니다.",
      },
      {
        key: "transfer",
        label: "계좌이체",
        description: "입금자명과 계좌 정보를 확인합니다.",
      },
      {
        key: "quick",
        label: "간편결제",
        description: "간편결제 수단을 선택합니다.",
      },
    ],
    cardIssuers: ["KB국민", "신한", "우리", "하나", "현대", "삼성", "롯데", "BC"],
    disabledFields: [
      "카드번호 입력",
      "만료일",
      "CVC",
    ],
    cautionNotes: [
      "결제 요청 전 금액과 선택한 수단을 다시 확인해 주세요.",
      "계좌번호나 외부 결제링크를 통한 거래를 진행하지 마세요.",
      "금액과 조건은 매물 및 임대인 조건에 따라 달라질 수 있습니다.",
      "계좌번호나 외부 결제링크를 통한 거래를 진행하지 마세요.",
    ],
    checklistItems: [
      "결제 요청 전 금액과 선택한 결제 수단을 확인했습니다.",
      "계좌번호나 외부 결제링크를 통한 거래를 진행하지 않겠습니다.",
      "결제 전 총 금액, 보증금, 환불 조건을 다시 확인해야 함을 이해했습니다.",
    ],
    checklistValidation: "결제 요청 전 확인 항목을 모두 체크해 주세요.",
    cancellationNotes: [
      "취소, 환불, 인출 관련 조건은 결제 전 반드시 확인해야 합니다.",
      "예약 시점, 입주예정일, 취소 시점에 따라 환불 가능 금액이 달라질 수 있습니다.",
      "임대인 사정으로 예약이 진행되지 않는 경우, 반환 절차가 별도로 안내될 수 있습니다.",
      "환불 및 취소 조건은 결제 요청 전 다시 확인해 주세요.",
    ],
    railTitle: "결제 요약",
    requestPaymentAction: "결제 요청하기",
    completeTitle: "예약 요청이 접수되었습니다",
    completeSubtitle:
      "접수된 예약 요청과 결제 확인 정보를 정리했습니다.",
    completeSections: {
      reservation: "예약 요청 요약",
      payment: "결제 요청 요약",
      mvp: "안내",
      next: "다음 단계",
    },
    completeRows: {
      listing: "매물명",
      room: "선택한 방",
      moveIn: "입주예정일",
      guests: "인원",
      stay: "체류 기간",
      paymentStatus: "결제 상태",
      paymentRequestStatus: "결제 요청 상태",
      requestAmount: "총 결제 금액",
      paymentMethod: "결제 수단",
      requestNumber: "접수번호",
    },
    completeValues: {
      paymentStatus: "확인 대기",
      paymentRequestStatus: "확인 대기",
    },
    completeMvpNotes: ["요청 내용과 결제 확인 상태를 기준으로 다음 단계가 안내됩니다."],
    nextSteps: [
      "MapleHouse가 예약 요청 정보를 확인합니다.",
      "결제 및 계약 조건은 별도로 안내됩니다.",
      "임대인 최종 확인 이후 진행 가능 여부 또는 취소 안내가 이어질 수 있습니다.",
    ],
    inquiryHistoryAction: "나의 문의내역 보기",
    reservationHistoryAction: "나의 예약내역 보기",
  },
  en: {
    home: "Home",
    reservation: "Reservation details",
    checkout: "Checkout details",
    complete: "Reservation request received",
    backToReservation: "Back to reservation details",
    listingDetailsAction: "Go to listing details",
    listingsAction: "View listings",
    heroTitle: "Checkout details",
    heroSubtitle:
      "Review payment details and confirmation items before sending a reservation request.",
    heroNote:
      "Check the amount and conditions before submitting the payment request.",
    emptyCheckoutTitle: "Checkout information was not found.",
    emptyCheckoutDescription:
      "Please return to a reservation page with a selected listing and room.",
    emptyCompleteTitle: "No reservation request information was found.",
    emptyCompleteDescription:
      "The completion page appears after the payment request is received.",
    metadata: {
      listing: "Listing",
      room: "Selected room",
      moveIn: "Move-in date",
      currency: "Currency",
      inquiry: "Linked inquiry",
    },
    values: {
      moveIn: "Aug 15, 2026",
      guests: "1 person",
      stay: "3 months",
      tax: "Calculated after condition review",
      total: "Before payment request",
    },
    profile: {
      title: "Selected listing and room",
      moveIn: "Move-in date",
      selectedRoom: "Selected room",
    },
    sections: {
      paymentDetails: "Payment reference details",
      paymentMethod: "Payment method",
      confirmation: "Before requesting payment",
      caution: "Payment cautions",
      cancellation: "Cancellation and refund note",
      summary: "Payment summary",
      completeReservation: "Reservation request summary",
      completePayment: "Payment request summary",
      mvp: "Note",
      nextSteps: "Next steps",
    },
    paymentRows: {
      rent: "Monthly rent",
      deposit: "Deposit",
      initialPayment: "Initial payment",
      supportFee: "Service support fee",
      tax: "Additional tax",
      total: "Total payment amount",
    },
    paymentHelp: {
      initialPayment: "Estimated from the first month rent, deposit, and last month rent amount commonly used in Toronto/Ontario leases. The amount and terms may vary by listing and landlord conditions.",
      supportFee: "A MapleHouse service fee for inquiry organization, reservation support, and customer assistance. The amount may vary by service scope.",
    },
    paymentMethodNote:
      "Choose a payment method and review the request details.",
    productSummaryTitle: "Reservation item summary",
    cardIssuerTitle: "Card issuer or bank",
    cardIssuerNote: "Select the card issuer or bank you want to use.",
    transferTitle: "Bank transfer information",
    transferAccountLabel: "Deposit account number",
    transferHolderLabel: "Account holder",
    transferPayerLabel: "Payer name",
    transferPayerPlaceholder: "Enter payer name",
    transferNote: "Do not proceed through account numbers or external payment links. The request will be reviewed through the guided process.",
    quickPayNote: "Select the quick pay option you want to use.",
    receiptEmailLabel: "Receipt email, optional",
    receiptEmailPlaceholder: "name@example.com",
    receiptEmailHelper:
      "Optionally enter an email for payment guidance and receipt delivery.",
    selectedMethodBadge: "Selected",
    mvpBadge: "Available",
    paymentMethods: [
      {
        key: "card",
        label: "Card payment",
        description: "Choose a card issuer or bank.",
      },
      {
        key: "transfer",
        label: "Bank transfer",
        description: "Check the payer name and bank transfer details.",
      },
      {
        key: "quick",
        label: "Quick pay",
        description: "Choose a quick pay option.",
      },
    ],
    cardIssuers: ["RBC", "TD", "BMO", "CIBC", "Scotia", "Visa", "Mastercard", "Amex"],
    disabledFields: [
      "Card number",
      "Expiry date",
      "CVC",
    ],
    cautionNotes: [
      "Review the amount and selected payment method before requesting payment.",
      "Do not proceed through account numbers or external payment links.",
      "Amounts and conditions may vary by listing and landlord terms.",
      "Do not proceed through bank account numbers or external payment links.",
    ],
    checklistItems: [
      "I reviewed the amount and selected payment method before requesting payment.",
      "I will not proceed through account numbers or external payment links.",
      "I understand the total amount, deposit, and refund conditions must be checked before payment.",
    ],
    checklistValidation: "Please check all confirmation items before requesting payment.",
    cancellationNotes: [
      "Cancellation, refund, and withdrawal terms must be checked before payment.",
      "Refundable amounts may vary by reservation timing, move-in date, and cancellation timing.",
      "If the reservation cannot proceed due to the landlord's circumstances, a separate return process may be provided.",
      "Review refund and cancellation terms before submitting a payment request.",
    ],
    railTitle: "Payment summary",
    requestPaymentAction: "Request payment",
    completeTitle: "Reservation request received",
    completeSubtitle:
      "Your reservation request and payment review details are summarized below.",
    completeSections: {
      reservation: "Reservation request summary",
      payment: "Payment request summary",
      mvp: "Note",
      next: "Next steps",
    },
    completeRows: {
      listing: "Listing",
      room: "Selected room",
      moveIn: "Move-in date",
      guests: "Guests",
      stay: "Stay period",
      paymentStatus: "Payment status",
      paymentRequestStatus: "Payment request status",
      requestAmount: "Total payment amount",
      paymentMethod: "Payment method",
      requestNumber: "Request no.",
    },
    completeValues: {
      paymentStatus: "Pending review",
      paymentRequestStatus: "Pending review",
    },
    completeMvpNotes: ["Next steps will be guided based on the request details and payment review status."],
    nextSteps: [
      "MapleHouse reviews the reservation request information.",
      "Payment and contract conditions will be provided separately.",
      "After the landlord's final confirmation, reservation confirmation or cancellation guidance may follow.",
    ],
    inquiryHistoryAction: "View my inquiries",
    reservationHistoryAction: "View my reservations",
  },
  fr: {
    home: "Accueil",
    reservation: "Détails de réservation",
    checkout: "Détails du paiement",
    complete: "Demande de réservation reçue",
    backToReservation: "Retour aux détails de réservation",
    listingDetailsAction: "Voir le logement",
    listingsAction: "Voir les logements",
    heroTitle: "Détails du paiement",
    heroSubtitle:
      "Vérifiez les détails de paiement et les éléments de confirmation avant d’envoyer une demande de réservation.",
    heroNote:
      "Vérifiez le montant et les conditions avant d’envoyer la demande de paiement.",
    emptyCheckoutTitle: "Les informations de paiement sont introuvables.",
    emptyCheckoutDescription:
      "Revenez à une page de réservation avec un logement et une chambre sélectionnés.",
    emptyCompleteTitle: "Aucune information de demande de réservation n’a été trouvée.",
    emptyCompleteDescription:
      "La page de confirmation apparaît après la réception de la demande de paiement.",
    metadata: {
      listing: "Logement",
      room: "Chambre choisie",
      moveIn: "Date d’entrée",
      currency: "Devise",
      inquiry: "Demande liée",
    },
    values: {
      moveIn: "15 août 2026",
      guests: "1 personne",
      stay: "3 mois",
      tax: "Calculé après vérification",
      total: "Avant demande de paiement",
    },
    profile: {
      title: "Logement et chambre choisis",
      moveIn: "Date d’entrée",
      selectedRoom: "Chambre choisie",
    },
    sections: {
      paymentDetails: "Détails de paiement indicatifs",
      paymentMethod: "Moyen de paiement",
      confirmation: "Avant de demander le paiement",
      caution: "Précautions avant paiement",
      cancellation: "Note sur l’annulation et le remboursement",
      summary: "Résumé du paiement",
      completeReservation: "Résumé de la demande",
      completePayment: "Résumé du paiement",
      mvp: "Note",
      nextSteps: "Prochaines étapes",
    },
    paymentRows: {
      rent: "Loyer mensuel",
      deposit: "Dépôt",
      initialPayment: "Paiement initial",
      supportFee: "Frais de service",
      tax: "Taxes supplémentaires",
      total: "Montant total à payer",
    },
    paymentHelp: {
      initialPayment: "Montant estimé à partir du premier mois de loyer, du dépôt et du dernier mois de loyer, selon une structure fréquente à Toronto/Ontario. Le montant et les conditions peuvent varier selon le logement et le propriétaire.",
      supportFee: "Frais MapleHouse pour l’organisation de la demande, l’aide à la réservation et le support client. Le montant peut varier selon l’étendue du service.",
    },
    paymentMethodNote:
      "Choisissez un moyen de paiement et vérifiez les détails de la demande.",
    productSummaryTitle: "Résumé de la demande",
    cardIssuerTitle: "Émetteur de carte ou banque",
    cardIssuerNote: "Sélectionnez l’émetteur de carte ou la banque à utiliser.",
    transferTitle: "Informations de virement",
    transferAccountLabel: "Numéro de compte de dépôt",
    transferHolderLabel: "Titulaire du compte",
    transferPayerLabel: "Nom du payeur",
    transferPayerPlaceholder: "Saisir le nom du payeur",
    transferNote: "Ne procédez pas via des numéros de compte ou des liens de paiement externes. La demande sera vérifiée selon la procédure indiquée.",
    quickPayNote: "Sélectionnez le moyen de paiement rapide à utiliser.",
    receiptEmailLabel: "E-mail de reçu, facultatif",
    receiptEmailPlaceholder: "name@example.com",
    receiptEmailHelper:
      "Vous pouvez saisir un e-mail pour recevoir les informations de paiement et le reçu.",
    selectedMethodBadge: "Choisi",
    mvpBadge: "Disponible",
    paymentMethods: [
      {
        key: "card",
        label: "Paiement par carte",
        description: "Choisissez un émetteur ou une banque.",
      },
      {
        key: "transfer",
        label: "Virement bancaire",
        description: "Vérifiez le nom du payeur et les informations de virement.",
      },
      {
        key: "quick",
        label: "Paiement rapide",
        description: "Choisissez un moyen de paiement rapide.",
      },
    ],
    cardIssuers: ["RBC", "TD", "BMO", "CIBC", "Scotia", "Visa", "Mastercard", "Amex"],
    disabledFields: [
      "Numéro de carte",
      "Date d’expiration",
      "CVC",
    ],
    cautionNotes: [
      "Vérifiez le montant et le moyen de paiement choisi avant de demander le paiement.",
      "Ne procédez pas via des numéros de compte ou des liens de paiement externes.",
      "Les montants et conditions peuvent varier selon le logement et le propriétaire.",
      "Ne procédez pas via des numéros de compte bancaire ou des liens de paiement externes.",
    ],
    checklistItems: [
      "J’ai vérifié le montant et le moyen de paiement choisi avant de demander le paiement.",
      "Je ne procéderai pas via des numéros de compte ou des liens de paiement externes.",
      "Je comprends que le montant total, le dépôt et les conditions de remboursement doivent être vérifiés avant paiement.",
    ],
    checklistValidation: "Veuillez cocher tous les éléments avant de demander le paiement.",
    cancellationNotes: [
      "Les conditions d’annulation, de remboursement et de retrait doivent être vérifiées avant paiement.",
      "Les montants remboursables peuvent varier selon la date de réservation, la date d’entrée et le moment de l’annulation.",
      "Si la réservation ne peut pas se poursuivre pour une raison liée au propriétaire, une procédure de retour séparée pourra être indiquée.",
      "Vérifiez les conditions d’annulation et de remboursement avant d’envoyer la demande de paiement.",
    ],
    railTitle: "Résumé du paiement",
    requestPaymentAction: "Demander le paiement",
    completeTitle: "Demande de réservation reçue",
    completeSubtitle:
      "Votre demande de réservation et les informations de vérification du paiement sont résumées ci-dessous.",
    completeSections: {
      reservation: "Résumé de la demande de réservation",
      payment: "Résumé de la demande de paiement",
      mvp: "Note",
      next: "Prochaines étapes",
    },
    completeRows: {
      listing: "Logement",
      room: "Chambre choisie",
      moveIn: "Date d’entrée",
      guests: "Personnes",
      stay: "Durée du séjour",
      paymentStatus: "État du paiement",
      paymentRequestStatus: "État de la demande de paiement",
      requestAmount: "Montant total à payer",
      paymentMethod: "Moyen de paiement",
      requestNumber: "N° de demande",
    },
    completeValues: {
      paymentStatus: "En attente de vérification",
      paymentRequestStatus: "En attente de vérification",
    },
    completeMvpNotes: ["Les prochaines étapes seront indiquées selon les détails de la demande et l’état de vérification du paiement."],
    nextSteps: [
      "MapleHouse vérifie les informations de demande de réservation.",
      "Les conditions de paiement et de contrat seront indiquées séparément.",
      "Après la confirmation finale du propriétaire, une confirmation de réservation ou une indication d’annulation pourra suivre.",
    ],
    inquiryHistoryAction: "Voir mes demandes",
    reservationHistoryAction: "Voir mes réservations",
  },
};

const CHECKOUT_UI_COPY: Record<Locale, CheckoutUiCopy> = {
  ko: {
    selectedIssuerLabel: "선택 카드/은행",
    issuerRequired: "선택 카드/은행 선택 필요",
    otherIssuerAction: "그 외 카드/은행 선택",
    otherIssuerTitle: "그 외 카드/은행",
    closeAction: "닫기",
    previewPaymentAction: "결제창 미리보기",
    paymentWindowTitle: "MapleHouse 결제창",
    paymentWindowSubtitle: "결제 요청 내용을 한 번 더 확인합니다.",
    paymentWindowClose: "닫기",
    paymentWindowNotice: "계좌번호나 외부 결제링크를 통한 거래를 진행하지 마세요.",
    duplicateTitle: "이미 접수된 예약 요청입니다.",
    duplicateBody: "같은 예약 요청은 다시 접수되지 않습니다.",
    duplicateRedirect: "이미 접수된 예약 요청입니다. 기존 접수 정보를 확인합니다.",
    duplicateViewAction: "접수 정보 보기",
    processingLabel: "처리 중...",
    transferBankLabel: "입금 은행",
    quickPayTitle: "간편결제",
    selectedQuickPayLabel: "선택 간편결제",
    submittedAtLabel: "요청 시각",
    processingStatusLabel: "결제 처리 상태",
    processingStatusValue: "확인 대기",
    directIssuers: [
      { mark: "KB", name: "KB국민카드", logoId: "kb-card" },
      { mark: "SH", name: "신한카드", logoId: "shinhan-card" },
      { mark: "SS", name: "삼성카드", logoId: "samsung-card" },
      { mark: "HY", name: "현대카드", logoId: "hyundai-card" },
      { mark: "LT", name: "롯데카드", logoId: "lotte-card" },
      { mark: "WR", name: "우리카드", logoId: "woori-card" },
      { mark: "HN", name: "하나카드", logoId: "hana-card" },
      { mark: "NH", name: "NH농협카드", logoId: "nh-card" },
      { mark: "BC", name: "BC카드", logoId: "bc-card" },
      { mark: "K", name: "카카오뱅크", logoId: "kakao-bank" },
      { mark: "K", name: "케이뱅크", logoId: "k-bank" },
      { mark: "T", name: "토스뱅크", logoId: "toss-bank" },
    ],
    otherIssuers: [
      { mark: "IBK", name: "IBK기업카드", logoId: "ibk-card" },
      { mark: "CT", name: "씨티카드", logoId: "citi-card" },
      { mark: "SC", name: "SC제일카드", logoId: "sc-card" },
    ],
    quickProviders: [
      { mark: "N", name: "네이버페이", logoId: "naver-pay" },
      { mark: "K", name: "카카오페이", logoId: "kakao-pay" },
      { mark: "T", name: "토스페이", logoId: "toss-pay" },
      { mark: "S", name: "삼성페이", logoId: "samsung-pay" },
      { mark: "A", name: "애플페이", logoId: "apple-pay" },
      { mark: "P", name: "페이코", logoId: "payco" },
      { mark: "G", name: "구글페이", logoId: "google-pay" },
      { mark: "L", name: "라인페이", logoId: "line-pay" },
      { mark: "A", name: "알리페이", logoId: "alipay" },
      { mark: "P", name: "페이팔", logoId: "paypal" },
    ],
  },
  en: {
    selectedIssuerLabel: "Selected card/bank",
    issuerRequired: "Select a card or bank",
    otherIssuerAction: "Other card/bank",
    otherIssuerTitle: "Other card/bank",
    closeAction: "Close",
    previewPaymentAction: "Preview payment window",
    paymentWindowTitle: "MapleHouse payment window",
    paymentWindowSubtitle: "Review the payment request details once more.",
    paymentWindowClose: "Close",
    paymentWindowNotice: "Do not proceed through account numbers or external payment links.",
    duplicateTitle: "This reservation request has already been received.",
    duplicateBody: "The same reservation request will not be submitted again.",
    duplicateRedirect: "This reservation request was already received. Showing the existing request information.",
    duplicateViewAction: "View request details",
    processingLabel: "Processing...",
    transferBankLabel: "Deposit bank",
    quickPayTitle: "Quick pay",
    selectedQuickPayLabel: "Selected quick pay",
    submittedAtLabel: "Request time",
    processingStatusLabel: "Payment processing status",
    processingStatusValue: "Pending review",
    directIssuers: [
      { mark: "KB", name: "KB Kookmin Card", logoId: "kb-card" },
      { mark: "SH", name: "Shinhan Card", logoId: "shinhan-card" },
      { mark: "SS", name: "Samsung Card", logoId: "samsung-card" },
      { mark: "HY", name: "Hyundai Card", logoId: "hyundai-card" },
      { mark: "LT", name: "Lotte Card", logoId: "lotte-card" },
      { mark: "WR", name: "Woori Card", logoId: "woori-card" },
      { mark: "HN", name: "Hana Card", logoId: "hana-card" },
      { mark: "NH", name: "NH Nonghyup Card", logoId: "nh-card" },
      { mark: "BC", name: "BC Card", logoId: "bc-card" },
      { mark: "K", name: "Kakao Bank", logoId: "kakao-bank" },
      { mark: "K", name: "K Bank", logoId: "k-bank" },
      { mark: "T", name: "Toss Bank", logoId: "toss-bank" },
    ],
    otherIssuers: [
      { mark: "IBK", name: "IBK Card", logoId: "ibk-card" },
      { mark: "CT", name: "Citi Card", logoId: "citi-card" },
      { mark: "SC", name: "SC First Card", logoId: "sc-card" },
      { mark: "RBC", name: "RBC" },
      { mark: "TD", name: "TD Bank" },
      { mark: "BMO", name: "BMO" },
      { mark: "CIBC", name: "CIBC" },
      { mark: "SCT", name: "Scotiabank" },
      { mark: "V", name: "Visa" },
      { mark: "MC", name: "Mastercard" },
      { mark: "AMX", name: "American Express" },
    ],
    quickProviders: [
      { mark: "N", name: "Naver Pay", logoId: "naver-pay" },
      { mark: "K", name: "Kakao Pay", logoId: "kakao-pay" },
      { mark: "T", name: "Toss Pay", logoId: "toss-pay" },
      { mark: "S", name: "Samsung Pay", logoId: "samsung-pay" },
      { mark: "A", name: "Apple Pay", logoId: "apple-pay" },
      { mark: "P", name: "Payco", logoId: "payco" },
      { mark: "G", name: "Google Pay", logoId: "google-pay" },
      { mark: "L", name: "Line Pay", logoId: "line-pay" },
      { mark: "A", name: "Alipay", logoId: "alipay" },
      { mark: "P", name: "PayPal", logoId: "paypal" },
    ],
  },
  fr: {
    selectedIssuerLabel: "Carte/banque choisie",
    issuerRequired: "Carte ou banque à choisir",
    otherIssuerAction: "Autre carte/banque",
    otherIssuerTitle: "Autre carte/banque",
    closeAction: "Fermer",
    previewPaymentAction: "Aperçu de la fenêtre de paiement",
    paymentWindowTitle: "Fenêtre de paiement MapleHouse",
    paymentWindowSubtitle: "Vérifiez encore une fois les détails de la demande de paiement.",
    paymentWindowClose: "Fermer",
    paymentWindowNotice: "Ne procédez pas via des numéros de compte ou des liens de paiement externes.",
    duplicateTitle: "Cette demande de réservation a déjà été reçue.",
    duplicateBody: "La même demande de réservation ne sera pas envoyée une deuxième fois.",
    duplicateRedirect: "Cette demande de réservation a déjà été reçue. Les informations existantes vont être affichées.",
    duplicateViewAction: "Voir les détails",
    processingLabel: "Traitement...",
    transferBankLabel: "Banque de dépôt",
    quickPayTitle: "Paiement rapide",
    selectedQuickPayLabel: "Paiement rapide choisi",
    submittedAtLabel: "Heure de demande",
    processingStatusLabel: "État du traitement du paiement",
    processingStatusValue: "En attente de vérification",
    directIssuers: [
      { mark: "KB", name: "KB Kookmin Card", logoId: "kb-card" },
      { mark: "SH", name: "Shinhan Card", logoId: "shinhan-card" },
      { mark: "SS", name: "Samsung Card", logoId: "samsung-card" },
      { mark: "HY", name: "Hyundai Card", logoId: "hyundai-card" },
      { mark: "LT", name: "Lotte Card", logoId: "lotte-card" },
      { mark: "WR", name: "Woori Card", logoId: "woori-card" },
      { mark: "HN", name: "Hana Card", logoId: "hana-card" },
      { mark: "NH", name: "NH Nonghyup Card", logoId: "nh-card" },
      { mark: "BC", name: "BC Card", logoId: "bc-card" },
      { mark: "K", name: "Kakao Bank", logoId: "kakao-bank" },
      { mark: "K", name: "K Bank", logoId: "k-bank" },
      { mark: "T", name: "Toss Bank", logoId: "toss-bank" },
    ],
    otherIssuers: [
      { mark: "IBK", name: "IBK Card", logoId: "ibk-card" },
      { mark: "CT", name: "Citi Card", logoId: "citi-card" },
      { mark: "SC", name: "SC First Card", logoId: "sc-card" },
      { mark: "RBC", name: "RBC" },
      { mark: "TD", name: "TD Bank" },
      { mark: "BMO", name: "BMO" },
      { mark: "CIBC", name: "CIBC" },
      { mark: "SCT", name: "Scotiabank" },
      { mark: "V", name: "Visa" },
      { mark: "MC", name: "Mastercard" },
      { mark: "AMX", name: "American Express" },
    ],
    quickProviders: [
      { mark: "N", name: "Naver Pay", logoId: "naver-pay" },
      { mark: "K", name: "Kakao Pay", logoId: "kakao-pay" },
      { mark: "T", name: "Toss Pay", logoId: "toss-pay" },
      { mark: "S", name: "Samsung Pay", logoId: "samsung-pay" },
      { mark: "A", name: "Apple Pay", logoId: "apple-pay" },
      { mark: "P", name: "Payco", logoId: "payco" },
      { mark: "G", name: "Google Pay", logoId: "google-pay" },
      { mark: "L", name: "Line Pay", logoId: "line-pay" },
      { mark: "A", name: "Alipay", logoId: "alipay" },
      { mark: "P", name: "PayPal", logoId: "paypal" },
    ],
  },
};

export function LocaleReservationCheckoutPage({
  locale,
  listingId,
  roomId,
  inquiryId,
  currency: currencyParam,
}: {
  locale: Locale;
  listingId?: string;
  roomId?: string;
  inquiryId?: string;
  currency?: string;
}) {
  const copy = CHECKOUT_COPY[locale];
  const uiCopy = CHECKOUT_UI_COPY[locale];
  const currency = parseReservationCurrency(currencyParam, locale);
  const context = getCheckoutContext(listingId, roomId);
  const checkoutSessionId =
    listingId && roomId ? buildCheckoutSessionId(listingId, roomId, currency) : "";
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    copy.checklistItems.map(() => false),
  );
  const [validationMessage, setValidationMessage] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodKey>("card");
  const [selectedCardIssuer, setSelectedCardIssuer] = useState(
    uiCopy.directIssuers[0]?.name ?? "",
  );
  const [selectedQuickProvider, setSelectedQuickProvider] = useState("");
  const [transferPayerName, setTransferPayerName] = useState("");
  const [receiptEmail, setReceiptEmail] = useState("");
  const [showPaymentWindow, setShowPaymentWindow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingRequest, setExistingRequest] = useState<CompletionState | null>(null);
  const paymentLogoManifest = PAYMENT_LOGO_MANIFEST;

  useEffect(() => {
    if (!listingId || !roomId || !checkoutSessionId) return;

    try {
      window.sessionStorage.setItem(
        getCheckoutSessionStorageKey(checkoutSessionId),
        checkoutSessionId,
      );
    } catch {
      // Frontend-only duplicate protection can still continue without storage.
    }

    setExistingRequest(readCheckoutRequest(checkoutSessionId));
  }, [checkoutSessionId, listingId, roomId]);

  if (!context) {
    return (
      <ReservationEmptyPage
        locale={locale}
        title={copy.emptyCheckoutTitle}
        description={copy.emptyCheckoutDescription}
        actionLabel={copy.listingsAction}
        actionHref={`/${locale}/listings`}
        breadcrumbLabel={copy.checkout}
      />
    );
  }

  const { listing, room } = context;
  const amounts = buildPaymentAmounts(room, currency);
  const backHref = getReservationNewHref(locale, listing.id, room.id, inquiryId, currency);
  const listingHref = getListingHref(locale, listing.id);
  const allChecked = checkedItems.every(Boolean);
  const otherIssuerOptions = buildOtherIssuerOptions(uiCopy, locale, paymentLogoManifest);
  const allPaymentOptions = [
    ...uiCopy.directIssuers,
    ...otherIssuerOptions,
    ...uiCopy.quickProviders,
  ];
  const handlePaymentMethodSelect = (method: PaymentMethodKey) => {
    setSelectedPaymentMethod(method);
    setValidationMessage("");
    setShowValidation(false);

    if (method === "card") {
      setSelectedQuickProvider("");
      return;
    }

    if (method === "quick") {
      setSelectedCardIssuer("");
      return;
    }

    setSelectedCardIssuer("");
    setSelectedQuickProvider("");
  };
  const selectedPaymentChoice =
    selectedPaymentMethod === "transfer"
      ? "MapleHouse payment desk"
      : selectedPaymentMethod === "quick"
        ? uiCopy.quickProviders.some((provider) => provider.name === selectedQuickProvider)
          ? selectedQuickProvider
          : uiCopy.issuerRequired
        : selectedCardIssuer || uiCopy.issuerRequired;
  const selectedPaymentLogo = getPaymentLogoForIssuerName(
    allPaymentOptions,
    paymentLogoManifest,
    selectedPaymentChoice,
    "signature",
  );
  const submitMockRequest = () => {
    const savedRequest = readCheckoutRequest(checkoutSessionId);
    if (savedRequest) {
      setExistingRequest(savedRequest);
      setValidationMessage(uiCopy.duplicateRedirect);
      setShowValidation(true);
      window.location.replace(`/${locale}/reservations/complete`);
      return;
    }

    if (!allChecked) {
      setValidationMessage(copy.checklistValidation);
      setShowValidation(true);
      return;
    }

    setIsSubmitting(true);

    const request: CompletionState = {
      checkoutSessionId,
      listingId: listing.id,
      roomId: room.id,
      currency,
      paymentMethod: selectedPaymentMethod,
      selectedIssuer:
        selectedPaymentMethod === "card" || selectedPaymentMethod === "quick"
          ? selectedPaymentChoice
          : undefined,
      requestAmount: buildRequestAmountLabel(amounts),
      requestNumber: buildMockRequestNumber(),
      inquiryId,
      status: "received_pending_review",
      submittedAt: new Date().toISOString(),
      requestedAt: new Date().toISOString(),
    };

    saveCompletionState(request);
    saveCheckoutRequest(request);

    window.location.replace(`/${locale}/reservations/complete`);
  };

  const summaryRows: Array<[ReactNode, ReactNode]> = [
    [copy.metadata.listing, listing.title[locale]],
    [copy.metadata.room, room.label[locale]],
    [copy.completeRows.paymentMethod, getPaymentMethodLabel(copy, selectedPaymentMethod)],
    [
      selectedPaymentMethod === "transfer"
        ? uiCopy.transferBankLabel
        : selectedPaymentMethod === "quick"
          ? uiCopy.selectedQuickPayLabel
          : uiCopy.selectedIssuerLabel,
      selectedPaymentChoice,
    ],
    [copy.paymentRows.rent, <ReservationAmountText value={amounts.monthlyRent} />],
    [
      <ReservationHelpLabel
        label={copy.paymentRows.initialPayment}
        items={[copy.paymentHelp.initialPayment]}
      />,
      <ReservationAmountText value={amounts.initialPayment} />,
    ],
    [
      <ReservationHelpLabel
        label={copy.paymentRows.supportFee}
        items={[copy.paymentHelp.supportFee]}
      />,
      <ReservationAmountText value={amounts.supportFee} />,
    ],
    [copy.completeRows.requestAmount, buildRequestAmountLabel(amounts)],
  ];

  return (
    <main className="min-h-screen bg-[#F7F7F8] py-10 sm:py-14">
      <Container className="space-y-6">
        <ReservationBreadcrumb
          locale={locale}
          items={[
            { label: copy.reservation, href: backHref },
            { label: copy.checkout },
          ]}
        />

        <ReservationHero
          eyebrow="MAPLEHOUSE CHECKOUT"
          title={copy.heroTitle}
          subtitle={copy.heroSubtitle}
          note={copy.heroNote}
        />

        {existingRequest ? (
          <section className="rounded-3xl border border-primary/20 bg-[#FFF8F1] px-5 py-4 text-sm shadow-sm">
            <p className="font-bold text-primary">{uiCopy.duplicateTitle}</p>
            <p className="mt-1 font-medium leading-6 text-muted-foreground">
              {uiCopy.duplicateBody}
            </p>
          </section>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            <ReservationSection title={copy.productSummaryTitle}>
              <div className="space-y-4">
                <CheckoutProductSummary
                  copy={copy}
                  locale={locale}
                  listing={listing}
                  room={room}
                  amounts={amounts}
                />

                <div className="border-t border-border" />

                <div>
                  <h2 className="text-lg font-bold text-foreground">{copy.sections.paymentMethod}</h2>
                </div>

                <p className="rounded-2xl border border-primary/15 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold leading-6 text-primary">
                  {copy.paymentMethodNote}
                </p>
                <div className="space-y-3">
                  {copy.paymentMethods.map((method) => {
                    const open = selectedPaymentMethod === method.key;

                    return (
                      <div key={method.key} className="rounded-2xl border border-border bg-white">
                        <button
                          type="button"
                          onClick={() => handlePaymentMethodSelect(method.key)}
                          aria-expanded={open}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm transition hover:bg-[#FFF8F1]/60",
                            open ? "text-primary" : "text-foreground",
                          )}
                        >
                          <span className="min-w-0">
                            <span className="block font-semibold">{method.label}</span>
                            <span className="mt-0.5 block text-xs font-medium leading-5 text-muted-foreground">
                              {method.description}
                            </span>
                          </span>
                          <span
                            className={cn(
                              "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold",
                              open
                                ? "border-primary/30 bg-white text-primary"
                                : "border-border text-muted-foreground",
                            )}
                          >
                            {open ? copy.selectedMethodBadge : copy.mvpBadge}
                          </span>
                        </button>
                        <div
                          className={cn(
                            "grid overflow-hidden transition-[grid-template-rows,opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                            open
                              ? "grid-rows-[1fr] opacity-100 translate-y-0"
                              : "grid-rows-[0fr] opacity-0 -translate-y-1",
                          )}
                        >
                          <div className={cn(open ? "overflow-visible" : "overflow-hidden")}>
                            <div className="border-t border-border/70 px-4 py-4">
                              {method.key === "card" ? (
                                <CardIssuerGrid
                                  copy={copy}
                                  uiCopy={uiCopy}
                                  logoManifest={paymentLogoManifest}
                                  otherIssuerOptions={otherIssuerOptions}
                                  selectedIssuer={selectedCardIssuer}
                                  onSelect={(issuer) => {
                                    setSelectedCardIssuer(issuer);
                                  }}
                                />
                              ) : null}

                              {method.key === "transfer" ? (
                                <TransferMockPanel
                                  copy={copy}
                                  uiCopy={uiCopy}
                                  payerName={transferPayerName}
                                  onPayerNameChange={setTransferPayerName}
                                />
                              ) : null}

                              {method.key === "quick" ? (
                                <QuickPayMockPanel
                                  copy={copy}
                                  uiCopy={uiCopy}
                                  logoManifest={paymentLogoManifest}
                                  selectedProvider={selectedQuickProvider}
                                  onSelect={setSelectedQuickProvider}
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <label className="block">
                  <span className="text-sm font-bold text-foreground">{copy.receiptEmailLabel}</span>
                  <input
                    type="email"
                    value={receiptEmail}
                    onChange={(event) => setReceiptEmail(event.target.value)}
                    placeholder={copy.receiptEmailPlaceholder}
                    className="mt-2 h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm font-semibold text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                  <span className="mt-2 block text-xs font-medium leading-5 text-muted-foreground">
                    {copy.receiptEmailHelper}
                  </span>
                </label>
              </div>
            </ReservationSection>

            <ReservationSection title={copy.sections.caution}>
              <ReservationDividerTextRows items={copy.cautionNotes} />
            </ReservationSection>

            <ReservationSection title={copy.sections.confirmation}>
              <ReservationConfirmationChecklist
                items={copy.checklistItems}
                checkedItems={checkedItems}
                onChange={(index) => {
                  setValidationMessage("");
                  setShowValidation(false);
                  setCheckedItems((current) =>
                    current.map((checked, itemIndex) =>
                      itemIndex === index ? !checked : checked,
                    ),
                  );
                }}
              />
              {showValidation ? (
                <p className="mt-3 rounded-2xl border border-primary/20 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold text-primary">
                  {validationMessage || copy.checklistValidation}
                </p>
              ) : null}
            </ReservationSection>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href={backHref}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-[#FFF8F1] hover:text-primary"
              >
                {copy.backToReservation}
              </a>
              <a
                href={listingHref}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-[#FFF8F1] hover:text-primary"
              >
                {copy.listingDetailsAction}
              </a>
              <button
                type="button"
                onClick={() => setShowPaymentWindow(true)}
                disabled={isSubmitting}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-primary/25 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold text-primary transition hover:bg-[#FFEFD9] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uiCopy.previewPaymentAction}
              </button>
              <button
                type="button"
                onClick={submitMockRequest}
                disabled={isSubmitting}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-primary/25 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold text-primary transition hover:bg-[#FFEFD9] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? uiCopy.processingLabel
                  : existingRequest
                    ? uiCopy.duplicateViewAction
                    : copy.requestPaymentAction}
              </button>
            </div>
          </div>

          <CheckoutSummaryRail
            copy={copy}
            uiCopy={uiCopy}
            rows={summaryRows}
            onSubmit={submitMockRequest}
            onPreview={() => setShowPaymentWindow(true)}
            validationMessage={showValidation ? validationMessage || copy.checklistValidation : ""}
            disabled={isSubmitting}
            duplicateRequest={existingRequest}
          />
        </div>

        {showPaymentWindow ? (
          <PaymentWindowMock
            copy={copy}
            uiCopy={uiCopy}
            locale={locale}
            listing={listing}
            room={room}
            amounts={amounts}
            paymentMethod={selectedPaymentMethod}
            selectedIssuer={selectedPaymentChoice}
            selectedIssuerLogo={selectedPaymentLogo}
            onClose={() => setShowPaymentWindow(false)}
            onSubmit={submitMockRequest}
            disabled={isSubmitting}
          />
        ) : null}
      </Container>
    </main>
  );
}

export function LocaleReservationCompletePage({ locale }: { locale: Locale }) {
  const copy = CHECKOUT_COPY[locale];
  const uiCopy = CHECKOUT_UI_COPY[locale];
  const [state, setState] = useState<CompletionState | null | undefined>(undefined);

  useEffect(() => {
    setState(readCompletionState());
  }, []);

  if (state === undefined) {
    return null;
  }

  const context = state ? getCheckoutContext(state.listingId, state.roomId) : null;

  if (!state || !context) {
    return (
      <ReservationEmptyPage
        locale={locale}
        title={copy.emptyCompleteTitle}
        description={copy.emptyCompleteDescription}
        actionLabel={copy.listingsAction}
        actionHref={`/${locale}/listings`}
        breadcrumbLabel={copy.complete}
      />
    );
  }

  const { listing, room } = context;

  return (
    <main className="min-h-screen bg-[#F7F7F8] py-10 sm:py-14">
      <Container className="max-w-5xl space-y-6">
        <ReservationBreadcrumb locale={locale} items={[{ label: copy.complete }]} />

        <ReservationHero
          eyebrow="MAPLEHOUSE RESERVATION"
          title={copy.completeTitle}
          subtitle={copy.completeSubtitle}
          note={copy.heroNote}
        />

        <ReservationSection title={copy.completeSections.reservation}>
          <ReservationRows
            rows={[
              [copy.completeRows.listing, listing.title[locale]],
              [copy.completeRows.room, room.label[locale]],
              [copy.completeRows.moveIn, copy.values.moveIn],
              [copy.completeRows.guests, copy.values.guests],
              [copy.completeRows.stay, copy.values.stay],
            ]}
          />
        </ReservationSection>

        <ReservationSection title={copy.completeSections.payment}>
          <ReservationRows
            rows={[
              [copy.completeRows.paymentStatus, copy.completeValues.paymentStatus],
              [copy.completeRows.paymentRequestStatus, copy.completeValues.paymentRequestStatus],
              [uiCopy.processingStatusLabel, uiCopy.processingStatusValue],
              [copy.completeRows.requestAmount, state.requestAmount],
              [copy.completeRows.paymentMethod, getPaymentMethodLabel(copy, state.paymentMethod)],
              ...(state.selectedIssuer
                ? ([[uiCopy.selectedIssuerLabel, state.selectedIssuer]] as Array<[ReactNode, ReactNode]>)
                : []),
              [copy.completeRows.requestNumber, state.requestNumber],
              [uiCopy.submittedAtLabel, formatMockSubmittedAt(state.submittedAt, locale)],
            ]}
          />
        </ReservationSection>

        <ReservationSection title={copy.completeSections.mvp}>
          <ReservationTextBlock items={copy.completeMvpNotes} />
        </ReservationSection>

        <ReservationSection title={copy.completeSections.next}>
          <ol className="space-y-3">
            {copy.nextSteps.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-[#FFF8F1] text-xs font-extrabold text-primary">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </ReservationSection>

        <div className="grid gap-3 sm:grid-cols-3">
          <a
            href={getListingHref(locale, listing.id)}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-[#FFF8F1] hover:text-primary"
          >
            {copy.listingDetailsAction}
          </a>
          <a
            href={`/${locale}/my/inquiries`}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-[#FFF8F1] hover:text-primary"
          >
            {copy.inquiryHistoryAction}
          </a>
          <button
            type="button"
            className="inline-flex min-h-11 cursor-default items-center justify-center rounded-2xl border border-primary/25 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold text-primary"
          >
            {copy.reservationHistoryAction}
          </button>
        </div>
      </Container>
    </main>
  );
}

function ReservationBreadcrumb({
  locale,
  items,
}: {
  locale: Locale;
  items: Array<{ label: string; href?: string }>;
}) {
  const copy = CHECKOUT_COPY[locale];

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <a href={`/${locale}`} className="transition hover:text-foreground">
        {copy.home}
      </a>
      {items.map((item) => (
        <span key={item.label} className="contents">
          <span aria-hidden>·</span>
          {item.href ? (
            <a href={item.href} className="transition hover:text-foreground">
              {item.label}
            </a>
          ) : (
            <span className="font-semibold text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

function ReservationHero({
  eyebrow,
  title,
  subtitle,
  note,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  note: string;
}) {
  return (
    <section className="rounded-3xl border border-primary/15 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-extrabold tracking-[0.18em] text-primary">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
        {subtitle}
      </p>
      <p className="mt-4 rounded-2xl border border-primary/15 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold leading-6 text-primary">
        {note}
      </p>
    </section>
  );
}

function ReservationEmptyPage({
  locale,
  title,
  description,
  actionLabel,
  actionHref,
  breadcrumbLabel,
}: {
  locale: Locale;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  breadcrumbLabel: string;
}) {
  return (
    <main className="min-h-screen bg-[#F7F7F8] py-10 sm:py-14">
      <Container className="max-w-3xl space-y-6">
        <ReservationBreadcrumb locale={locale} items={[{ label: breadcrumbLabel }]} />
        <section className="rounded-3xl border border-border bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-[#FFF8F1] text-primary">
            <Inbox className="h-5 w-5" aria-hidden />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
          <a
            href={actionHref}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl border border-primary/25 bg-[#FFF8F1] px-5 py-3 text-sm font-semibold text-primary transition hover:bg-[#FFEFD9]"
          >
            {actionLabel}
          </a>
        </section>
      </Container>
    </main>
  );
}

function ReservationMetadataStrip({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-3xl border border-border bg-white px-5 py-4 text-sm shadow-sm">
      {items.map(([label, value]) => (
        <span key={`${label}-${value}`} className="min-w-0 text-muted-foreground">
          <span className="font-bold text-foreground">{label}</span> {value}
        </span>
      ))}
    </div>
  );
}

function CheckoutProductSummary({
  copy,
  locale,
  listing,
  room,
  amounts,
}: {
  copy: CheckoutCopy;
  locale: Locale;
  listing: MockListing;
  room: MockListingRoomOption;
  amounts: ReturnType<typeof buildPaymentAmounts>;
}) {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-[96px_minmax(0,1fr)] sm:items-center">
        <ListingImageFrame
          src={listing.imagePath}
          alt={listing.title[locale]}
          className="aspect-square w-full max-w-28 rounded-2xl border border-border bg-muted sm:max-w-none"
        />
        <div className="min-w-0">
          <h3 className="text-lg font-bold leading-snug text-foreground">
            {listing.title[locale]}
          </h3>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <span className="font-semibold text-muted-foreground">
              {copy.metadata.room}{" "}
              <span className="text-foreground">{room.label[locale]}</span>
            </span>
            <span className="font-semibold text-muted-foreground">
              {copy.paymentRows.rent}{" "}
              <span className="text-foreground">{amounts.monthlyRent}</span>
            </span>
            <span className="font-semibold text-muted-foreground">
              {copy.paymentRows.initialPayment}{" "}
              <span className="text-foreground">{amounts.initialPayment}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardIssuerGrid({
  copy,
  uiCopy,
  logoManifest,
  otherIssuerOptions,
  selectedIssuer,
  onSelect,
}: {
  copy: CheckoutCopy;
  uiCopy: CheckoutUiCopy;
  logoManifest: PaymentLogoManifestEntry[];
  otherIssuerOptions: IssuerOption[];
  selectedIssuer: string;
  onSelect: (issuer: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-bold text-foreground">{copy.cardIssuerTitle}</h3>
        <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">
          {copy.cardIssuerNote}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-4 lg:grid-cols-6">
        {uiCopy.directIssuers.map((issuer) => {
          const selected = selectedIssuer === issuer.name;
          const logo = getPaymentLogoForOption(issuer, logoManifest, "compact");

          return (
            <button
              key={issuer.name}
              type="button"
              aria-label={issuer.name}
              onClick={() => onSelect(issuer.name)}
              className={cn(
                "payment-logo-option group flex min-w-0 flex-col items-center gap-1.5 bg-transparent p-0 text-center",
                selected ? "is-selected text-primary" : "text-foreground",
              )}
            >
              <PaymentLogoMark
                logo={logo}
                fallback={issuer.mark}
                className="payment-logo-image"
              />
              <span
                className={cn(
                  "payment-logo-label min-h-8 w-full text-[11px] font-bold leading-4",
                  selected ? "text-primary" : "text-muted-foreground",
                )}
              >
                {issuer.name}
              </span>
            </button>
          );
        })}
      </div>
      <details className="group relative z-40">
        <summary className="inline-flex min-h-10 cursor-pointer list-none items-center justify-center rounded-2xl border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-[#FFF8F1] hover:text-primary [&::-webkit-details-marker]:hidden">
          {uiCopy.otherIssuerAction}
        </summary>
        <div className="absolute z-[80] mt-2 max-h-80 w-full overflow-y-auto rounded-2xl border border-border bg-white p-2 shadow-xl sm:max-w-md">
          <div className="grid grid-cols-1 gap-1">
            {otherIssuerOptions.map((issuer) => {
              const selected = selectedIssuer === issuer.name;
              const logo = getPaymentLogoForOption(issuer, logoManifest, "signature");

              return (
                <button
                  key={issuer.name}
                  type="button"
                  aria-label={issuer.name}
                  onClick={(event) => {
                    onSelect(issuer.name);
                    event.currentTarget.closest("details")?.removeAttribute("open");
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border bg-white px-3 py-2 text-left text-sm transition hover:border-primary/30 hover:bg-[#FFF8F1]",
                    selected
                      ? "border-primary/35 text-primary"
                      : "border-transparent text-foreground",
                  )}
                >
                  <PaymentLogoMark
                    logo={logo}
                    fallback={issuer.mark}
                    className="h-8 w-20 shrink-0 rounded-lg object-contain"
                  />
                  <span className="min-w-0 truncate font-semibold">{issuer.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </details>
    </div>
  );
}

function QuickPayMockPanel({
  copy,
  uiCopy,
  logoManifest,
  selectedProvider,
  onSelect,
}: {
  copy: CheckoutCopy;
  uiCopy: CheckoutUiCopy;
  logoManifest: PaymentLogoManifestEntry[];
  selectedProvider: string;
  onSelect: (provider: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-bold text-foreground">{uiCopy.quickPayTitle}</h3>
        <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">
          {copy.quickPayNote}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4">
        {uiCopy.quickProviders.map((provider) => {
          const selected = selectedProvider === provider.name;
          const logo = getPaymentLogoForOption(provider, logoManifest, "signature");

          return (
            <button
              key={provider.name}
              type="button"
              aria-label={provider.name}
              onClick={() => onSelect(provider.name)}
              className={cn(
                "easy-payment-option group flex min-w-0 flex-col items-center justify-center gap-1.5 bg-transparent p-0 text-center",
                provider.logoId ? `provider-${provider.logoId}` : "",
                selected ? "is-selected text-primary" : "text-foreground",
              )}
            >
              <span className="easy-payment-visual">
                <PaymentLogoMark
                  logo={logo}
                  fallback={provider.mark}
                  className="easy-payment-image"
                  fit="cover"
                />
              </span>
              <span
                className={cn(
                  "easy-payment-label text-[11px] font-bold leading-4",
                  selected ? "text-primary" : "text-muted-foreground",
                )}
              >
                {provider.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TransferMockPanel({
  copy,
  uiCopy,
  payerName,
  onPayerNameChange,
}: {
  copy: CheckoutCopy;
  uiCopy: CheckoutUiCopy;
  payerName: string;
  onPayerNameChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-foreground">{copy.transferTitle}</h3>
        <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">
          {copy.transferNote}
        </p>
      </div>
      <ReservationRows
        rows={[
          [uiCopy.transferBankLabel, "MapleHouse payment desk"],
          [copy.transferAccountLabel, "000-000-000000"],
          [copy.transferHolderLabel, "MapleHouse"],
        ]}
      />
      <label className="block">
        <span className="text-sm font-bold text-foreground">{copy.transferPayerLabel}</span>
        <input
          type="text"
          value={payerName}
          onChange={(event) => onPayerNameChange(event.target.value)}
          placeholder={copy.transferPayerPlaceholder}
          className="mt-2 h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm font-semibold text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        />
      </label>
    </div>
  );
}

function PaymentWindowMock({
  copy,
  uiCopy,
  locale,
  listing,
  room,
  amounts,
  paymentMethod,
  selectedIssuer,
  selectedIssuerLogo,
  onClose,
  onSubmit,
  disabled,
}: {
  copy: CheckoutCopy;
  uiCopy: CheckoutUiCopy;
  locale: Locale;
  listing: MockListing;
  room: MockListingRoomOption;
  amounts: ReturnType<typeof buildPaymentAmounts>;
  paymentMethod: PaymentMethodKey;
  selectedIssuer: string;
  selectedIssuerLogo: PaymentLogoAsset | null;
  onClose: () => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <section className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-white shadow-2xl">
        <div className="border-b border-border px-5 py-4">
          <p className="text-xs font-extrabold tracking-[0.16em] text-primary">
            MAPLEHOUSE CHECKOUT
          </p>
          <h2 className="mt-1 text-xl font-bold text-foreground">{uiCopy.paymentWindowTitle}</h2>
          <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
            {uiCopy.paymentWindowSubtitle}
          </p>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid grid-cols-[76px_minmax(0,1fr)] gap-3">
            <ListingImageFrame
              src={listing.imagePath}
              alt={listing.title[locale]}
              className="aspect-square rounded-2xl border border-border bg-muted"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-muted-foreground">{copy.metadata.listing}</p>
              <p className="mt-1 truncate text-base font-bold text-foreground">
                {listing.title[locale]}
              </p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                {copy.metadata.room} <span className="text-foreground">{room.label[locale]}</span>
              </p>
            </div>
          </div>

          <ReservationRows
            rows={[
              [copy.completeRows.paymentMethod, getPaymentMethodLabel(copy, paymentMethod)],
              [
                uiCopy.selectedIssuerLabel,
                <span className="inline-flex items-center gap-2">
                  <PaymentLogoMark
                    logo={selectedIssuerLogo}
                    fallback={selectedIssuer.slice(0, 3)}
                    className="h-11 w-24 shrink-0 rounded-lg object-contain"
                  />
                  <span>{selectedIssuer}</span>
                </span>,
              ],
              [copy.paymentRows.rent, amounts.monthlyRent],
              [
                <ReservationHelpLabel
                  label={copy.paymentRows.initialPayment}
                  items={[copy.paymentHelp.initialPayment]}
                />,
                amounts.initialPayment,
              ],
              [
                <ReservationHelpLabel
                  label={copy.paymentRows.supportFee}
                  items={[copy.paymentHelp.supportFee]}
                />,
                amounts.supportFee,
              ],
              [copy.completeRows.requestAmount, buildRequestAmountLabel(amounts)],
            ]}
          />

          <p className="rounded-2xl border border-primary/15 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold leading-6 text-primary">
            {uiCopy.paymentWindowNotice}
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-[#FFF8F1] hover:text-primary"
            >
              {uiCopy.paymentWindowClose}
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={disabled}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-primary/25 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold text-primary transition hover:bg-[#FFEFD9] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {disabled ? uiCopy.processingLabel : copy.requestPaymentAction}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function PaymentLogoMark({
  logo,
  fallback,
  className,
  fit = "contain",
}: {
  logo: PaymentLogoAsset | null;
  fallback: string;
  className?: string;
  fit?: "contain" | "cover";
}) {
  if (logo) {
    return (
      <img
        src={logo.src}
        alt={logo.alt}
        className={cn(fit === "cover" ? "object-cover" : "object-contain", className)}
        loading="lazy"
      />
    );
  }

  return (
    <span className={cn("text-[11px] font-extrabold leading-none text-current", className)}>
      {fallback}
    </span>
  );
}

function ReservationSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ReservationRows({ rows }: { rows: Array<[ReactNode, ReactNode]> }) {
  return (
    <div className="divide-y divide-border/70">
      {rows.map(([label, value], index) => (
        <div key={index} className="grid gap-1 py-3 text-sm sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-4">
          <div className="font-semibold text-muted-foreground">{label}</div>
          <div className="min-w-0 font-semibold leading-6 text-foreground">{value}</div>
        </div>
      ))}
    </div>
  );
}

function ReservationHelpLabel({ label, items }: { label: string; items: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="group relative inline-flex max-w-full items-center gap-1.5">
      <span>{label}</span>
      <button
        type="button"
        aria-label={`${label} help`}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-white text-primary transition hover:border-primary hover:bg-[#FFF8F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
      >
        <CircleHelp className="h-3.5 w-3.5" aria-hidden />
      </button>
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-0 top-full z-30 mt-2 w-[min(20rem,calc(100vw-3rem))] rounded-2xl border border-primary/15 bg-white p-3 text-xs font-medium leading-5 text-muted-foreground opacity-0 shadow-lg transition",
          "group-hover:opacity-100 group-focus-within:opacity-100",
          open && "pointer-events-auto opacity-100",
        )}
      >
        {items.map((item) => (
          <span key={item} className="block [&+&]:mt-1.5">
            {item}
          </span>
        ))}
      </span>
    </span>
  );
}

function ReservationAmountText({ value }: { value: string }) {
  return (
    <span key={value} className="mh-price-change inline-block min-w-0">
      {value}
    </span>
  );
}

function ReservationTextBlock({ items }: { items: string[] }) {
  return (
    <div className="space-y-2 text-sm leading-6 text-muted-foreground">
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  );
}

function ReservationConfirmationChecklist({
  items,
  checkedItems,
  onChange,
}: {
  items: string[];
  checkedItems: boolean[];
  onChange: (index: number) => void;
}) {
  return (
    <div className="space-y-2.5">
      {items.map((item, index) => {
        const checked = checkedItems[index];

        return (
          <button
            key={item}
            type="button"
            role="checkbox"
            aria-checked={checked}
            onClick={() => onChange(index)}
            className="flex w-full cursor-pointer items-start gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-left text-sm leading-6 transition hover:border-primary/25 hover:bg-[#FFF8F1]/60"
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition",
                checked
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-transparent",
              )}
              aria-hidden
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <span className="font-semibold text-foreground">{item}</span>
          </button>
        );
      })}
    </div>
  );
}

function ReservationDividerTextRows({ items }: { items: string[] }) {
  return (
    <div className="divide-y divide-border/70">
      {items.map((item) => (
        <p key={item} className="py-3 text-sm font-medium leading-6 text-muted-foreground">
          {item}
        </p>
      ))}
    </div>
  );
}

function CheckoutSummaryRail({
  copy,
  uiCopy,
  rows,
  onSubmit,
  onPreview,
  validationMessage,
  disabled,
  duplicateRequest,
}: {
  copy: CheckoutCopy;
  uiCopy: CheckoutUiCopy;
  rows: Array<[ReactNode, ReactNode]>;
  onSubmit: () => void;
  onPreview: () => void;
  validationMessage: string;
  disabled: boolean;
  duplicateRequest: CompletionState | null;
}) {
  return (
    <aside className="h-fit rounded-3xl border border-primary/15 bg-white p-5 shadow-sm xl:sticky xl:top-24">
      <h2 className="border-b border-border/70 pb-3 text-sm font-bold text-foreground">
        {copy.railTitle}
      </h2>
      <div className="divide-y divide-border/70">
        {rows.map(([label, value], index) => (
          <div key={index} className="py-3 text-sm">
            <p className="font-semibold text-foreground">{label}</p>
            <p className="mt-1 min-w-0 leading-6 text-muted-foreground">{value}</p>
          </div>
        ))}
      </div>
      {validationMessage ? (
        <p className="mt-3 rounded-2xl border border-primary/20 bg-[#FFF8F1] px-4 py-3 text-xs font-semibold leading-5 text-primary">
          {validationMessage}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onPreview}
        disabled={disabled}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-[#FFF8F1] hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uiCopy.previewPaymentAction}
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-primary/25 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold text-primary transition hover:bg-[#FFEFD9] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {disabled
          ? uiCopy.processingLabel
          : duplicateRequest
            ? uiCopy.duplicateViewAction
            : copy.requestPaymentAction}
      </button>
    </aside>
  );
}

function getCheckoutContext(listingId?: string, roomId?: string): CheckoutContext | null {
  if (!listingId || !roomId) return null;

  const listing = MOCK_LISTINGS.find((item) => item.id === listingId);
  if (!listing) return null;

  const room = getMockListingRoomOption(listing, roomId);
  if (room.id !== roomId) return null;

  return { listing, room };
}

function parseReservationCurrency(currency: string | undefined, locale: Locale): ReservationCurrency {
  if (currency === "CAD" || currency === "KRW") return currency;
  return locale === "ko" ? "KRW" : "CAD";
}

function buildPaymentAmounts(room: MockListingRoomOption, currency: ReservationCurrency) {
  const supportFeeCad = room.priceCAD * 0.15;
  const supportFeeKrw = room.priceKRW * 0.15;

  return {
    monthlyRent: formatMonthlyReservationAmount(currency, room.priceCAD, room.priceKRW),
    deposit: formatReservationAmount(currency, room.priceCAD, room.priceKRW),
    initialPayment: formatReservationAmount(currency, room.priceCAD * 2, room.priceKRW * 2),
    supportFee: `${formatReservationAmount(currency, supportFeeCad, supportFeeKrw)} / 1회납부`,
  };
}

function buildRequestAmountLabel(amounts: ReturnType<typeof buildPaymentAmounts>) {
  return `${amounts.initialPayment} + ${amounts.supportFee}`;
}

function buildCheckoutSessionId(
  listingId: string,
  roomId: string,
  currency: ReservationCurrency,
) {
  return `${listingId}:${roomId}:${currency}`;
}

function buildMockRequestNumber() {
  return `MH-RQ-${Date.now().toString().slice(-8)}`;
}

function getPaymentMethodLabel(copy: CheckoutCopy, key: PaymentMethodKey) {
  return copy.paymentMethods.find((method) => method.key === key)?.label ?? copy.paymentMethods[0].label;
}

function buildOtherIssuerOptions(
  uiCopy: CheckoutUiCopy,
  locale: Locale,
  manifest: PaymentLogoManifestEntry[],
) {
  const representativeNames = new Set(uiCopy.directIssuers.map((issuer) => issuer.name));
  const representativeLogoIds = new Set(
    uiCopy.directIssuers
      .map((issuer) => issuer.logoId)
      .filter((logoId): logoId is string => Boolean(logoId)),
  );
  for (const logoId of Array.from(representativeLogoIds)) {
    PAYMENT_LOGO_FALLBACK_IDS[logoId]?.forEach((fallbackLogoId) => {
      representativeLogoIds.add(fallbackLogoId);
    });
  }
  const otherIssuerLogoIds = new Set(
    uiCopy.otherIssuers
      .map((issuer) => issuer.logoId)
      .filter((logoId): logoId is string => Boolean(logoId)),
  );
  for (const logoId of Array.from(otherIssuerLogoIds)) {
    PAYMENT_LOGO_FALLBACK_IDS[logoId]?.forEach((fallbackLogoId) => {
      otherIssuerLogoIds.add(fallbackLogoId);
    });
  }
  const manifestOptions = manifest
    .filter(
      (entry) =>
        (entry.category === "banks" || entry.category === "cards") &&
        !representativeLogoIds.has(entry.id) &&
        !otherIssuerLogoIds.has(entry.id) &&
        !representativeNames.has(entry.label),
    )
    .map((entry) => ({
      mark: buildLogoMark(entry.label),
      name: locale === "ko" ? entry.label : entry.label,
      logoId: entry.id,
    }));
  const existingNames = new Set(uiCopy.otherIssuers.map((issuer) => issuer.name));
  const dedupedBaseOptions = uiCopy.otherIssuers.filter(
    (issuer) =>
      !representativeNames.has(issuer.name) &&
      (!issuer.logoId || !representativeLogoIds.has(issuer.logoId)),
  );
  const dedupedManifestOptions = manifestOptions.filter((issuer) => !existingNames.has(issuer.name));

  return [...dedupedBaseOptions, ...dedupedManifestOptions];
}

function getPaymentLogoForIssuerName(
  issuers: IssuerOption[],
  manifest: PaymentLogoManifestEntry[],
  issuerName: string,
  purpose: "compact" | "signature",
) {
  const option = issuers.find((issuer) => issuer.name === issuerName);
  return option ? getPaymentLogoForOption(option, manifest, purpose) : null;
}

function getPaymentLogoForOption(
  option: IssuerOption,
  manifest: PaymentLogoManifestEntry[],
  purpose: "compact" | "signature",
): PaymentLogoAsset | null {
  const entries = getPaymentLogoEntriesForOption(option, manifest);

  for (const entry of entries) {
    const src = getPaymentLogoSource(entry, purpose);
    if (src) return { alt: entry.label, src };
  }

  return null;
}

function getPaymentLogoEntriesForOption(
  option: IssuerOption,
  manifest: PaymentLogoManifestEntry[],
) {
  const entryIds = option.logoId
    ? [option.logoId, ...(PAYMENT_LOGO_FALLBACK_IDS[option.logoId] ?? [])]
    : [];
  const entries = entryIds
    .map((entryId) => manifest.find((item) => item.id === entryId))
    .filter((entry): entry is PaymentLogoManifestEntry => Boolean(entry));
  const labelEntry = manifest.find((item) => item.label === option.name);

  if (labelEntry && !entries.some((entry) => entry.id === labelEntry.id)) {
    entries.push(labelEntry);
  }

  return entries;
}

function getPaymentLogoSource(
  entry: PaymentLogoManifestEntry,
  purpose: "compact" | "signature",
) {
  return purpose === "compact"
    ? entry.original ?? entry.fill ?? entry.signature ?? entry.alternate
    : entry.signature ?? entry.original ?? entry.fill ?? entry.alternate;
}

function buildLogoMark(label: string) {
  const ascii = label.match(/[A-Z]+/g)?.join("");
  if (ascii) return ascii.slice(0, 3);

  return label.replace(/은행|카드|뱅크|저축|금고/g, "").slice(0, 3);
}

function isPaymentLogoManifestEntry(value: unknown): value is PaymentLogoManifestEntry {
  if (!value || typeof value !== "object") return false;

  const entry = value as Partial<PaymentLogoManifestEntry>;
  return (
    typeof entry.id === "string" &&
    typeof entry.label === "string" &&
    typeof entry.category === "string" &&
    (typeof entry.signature === "string" || entry.signature === null) &&
    (typeof entry.original === "string" || entry.original === null) &&
    (typeof entry.fill === "string" || entry.fill === null) &&
    (
      typeof entry.alternate === "string" ||
      entry.alternate === null ||
      typeof entry.alternate === "undefined"
    )
  );
}

function getCheckoutSessionStorageKey(checkoutSessionId: string) {
  return `${CHECKOUT_SESSION_STORAGE_PREFIX}${checkoutSessionId}`;
}

function getCheckoutRequestStorageKey(checkoutSessionId: string) {
  return `${CHECKOUT_REQUEST_STORAGE_PREFIX}${checkoutSessionId}`;
}

function isPaymentMethodKey(value: unknown): value is PaymentMethodKey {
  return value === "card" || value === "transfer" || value === "quick";
}

function isCompletionState(value: unknown): value is CompletionState {
  if (!value || typeof value !== "object") return false;

  const parsed = value as Partial<CompletionState>;
  return (
    typeof parsed.checkoutSessionId === "string" &&
    typeof parsed.listingId === "string" &&
    typeof parsed.roomId === "string" &&
    (parsed.currency === "CAD" || parsed.currency === "KRW") &&
    isPaymentMethodKey(parsed.paymentMethod) &&
    (typeof parsed.selectedIssuer === "string" || typeof parsed.selectedIssuer === "undefined") &&
    typeof parsed.requestAmount === "string" &&
    typeof parsed.requestNumber === "string" &&
    parsed.status === "received_pending_review" &&
    typeof parsed.submittedAt === "string" &&
    typeof parsed.requestedAt === "string"
  );
}

function saveCheckoutRequest(state: CompletionState) {
  try {
    window.sessionStorage.setItem(
      getCheckoutRequestStorageKey(state.checkoutSessionId),
      JSON.stringify(state),
    );
  } catch {
    // Frontend-only duplicate protection; failure should not crash the page.
  }
}

function readCheckoutRequest(checkoutSessionId: string): CompletionState | null {
  try {
    const raw = window.sessionStorage.getItem(getCheckoutRequestStorageKey(checkoutSessionId));
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return isCompletionState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function formatMockSubmittedAt(value: string, locale: Locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString(locale === "ko" ? "ko-KR" : locale === "fr" ? "fr-CA" : "en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatMonthlyReservationAmount(
  currency: ReservationCurrency,
  cadAmount: number,
  krwAmount: number,
) {
  const suffix = currency === "KRW" ? " / 월" : " / mo";
  return `${formatReservationAmount(currency, cadAmount, krwAmount)}${suffix}`;
}

function formatReservationAmount(
  currency: ReservationCurrency,
  cadAmount: number,
  krwAmount: number,
) {
  if (currency === "KRW") {
    return `${Math.round(krwAmount).toLocaleString("ko-KR")}원`;
  }

  const fixed = cadAmount % 1 === 0 ? 0 : 2;
  return `C$${cadAmount.toLocaleString("en-CA", {
    minimumFractionDigits: fixed,
    maximumFractionDigits: fixed,
  })}`;
}

function getReservationNewHref(
  locale: Locale,
  listingId: string,
  roomId: string,
  inquiryId?: string,
  currency?: ReservationCurrency,
) {
  const params = new URLSearchParams({ listingId, roomId });

  if (inquiryId) params.set("inquiryId", inquiryId);
  if (currency) params.set("currency", currency);

  return `/${locale}/reservations/new?${params.toString()}`;
}

function getListingHref(locale: Locale, listingId: string) {
  return `/${locale}/listings/${listingId}`;
}

function saveCompletionState(state: CompletionState) {
  try {
    window.sessionStorage.setItem(RESERVATION_COMPLETION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Session storage is only a frontend handoff; navigation can still continue.
  }
}

function readCompletionState(): CompletionState | null {
  try {
    const raw = window.sessionStorage.getItem(RESERVATION_COMPLETION_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (isCompletionState(parsed)) return parsed;

    const legacyParsed = parsed as Partial<CompletionState>;
    if (
      typeof legacyParsed.listingId === "string" &&
      typeof legacyParsed.roomId === "string" &&
      (legacyParsed.currency === "CAD" || legacyParsed.currency === "KRW") &&
      isPaymentMethodKey(legacyParsed.paymentMethod) &&
      typeof legacyParsed.requestAmount === "string" &&
      typeof legacyParsed.requestNumber === "string" &&
      typeof legacyParsed.requestedAt === "string"
    ) {
      return {
        checkoutSessionId: buildCheckoutSessionId(
          legacyParsed.listingId,
          legacyParsed.roomId,
          legacyParsed.currency,
        ),
        listingId: legacyParsed.listingId,
        roomId: legacyParsed.roomId,
        currency: legacyParsed.currency,
        paymentMethod: legacyParsed.paymentMethod,
        selectedIssuer:
          typeof legacyParsed.selectedIssuer === "string"
            ? legacyParsed.selectedIssuer
            : undefined,
        requestAmount: legacyParsed.requestAmount,
        requestNumber: legacyParsed.requestNumber,
        inquiryId: typeof legacyParsed.inquiryId === "string" ? legacyParsed.inquiryId : undefined,
        status: "received_pending_review",
        submittedAt: legacyParsed.requestedAt,
        requestedAt: legacyParsed.requestedAt,
      };
    }

    return null;
  } catch {
    return null;
  }
}
