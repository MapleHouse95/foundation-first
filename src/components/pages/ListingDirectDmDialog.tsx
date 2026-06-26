import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Home,
  SendHorizontal,
  UserRound,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Container } from "@/components/layout/Container";
import { ListingImageFrame } from "@/components/ui/listing-image-frame";
import type { Locale } from "@/lib/i18n";
import {
  addCustomerReply,
  createDirectLandlordDmThread,
  findDirectLandlordDmThread,
  formatInquiryDate,
  getInquiries,
  markInquiryReadByCustomer,
  subscribeToInquiryChanges,
  type InquiryMessage,
  type InquiryRecord,
} from "@/lib/inquiryStore";
import {
  getListingById,
  resolveLocalizedListingMeta,
  type ResolvedListingMeta,
} from "@/lib/listingResolver";
import type { SelectedInquiryPayload } from "@/lib/mockInquiryStorage";
import { cn } from "@/lib/utils";

export type DirectDmListingContext = {
  listingId: string;
  roomId?: string;
  title: string;
  roomTitle?: string;
  image?: string;
  location?: string;
};

const DIRECT_DM_COPY = {
  ko: {
    label: "집주인 DM",
    title: "집주인에게 DM 문의하기",
    subtitle: "이 매물에 대해 집주인과 바로 대화할 수 있습니다.",
    empty: "아직 대화가 없습니다. 이 매물에 대해 궁금한 내용을 남겨보세요.",
    placeholder: "메시지를 입력해 주세요.",
    send: "보내기",
    me: "나",
    landlord: "집주인",
    mapleHouse: "MapleHouse",
    tenantInitial: "나",
    landlordInitial: "집",
    pageTitle: "집주인에게 DM 문의하기",
    unavailableTitle: "매물 정보를 찾을 수 없습니다.",
    unavailableBody: "유효한 매물에서 다시 DM 문의를 시작해 주세요.",
    backToListings: "매물 목록으로",
    back: "뒤로",
    listingDetail: "매물 상세 보기",
    listingLabel: "대화 중인 매물",
    selectedRoom: "선택한 방",
    landlordName: "MapleHouse 등록 임대인",
    landlordRole: "매물 담당 집주인",
    responseGuide: "문의 내용은 이 매물 대화에 저장됩니다.",
    localOnlyGuide: "현재는 브라우저에 저장되는 프론트엔드 대화입니다.",
    priceFallback: "가격 확인 필요",
    locationFallback: "위치 확인 필요",
    housingFallback: "주거 형태 확인 필요",
  },
  en: {
    label: "Landlord DM",
    title: "DM the landlord",
    subtitle: "Start a direct conversation with the landlord about this listing.",
    empty: "No messages yet. Ask the landlord about this listing.",
    placeholder: "Enter a message.",
    send: "Send",
    me: "Me",
    landlord: "Landlord",
    mapleHouse: "MapleHouse",
    tenantInitial: "Me",
    landlordInitial: "L",
    pageTitle: "DM the landlord",
    unavailableTitle: "Listing information was not found.",
    unavailableBody: "Please start a DM again from a valid listing.",
    backToListings: "Back to listings",
    back: "Back",
    listingDetail: "View listing",
    listingLabel: "Listing in conversation",
    selectedRoom: "Selected room",
    landlordName: "MapleHouse listed landlord",
    landlordRole: "Listing owner",
    responseGuide: "Messages are saved to this listing conversation.",
    localOnlyGuide: "This is currently a front-end conversation stored in this browser.",
    priceFallback: "Price to confirm",
    locationFallback: "Location to confirm",
    housingFallback: "Housing type to confirm",
  },
  fr: {
    label: "DM propriétaire",
    title: "Envoyer un DM au propriétaire",
    subtitle: "Démarrez une conversation directe avec le propriétaire au sujet de ce logement.",
    empty: "Aucun message pour le moment. Posez une question au propriétaire au sujet de ce logement.",
    placeholder: "Saisissez un message.",
    send: "Envoyer",
    me: "Moi",
    landlord: "Propriétaire",
    mapleHouse: "MapleHouse",
    tenantInitial: "Moi",
    landlordInitial: "P",
    pageTitle: "Envoyer un DM au propriétaire",
    unavailableTitle: "Informations du logement introuvables.",
    unavailableBody: "Veuillez recommencer le DM depuis un logement valide.",
    backToListings: "Retour aux logements",
    back: "Retour",
    listingDetail: "Voir le logement",
    listingLabel: "Logement de la conversation",
    selectedRoom: "Chambre sélectionnée",
    landlordName: "Propriétaire inscrit MapleHouse",
    landlordRole: "Propriétaire du logement",
    responseGuide: "Les messages sont enregistrés dans cette conversation.",
    localOnlyGuide: "Cette conversation est actuellement stockée dans ce navigateur.",
    priceFallback: "Prix à confirmer",
    locationFallback: "Emplacement à confirmer",
    housingFallback: "Type de logement à confirmer",
  },
} as const;

function useDirectDmThread(listingId: string, roomId?: string) {
  const [records, setRecords] = useState<InquiryRecord[]>([]);

  useEffect(() => {
    setRecords(getInquiries());
    return subscribeToInquiryChanges(setRecords);
  }, []);

  return useMemo(
    () =>
      records.find((record) => {
        if (record.inquiryMethod !== "direct-landlord-dm" && record.inquiryMethod !== "direct") {
          return false;
        }
        if (record.listingId !== listingId) return false;
        if (roomId) return record.roomId === roomId;
        return !record.roomId;
      }) ?? findDirectLandlordDmThread({ listingId, roomId }),
    [listingId, records, roomId],
  );
}

export function getListingDmHref(locale: Locale, listingId: string, roomId?: string) {
  const params = new URLSearchParams();
  if (roomId) params.set("roomId", roomId);
  const query = params.toString();
  return `/${locale}/messages/listing/${encodeURIComponent(listingId)}${query ? `?${query}` : ""}`;
}

export function selectedInquiryToDirectDmContext(
  selectedInquiry: SelectedInquiryPayload,
): DirectDmListingContext {
  return {
    listingId: selectedInquiry.listingId,
    roomId: selectedInquiry.roomId,
    title: selectedInquiry.listingTitle,
    roomTitle: selectedInquiry.roomName,
    image: selectedInquiry.thumbnailUrl,
    location: selectedInquiry.area,
  };
}

export function DirectLandlordDmApplyPage({
  locale,
  loaded,
  selectedInquiry,
}: {
  locale: Locale;
  loaded: boolean;
  selectedInquiry: SelectedInquiryPayload | null;
}) {
  const copy = DIRECT_DM_COPY[locale];

  useEffect(() => {
    if (!loaded || !selectedInquiry || typeof window === "undefined") return;
    window.location.replace(
      getListingDmHref(locale, selectedInquiry.listingId, selectedInquiry.roomId),
    );
  }, [loaded, locale, selectedInquiry]);

  if (!loaded || selectedInquiry) {
    return (
      <main className="min-h-screen bg-[#F7F7F8] py-12 sm:py-16">
        <Container>
          <section className="mx-auto max-w-2xl rounded-3xl border border-border bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-primary">{copy.label}</p>
            <h1 className="mt-3 text-2xl font-bold text-foreground">{copy.pageTitle}</h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy.subtitle}</p>
          </section>
        </Container>
      </main>
    );
  }

  return <DirectDmNotFound locale={locale} />;
}

export function LocaleListingDmPage({
  locale,
  listingId,
  roomId,
}: {
  locale: Locale;
  listingId: string;
  roomId?: string;
}) {
  const listing = getListingById(listingId);
  const copy = DIRECT_DM_COPY[locale];
  const meta = resolveLocalizedListingMeta({ listingId, roomId, locale });

  if (!listing) {
    return <DirectDmNotFound locale={locale} />;
  }

  const context: DirectDmListingContext = {
    listingId,
    roomId,
    title: meta.listingTitle,
    roomTitle: meta.roomTitle,
    image: meta.image,
    location: meta.location,
  };

  return (
    <main className="min-h-screen bg-[#F7F7F8] py-6 sm:py-8">
      <Container className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`/${locale}/listings`}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/30 hover:bg-[#FFF8F1] hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {copy.back}
          </a>
          <p className="text-sm font-semibold text-muted-foreground">{copy.pageTitle}</p>
        </div>

        <ListingChatHeader locale={locale} meta={meta} />

        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <LandlordProfileCard locale={locale} />
          <ListingDmChatPanel locale={locale} context={context} meta={meta} />
        </div>
      </Container>
    </main>
  );
}

function DirectDmNotFound({ locale }: { locale: Locale }) {
  const copy = DIRECT_DM_COPY[locale];
  return (
    <main className="min-h-screen bg-[#F7F7F8] py-12 sm:py-16">
      <Container>
        <section className="mx-auto max-w-2xl rounded-3xl border border-border bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">{copy.unavailableTitle}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            {copy.unavailableBody}
          </p>
          <a href={`/${locale}/listings`} className="mh-primary-soft-button mt-6">
            {copy.backToListings}
          </a>
        </section>
      </Container>
    </main>
  );
}

function ListingChatHeader({
  locale,
  meta,
}: {
  locale: Locale;
  meta: ResolvedListingMeta;
}) {
  const copy = DIRECT_DM_COPY[locale];
  const listing = meta.listing;
  const price = formatDmPrice(locale, listing);
  const housingType = listing?.roomType[locale] ?? copy.housingFallback;

  return (
    <section className="sticky top-0 z-20 rounded-3xl border border-border bg-white/95 p-4 shadow-sm backdrop-blur sm:p-5">
      <div className="grid gap-4 sm:grid-cols-[128px_minmax(0,1fr)] sm:items-center">
        <ListingImageFrame
          src={meta.image}
          alt={meta.listingTitle}
          className="h-28 rounded-2xl sm:h-24"
        />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {copy.listingLabel}
          </p>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="line-clamp-2 text-xl font-bold leading-tight text-foreground sm:text-2xl">
                {meta.listingTitle}
              </h1>
              {meta.roomTitle ? (
                <p className="mt-1 text-sm font-semibold text-primary">
                  {copy.selectedRoom}: {meta.roomTitle}
                </p>
              ) : null}
            </div>
            <a href={`/${locale}/listings/${meta.listingId}`} className="mh-soft-button shrink-0">
              {copy.listingDetail}
            </a>
          </div>
          <dl className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
            <CompactFact icon={<Home className="h-4 w-4" />} value={meta.location || copy.locationFallback} />
            <CompactFact icon={<Building2 className="h-4 w-4" />} value={housingType} />
            <CompactFact icon={<CheckCircle2 className="h-4 w-4" />} value={price} />
          </dl>
        </div>
      </div>
    </section>
  );
}

function CompactFact({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-border/70 bg-[#FAFAFA] px-3 py-2">
      <span className="shrink-0 text-primary">{icon}</span>
      <span className="truncate font-semibold text-foreground">{value}</span>
    </div>
  );
}

function LandlordProfileCard({ locale }: { locale: Locale }) {
  const copy = DIRECT_DM_COPY[locale];
  return (
    <aside className="h-fit rounded-3xl border border-border bg-white p-5 shadow-sm lg:sticky lg:top-36">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-[#FFF8F1] text-primary">
          <UserRound className="h-7 w-7" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-foreground">{copy.landlordName}</p>
          <p className="mt-1 text-xs font-semibold text-primary">{copy.landlordRole}</p>
        </div>
      </div>
      <div className="mt-5 space-y-3 border-t border-border pt-4">
        <p className="text-sm leading-6 text-muted-foreground">{copy.responseGuide}</p>
        <p className="rounded-2xl bg-[#FAFAFA] p-3 text-xs leading-5 text-muted-foreground">
          {copy.localOnlyGuide}
        </p>
      </div>
    </aside>
  );
}

function ListingDmChatPanel({
  locale,
  context,
  meta,
}: {
  locale: Locale;
  context: DirectDmListingContext;
  meta: ResolvedListingMeta;
}) {
  const copy = DIRECT_DM_COPY[locale];
  const thread = useDirectDmThread(context.listingId, context.roomId);
  const messages = thread?.messages ?? [];
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (thread?.customerUnread || thread?.tenantUnread) {
      markInquiryReadByCustomer(thread.id);
    }
  }, [thread?.customerUnread, thread?.id, thread?.tenantUnread]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) {
      setError(copy.placeholder);
      return;
    }

    if (thread) {
      addCustomerReply(thread.id, trimmed);
    } else {
      createDirectLandlordDmThread({
        listingId: context.listingId,
        roomId: context.roomId,
        locale,
        listingTitleSnapshot: meta.listingTitle,
        listingTitleSnapshots: meta.listingTitleSnapshots,
        roomTitleSnapshot: meta.roomTitle,
        roomTitleSnapshots: meta.roomTitleSnapshots,
        listingImageSnapshot: meta.image,
        message: trimmed,
      });
    }

    setMessage("");
    setError("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    sendMessage();
  };

  return (
    <section className="flex min-h-[68vh] flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <p className="text-sm font-bold text-foreground">{copy.title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{copy.subtitle}</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-[#FAFAFA] px-4 py-5 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-border bg-white p-8 text-center">
            <p className="max-w-sm text-sm font-semibold leading-7 text-muted-foreground">
              {copy.empty}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((item) => (
              <TenantDmBubble key={item.id} locale={locale} message={item} />
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <footer className="border-t border-border bg-white p-4">
        <textarea
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            setError("");
          }}
          onKeyDown={onKeyDown}
          rows={3}
          placeholder={copy.placeholder}
          className="min-h-24 w-full resize-none rounded-2xl border border-input bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-muted-foreground/75 focus:border-primary/45 focus:ring-2 focus:ring-primary/10"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="min-h-5 text-xs font-semibold text-primary">{error}</p>
          <button
            type="button"
            onClick={sendMessage}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-[#FFF3E6] px-5 py-2.5 text-sm font-bold text-primary transition hover:border-primary/55 hover:bg-[#FFE8CC]"
          >
            {copy.send}
            <SendHorizontal className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </footer>
    </section>
  );
}

function TenantDmBubble({
  locale,
  message,
}: {
  locale: Locale;
  message: InquiryMessage;
}) {
  const copy = DIRECT_DM_COPY[locale];
  const outgoing = message.author === "customer";
  const system = message.author === "maplehouse";
  const label =
    message.author === "customer"
      ? copy.me
      : message.author === "landlord"
        ? copy.landlord
        : copy.mapleHouse;

  if (system) {
    return (
      <article className="flex justify-center">
        <div className="max-w-[78%] rounded-full bg-white px-4 py-2 text-center text-xs font-semibold text-muted-foreground shadow-sm">
          {message.body}
        </div>
      </article>
    );
  }

  return (
    <article className={cn("flex items-end gap-2", outgoing ? "justify-end" : "justify-start")}>
      {!outgoing ? <MessageAvatar label={copy.landlordInitial} tone="incoming" /> : null}
      <div
        className={cn(
          "max-w-[72%] rounded-[1.25rem] border px-4 py-3 text-sm leading-6 shadow-sm",
          outgoing
            ? "rounded-br-md border-primary/20 bg-[#FFF3E6] text-foreground"
            : "rounded-bl-md border-border bg-white text-foreground",
        )}
      >
        <p className={cn("text-[11px] font-semibold", outgoing ? "text-primary" : "text-muted-foreground")}>
          {label} - {formatInquiryDate(locale, message.createdAt)}
        </p>
        <p className="mt-1 whitespace-pre-wrap break-words">{message.body}</p>
      </div>
      {outgoing ? <MessageAvatar label={copy.tenantInitial} tone="outgoing" /> : null}
    </article>
  );
}

function MessageAvatar({ label, tone }: { label: string; tone: "incoming" | "outgoing" }) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold",
        tone === "outgoing"
          ? "border-primary/25 bg-[#FFF8F1] text-primary"
          : "border-border bg-white text-muted-foreground",
      )}
    >
      {label}
    </div>
  );
}

function formatDmPrice(locale: Locale, listing: ResolvedListingMeta["listing"]) {
  const copy = DIRECT_DM_COPY[locale];
  if (!listing) return copy.priceFallback;
  if (locale === "ko") return `월 ${listing.priceKRW.toLocaleString("ko-KR")}원`;
  return `$${listing.priceCAD.toLocaleString("en-CA")} /m`;
}
