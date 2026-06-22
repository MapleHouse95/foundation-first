import { Check, Inbox } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { ListingImageFrame } from "@/components/ui/listing-image-frame";
import type { Locale } from "@/lib/i18n";
import {
  getMockListingRoomOption,
  type MockListingRoomOption,
} from "@/lib/mockListingRooms";
import { cn } from "@/lib/utils";
import { MOCK_LISTINGS, type MockListing } from "./LocaleListingsPage";

type ReservationCurrency = "CAD" | "KRW";

type CheckoutContext = {
  listing: MockListing;
  room: MockListingRoomOption;
};

type CompletionState = {
  listingId: string;
  roomId: string;
  currency: ReservationCurrency;
  inquiryId?: string;
  requestedAt: string;
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
  paymentMethods: string[];
  disabledFields: string[];
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
  };
  completeMvpNotes: string[];
  nextSteps: string[];
  inquiryHistoryAction: string;
  reservationHistoryAction: string;
};

const RESERVATION_COMPLETION_STORAGE_KEY = "maplehouse.reservationCompletion.v1";

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
      "예약 요청 전 결제 참고 정보와 확인 항목을 정리하는 MVP mock 화면입니다.",
    heroNote:
      "실제 결제, 송금, 계약, 예약 확정은 아직 연결되어 있지 않습니다.",
    emptyCheckoutTitle: "결제 정보를 찾을 수 없습니다.",
    emptyCheckoutDescription:
      "매물과 방 정보가 있는 예약 화면에서 다시 진행해 주세요.",
    emptyCompleteTitle: "접수된 예약 요청 정보를 찾을 수 없습니다.",
    emptyCompleteDescription:
      "예약 요청 완료 화면은 mock checkout 확인 이후에 표시됩니다.",
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
      tax: "실제 운영 단계에서 산정 예정",
      total: "실제 결제 연결 전",
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
      cancellation: "취소 및 환불 안내",
      summary: "결제 요약",
      completeReservation: "예약 요청 요약",
      completePayment: "결제 요청 요약",
      mvp: "MVP 안내",
      nextSteps: "다음 단계",
    },
    paymentRows: {
      rent: "월세",
      deposit: "보증금",
      initialPayment: "초기 입금액",
      supportFee: "서비스 이용료",
      tax: "부가세·세금",
      total: "총 결제 예정 금액",
    },
    paymentHelp: {
      initialPayment: "월세와 보증금을 합산한 mock 참고 금액입니다.",
      supportFee: "MapleHouse 대리 문의 및 확인 지원 mock 수수료입니다.",
    },
    paymentMethodNote:
      "실제 카드 입력, 계좌이체, 해외결제는 아직 연결되어 있지 않습니다.",
    paymentMethods: [
      "신용카드 · MVP 예정",
      "계좌이체 · MVP 예정",
      "해외카드 · MVP 예정",
    ],
    disabledFields: [
      "카드번호 입력 · MVP 예정",
      "만료일 · MVP 예정",
      "CVC · MVP 예정",
    ],
    checklistItems: [
      "이 화면은 실제 결제창이 아닌 MVP mock 화면임을 이해했습니다.",
      "실제 결제, 송금, 계약, 예약 확정은 아직 연결되어 있지 않음을 이해했습니다.",
      "결제 전 총 금액, 보증금, 환불 조건을 다시 확인해야 함을 이해했습니다.",
    ],
    checklistValidation: "결제 요청 전 확인 항목을 모두 체크해 주세요.",
    cancellationNotes: [
      "실제 취소, 환불, 인출 관련 정책은 아직 연결되어 있지 않습니다.",
      "추후 운영 단계에서는 예약 시점, 입주 예정일, 취소 시점에 따라 환불 가능 금액이 달라질 수 있습니다.",
      "임대인 사정으로 예약이 진행되지 않는 경우, 실제 운영 단계에서는 결제 금액 반환 절차가 별도로 안내될 수 있습니다.",
      "현재 화면은 정책 구조를 보여주는 MVP mock 상태입니다.",
    ],
    railTitle: "결제 요약",
    requestPaymentAction: "결제 요청하기 · MVP 예정",
    completeTitle: "예약 요청이 접수되었습니다",
    completeSubtitle:
      "아래 내용은 MVP mock 접수 화면입니다. 실제 결제, 계약, 송금, 예약 확정은 아직 연결되어 있지 않습니다.",
    completeSections: {
      reservation: "예약 요청 요약",
      payment: "결제 요청 요약",
      mvp: "MVP 안내",
      next: "다음 단계",
    },
    completeRows: {
      listing: "매물명",
      room: "선택한 방",
      moveIn: "입주예정일",
      guests: "인원",
      stay: "체류 기간",
    },
    completeMvpNotes: [
      "실제 결제, 계약, 송금, 예약 확정은 아직 연결되어 있지 않습니다.",
      "이 화면은 예약 요청 흐름을 보여주는 mock 상태입니다.",
    ],
    nextSteps: [
      "MapleHouse가 예약 요청 정보를 확인합니다.",
      "실제 운영 단계에서는 결제 및 계약 조건을 별도로 안내합니다.",
      "임대인 최종 확인 이후 예약 확정 또는 취소 안내가 진행될 수 있습니다.",
    ],
    inquiryHistoryAction: "나의 문의내역 보기",
    reservationHistoryAction: "나의 예약내역 보기 · MVP 예정",
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
      "Review payment details and confirmation items before sending a reservation request in this MVP mock screen.",
    heroNote:
      "Real payment, money transfer, contract, and reservation confirmation are not connected yet.",
    emptyCheckoutTitle: "Checkout information was not found.",
    emptyCheckoutDescription:
      "Please return to a reservation page with a selected listing and room.",
    emptyCompleteTitle: "No reservation request information was found.",
    emptyCompleteDescription:
      "The completion page appears after the mock checkout confirmation step.",
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
      tax: "To be calculated in the real operation stage",
      total: "Before real checkout connection",
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
      cancellation: "Cancellation and refund note",
      summary: "Payment summary",
      completeReservation: "Reservation request summary",
      completePayment: "Payment request summary",
      mvp: "MVP note",
      nextSteps: "Next steps",
    },
    paymentRows: {
      rent: "Monthly rent",
      deposit: "Deposit",
      initialPayment: "Initial payment",
      supportFee: "Service support fee",
      tax: "Additional tax",
      total: "Estimated total payment",
    },
    paymentHelp: {
      initialPayment: "Mock reference amount combining one month rent and deposit.",
      supportFee: "Mock fee for MapleHouse inquiry and confirmation support.",
    },
    paymentMethodNote:
      "Real card input, bank transfer, and international payment are not connected yet.",
    paymentMethods: [
      "Credit card · MVP coming",
      "Bank transfer · MVP coming",
      "International card · MVP coming",
    ],
    disabledFields: [
      "Card number · MVP coming",
      "Expiry date · MVP coming",
      "CVC · MVP coming",
    ],
    checklistItems: [
      "I understand this is an MVP mock screen, not a real checkout page.",
      "I understand real payment, money transfer, contract, and reservation confirmation are not connected yet.",
      "I understand the total amount, deposit, and refund conditions must be checked again before any real payment.",
    ],
    checklistValidation: "Please check all confirmation items before requesting payment.",
    cancellationNotes: [
      "Real cancellation, refund, and withdrawal policies are not connected yet.",
      "In a future operation stage, refundable amounts may vary by reservation timing, move-in date, and cancellation timing.",
      "If the reservation cannot proceed due to the landlord's circumstances, a separate return process may be provided in the real operation stage.",
      "This screen is an MVP mock showing the policy structure only.",
    ],
    railTitle: "Payment summary",
    requestPaymentAction: "Request payment · MVP coming",
    completeTitle: "Reservation request received",
    completeSubtitle:
      "This is an MVP mock confirmation screen. Real payment, contract, money transfer, and reservation confirmation are not connected yet.",
    completeSections: {
      reservation: "Reservation request summary",
      payment: "Payment request summary",
      mvp: "MVP note",
      next: "Next steps",
    },
    completeRows: {
      listing: "Listing",
      room: "Selected room",
      moveIn: "Move-in date",
      guests: "Guests",
      stay: "Stay period",
    },
    completeMvpNotes: [
      "Real payment, contract, money transfer, and reservation confirmation are not connected yet.",
      "This page is a mock state showing the reservation request flow.",
    ],
    nextSteps: [
      "MapleHouse reviews the reservation request information.",
      "In the real operation stage, payment and contract conditions will be provided separately.",
      "After the landlord's final confirmation, reservation confirmation or cancellation guidance may follow.",
    ],
    inquiryHistoryAction: "View my inquiries",
    reservationHistoryAction: "View my reservations · MVP coming",
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
      "Vérifiez les détails de paiement et les éléments de confirmation avant d’envoyer une demande de réservation dans cet écran mock MVP.",
    heroNote:
      "Le paiement réel, le transfert d’argent, le contrat et la confirmation de réservation ne sont pas encore connectés.",
    emptyCheckoutTitle: "Les informations de paiement sont introuvables.",
    emptyCheckoutDescription:
      "Revenez à une page de réservation avec un logement et une chambre sélectionnés.",
    emptyCompleteTitle: "Aucune information de demande de réservation n’a été trouvée.",
    emptyCompleteDescription:
      "La page de confirmation apparaît après l’étape mock de vérification du paiement.",
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
      tax: "À calculer lors de l’exploitation réelle",
      total: "Avant connexion au paiement réel",
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
      cancellation: "Note sur l’annulation et le remboursement",
      summary: "Résumé du paiement",
      completeReservation: "Résumé de la demande",
      completePayment: "Résumé du paiement",
      mvp: "Note MVP",
      nextSteps: "Prochaines étapes",
    },
    paymentRows: {
      rent: "Loyer mensuel",
      deposit: "Dépôt",
      initialPayment: "Paiement initial",
      supportFee: "Frais de service",
      tax: "Taxes supplémentaires",
      total: "Montant total estimé",
    },
    paymentHelp: {
      initialPayment: "Montant mock combinant un mois de loyer et le dépôt.",
      supportFee: "Frais mock pour l’aide MapleHouse à la demande et à la vérification.",
    },
    paymentMethodNote:
      "La saisie de carte, le virement bancaire et le paiement international réels ne sont pas encore connectés.",
    paymentMethods: [
      "Carte bancaire · MVP à venir",
      "Virement bancaire · MVP à venir",
      "Carte internationale · MVP à venir",
    ],
    disabledFields: [
      "Numéro de carte · MVP à venir",
      "Date d’expiration · MVP à venir",
      "CVC · MVP à venir",
    ],
    checklistItems: [
      "Je comprends que cet écran est un mock MVP, pas une vraie page de paiement.",
      "Je comprends que le paiement réel, le transfert d’argent, le contrat et la confirmation de réservation ne sont pas encore connectés.",
      "Je comprends que le montant total, le dépôt et les conditions de remboursement devront être revérifiés avant tout paiement réel.",
    ],
    checklistValidation: "Veuillez cocher tous les éléments avant de demander le paiement.",
    cancellationNotes: [
      "Les politiques réelles d’annulation, de remboursement et de retrait ne sont pas encore connectées.",
      "Lors d’une future exploitation, les montants remboursables pourront varier selon la date de réservation, la date d’entrée et le moment de l’annulation.",
      "Si la réservation ne peut pas se poursuivre pour une raison liée au propriétaire, une procédure de retour séparée pourra être indiquée dans l’exploitation réelle.",
      "Cet écran est un mock MVP qui présente seulement la structure de la politique.",
    ],
    railTitle: "Résumé du paiement",
    requestPaymentAction: "Demander le paiement · MVP à venir",
    completeTitle: "Demande de réservation reçue",
    completeSubtitle:
      "Ceci est un écran de confirmation mock MVP. Le paiement réel, le contrat, le transfert d’argent et la confirmation de réservation ne sont pas encore connectés.",
    completeSections: {
      reservation: "Résumé de la demande de réservation",
      payment: "Résumé de la demande de paiement",
      mvp: "Note MVP",
      next: "Prochaines étapes",
    },
    completeRows: {
      listing: "Logement",
      room: "Chambre choisie",
      moveIn: "Date d’entrée",
      guests: "Personnes",
      stay: "Durée du séjour",
    },
    completeMvpNotes: [
      "Le paiement réel, le contrat, le transfert d’argent et la confirmation de réservation ne sont pas encore connectés.",
      "Cette page est un état mock qui montre le flux de demande de réservation.",
    ],
    nextSteps: [
      "MapleHouse vérifie les informations de demande de réservation.",
      "Lors de l’exploitation réelle, les conditions de paiement et de contrat seront indiquées séparément.",
      "Après la confirmation finale du propriétaire, une confirmation de réservation ou une indication d’annulation pourra suivre.",
    ],
    inquiryHistoryAction: "Voir mes demandes",
    reservationHistoryAction: "Voir mes réservations · MVP à venir",
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
  const currency = parseReservationCurrency(currencyParam, locale);
  const context = getCheckoutContext(listingId, roomId);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    copy.checklistItems.map(() => false),
  );
  const [validationMessage, setValidationMessage] = useState("");

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

  const submitMockRequest = () => {
    if (!allChecked) {
      setValidationMessage(copy.checklistValidation);
      return;
    }

    saveCompletionState({
      listingId: listing.id,
      roomId: room.id,
      currency,
      inquiryId,
      requestedAt: new Date().toISOString(),
    });

    window.location.assign(`/${locale}/reservations/complete`);
  };

  const summaryRows: Array<[string, ReactNode]> = [
    [copy.metadata.listing, listing.title[locale]],
    [copy.metadata.room, room.label[locale]],
    [copy.metadata.moveIn, copy.values.moveIn],
    [copy.paymentRows.rent, <ReservationAmountText value={amounts.monthlyRent} />],
    [copy.paymentRows.initialPayment, <ReservationAmountText value={amounts.initialPayment} />],
    [copy.paymentRows.supportFee, <ReservationAmountText value={amounts.supportFee} />],
    [copy.paymentRows.tax, copy.values.tax],
    [copy.paymentRows.total, copy.values.total],
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
          eyebrow="MAPLEHOUSE MVP CHECKOUT MOCK"
          title={copy.heroTitle}
          subtitle={copy.heroSubtitle}
          note={copy.heroNote}
        />

        <ReservationMetadataStrip
          items={[
            [copy.metadata.listing, listing.title[locale]],
            [copy.metadata.room, room.label[locale]],
            [copy.metadata.moveIn, copy.values.moveIn],
            [copy.metadata.currency, currency],
            ...(inquiryId ? ([[copy.metadata.inquiry, inquiryId]] as Array<[string, string]>) : []),
          ]}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            <CheckoutListingProfileCard
              copy={copy}
              locale={locale}
              listing={listing}
              room={room}
              backHref={backHref}
            />

            <ReservationSection title={copy.sections.paymentDetails}>
              <ReservationRows
                rows={[
                  [copy.paymentRows.rent, <ReservationAmountText value={amounts.monthlyRent} />],
                  [copy.paymentRows.deposit, <ReservationAmountText value={amounts.deposit} />],
                  [
                    <ReservationHelpLabel
                      label={copy.paymentRows.initialPayment}
                      help={copy.paymentHelp.initialPayment}
                    />,
                    <ReservationAmountText value={amounts.initialPayment} />,
                  ],
                  [
                    <ReservationHelpLabel
                      label={copy.paymentRows.supportFee}
                      help={copy.paymentHelp.supportFee}
                    />,
                    <ReservationAmountText value={amounts.supportFee} />,
                  ],
                  [copy.paymentRows.tax, copy.values.tax],
                  [copy.paymentRows.total, copy.values.total],
                ]}
              />
            </ReservationSection>

            <ReservationSection title={copy.sections.paymentMethod}>
              <div className="space-y-4">
                <p className="rounded-2xl border border-primary/15 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold leading-6 text-primary">
                  {copy.paymentMethodNote}
                </p>
                <div className="divide-y divide-border/70 rounded-2xl border border-border bg-white">
                  {copy.paymentMethods.map((method) => (
                    <div key={method} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                      <span className="font-semibold text-foreground">{method}</span>
                      <span className="rounded-full border border-primary/20 px-2.5 py-1 text-[11px] font-bold text-primary">
                        MVP
                      </span>
                    </div>
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {copy.disabledFields.map((field) => (
                    <div
                      key={field}
                      className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-3 text-xs font-semibold leading-5 text-muted-foreground"
                    >
                      {field}
                    </div>
                  ))}
                </div>
              </div>
            </ReservationSection>

            <ReservationSection title={copy.sections.confirmation}>
              <ReservationConfirmationChecklist
                items={copy.checklistItems}
                checkedItems={checkedItems}
                onChange={(index) => {
                  setValidationMessage("");
                  setCheckedItems((current) =>
                    current.map((checked, itemIndex) =>
                      itemIndex === index ? !checked : checked,
                    ),
                  );
                }}
              />
              {validationMessage ? (
                <p className="mt-3 rounded-2xl border border-primary/20 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold text-primary">
                  {validationMessage}
                </p>
              ) : null}
            </ReservationSection>

            <ReservationSection title={copy.sections.cancellation}>
              <ReservationTextBlock items={copy.cancellationNotes} />
            </ReservationSection>

            <div className="grid gap-3 sm:grid-cols-3">
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
                onClick={submitMockRequest}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-primary/25 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold text-primary transition hover:bg-[#FFEFD9]"
              >
                {copy.requestPaymentAction}
              </button>
            </div>
          </div>

          <CheckoutSummaryRail
            copy={copy}
            rows={summaryRows}
            onSubmit={submitMockRequest}
            validationMessage={validationMessage}
          />
        </div>
      </Container>
    </main>
  );
}

export function LocaleReservationCompletePage({ locale }: { locale: Locale }) {
  const copy = CHECKOUT_COPY[locale];
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
  const amounts = buildPaymentAmounts(room, state.currency);

  return (
    <main className="min-h-screen bg-[#F7F7F8] py-10 sm:py-14">
      <Container className="max-w-5xl space-y-6">
        <ReservationBreadcrumb locale={locale} items={[{ label: copy.complete }]} />

        <ReservationHero
          eyebrow="MAPLEHOUSE MVP RESERVATION MOCK"
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
              [copy.paymentRows.rent, <ReservationAmountText value={amounts.monthlyRent} />],
              [copy.paymentRows.initialPayment, <ReservationAmountText value={amounts.initialPayment} />],
              [copy.paymentRows.supportFee, <ReservationAmountText value={amounts.supportFee} />],
              [copy.paymentRows.tax, copy.values.tax],
              [copy.paymentRows.total, copy.values.total],
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

function CheckoutListingProfileCard({
  copy,
  locale,
  listing,
  room,
  backHref,
}: {
  copy: CheckoutCopy;
  locale: Locale;
  listing: MockListing;
  room: MockListingRoomOption;
  backHref: string;
}) {
  return (
    <section className="rounded-3xl border border-primary/15 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold tracking-[0.16em] text-primary">MAPLEHOUSE</p>
          <h2 className="mt-1 text-lg font-bold text-foreground">{copy.profile.title}</h2>
        </div>
        <a href={backHref} className="text-sm font-semibold text-primary transition hover:text-primary/75">
          {copy.backToReservation}
        </a>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-[160px_minmax(0,1fr)]">
        <ListingImageFrame
          src={listing.imagePath}
          alt={listing.title[locale]}
          className="aspect-[4/3] rounded-2xl border border-border bg-muted md:aspect-square"
        />
        <div className="min-w-0 space-y-3">
          <div>
            <p className="text-xs font-semibold text-primary">{listing.area}</p>
            <h3 className="mt-1 text-xl font-bold leading-snug text-foreground">
              {listing.title[locale]}
            </h3>
          </div>
          <ReservationRows
            rows={[
              [copy.profile.selectedRoom, room.label[locale]],
              [copy.profile.moveIn, copy.values.moveIn],
            ]}
          />
        </div>
      </div>
    </section>
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

function ReservationHelpLabel({ label, help }: { label: string; help: string }) {
  return (
    <span className="inline-flex max-w-full flex-col gap-1">
      <span>{label}</span>
      <span className="text-xs font-medium leading-5 text-muted-foreground">{help}</span>
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

function CheckoutSummaryRail({
  copy,
  rows,
  onSubmit,
  validationMessage,
}: {
  copy: CheckoutCopy;
  rows: Array<[string, ReactNode]>;
  onSubmit: () => void;
  validationMessage: string;
}) {
  return (
    <aside className="h-fit rounded-3xl border border-primary/15 bg-white p-5 shadow-sm xl:sticky xl:top-24">
      <h2 className="border-b border-border/70 pb-3 text-sm font-bold text-foreground">
        {copy.railTitle}
      </h2>
      <div className="divide-y divide-border/70">
        {rows.map(([label, value]) => (
          <div key={label} className="py-3 text-sm">
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
        onClick={onSubmit}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-primary/25 bg-[#FFF8F1] px-4 py-3 text-sm font-semibold text-primary transition hover:bg-[#FFEFD9]"
      >
        {copy.requestPaymentAction}
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
    // Session storage is only a frontend MVP handoff; navigation can still continue.
  }
}

function readCompletionState(): CompletionState | null {
  try {
    const raw = window.sessionStorage.getItem(RESERVATION_COMPLETION_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CompletionState>;
    if (
      typeof parsed.listingId !== "string" ||
      typeof parsed.roomId !== "string" ||
      (parsed.currency !== "CAD" && parsed.currency !== "KRW") ||
      typeof parsed.requestedAt !== "string"
    ) {
      return null;
    }

    return {
      listingId: parsed.listingId,
      roomId: parsed.roomId,
      currency: parsed.currency,
      inquiryId: typeof parsed.inquiryId === "string" ? parsed.inquiryId : undefined,
      requestedAt: parsed.requestedAt,
    };
  } catch {
    return null;
  }
}
