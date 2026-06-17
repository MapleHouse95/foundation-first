import {
  ArrowRight,
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
import { MOCK_LISTINGS } from "./LocaleListingsPage";

type TenantInquiryMethod = "assisted" | "direct";
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
      reservationReview: "예약 검토 가능",
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
    reservationAction: "예약 검토하기 · MVP 예정",
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
      reservationReview: "Reservation review possible",
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
    reservationAction: "Review reservation · MVP coming",
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
      reservationReview: "Réservation à examiner",
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
    reservationAction: "Examiner la réservation · MVP à venir",
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

function getTenantInquiryListHref(locale: Locale) {
  return `/${locale}/my/inquiries`;
}

function getTenantInquiryDetailHref(locale: Locale, slug: string) {
  return `/${locale}/my/inquiries/${slug}`;
}

function getTenantListingHref(locale: Locale, listingId: string) {
  return `/${locale}/listings/${listingId}`;
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
              <button
                type="button"
                className="inline-flex flex-1 cursor-default items-center justify-center rounded-2xl border border-primary/20 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold text-primary/75"
              >
                {copy.reservationAction}
              </button>
            </div>
          </>
        )}
      </Container>
    </main>
  );
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
