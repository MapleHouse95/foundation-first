import {
  ArrowRight,
  Check,
  CheckCircle2,
  Inbox,
  Paperclip,
  SendHorizontal,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { ListingImageFrame } from "@/components/ui/listing-image-frame";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { MOCK_LISTINGS, type MockListing } from "./LocaleListingsPage";

type TenantInquiryMethod = "assisted" | "direct";
type ReservationCurrency = "CAD" | "KRW";
type TenantInquiryProgressKey =
  | "received"
  | "review"
  | "waitingLandlord"
  | "summarizingReply"
  | "reservationReview"
  | "closed";

type TenantInquiryText = Record<Locale, string>;

type TenantInquiryData = {
  slug: string;
  id: string;
  listingId: string;
  listingTitle: TenantInquiryText;
  areaUnit: TenantInquiryText;
  method: TenantInquiryMethod;
  progress: TenantInquiryProgressKey;
  receivedAt: TenantInquiryText;
  latestUpdate: TenantInquiryText;
  sentInquiry: TenantInquiryText[];
  mapleHouseQuestions: TenantInquiryText[];
  directQuestions?: TenantInquiryText[];
  responseGroups: Array<{
    title: TenantInquiryText;
    items: TenantInquiryText[];
  }>;
};

type TenantReservationReviewCopy = {
  title: string;
  subtitle: string;
  mvpNote: string;
  breadcrumb: string;
  backToDetail: string;
  emptyTitle: string;
  emptyBody: string;
  readyTitle: string;
  readyBody: string;
  notReadyTitle: string;
  notReadyBody: string;
  mockNote: string;
  sections: {
    responseSummary: string;
    assistedSummary: string;
    directSummary: string;
    tenantConfirm: string;
    checklist: string;
    cost: string;
    cancellation: string;
    finalConfirm: string;
    summary: string;
  };
  metadata: {
    currentStep: string;
  };
  checklistItems: string[];
  costLabels: {
    rent: string;
    initialPayment: string;
    deposit: string;
    supportFee: string;
    paymentStatus: string;
  };
  costValues: {
    needsConfirm: string;
    supportFee: string;
    paymentStatus: string;
  };
  costNote: string;
  cancellationNotes: string[];
  finalConfirmItems: string[];
  summaryLabels: {
    listing: string;
    inquiryId: string;
    currentStep: string;
    confirmItems: string;
    availabilityStatus: string;
  };
  availability: {
    afterReply: string;
    waitingLandlord: string;
    ready: string;
  };
  confirmCount: string;
  requestAction: string;
};

type TenantInquiryCopy = {
  home: string;
  listTitle: string;
  listSubtitle: string;
  detailTitle: string;
  detailSubtitle: string;
  mvpNote: string;
  emptyTitle: string;
  emptyBody: string;
  backToList: string;
  detailAction: string;
  listingAction: string;
  columns: {
    id: string;
    listing: string;
    type: string;
    progress: string;
    latestUpdate: string;
    detail: string;
  };
  methods: Record<TenantInquiryMethod, string>;
  methodsShort: Record<TenantInquiryMethod, string>;
  progress: Record<TenantInquiryProgressKey, string>;
  metadata: {
    id: string;
    listing: string;
    method: string;
    receivedAt: string;
  };
  sections: {
    listingProfile: string;
    sentAssisted: string;
    sentDirect: string;
    customerInquiry: string;
    mapleHouseQuestions: string;
    directDescription: string;
    assistedResponse: string;
    directResponse: string;
    reservation: string;
    progress: string;
  };
  tabs: {
    progress: string;
    dm: string;
  };
  dm: {
    title: string;
    subtitle: string;
    landlordLabel: string;
    customerLabel: string;
    translationNote: string;
    inputPlaceholder: string;
    attach: string;
    send: string;
    fileNote: string;
    guidelinesTitle: string;
    guidelines: string[];
    messages: Array<{
      side: "landlord" | "customer";
      text: string;
    }>;
  };
  reservationNotes: string[];
  reservationAction: string;
  reservationReview: TenantReservationReviewCopy;
};

const TENANT_PROGRESS_ORDER: TenantInquiryProgressKey[] = [
  "received",
  "review",
  "waitingLandlord",
  "summarizingReply",
  "reservationReview",
  "closed",
];

const TENANT_INQUIRY_COPY: Record<Locale, TenantInquiryCopy> = {
  ko: {
    home: "홈",
    listTitle: "문의 내역",
    listSubtitle: "내가 보낸 매물 문의와 진행 상태를 확인하는 MVP mock 화면입니다.",
    detailTitle: "문의 상세",
    detailSubtitle: "문의 진행 상태와 답변 내용을 확인하는 MVP mock 화면입니다.",
    mvpNote: "실제 메시지, 예약, 결제, 계약은 아직 연결되어 있지 않습니다.",
    emptyTitle: "문의 정보를 찾을 수 없습니다.",
    emptyBody: "선택한 문의 ID에 해당하는 mock 문의가 없습니다.",
    backToList: "문의 목록으로 돌아가기",
    detailAction: "상세 보기",
    listingAction: "매물 상세 페이지로 이동",
    columns: {
      id: "문의 ID",
      listing: "매물명",
      type: "문의 방식",
      progress: "진행 상태",
      latestUpdate: "최근 업데이트",
      detail: "상세",
    },
    methods: {
      assisted: "MapleHouse 대리 문의",
      direct: "직접 문의",
    },
    methodsShort: {
      assisted: "대리 문의",
      direct: "직접 문의",
    },
    progress: {
      received: "문의 접수",
      review: "문의 내용 확인",
      waitingLandlord: "임대인 답변 대기",
      summarizingReply: "답변 정리 중",
      reservationReview: "예약 가능",
      closed: "종료",
    },
    metadata: {
      id: "문의 ID",
      listing: "매물명",
      method: "문의 방식",
      receivedAt: "접수일",
    },
    sections: {
      listingProfile: "선택한 매물",
      sentAssisted: "내가 보낸 문의",
      sentDirect: "직접 문의 내용",
      customerInquiry: "고객 문의 내용",
      mapleHouseQuestions: "MapleHouse가 정리한 질문",
      directDescription: "고객이 임대인에게 직접 전달한 문의 내용입니다.",
      assistedResponse: "MapleHouse 답변 정리",
      directResponse: "임대인 답변",
      reservation: "예약 진행",
      progress: "문의 진행 상태",
    },
    tabs: {
      progress: "문의 진행",
      dm: "DM 대화 · MVP 예정",
    },
    dm: {
      title: "집주인과의 DM",
      subtitle: "실제 메시지 전송, 채팅, 파일 업로드, 번역 기능은 아직 연결되어 있지 않습니다.",
      landlordLabel: "임대인",
      customerLabel: "나",
      translationNote: "번역 지원 기능은 추후 연결 예정입니다.",
      inputPlaceholder: "메시지를 입력하세요 · MVP 예정",
      attach: "파일 첨부",
      send: "전송 · MVP 예정",
      fileNote: "PDF, JPG, PNG 파일 첨부 예정",
      guidelinesTitle: "채팅 시 주의사항",
      guidelines: [
        "상호간의 예의있는 대화를 해주세요.",
        "자동번역에 오역이 있을 시,\n조금 더 자세하게 설명해 주세요.",
        "계좌번호 혹은 결제링크를 통해\n거래하지 마세요, 사기의 위험이\n있을 수 있습니다.",
        "도움이 필요할 시, 상단 바의 문의하기 기능을 이용해 주세요.",
      ],
      messages: [
        {
          side: "landlord",
          text: "안녕하세요. 문의 주신 매물은 현재 확인 가능합니다.",
        },
        {
          side: "customer",
          text: "입주 전 초기 입금액과 환불 조건을 먼저 확인하고 싶습니다.",
        },
        {
          side: "landlord",
          text: "보증금과 입주 가능일은 다시 확인 후 안내드리겠습니다.",
        },
      ],
    },
    reservationNotes: [
      "실제 예약, 결제, 계약은 아직 연결되어 있지 않습니다.",
      "현재 단계에서는 답변 내용을 확인하는 MVP mock 상태입니다.",
    ],
    reservationAction: "예약하기 · MVP 예정",
    reservationReview: {
      title: "예약 검토",
      subtitle: "문의 답변을 바탕으로 예약 진행 여부를 검토하는 MVP mock 화면입니다.",
      mvpNote: "실제 예약, 결제, 계약, 송금은 아직 연결되어 있지 않습니다.",
      breadcrumb: "예약 검토",
      backToDetail: "문의 상세로 돌아가기",
      emptyTitle: "예약 검토 정보를 찾을 수 없습니다.",
      emptyBody: "선택한 문의 ID에 해당하는 mock 예약 검토 정보가 없습니다.",
      readyTitle: "답변 내용을 바탕으로 예약 진행 여부를 검토할 수 있습니다.",
      readyBody: "아직 실제 예약은 진행되지 않았으며, 입금 전 확인해야 할 항목이 남아 있을 수 있습니다.",
      notReadyTitle: "아직 예약을 확정할 수 있는 단계가 아닙니다.",
      notReadyBody: "답변 확인 후 예약 검토를 진행할 수 있습니다.",
      mockNote: "현재 화면은 실제 예약 신청이 아닌 MVP mock 검토 화면입니다.",
      sections: {
        responseSummary: "문의 답변 요약",
        assistedSummary: "MapleHouse가 정리한 답변 요약",
        directSummary: "임대인 답변 요약",
        tenantConfirm: "세입자가 추가로 확인해야 할 점",
        checklist: "예약 전 확인 항목",
        cost: "비용 확인",
        cancellation: "취소 및 노쇼 관련 안내",
        finalConfirm: "예약 검토 전 확인",
        summary: "예약 검토 요약",
      },
      metadata: {
        currentStep: "현재 단계",
      },
      checklistItems: [
        "실제 입주 가능일을 확인했나요?",
        "월세에 포함되는 항목을 확인했나요?",
        "초기 입금액과 보증금 조건을 확인했나요?",
        "환불 조건을 확인했나요?",
        "사진과 실제 공간 차이에 대한 답변을 확인했나요?",
        "하우스 룰 또는 공용공간 규칙을 확인했나요?",
      ],
      costLabels: {
        rent: "월세",
        initialPayment: "예상 초기 입금액",
        deposit: "보증금",
        supportFee: "MapleHouse 예약 지원비",
        paymentStatus: "결제 상태",
      },
      costValues: {
        needsConfirm: "확인 필요",
        supportFee: "MVP 단계에서 산정 예정",
        paymentStatus: "실제 결제 연결 전",
      },
      costNote: "실제 결제는 아직 연결되어 있지 않습니다. 입금 전 총 금액과 환불 조건 확인이 필요합니다.",
      cancellationNotes: [
        "실제 취소, 환불, 노쇼 보상 정책은 아직 연결되어 있지 않습니다.",
        "추후 운영 단계에서는 예약 시점, 입주 예정일, 취소 시점에 따라 환불 가능 금액이 달라질 수 있습니다.",
        "현재 화면은 정책 구조를 보여주는 MVP mock 상태입니다.",
      ],
      finalConfirmItems: [
        "이 화면은 실제 예약 신청이 아니라 MVP mock 화면임을 이해했습니다.",
        "실제 결제, 계약, 송금은 아직 연결되어 있지 않음을 이해했습니다.",
        "입금 전 확인해야 할 항목이 남아 있을 수 있음을 이해했습니다.",
      ],
      summaryLabels: {
        listing: "매물명",
        inquiryId: "문의 ID",
        currentStep: "현재 단계",
        confirmItems: "확인 필요 항목",
        availabilityStatus: "예약 가능 상태",
      },
      availability: {
        afterReply: "답변 확인 후 검토 가능",
        waitingLandlord: "임대인 답변 대기",
        ready: "답변 확인 후 검토 가능",
      },
      confirmCount: "6개",
      requestAction: "예약 요청 준비 · MVP 예정",
    },
  },
  en: {
    home: "Home",
    listTitle: "Inquiry history",
    listSubtitle: "An MVP mock page for checking inquiries you sent and their progress.",
    detailTitle: "Inquiry detail",
    detailSubtitle: "An MVP mock page for reviewing inquiry progress and reply details.",
    mvpNote: "Real messages, reservations, payments, and contracts are not connected yet.",
    emptyTitle: "Inquiry information was not found.",
    emptyBody: "There is no mock inquiry for the selected inquiry ID.",
    backToList: "Back to inquiry list",
    detailAction: "View detail",
    listingAction: "Go to listing details",
    columns: {
      id: "Inquiry ID",
      listing: "Listing",
      type: "Type",
      progress: "Progress",
      latestUpdate: "Latest update",
      detail: "Detail",
    },
    methods: {
      assisted: "MapleHouse assisted inquiry",
      direct: "Direct inquiry",
    },
    methodsShort: {
      assisted: "Assisted",
      direct: "Direct",
    },
    progress: {
      received: "Inquiry received",
      review: "Inquiry review",
      waitingLandlord: "Waiting for landlord reply",
      summarizingReply: "Reply summary in progress",
      reservationReview: "Reservation possible",
      closed: "Closed",
    },
    metadata: {
      id: "Inquiry ID",
      listing: "Listing",
      method: "Inquiry type",
      receivedAt: "Received",
    },
    sections: {
      listingProfile: "Selected listing",
      sentAssisted: "Sent inquiry",
      sentDirect: "Direct inquiry content",
      customerInquiry: "Customer inquiry",
      mapleHouseQuestions: "Questions organized by MapleHouse",
      directDescription: "This is the inquiry content sent directly to the landlord.",
      assistedResponse: "MapleHouse response summary",
      directResponse: "Landlord reply",
      reservation: "Reservation review",
      progress: "Inquiry progress",
    },
    tabs: {
      progress: "Inquiry progress",
      dm: "DM chat · MVP coming",
    },
    dm: {
      title: "DM with landlord",
      subtitle: "Real messaging, chat, file upload, and translation are not connected yet.",
      landlordLabel: "Landlord",
      customerLabel: "Me",
      translationNote: "Translation support will be connected later.",
      inputPlaceholder: "Type a message · MVP coming",
      attach: "Attach file",
      send: "Send · MVP coming",
      fileNote: "PDF, JPG, PNG attachments coming",
      guidelinesTitle: "Chat guidelines",
      guidelines: [
        "Please keep the conversation respectful.",
        "If automatic translation is inaccurate, explain your message in more detail.",
        "Do not complete transactions through bank account numbers or payment links. There may be a risk of fraud.",
        "If you need help, use the Contact option in the top navigation.",
      ],
      messages: [
        {
          side: "landlord",
          text: "Hello. The listing you asked about is currently available for review.",
        },
        {
          side: "customer",
          text: "Before move-in, I would like to confirm the initial payment and refund terms.",
        },
        {
          side: "landlord",
          text: "I will check the deposit and available move-in date again and update you.",
        },
      ],
    },
    reservationNotes: [
      "Real reservations, payments, and contracts are not connected yet.",
      "This MVP mock currently only shows the inquiry reply and confirmation flow.",
    ],
    reservationAction: "Reserve · MVP coming",
    reservationReview: {
      title: "Reservation review",
      subtitle: "Review whether to proceed with a reservation based on the inquiry response.",
      mvpNote: "Real reservation, payment, contract, and money transfer are not connected yet.",
      breadcrumb: "Reservation review",
      backToDetail: "Back to inquiry detail",
      emptyTitle: "Reservation review information was not found.",
      emptyBody: "There is no mock reservation review information for the selected inquiry ID.",
      readyTitle: "You can review whether to proceed based on the response details.",
      readyBody: "No real reservation has been made yet, and some items may still need confirmation before payment.",
      notReadyTitle: "This inquiry is not ready for reservation confirmation yet.",
      notReadyBody: "You can continue the reservation review after the reply has been checked.",
      mockNote: "This is an MVP mock review screen, not a real reservation request.",
      sections: {
        responseSummary: "Inquiry response summary",
        assistedSummary: "Response summary prepared by MapleHouse",
        directSummary: "Landlord reply summary",
        tenantConfirm: "Items the tenant should confirm",
        checklist: "Before-reservation checklist",
        cost: "Cost review",
        cancellation: "Cancellation and no-show note",
        finalConfirm: "Before reviewing reservation",
        summary: "Reservation review summary",
      },
      metadata: {
        currentStep: "Current step",
      },
      checklistItems: [
        "Did you confirm the actual available move-in date?",
        "Did you confirm what is included in monthly rent?",
        "Did you confirm the initial payment and deposit terms?",
        "Did you confirm the refund conditions?",
        "Did you confirm any difference between photos and the actual space?",
        "Did you confirm house rules or shared-space rules?",
      ],
      costLabels: {
        rent: "Monthly rent",
        initialPayment: "Estimated initial payment",
        deposit: "Deposit",
        supportFee: "MapleHouse reservation support fee",
        paymentStatus: "Payment status",
      },
      costValues: {
        needsConfirm: "Needs confirmation",
        supportFee: "To be estimated in the MVP stage",
        paymentStatus: "Real payment is not connected yet",
      },
      costNote: "Real payment is not connected yet. Confirm the total amount and refund terms before any money transfer.",
      cancellationNotes: [
        "Real cancellation, refund, and no-show compensation policies are not connected yet.",
        "In a later operating stage, refundable amounts may vary by reservation time, planned move-in date, and cancellation time.",
        "This screen is an MVP mock showing the policy structure only.",
      ],
      finalConfirmItems: [
        "I understand this screen is an MVP mock, not a real reservation request.",
        "I understand real payment, contract, and money transfer are not connected yet.",
        "I understand there may still be items to confirm before payment.",
      ],
      summaryLabels: {
        listing: "Listing",
        inquiryId: "Inquiry ID",
        currentStep: "Current step",
        confirmItems: "Items to confirm",
        availabilityStatus: "Reservation status",
      },
      availability: {
        afterReply: "Review possible after reply check",
        waitingLandlord: "Waiting for landlord reply",
        ready: "Review possible after reply check",
      },
      confirmCount: "6 items",
      requestAction: "Prepare reservation request · MVP coming",
    },
  },
  fr: {
    home: "Accueil",
    listTitle: "Historique des demandes",
    listSubtitle: "Page mock MVP pour vérifier vos demandes envoyées et leur progression.",
    detailTitle: "Détail de la demande",
    detailSubtitle: "Page mock MVP pour suivre la progression et le contenu de la réponse.",
    mvpNote: "Les messages, réservations, paiements et contrats réels ne sont pas encore connectés.",
    emptyTitle: "Information de demande introuvable.",
    emptyBody: "Aucune demande mock ne correspond à cet ID.",
    backToList: "Retour à la liste des demandes",
    detailAction: "Voir le détail",
    listingAction: "Voir le logement",
    columns: {
      id: "ID",
      listing: "Logement",
      type: "Type",
      progress: "Progression",
      latestUpdate: "Dernière mise à jour",
      detail: "Détail",
    },
    methods: {
      assisted: "Demande assistée par MapleHouse",
      direct: "Demande directe",
    },
    methodsShort: {
      assisted: "Assistée",
      direct: "Directe",
    },
    progress: {
      received: "Demande reçue",
      review: "Vérification de la demande",
      waitingLandlord: "Réponse du propriétaire attendue",
      summarizingReply: "Synthèse en cours",
      reservationReview: "Réservation possible",
      closed: "Terminé",
    },
    metadata: {
      id: "ID de demande",
      listing: "Logement",
      method: "Type de demande",
      receivedAt: "Reçue le",
    },
    sections: {
      listingProfile: "Logement sélectionné",
      sentAssisted: "Demande envoyée",
      sentDirect: "Contenu de la demande directe",
      customerInquiry: "Demande du client",
      mapleHouseQuestions: "Questions préparées par MapleHouse",
      directDescription: "Contenu envoyé directement au propriétaire.",
      assistedResponse: "Synthèse de réponse par MapleHouse",
      directResponse: "Réponse du propriétaire",
      reservation: "Réservation à examiner",
      progress: "Progression de la demande",
    },
    tabs: {
      progress: "Progression",
      dm: "DM · MVP à venir",
    },
    dm: {
      title: "DM avec le propriétaire",
      subtitle: "La messagerie réelle, le chat, l’envoi de fichiers et la traduction ne sont pas encore connectés.",
      landlordLabel: "Propriétaire",
      customerLabel: "Moi",
      translationNote: "La traduction sera ajoutée plus tard.",
      inputPlaceholder: "Écrire un message · MVP à venir",
      attach: "Joindre un fichier",
      send: "Envoyer · MVP à venir",
      fileNote: "Pièces jointes PDF, JPG, PNG à venir",
      guidelinesTitle: "Conseils pour le chat",
      guidelines: [
        "Gardez une conversation respectueuse.",
        "Si la traduction automatique est incorrecte, expliquez votre message plus en détail.",
        "N’effectuez pas de transaction via un numéro de compte ou un lien de paiement. Il peut y avoir un risque de fraude.",
        "Si vous avez besoin d’aide, utilisez l’option Contact dans la barre supérieure.",
      ],
      messages: [
        {
          side: "landlord",
          text: "Bonjour. Le logement demandé peut actuellement être vérifié.",
        },
        {
          side: "customer",
          text: "Avant l’entrée, je souhaite confirmer le montant initial et les conditions de remboursement.",
        },
        {
          side: "landlord",
          text: "Je vais revérifier le dépôt et la date d’entrée possible, puis vous répondre.",
        },
      ],
    },
    reservationNotes: [
      "Les réservations, paiements et contrats réels ne sont pas encore connectés.",
      "Cet écran mock MVP sert uniquement à vérifier la réponse et les points à confirmer.",
    ],
    reservationAction: "Réserver · MVP à venir",
    reservationReview: {
      title: "Examen de réservation",
      subtitle: "Vérifiez si vous souhaitez poursuivre une réservation à partir de la réponse reçue.",
      mvpNote: "La réservation réelle, le paiement, le contrat et le transfert d’argent ne sont pas encore connectés.",
      breadcrumb: "Examen de réservation",
      backToDetail: "Retour au détail de la demande",
      emptyTitle: "Information d’examen de réservation introuvable.",
      emptyBody: "Aucune information mock d’examen de réservation ne correspond à cet ID.",
      readyTitle: "Vous pouvez examiner la suite possible à partir de la réponse.",
      readyBody: "Aucune réservation réelle n’a encore été effectuée, et certains points peuvent rester à confirmer avant tout paiement.",
      notReadyTitle: "Cette demande n’est pas encore prête pour confirmer une réservation.",
      notReadyBody: "Vous pourrez poursuivre l’examen après vérification de la réponse.",
      mockNote: "Cet écran est un mock MVP d’examen, pas une vraie demande de réservation.",
      sections: {
        responseSummary: "Résumé de la réponse",
        assistedSummary: "Résumé préparé par MapleHouse",
        directSummary: "Résumé de la réponse du propriétaire",
        tenantConfirm: "Points à confirmer par le locataire",
        checklist: "Points à vérifier avant réservation",
        cost: "Vérification des coûts",
        cancellation: "Note sur annulation et no-show",
        finalConfirm: "Avant l’examen de réservation",
        summary: "Résumé de l’examen",
      },
      metadata: {
        currentStep: "Étape actuelle",
      },
      checklistItems: [
        "Avez-vous confirmé la vraie date d’entrée possible?",
        "Avez-vous confirmé ce qui est inclus dans le loyer?",
        "Avez-vous confirmé le paiement initial et les conditions de dépôt?",
        "Avez-vous confirmé les conditions de remboursement?",
        "Avez-vous confirmé les différences entre les photos et l’espace réel?",
        "Avez-vous confirmé les règles du logement ou des espaces communs?",
      ],
      costLabels: {
        rent: "Loyer mensuel",
        initialPayment: "Paiement initial estimé",
        deposit: "Dépôt",
        supportFee: "Frais d’aide à la réservation MapleHouse",
        paymentStatus: "Statut du paiement",
      },
      costValues: {
        needsConfirm: "À confirmer",
        supportFee: "À estimer au stade MVP",
        paymentStatus: "Le paiement réel n’est pas connecté",
      },
      costNote: "Le paiement réel n’est pas encore connecté. Vérifiez le montant total et les conditions de remboursement avant tout transfert.",
      cancellationNotes: [
        "Les politiques réelles d’annulation, de remboursement et de no-show ne sont pas encore connectées.",
        "En phase d’exploitation, le montant remboursable peut varier selon le moment de réservation, la date d’entrée prévue et le moment d’annulation.",
        "Cet écran est un mock MVP qui montre uniquement la structure de la politique.",
      ],
      finalConfirmItems: [
        "Je comprends que cet écran est un mock MVP, pas une vraie demande de réservation.",
        "Je comprends que le paiement, le contrat et le transfert d’argent réels ne sont pas encore connectés.",
        "Je comprends qu’il peut rester des points à confirmer avant tout paiement.",
      ],
      summaryLabels: {
        listing: "Logement",
        inquiryId: "ID de demande",
        currentStep: "Étape actuelle",
        confirmItems: "Points à confirmer",
        availabilityStatus: "Statut de réservation",
      },
      availability: {
        afterReply: "Examen possible après vérification",
        waitingLandlord: "Réponse du propriétaire attendue",
        ready: "Examen possible après vérification",
      },
      confirmCount: "6 points",
      requestAction: "Préparer la demande · MVP à venir",
    },
  },
};

type TenantReservationNewCopy = {
  title: string;
  subtitle: string;
  mvpNote: string;
  breadcrumb: string;
  linkedInquiryNote: string;
  emptyTitle: string;
  emptyBody: string;
  listingsAction: string;
  detailAction: string;
  inquiryListAction: string;
  checkoutAction: string;
  railCheckoutAction: string;
  sections: {
    listingProfile: string;
    reservationInfo: string;
    paymentDetails: string;
    cancellation: string;
    finalConfirm: string;
    summary: string;
  };
  metadata: {
    listing: string;
    moveIn: string;
    guests: string;
    stay: string;
  };
  reservationRows: {
    listing: string;
    selectedUnit: string;
    moveIn: string;
    stay: string;
    guests: string;
    name: string;
    email: string;
  };
  paymentRows: {
    rent: string;
    deposit: string;
    initialPayment: string;
    supportFee: string;
    tax: string;
    total: string;
  };
  summaryLabels: {
    listing: string;
    moveIn: string;
    amount: string;
    supportFee: string;
    tax: string;
    total: string;
  };
  values: {
    selectedUnit: string;
    moveIn: string;
    stay: string;
    guests: string;
    name: string;
    email: string;
    tax: string;
    total: string;
  };
  paymentNote: string;
  paymentHelp: {
    initialPayment: string[];
    supportFee: string[];
  };
  summaryNote: string;
  cancellationNotes: string[];
  finalConfirmItems: string[];
};

const TENANT_RESERVATION_NEW_COPY: Record<Locale, TenantReservationNewCopy> = {
  ko: {
    title: "예약하기",
    subtitle: "선택한 매물의 예약 조건과 결제 전 확인 항목을 정리하는 MVP mock 화면입니다.",
    mvpNote: "실제 결제와 예약 확정은 아직 진행되지 않습니다.",
    breadcrumb: "예약하기",
    linkedInquiryNote:
      "이전 문의 내역이 연결된 예약입니다. 문의 내용은 나의 문의내역에서 다시 확인할 수 있습니다.",
    emptyTitle: "예약할 매물 정보를 찾을 수 없습니다.",
    emptyBody: "매물 상세 페이지나 매물 목록에서 예약할 매물을 다시 선택해 주세요.",
    listingsAction: "매물 목록 보기",
    detailAction: "매물 상세 페이지로 돌아가기",
    inquiryListAction: "나의 문의내역 보기",
    checkoutAction: "결제창으로 이동 · MVP 예정",
    railCheckoutAction: "결제창으로 이동 · MVP 예정",
    sections: {
      listingProfile: "선택한 매물",
      reservationInfo: "예약 정보",
      paymentDetails: "결제 세부정보",
      cancellation: "취소 및 환불 안내",
      finalConfirm: "결제 전 확인",
      summary: "예약 요약",
    },
    metadata: {
      listing: "매물명",
      moveIn: "입주예정일",
      guests: "인원",
      stay: "체류 기간",
    },
    reservationRows: {
      listing: "매물명",
      selectedUnit: "선택 방/유닛",
      moveIn: "입주예정일",
      stay: "체류 기간",
      guests: "인원",
      name: "예약자 이름",
      email: "예약자 이메일",
    },
    paymentRows: {
      rent: "월세",
      deposit: "보증금",
      initialPayment: "초기 입금액",
      supportFee: "서비스 이용료",
      tax: "부가세/세금",
      total: "총 결제 예정 금액",
    },
    summaryLabels: {
      listing: "매물명",
      moveIn: "입주예정일",
      amount: "금액",
      supportFee: "서비스 이용료",
      tax: "부가세/세금",
      total: "총 결제 예정 금액",
    },
    values: {
      selectedUnit: "전체 유닛",
      moveIn: "2026. 8. 15.",
      stay: "6개월",
      guests: "1명",
      name: "MEHA KIM",
      email: "name@example.com",
      tax: "실제 운영 단계에서 산정 예정",
      total: "실제 결제 연결 전",
    },
    paymentNote: "실제 결제 전 총 금액, 보증금, 환불 조건을 다시 확인해야 합니다.",
    paymentHelp: {
      initialPayment: [
        "첫 달 월세 + 보증금(마지막 달 월세로 사용됨) 기준으로 계산된 금액입니다.",
        "토론토/온타리오 지역 임대 계약에서 자주 사용되는 일반적인 형태를 기준으로 한 안내입니다.",
        "실제 금액과 조건은 매물 및 임대인 조건에 따라 달라질 수 있습니다.",
      ],
      supportFee: [
        "MapleHouse가 문의 정리, 예약 보조, 고객 응대 등의 운영 지원을 위해 부과하는 비용입니다.",
        "실제 운영 단계에서는 서비스 범위에 따라 금액이 달라질 수 있습니다.",
      ],
    },
    summaryNote: "실제 결제와 예약 확정은 아직 진행되지 않았습니다.",
    cancellationNotes: [
      "취소 가능 여부와 환불 조건은 실제 운영 단계에서 임대인 조건과 결제 방식에 따라 다시 안내됩니다.",
      "예약 전 보증금, 첫 달 월세, 서비스 이용료, 세금, 환불 가능 기간을 반드시 확인해야 합니다.",
      "MapleHouse MVP 화면은 실제 계약, 송금, 예약 확정을 처리하지 않습니다.",
    ],
    finalConfirmItems: [
      "매물 정보, 입주예정일, 체류 기간이 맞는지 확인했습니다.",
      "초기 입금액, 보증금, 서비스 이용료, 세금 산정 방식은 실제 결제 전 다시 확인해야 합니다.",
      "이 화면은 MVP mock이며 실제 결제창과 예약 확정은 아직 연결되어 있지 않습니다.",
    ],
  },
  en: {
    title: "Reserve",
    subtitle:
      "An MVP mock page for reviewing reservation details and pre-payment checks for the selected listing.",
    mvpNote: "Real payment and reservation confirmation are not connected yet.",
    breadcrumb: "Reserve",
    linkedInquiryNote:
      "This reservation is linked to a previous inquiry. You can review the inquiry details again in your inquiry history.",
    emptyTitle: "We could not find the listing to reserve.",
    emptyBody: "Please choose the listing again from the listing detail page or listings page.",
    listingsAction: "View listings",
    detailAction: "Back to listing details",
    inquiryListAction: "View my inquiries",
    checkoutAction: "Go to checkout · MVP coming",
    railCheckoutAction: "Proceed to checkout · MVP soon",
    sections: {
      listingProfile: "Selected listing",
      reservationInfo: "Reservation information",
      paymentDetails: "Payment details",
      cancellation: "Cancellation and refund note",
      finalConfirm: "Before payment",
      summary: "Reservation summary",
    },
    metadata: {
      listing: "Listing",
      moveIn: "Move-in date",
      guests: "Guests",
      stay: "Stay period",
    },
    reservationRows: {
      listing: "Listing",
      selectedUnit: "Selected room/unit",
      moveIn: "Move-in date",
      stay: "Stay period",
      guests: "Guests",
      name: "Guest name",
      email: "Guest email",
    },
    paymentRows: {
      rent: "Monthly rent",
      deposit: "Deposit",
      initialPayment: "Initial payment",
      supportFee: "Service fee",
      tax: "Tax",
      total: "Estimated total due",
    },
    summaryLabels: {
      listing: "Listing",
      moveIn: "Move-in date",
      amount: "Amount",
      supportFee: "Service fee",
      tax: "Tax",
      total: "Estimated total due",
    },
    values: {
      selectedUnit: "Entire unit",
      moveIn: "Aug 15, 2026",
      stay: "6 months",
      guests: "1 person",
      name: "MEHA KIM",
      email: "name@example.com",
      tax: "To be calculated in the real operation stage",
      total: "Before real checkout connection",
    },
    paymentNote:
      "Before any real payment, review the total amount, deposit, and refund conditions again.",
    paymentHelp: {
      initialPayment: [
        "This amount is calculated based on the first month’s rent plus the deposit (typically used as the last month’s rent).",
        "This follows a commonly used rental structure in Toronto/Ontario.",
        "Actual amounts and terms may vary by listing and landlord conditions.",
      ],
      supportFee: [
        "This is a service fee charged for MapleHouse support such as inquiry organization, reservation assistance, and customer communication.",
        "In the live service, the amount may vary depending on the service scope.",
      ],
    },
    summaryNote: "Real payment and reservation confirmation have not started yet.",
    cancellationNotes: [
      "Cancellation and refund conditions will be confirmed in the real operation stage based on landlord terms and payment method.",
      "Before reserving, confirm the deposit, first month rent, service fee, tax, and refundable period.",
      "This MapleHouse MVP screen does not process a real contract, money transfer, or reservation confirmation.",
    ],
    finalConfirmItems: [
      "I checked that the listing, move-in date, and stay period are correct.",
      "The initial payment, deposit, service fee, and tax calculation must be reviewed again before real checkout.",
      "This is an MVP mock screen. Real checkout and reservation confirmation are not connected yet.",
    ],
  },
  fr: {
    title: "Réserver",
    subtitle:
      "Page mock MVP pour vérifier les détails de réservation et les points à confirmer avant paiement.",
    mvpNote: "Le paiement réel et la confirmation de réservation ne sont pas encore connectés.",
    breadcrumb: "Réserver",
    linkedInquiryNote:
      "Cette réservation est liée à une demande précédente. Vous pouvez revoir le contenu dans votre historique des demandes.",
    emptyTitle: "Impossible de trouver le logement à réserver.",
    emptyBody: "Veuillez choisir de nouveau le logement depuis sa page détail ou la liste.",
    listingsAction: "Voir les logements",
    detailAction: "Retour au logement",
    inquiryListAction: "Voir mes demandes",
    checkoutAction: "Aller au paiement · MVP à venir",
    railCheckoutAction: "Aller au paiement · MVP bientôt",
    sections: {
      listingProfile: "Logement sélectionné",
      reservationInfo: "Informations de réservation",
      paymentDetails: "Détails du paiement",
      cancellation: "Annulation et remboursement",
      finalConfirm: "Avant paiement",
      summary: "Résumé de réservation",
    },
    metadata: {
      listing: "Logement",
      moveIn: "Date d’arrivée",
      guests: "Personnes",
      stay: "Durée du séjour",
    },
    reservationRows: {
      listing: "Logement",
      selectedUnit: "Chambre/unité choisie",
      moveIn: "Date d’arrivée",
      stay: "Durée du séjour",
      guests: "Personnes",
      name: "Nom du réservataire",
      email: "Email du réservataire",
    },
    paymentRows: {
      rent: "Loyer mensuel",
      deposit: "Dépôt",
      initialPayment: "Montant initial",
      supportFee: "Frais de service",
      tax: "Taxes",
      total: "Montant total prévu",
    },
    summaryLabels: {
      listing: "Logement",
      moveIn: "Date d’arrivée",
      amount: "Montant",
      supportFee: "Frais de service",
      tax: "Taxes",
      total: "Montant total prévu",
    },
    values: {
      selectedUnit: "Unité entière",
      moveIn: "15 août 2026",
      stay: "6 mois",
      guests: "1 personne",
      name: "MEHA KIM",
      email: "name@example.com",
      tax: "À calculer lors de l’exploitation réelle",
      total: "Avant connexion au paiement réel",
    },
    paymentNote:
      "Avant tout paiement réel, vérifiez de nouveau le montant total, le dépôt et les conditions de remboursement.",
    paymentHelp: {
      initialPayment: [
        "Ce montant est calculé sur la base du premier mois de loyer plus le dépôt (généralement utilisé comme dernier mois de loyer).",
        "Cette structure est couramment utilisée dans les locations à Toronto/Ontario.",
        "Les montants et conditions réels peuvent varier selon le logement et le propriétaire.",
      ],
      supportFee: [
        "Il s’agit de frais de service facturés pour l’assistance MapleHouse, comme l’organisation des demandes, l’aide à la réservation et la communication client.",
        "En phase réelle, le montant peut varier selon l’étendue du service.",
      ],
    },
    summaryNote: "Le paiement réel et la confirmation de réservation ne sont pas encore lancés.",
    cancellationNotes: [
      "Les conditions d’annulation et de remboursement seront confirmées lors de l’exploitation réelle selon les conditions du propriétaire et le mode de paiement.",
      "Avant de réserver, vérifiez le dépôt, le premier mois de loyer, les frais de service, les taxes et la période remboursable.",
      "Cet écran MapleHouse MVP ne traite pas de contrat réel, de transfert d’argent ni de confirmation de réservation.",
    ],
    finalConfirmItems: [
      "J’ai vérifié que le logement, la date d’arrivée et la durée du séjour sont corrects.",
      "Le montant initial, le dépôt, les frais de service et les taxes doivent être revérifiés avant tout paiement réel.",
      "Cet écran est un mock MVP. Le paiement réel et la confirmation de réservation ne sont pas encore connectés.",
    ],
  },
};

const TENANT_INQUIRIES: TenantInquiryData[] = [
  {
    slug: "inq-2026-001",
    id: "INQ-2026-001",
    listingId: "L-001",
    listingTitle: {
      ko: "Koreatown 1BR 코지 스튜디오",
      en: "Cozy 1BR Studio in Koreatown",
      fr: "Studio 1 chambre confortable à Koreatown",
    },
    areaUnit: {
      ko: "Koreatown · 1BR 스튜디오",
      en: "Koreatown · 1BR studio",
      fr: "Koreatown · studio 1 chambre",
    },
    method: "assisted",
    progress: "received",
    receivedAt: { ko: "2026. 6. 16.", en: "Jun 16, 2026", fr: "16 juin 2026" },
    latestUpdate: {
      ko: "MapleHouse가 문의 내용을 확인할 예정입니다.",
      en: "MapleHouse is preparing to review the inquiry details.",
      fr: "MapleHouse va vérifier le contenu de la demande.",
    },
    sentInquiry: [
      {
        ko: "입주 가능일, 공과금 포함 여부, 보증금 조건을 확인하고 싶습니다.",
        en: "I would like to confirm the move-in date, included utilities, and deposit conditions.",
        fr: "Je souhaite confirmer la date d’entrée, les charges incluses et les conditions de dépôt.",
      },
      {
        ko: "입금 전에 초기 입금액과 환불 조건을 알고 싶습니다.",
        en: "Before paying, I want to understand the first payment amount and refund conditions.",
        fr: "Avant tout paiement, je souhaite comprendre le montant initial et les conditions de remboursement.",
      },
    ],
    mapleHouseQuestions: [
      {
        ko: "실제 입주 가능일은 언제인가요?",
        en: "What is the actual available move-in date?",
        fr: "Quelle est la date réelle d’entrée possible?",
      },
      {
        ko: "월세에 포함되는 항목은 무엇인가요?",
        en: "What items are included in the monthly rent?",
        fr: "Quels éléments sont inclus dans le loyer mensuel?",
      },
      {
        ko: "보증금 또는 초기 입금 조건은 어떻게 되나요?",
        en: "What are the deposit or initial payment conditions?",
        fr: "Quelles sont les conditions de dépôt ou de paiement initial?",
      },
      {
        ko: "입주 전 입금이 필요한 경우 금액과 환불 조건은 어떻게 되나요?",
        en: "If payment is required before move-in, what is the amount and refund policy?",
        fr: "Si un paiement est requis avant l’entrée, quel est le montant et la politique de remboursement?",
      },
      {
        ko: "사진과 실제 공간이 다른 부분이 있나요?",
        en: "Are there any differences between the photos and the actual space?",
        fr: "Y a-t-il des différences entre les photos et l’espace réel?",
      },
      {
        ko: "예약이나 계약 전 추가로 확인해야 할 규칙이 있나요?",
        en: "Are there any additional rules to confirm before reservation or agreement?",
        fr: "Y a-t-il des règles à confirmer avant la réservation ou l’accord?",
      },
    ],
    responseGroups: [
      {
        title: {
          ko: "임대인 답변 요약",
          en: "Landlord reply summary",
          fr: "Synthèse de la réponse du propriétaire",
        },
        items: [
          {
            ko: "아직 임대인 답변을 기다리는 중입니다.",
            en: "The landlord reply is still pending.",
            fr: "La réponse du propriétaire est encore en attente.",
          },
          {
            ko: "입주 가능일, 포함 항목, 초기 입금 조건은 확인 전입니다.",
            en: "Move-in date, included items, and initial payment terms still need confirmation.",
            fr: "La date d’entrée, les inclusions et les conditions de paiement initial restent à confirmer.",
          },
        ],
      },
      {
        title: {
          ko: "입주자가 확인해야 할 점",
          en: "Items to confirm before payment",
          fr: "Points à confirmer avant paiement",
        },
        items: [
          {
            ko: "입금 전에는 초기 입금액과 환불 조건을 다시 확인해야 합니다.",
            en: "Before any payment, confirm the initial amount and refund conditions again.",
            fr: "Avant tout paiement, confirmez de nouveau le montant initial et les conditions de remboursement.",
          },
          {
            ko: "사진과 실제 공간 차이에 대한 답변을 듣기 전까지 예약 진행은 보류하는 것이 좋습니다.",
            en: "It is better to wait before proceeding until photo and actual-space differences are clarified.",
            fr: "Il est préférable d’attendre la réponse sur les différences entre photos et espace réel.",
          },
        ],
      },
    ],
  },
  {
    slug: "inq-2026-003",
    id: "INQ-2026-003",
    listingId: "L-002",
    listingTitle: {
      ko: "Downtown furnished studio",
      en: "Downtown furnished studio",
      fr: "Studio meublé au centre-ville",
    },
    areaUnit: {
      ko: "Downtown · furnished studio",
      en: "Downtown · furnished studio",
      fr: "Centre-ville · studio meublé",
    },
    method: "assisted",
    progress: "waitingLandlord",
    receivedAt: { ko: "2026. 6. 15.", en: "Jun 15, 2026", fr: "15 juin 2026" },
    latestUpdate: {
      ko: "임대인에게 포함 항목과 추가 비용을 문의한 상태입니다.",
      en: "MapleHouse has asked the landlord about included items and extra costs.",
      fr: "MapleHouse a demandé au propriétaire les inclusions et les frais supplémentaires.",
    },
    sentInquiry: [
      {
        ko: "가구 포함 범위와 인터넷 포함 여부를 확인하고 싶습니다.",
        en: "I want to confirm what furniture is included and whether internet is included.",
        fr: "Je souhaite confirmer les meubles inclus et si l’internet est inclus.",
      },
      {
        ko: "추가 비용이 있다면 예약 전에 알고 싶습니다.",
        en: "I would like to know any extra costs before reservation.",
        fr: "Je souhaite connaître les frais supplémentaires avant toute réservation.",
      },
    ],
    mapleHouseQuestions: [
      {
        ko: "침대, 책상, 의자, 주방용품 등 실제 포함 가구는 무엇인가요?",
        en: "Which furniture items are actually included, such as bed, desk, chair, and kitchenware?",
        fr: "Quels meubles sont réellement inclus, par exemple lit, bureau, chaise et ustensiles?",
      },
      {
        ko: "인터넷, 전기, 수도, 난방 중 월세에 포함되는 항목은 무엇인가요?",
        en: "Which utilities are included in rent: internet, electricity, water, and heating?",
        fr: "Quelles charges sont incluses: internet, électricité, eau et chauffage?",
      },
      {
        ko: "입주 전 추가로 납부해야 하는 비용이 있나요?",
        en: "Are there any extra costs due before move-in?",
        fr: "Y a-t-il des frais supplémentaires à payer avant l’entrée?",
      },
    ],
    responseGroups: [
      {
        title: {
          ko: "임대인 답변 요약",
          en: "Landlord reply summary",
          fr: "Synthèse de la réponse du propriétaire",
        },
        items: [
          {
            ko: "가구 포함 범위와 인터넷 포함 여부를 임대인에게 문의한 상태입니다.",
            en: "Furniture scope and internet inclusion have been sent to the landlord for confirmation.",
            fr: "La portée des meubles et l’inclusion d’internet sont en cours de confirmation.",
          },
          {
            ko: "답변이 도착하면 MapleHouse가 주요 조건을 정리해 안내합니다.",
            en: "When the reply arrives, MapleHouse will summarize the key conditions clearly.",
            fr: "Lorsque la réponse arrive, MapleHouse résumera clairement les conditions importantes.",
          },
        ],
      },
    ],
  },
  {
    slug: "inq-2026-004",
    id: "INQ-2026-004",
    listingId: "L-003",
    listingTitle: {
      ko: "Finch station shared house",
      en: "Finch station shared house",
      fr: "Maison partagée près de Finch",
    },
    areaUnit: {
      ko: "Finch Station · shared house",
      en: "Finch Station · shared house",
      fr: "Finch Station · maison partagée",
    },
    method: "direct",
    progress: "summarizingReply",
    receivedAt: { ko: "2026. 6. 14.", en: "Jun 14, 2026", fr: "14 juin 2026" },
    latestUpdate: {
      ko: "임대인 답변을 확인했습니다.",
      en: "The landlord reply has been received.",
      fr: "La réponse du propriétaire a été reçue.",
    },
    sentInquiry: [],
    mapleHouseQuestions: [],
    directQuestions: [
      {
        ko: "단기 체류가 가능한가요?",
        en: "Is a short stay possible?",
        fr: "Un court séjour est-il possible?",
      },
      {
        ko: "입주 전 입금 조건은 어떻게 되나요?",
        en: "What are the payment conditions before move-in?",
        fr: "Quelles sont les conditions de paiement avant l’entrée?",
      },
      {
        ko: "공용공간 이용 규칙이 있나요?",
        en: "Are there any rules for shared spaces?",
        fr: "Y a-t-il des règles pour les espaces communs?",
      },
    ],
    responseGroups: [
      {
        title: {
          ko: "임대인 답변",
          en: "Landlord reply",
          fr: "Réponse du propriétaire",
        },
        items: [
          {
            ko: "단기 체류는 가능하지만 최소 체류 기간과 입주 전 입금 조건은 다시 확인이 필요합니다.",
            en: "A short stay may be possible, but minimum stay and pre-move-in payment terms need reconfirmation.",
            fr: "Un court séjour peut être possible, mais la durée minimale et les conditions de paiement doivent être reconfirmées.",
          },
          {
            ko: "공용공간 이용 규칙은 입주 전 안내 예정입니다.",
            en: "Shared-space rules will be provided before move-in.",
            fr: "Les règles des espaces communs seront communiquées avant l’entrée.",
          },
        ],
      },
    ],
  },
];

function getTenantInquiry(slug: string) {
  return TENANT_INQUIRIES.find((inquiry) => inquiry.slug === slug);
}

function getTenantInquiryListing(inquiry: TenantInquiryData) {
  return MOCK_LISTINGS.find((listing) => listing.id === inquiry.listingId);
}

function getMockListingById(listingId?: string) {
  return listingId ? MOCK_LISTINGS.find((listing) => listing.id === listingId) : undefined;
}

function getTenantInquiryListHref(locale: Locale) {
  return `/${locale}/my/inquiries`;
}

function getTenantInquiryDetailHref(locale: Locale, slug: string) {
  return `/${locale}/my/inquiries/${slug}`;
}

function getTenantReservationNewHref(locale: Locale, listingId: string, inquiryId?: string) {
  const params = new URLSearchParams({ listingId });

  if (inquiryId) {
    params.set("inquiryId", inquiryId);
  }

  return `/${locale}/reservations/new?${params.toString()}`;
}

function getTenantReservationReviewHref(locale: Locale, slug: string) {
  const inquiry = getTenantInquiry(slug);

  if (!inquiry) {
    return `/${locale}/reservations/new`;
  }

  return getTenantReservationNewHref(locale, inquiry.listingId, inquiry.slug);
}

function getTenantListingHref(locale: Locale, listingId: string) {
  return `/${locale}/listings/${listingId}`;
}

function isTenantReservationReviewReady(progress: TenantInquiryProgressKey) {
  return progress === "summarizingReply" || progress === "reservationReview" || progress === "closed";
}

function getTenantReservationAvailability(
  copy: TenantInquiryCopy,
  progress: TenantInquiryProgressKey,
) {
  if (progress === "waitingLandlord") {
    return copy.reservationReview.availability.waitingLandlord;
  }

  if (isTenantReservationReviewReady(progress)) {
    return copy.reservationReview.availability.ready;
  }

  return copy.reservationReview.availability.afterReply;
}

function getTenantReservationFollowUpItems(inquiry: TenantInquiryData, locale: Locale) {
  const existingFollowUpGroup = inquiry.responseGroups[1];

  if (existingFollowUpGroup) {
    return existingFollowUpGroup.items.map((item) => item[locale]);
  }

  if (inquiry.slug === "inq-2026-003") {
    return {
      ko: [
        "포함 항목과 추가 비용은 답변 도착 전까지 확정하지 않습니다.",
        "입금 전 총 초기 비용과 환불 조건을 다시 확인해야 합니다.",
      ],
      en: [
        "Do not treat included items and extra costs as final until the reply arrives.",
        "Confirm the total initial amount and refund conditions again before any payment.",
      ],
      fr: [
        "Ne considérez pas les inclusions et frais supplémentaires comme définitifs avant la réponse.",
        "Confirmez le montant initial total et les conditions de remboursement avant tout paiement.",
      ],
    }[locale];
  }

  if (inquiry.slug === "inq-2026-004") {
    return {
      ko: [
        "입금 전 송금 조건과 환불 가능 여부를 확인해야 합니다.",
        "공용공간 규칙을 문서나 메시지로 남겨두는 것이 좋습니다.",
      ],
      en: [
        "Confirm transfer conditions and refund possibility before any payment.",
        "It is better to keep shared-space rules in writing or message form.",
      ],
      fr: [
        "Confirmez les conditions de transfert et la possibilité de remboursement avant tout paiement.",
        "Il est préférable de garder les règles des espaces communs par écrit ou par message.",
      ],
    }[locale];
  }

  return inquiry.mapleHouseQuestions.slice(0, 2).map((item) => item[locale]);
}

function formatTenantReservationRent(locale: Locale, priceCAD?: number) {
  if (!priceCAD) {
    return locale === "ko" ? "확인 필요" : locale === "fr" ? "À confirmer" : "Needs confirmation";
  }

  const amount = `C$${priceCAD.toLocaleString("en-US")}`;

  if (locale === "ko") {
    return `${amount} / 월`;
  }

  if (locale === "fr") {
    return `${amount} / mois`;
  }

  return `${amount} / month`;
}

function formatReservationCadAmount(amount?: number) {
  if (!amount) {
    return "C$0";
  }

  const hasCents = !Number.isInteger(amount);

  return `C$${amount.toLocaleString("en-US", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatReservationKrwAmount(amount?: number) {
  if (!amount) {
    return "₩0";
  }

  return `₩${Math.round(amount).toLocaleString("ko-KR")}`;
}

function formatReservationAmount(
  currency: ReservationCurrency,
  amountCAD: number,
  amountKRW: number,
) {
  return currency === "CAD"
    ? formatReservationCadAmount(amountCAD)
    : formatReservationKrwAmount(amountKRW);
}

function formatReservationMonthlyRent(
  locale: Locale,
  currency: ReservationCurrency,
  priceCAD: number,
  priceKRW: number,
) {
  const amount = formatReservationAmount(currency, priceCAD, priceKRW);

  if (locale === "ko") {
    return `${amount} / 월`;
  }

  if (locale === "fr") {
    return `${amount} / mois`;
  }

  return `${amount} / month`;
}

export function LocaleTenantInquiryListPage({ locale }: { locale: Locale }) {
  const copy = TENANT_INQUIRY_COPY[locale];

  return (
    <main className="min-h-screen bg-[#F7F7F8] py-10 sm:py-14">
      <Container className="space-y-6">
        <TenantInquiryBreadcrumb
          locale={locale}
          items={[{ label: copy.listTitle }]}
        />

        <TenantInquiryHero
          eyebrow="MAPLEHOUSE MVP MY PAGE MOCK"
          title={copy.listTitle}
          subtitle={copy.listSubtitle}
          note={copy.mvpNote}
        />

        <section className="rounded-3xl border border-border bg-white p-4 shadow-sm sm:p-5">
          <div className="hidden overflow-hidden rounded-2xl border border-border md:block">
            <div className="grid grid-cols-[150px_minmax(0,1.4fr)_150px_150px_minmax(0,1.3fr)_110px] bg-muted/40 px-4 py-3 text-center text-xs font-bold text-muted-foreground">
              <span>{copy.columns.id}</span>
              <span>{copy.columns.listing}</span>
              <span>{copy.columns.type}</span>
              <span>{copy.columns.progress}</span>
              <span>{copy.columns.latestUpdate}</span>
              <span>{copy.columns.detail}</span>
            </div>
            <div className="divide-y divide-border">
              {TENANT_INQUIRIES.map((inquiry) => (
                <TenantInquiryTableRow key={inquiry.id} inquiry={inquiry} copy={copy} locale={locale} />
              ))}
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {TENANT_INQUIRIES.map((inquiry) => (
              <TenantInquiryMobileCard key={inquiry.id} inquiry={inquiry} copy={copy} locale={locale} />
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}

export function LocaleTenantInquiryDetailPage({
  locale,
  inquiryId,
}: {
  locale: Locale;
  inquiryId: string;
}) {
  const copy = TENANT_INQUIRY_COPY[locale];
  const inquiry = getTenantInquiry(inquiryId);
  const [activeTab, setActiveTab] = useState<"progress" | "dm">("progress");

  return (
    <main className="min-h-screen bg-[#F7F7F8] py-10 sm:py-14">
      <Container className="space-y-6">
        <TenantInquiryBreadcrumb
          locale={locale}
          items={[
            { label: copy.listTitle, href: getTenantInquiryListHref(locale) },
            { label: copy.detailTitle },
          ]}
        />

        <TenantInquiryHero
          eyebrow="MAPLEHOUSE MVP MY PAGE MOCK"
          title={copy.detailTitle}
          subtitle={copy.detailSubtitle}
          note={copy.mvpNote}
        />

        {!inquiry ? (
          <TenantInquiryEmptyState copy={copy} locale={locale} />
        ) : (
          <>
            <TenantInquiryMetadataStrip
              items={[
                [copy.metadata.id, inquiry.id],
                [copy.metadata.listing, inquiry.listingTitle[locale]],
                [copy.metadata.method, copy.methods[inquiry.method]],
                [copy.metadata.receivedAt, inquiry.receivedAt[locale]],
              ]}
            />

            <TenantListingProfileCard inquiry={inquiry} copy={copy} locale={locale} />

            {activeTab === "progress" ? (
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
                <div className="min-w-0 space-y-5">
                  <TenantInquiryDetailTabs
                    copy={copy}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                  />
                  <TenantInquiryProgressContent inquiry={inquiry} copy={copy} locale={locale} />
                </div>

                <aside className="h-fit rounded-3xl border border-primary/15 bg-white p-5 shadow-sm xl:sticky xl:top-24">
                  <div className="mb-4 border-b border-border/70 pb-3">
                    <h2 className="text-sm font-bold text-foreground">{copy.sections.progress}</h2>
                  </div>
                  <TenantProgressFlow copy={copy} current={inquiry.progress} />
                  <div className="mt-5 border-t border-border/70 pt-4">
                    <a
                      href={getTenantInquiryListHref(locale)}
                      className="inline-flex w-full items-center justify-center rounded-2xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-[#FFF8F1] hover:text-primary"
                    >
                      {copy.backToList}
                    </a>
                  </div>
                </aside>
              </div>
            ) : (
              <div className="space-y-5">
                <TenantInquiryDetailTabs
                  copy={copy}
                  activeTab={activeTab}
                  onChange={setActiveTab}
                />
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
                  <div className="min-w-0">
                    <TenantDmPlaceholder copy={copy} />
                  </div>
                  <TenantDmGuidelinesRail copy={copy} />
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <a
                href={getTenantListingHref(locale, inquiry.listingId)}
                className="inline-flex flex-1 items-center justify-center rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-[#FFF8F1] hover:text-primary"
              >
                {copy.listingAction}
              </a>
              <a
                href={getTenantInquiryListHref(locale)}
                className="inline-flex flex-1 items-center justify-center rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-[#FFF8F1] hover:text-primary"
              >
                {copy.backToList}
              </a>
              <a
                href={getTenantReservationReviewHref(locale, inquiry.slug)}
                className="inline-flex flex-1 items-center justify-center rounded-2xl border border-primary/20 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold text-primary transition hover:border-primary/35 hover:bg-[#FFEFD9]"
              >
                {copy.reservationAction}
              </a>
            </div>
          </>
        )}
      </Container>
    </main>
  );
}

export function LocaleReservationNewPage({
  locale,
  listingId,
  inquiryId,
}: {
  locale: Locale;
  listingId?: string;
  inquiryId?: string;
}) {
  const reservationCopy = TENANT_RESERVATION_NEW_COPY[locale];
  const [currency, setCurrency] = useState<ReservationCurrency>("CAD");
  const inquiry = inquiryId ? getTenantInquiry(inquiryId) : undefined;
  const effectiveListingId = listingId || inquiry?.listingId || "";
  const listing = getMockListingById(effectiveListingId);

  if (!listing) {
    return (
      <main className="min-h-screen bg-[#F7F7F8] py-10 sm:py-14">
        <Container className="space-y-6">
          <TenantInquiryBreadcrumb
            locale={locale}
            items={[{ label: reservationCopy.breadcrumb }]}
          />
          <TenantInquiryHero
            eyebrow="MAPLEHOUSE MVP RESERVATION MOCK"
            title={reservationCopy.title}
            subtitle={reservationCopy.subtitle}
            note={reservationCopy.mvpNote}
          />
          <TenantReservationEmptyState reservationCopy={reservationCopy} locale={locale} />
        </Container>
      </main>
    );
  }

  const monthlyRent = formatReservationMonthlyRent(
    locale,
    currency,
    listing.priceCAD,
    listing.priceKRW,
  );
  const deposit = formatReservationAmount(currency, listing.priceCAD, listing.priceKRW);
  const initialPayment = formatReservationAmount(
    currency,
    listing.priceCAD * 2,
    listing.priceKRW * 2,
  );
  const supportFee = formatReservationAmount(
    currency,
    listing.priceCAD * 0.15,
    listing.priceKRW * 0.15,
  );

  return (
    <main className="min-h-screen bg-[#F7F7F8] py-10 sm:py-14">
      <Container className="space-y-6">
        <TenantInquiryBreadcrumb
          locale={locale}
          items={[{ label: reservationCopy.breadcrumb }]}
        />

        <TenantInquiryHero
          eyebrow="MAPLEHOUSE MVP RESERVATION MOCK"
          title={reservationCopy.title}
          subtitle={reservationCopy.subtitle}
          note={reservationCopy.mvpNote}
        />

        <TenantInquiryMetadataStrip
          items={[
            [reservationCopy.metadata.listing, listing.title[locale]],
            [reservationCopy.metadata.moveIn, reservationCopy.values.moveIn],
            [reservationCopy.metadata.guests, reservationCopy.values.guests],
            [reservationCopy.metadata.stay, reservationCopy.values.stay],
          ]}
        />

        {inquiry ? (
          <p className="rounded-2xl border border-primary/15 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold leading-6 text-primary">
            {reservationCopy.linkedInquiryNote}
          </p>
        ) : null}

        <ReservationListingProfileCard listing={listing} copy={reservationCopy} locale={locale} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-5">
            <TenantDetailSection title={reservationCopy.sections.reservationInfo}>
              <TenantReservationRows
                rows={[
                  [reservationCopy.reservationRows.listing, listing.title[locale]],
                  [reservationCopy.reservationRows.selectedUnit, reservationCopy.values.selectedUnit],
                  [reservationCopy.reservationRows.moveIn, reservationCopy.values.moveIn],
                  [reservationCopy.reservationRows.stay, reservationCopy.values.stay],
                  [reservationCopy.reservationRows.guests, reservationCopy.values.guests],
                  [reservationCopy.reservationRows.name, reservationCopy.values.name],
                  [reservationCopy.reservationRows.email, reservationCopy.values.email],
                ]}
              />
            </TenantDetailSection>

            <TenantDetailSection title={reservationCopy.sections.paymentDetails}>
              <div className="space-y-4">
                <TenantReservationRows
                  rows={[
                    [reservationCopy.paymentRows.rent, monthlyRent],
                    [reservationCopy.paymentRows.deposit, deposit],
                    [
                      <ReservationHelpLabel
                        label={reservationCopy.paymentRows.initialPayment}
                        items={reservationCopy.paymentHelp.initialPayment}
                      />,
                      initialPayment,
                    ],
                    [
                      <ReservationHelpLabel
                        label={reservationCopy.paymentRows.supportFee}
                        items={reservationCopy.paymentHelp.supportFee}
                      />,
                      supportFee,
                    ],
                    [reservationCopy.paymentRows.tax, reservationCopy.values.tax],
                    [reservationCopy.paymentRows.total, reservationCopy.values.total],
                  ]}
                />
                <p className="rounded-2xl border border-primary/15 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold leading-6 text-primary">
                  {reservationCopy.paymentNote}
                </p>
              </div>
            </TenantDetailSection>

            <TenantDetailSection title={reservationCopy.sections.cancellation}>
              <TenantTextBlock items={reservationCopy.cancellationNotes} />
            </TenantDetailSection>

            <TenantDetailSection title={reservationCopy.sections.finalConfirm}>
              <TenantReservationChecklist items={reservationCopy.finalConfirmItems} />
            </TenantDetailSection>

            <div className="grid gap-3 sm:grid-cols-3">
              <a
                href={getTenantListingHref(locale, listing.id)}
                className="inline-flex items-center justify-center rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-[#FFF8F1] hover:text-primary"
              >
                {reservationCopy.detailAction}
              </a>
              <a
                href={getTenantInquiryListHref(locale)}
                className="inline-flex items-center justify-center rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-[#FFF8F1] hover:text-primary"
              >
                {reservationCopy.inquiryListAction}
              </a>
              <button
                type="button"
                className="inline-flex cursor-default items-center justify-center rounded-2xl border border-primary/25 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold text-primary"
              >
                {reservationCopy.checkoutAction}
              </button>
            </div>
          </div>

          <TenantReservationSummaryRail
            listing={listing}
            copy={reservationCopy}
            locale={locale}
            currency={currency}
            onCurrencyChange={setCurrency}
            monthlyRent={monthlyRent}
            supportFee={supportFee}
          />
        </div>
      </Container>
    </main>
  );
}

export function LocaleTenantReservationReviewPage({
  locale,
  inquiryId,
}: {
  locale: Locale;
  inquiryId: string;
}) {
  return <LocaleReservationNewPage locale={locale} inquiryId={inquiryId} />;
}

function TenantInquiryBreadcrumb({
  locale,
  items,
}: {
  locale: Locale;
  items: Array<{ label: string; href?: string }>;
}) {
  const copy = TENANT_INQUIRY_COPY[locale];

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

function TenantInquiryHero({
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
      <div className="max-w-3xl space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
        <h1 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">{title}</h1>
        <p className="text-sm leading-7 text-muted-foreground">{subtitle}</p>
        <p className="inline-flex max-w-full rounded-full border border-primary/20 bg-[#FFF8F1] px-3 py-1.5 text-xs font-semibold leading-relaxed text-primary">
          {note}
        </p>
      </div>
    </section>
  );
}

function TenantInquiryTableRow({
  inquiry,
  copy,
  locale,
}: {
  inquiry: TenantInquiryData;
  copy: TenantInquiryCopy;
  locale: Locale;
}) {
  return (
    <div className="grid grid-cols-[150px_minmax(0,1.4fr)_150px_150px_minmax(0,1.3fr)_110px] items-center gap-0 px-4 py-4 text-center text-sm">
      <span className="font-semibold text-foreground">{inquiry.id}</span>
      <span className="mx-auto min-w-0 max-w-full truncate text-foreground">
        {inquiry.listingTitle[locale]}
      </span>
      <span className="text-muted-foreground">{copy.methodsShort[inquiry.method]}</span>
      <span className="flex justify-center">
        <TenantStatusPill label={copy.progress[inquiry.progress]} active />
      </span>
      <span className="mx-auto min-w-0 max-w-[18rem] text-sm leading-6 text-muted-foreground">
        {inquiry.latestUpdate[locale]}
      </span>
      <span>
        <a
          href={getTenantInquiryDetailHref(locale, inquiry.slug)}
          className="inline-flex items-center justify-center gap-1 rounded-xl border border-primary/20 px-3 py-2 text-xs font-bold text-primary transition hover:bg-[#FFF8F1]"
        >
          {copy.detailAction}
        </a>
      </span>
    </div>
  );
}

function TenantInquiryMobileCard({
  inquiry,
  copy,
  locale,
}: {
  inquiry: TenantInquiryData;
  copy: TenantInquiryCopy;
  locale: Locale;
}) {
  return (
    <article className="rounded-2xl border border-border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-muted-foreground">{inquiry.id}</p>
          <h2 className="mt-1 truncate text-sm font-bold text-foreground">
            {inquiry.listingTitle[locale]}
          </h2>
        </div>
        <TenantStatusPill label={copy.progress[inquiry.progress]} active />
      </div>
      <div className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
        <p>
          <span className="font-semibold text-foreground">{copy.columns.type}: </span>
          {copy.methodsShort[inquiry.method]}
        </p>
        <p>{inquiry.latestUpdate[locale]}</p>
      </div>
      <a
        href={getTenantInquiryDetailHref(locale, inquiry.slug)}
        className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-primary/20 px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-[#FFF8F1]"
      >
        {copy.detailAction}
      </a>
    </article>
  );
}

function TenantInquiryEmptyState({ copy, locale }: { copy: TenantInquiryCopy; locale: Locale }) {
  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-border bg-white p-8 text-center shadow-sm">
      <Inbox className="mx-auto h-10 w-10 text-primary" aria-hidden />
      <h2 className="mt-4 text-xl font-bold text-foreground">{copy.emptyTitle}</h2>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy.emptyBody}</p>
      <a
        href={getTenantInquiryListHref(locale)}
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
      >
        {copy.backToList}
      </a>
    </section>
  );
}

function TenantReservationEmptyState({
  reservationCopy,
  locale,
}: {
  reservationCopy: TenantReservationNewCopy;
  locale: Locale;
}) {
  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-border bg-white p-8 text-center shadow-sm">
      <Inbox className="mx-auto h-10 w-10 text-primary" aria-hidden />
      <h2 className="mt-4 text-xl font-bold text-foreground">{reservationCopy.emptyTitle}</h2>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{reservationCopy.emptyBody}</p>
      <a
        href={`/${locale}/listings`}
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
      >
        {reservationCopy.listingsAction}
      </a>
    </section>
  );
}

function TenantInquiryMetadataStrip({ items }: { items: Array<[string, string]> }) {
  return (
    <section className="rounded-3xl border border-border bg-white px-5 py-4 text-sm shadow-sm">
      <div className="flex flex-wrap gap-x-3 gap-y-2 text-muted-foreground">
        {items.map(([label, value], index) => (
          <span key={label} className="min-w-0">
            {index > 0 ? <span className="mr-3 text-border">·</span> : null}
            <span className="font-semibold text-foreground">{label}</span>{" "}
            <span className="break-words">{value}</span>
          </span>
        ))}
      </div>
    </section>
  );
}

function TenantReservationReadinessNotice({
  reviewCopy,
  isReady,
}: {
  reviewCopy: TenantReservationReviewCopy;
  isReady: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border bg-white p-5 shadow-sm",
        isReady ? "border-primary/20" : "border-border",
      )}
    >
      <p className={cn("text-sm font-bold", isReady ? "text-primary" : "text-foreground")}>
        {isReady ? reviewCopy.readyTitle : reviewCopy.notReadyTitle}
      </p>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">
        {isReady ? reviewCopy.readyBody : reviewCopy.notReadyBody}
      </p>
      <p className="mt-3 text-xs font-semibold leading-5 text-primary">{reviewCopy.mockNote}</p>
    </section>
  );
}

function TenantListingProfileCard({
  inquiry,
  copy,
  locale,
}: {
  inquiry: TenantInquiryData;
  copy: TenantInquiryCopy;
  locale: Locale;
}) {
  const listing = getTenantInquiryListing(inquiry);
  const imageSrc = listing?.imagePath;

  return (
    <section className="rounded-3xl border border-primary/15 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center">
        <ListingImageFrame
          src={imageSrc}
          alt={inquiry.listingTitle[locale]}
          className="h-32 rounded-2xl border border-border bg-secondary sm:h-28"
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-[#FFF8F1] text-xs font-bold text-primary">
              MapleHouse
            </div>
          }
        />
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
            {copy.sections.listingProfile}
          </p>
          <h2 className="mt-2 truncate text-lg font-bold text-foreground">
            {inquiry.listingTitle[locale]}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{inquiry.areaUnit[locale]}</p>
          <a
            href={getTenantListingHref(locale, inquiry.listingId)}
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary transition hover:underline"
          >
            {copy.listingAction}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}

function ReservationListingProfileCard({
  listing,
  copy,
  locale,
}: {
  listing: MockListing;
  copy: TenantReservationNewCopy;
  locale: Locale;
}) {
  return (
    <section className="rounded-3xl border border-primary/15 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center">
        <ListingImageFrame
          src={listing.imagePath}
          alt={listing.title[locale]}
          className="h-32 rounded-2xl border border-border bg-secondary sm:h-28"
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-[#FFF8F1] text-xs font-bold text-primary">
              MapleHouse
            </div>
          }
        />
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
            {copy.sections.listingProfile}
          </p>
          <h2 className="mt-2 truncate text-lg font-bold text-foreground">
            {listing.title[locale]}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {listing.area} · {listing.roomType[locale]}
          </p>
          <a
            href={getTenantListingHref(locale, listing.id)}
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary transition hover:underline"
          >
            {copy.detailAction}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}

function TenantReservationChecklist({ items }: { items: string[] }) {
  return (
    <div className="divide-y divide-border/70">
      {items.map((item) => (
        <div key={item} className="flex gap-3 py-3 text-sm leading-7 text-muted-foreground">
          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary text-white">
            <Check className="h-3.5 w-3.5" aria-hidden strokeWidth={2.4} />
          </span>
          <span className="min-w-0">{item}</span>
        </div>
      ))}
    </div>
  );
}

function TenantReservationRows({ rows }: { rows: Array<[ReactNode, ReactNode]> }) {
  return (
    <div className="divide-y divide-border/70">
      {rows.map(([label, value], index) => (
        <div key={index} className="grid gap-1 py-3 text-sm sm:grid-cols-[180px_minmax(0,1fr)]">
          <span className="font-semibold text-foreground">{label}</span>
          <span className="min-w-0 leading-6 text-muted-foreground">{value}</span>
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
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-white text-[11px] font-bold leading-none text-primary transition hover:border-primary hover:bg-[#FFF8F1]"
      >
        ?
      </button>
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-0 top-full z-20 mt-2 w-[min(18rem,calc(100vw-3rem))] rounded-2xl border border-primary/15 bg-white p-3 text-xs font-medium leading-5 text-muted-foreground opacity-0 shadow-lg transition",
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

function TenantReservationSummaryRail({
  listing,
  copy,
  locale,
  currency,
  onCurrencyChange,
  monthlyRent,
  supportFee,
}: {
  listing: MockListing;
  copy: TenantReservationNewCopy;
  locale: Locale;
  currency: ReservationCurrency;
  onCurrencyChange: (currency: ReservationCurrency) => void;
  monthlyRent: string;
  supportFee: string;
}) {
  return (
    <aside className="h-fit rounded-3xl border border-primary/15 bg-white p-5 shadow-sm xl:sticky xl:top-24">
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-border/70 pb-3">
        <h2 className="text-sm font-bold text-foreground">{copy.sections.summary}</h2>
        <CurrencyTextToggle value={currency} onChange={onCurrencyChange} />
      </div>
      <TenantReservationSummaryRows
        rows={[
          [copy.summaryLabels.listing, listing.title[locale]],
          [copy.summaryLabels.moveIn, copy.values.moveIn],
          [copy.summaryLabels.amount, monthlyRent],
          [copy.summaryLabels.supportFee, supportFee],
          [copy.summaryLabels.tax, copy.values.tax],
          [copy.summaryLabels.total, copy.values.total],
        ]}
      />
      <p className="mt-4 rounded-2xl border border-primary/15 bg-[#FFF8F1] px-4 py-3 text-xs font-semibold leading-6 text-primary">
        {copy.summaryNote}
      </p>
      <button
        type="button"
        className="mt-4 inline-flex min-h-11 w-full cursor-default items-center justify-center rounded-2xl border border-primary/25 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold text-primary transition hover:bg-[#FFEFD9]"
      >
        {copy.railCheckoutAction}
      </button>
    </aside>
  );
}

function CurrencyTextToggle({
  value,
  onChange,
}: {
  value: ReservationCurrency;
  onChange: (currency: ReservationCurrency) => void;
}) {
  return (
    <div className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-primary">
      {(["CAD", "KRW"] as const).map((currency, index) => (
        <span key={currency} className="inline-flex items-center gap-1.5">
          {index > 0 ? <span className="text-primary/35">|</span> : null}
          <button
            type="button"
            onClick={() => onChange(currency)}
            className={cn(
              "whitespace-nowrap bg-transparent p-0 text-xs transition hover:text-primary",
              value === currency ? "font-extrabold text-primary" : "font-semibold text-primary/55",
            )}
          >
            {currency}
          </button>
        </span>
      ))}
    </div>
  );
}

function TenantReservationSummaryRows({ rows }: { rows: Array<[string, ReactNode]> }) {
  return (
    <div className="divide-y divide-border/70">
      {rows.map(([label, value]) => (
        <div key={label} className="py-3 text-sm">
          <p className="font-semibold text-foreground">{label}</p>
          <p className="mt-1 min-w-0 leading-6 text-muted-foreground">{value}</p>
        </div>
      ))}
    </div>
  );
}

function TenantInquiryDetailTabs({
  copy,
  activeTab,
  onChange,
}: {
  copy: TenantInquiryCopy;
  activeTab: "progress" | "dm";
  onChange: (tab: "progress" | "dm") => void;
}) {
  const tabs: Array<{ id: "progress" | "dm"; label: string }> = [
    { id: "progress", label: copy.tabs.progress },
    { id: "dm", label: copy.tabs.dm },
  ];

  return (
    <div className="inline-flex max-w-full flex-wrap gap-1.5 rounded-2xl border border-border bg-white p-1.5 shadow-sm">
      {tabs.map((tab) => {
        const selected = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex min-h-10 items-center justify-center rounded-xl px-4 text-sm font-bold transition",
              "whitespace-nowrap break-keep",
              selected
                ? "border border-primary/20 bg-[#FFF8F1] text-primary"
                : "border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            aria-pressed={selected}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function TenantInquiryProgressContent({
  inquiry,
  copy,
  locale,
}: {
  inquiry: TenantInquiryData;
  copy: TenantInquiryCopy;
  locale: Locale;
}) {
  return (
    <>
      {inquiry.method === "assisted" ? (
        <TenantDetailSection title={copy.sections.sentAssisted}>
          <TenantTextBlock
            title={copy.sections.customerInquiry}
            items={inquiry.sentInquiry.map((item) => item[locale])}
          />
          <TenantNumberedList
            title={copy.sections.mapleHouseQuestions}
            items={inquiry.mapleHouseQuestions.map((item) => item[locale])}
          />
        </TenantDetailSection>
      ) : (
        <TenantDetailSection
          title={copy.sections.sentDirect}
          description={copy.sections.directDescription}
        >
          <TenantNumberedList
            title={copy.sections.customerInquiry}
            items={(inquiry.directQuestions ?? []).map((item) => item[locale])}
          />
        </TenantDetailSection>
      )}

      <TenantDetailSection
        title={
          inquiry.method === "assisted"
            ? copy.sections.assistedResponse
            : copy.sections.directResponse
        }
      >
        <div className="space-y-5">
          {inquiry.responseGroups.map((group) => (
            <TenantTextBlock
              key={group.title[locale]}
              title={group.title[locale]}
              items={group.items.map((item) => item[locale])}
            />
          ))}
        </div>
      </TenantDetailSection>

      <TenantDetailSection title={copy.sections.reservation}>
        <TenantTextBlock items={copy.reservationNotes} />
      </TenantDetailSection>
    </>
  );
}

function TenantDmPlaceholder({ copy }: { copy: TenantInquiryCopy }) {
  return (
    <TenantDetailSection title={copy.dm.title} description={copy.dm.subtitle}>
      <div className="space-y-4">
        <div className="min-h-[420px] space-y-2 overflow-y-auto rounded-2xl border border-border bg-[#FAFAFA] p-3 sm:min-h-[520px] sm:p-4">
          {copy.dm.messages.map((message, index) => {
            const mine = message.side === "customer";
            const label = mine ? copy.dm.customerLabel : copy.dm.landlordLabel;

            return (
              <div
                key={`${message.side}-${index}`}
                className={cn("flex", mine ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[78%] rounded-2xl border px-3.5 py-2.5 text-sm leading-6 shadow-sm",
                    mine
                      ? "border-primary/18 bg-[#FFF8F1] text-foreground"
                      : "border-border bg-white text-foreground",
                  )}
                >
                  <p
                    className={cn(
                      "mb-0.5 text-[10px] font-bold leading-none",
                      mine ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </p>
                  <p>{message.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="rounded-2xl border border-primary/15 bg-[#FFF8F1] px-4 py-3 text-xs font-semibold leading-6 text-primary">
          {copy.dm.translationNote}
        </p>

        <div className="rounded-2xl border border-border bg-white p-3">
          <textarea
            disabled
            rows={3}
            placeholder={copy.dm.inputPlaceholder}
            className="min-h-20 w-full resize-none rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm leading-6 text-muted-foreground outline-none"
          />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-muted-foreground">{copy.dm.fileNote}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled
                className="inline-flex cursor-default items-center justify-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-bold text-muted-foreground"
              >
                <Paperclip className="h-3.5 w-3.5" aria-hidden />
                {copy.dm.attach}
              </button>
              <button
                type="button"
                disabled
                className="inline-flex cursor-default items-center justify-center gap-1.5 rounded-xl border border-primary/20 bg-[#FFF8F1] px-3 py-2 text-xs font-bold text-primary/70"
              >
                <SendHorizontal className="h-3.5 w-3.5" aria-hidden />
                {copy.dm.send}
              </button>
            </div>
          </div>
        </div>
      </div>
    </TenantDetailSection>
  );
}

function TenantDmGuidelinesRail({ copy }: { copy: TenantInquiryCopy }) {
  return (
    <aside className="h-fit rounded-3xl border border-primary/15 bg-white p-5 shadow-sm xl:sticky xl:top-24">
      <div className="border-b border-border/70 pb-3">
        <h2 className="text-sm font-bold text-foreground">{copy.dm.guidelinesTitle}</h2>
      </div>
      <ul className="divide-y divide-border/70">
        {copy.dm.guidelines.map((item, index) => {
          const paymentCaution = index === 2;

          return (
            <li
              key={item}
              className={cn(
                "flex gap-2.5 py-3 text-[13px] leading-6",
                paymentCaution ? "font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              <CheckCircle2
                aria-hidden
                className={cn(
                  "mt-1 h-4 w-4 shrink-0",
                  paymentCaution ? "text-primary" : "text-primary/75",
                )}
                strokeWidth={1.7}
              />
              <span className="min-w-0 whitespace-pre-line">{item}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function TenantDetailSection({
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
      <div className="mb-5 border-b border-border/70 pb-4">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function TenantTextBlock({ title, items }: { title?: string; items: string[] }) {
  return (
    <div className="space-y-3">
      {title ? <h3 className="text-sm font-bold text-foreground">{title}</h3> : null}
      <div className="divide-y divide-border/70">
        {items.map((item) => (
          <p key={item} className="py-3 text-sm leading-7 text-muted-foreground">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function TenantNumberedList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      <ol className="divide-y divide-border/70">
        {items.map((item, index) => (
          <li key={item} className="flex gap-3 py-3 text-sm leading-7 text-muted-foreground">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/25 text-xs font-bold text-primary">
              {index + 1}
            </span>
            <span className="min-w-0">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function TenantProgressFlow({
  copy,
  current,
}: {
  copy: TenantInquiryCopy;
  current: TenantInquiryProgressKey;
}) {
  const currentIndex = TENANT_PROGRESS_ORDER.indexOf(current);

  return (
    <ol className="space-y-3">
      {TENANT_PROGRESS_ORDER.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;

        return (
          <li key={step} className="flex gap-3">
            <span
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : done
                    ? "border-primary/35 bg-[#FFF8F1] text-primary"
                    : "border-border bg-muted text-muted-foreground",
              )}
            >
              {done ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> : index + 1}
            </span>
            <span
              className={cn(
                "min-w-0 text-sm leading-6",
                active ? "font-bold text-foreground" : "text-muted-foreground",
              )}
            >
              {copy.progress[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function TenantStatusPill({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center justify-center rounded-full border px-2.5 py-1 text-[11px] font-bold leading-none",
        active
          ? "border-primary/25 bg-[#FFF8F1] text-primary"
          : "border-border bg-muted text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}
