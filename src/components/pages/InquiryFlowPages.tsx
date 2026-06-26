import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { ListingImageFrame } from "@/components/ui/listing-image-frame";
import { getListingDmHref } from "@/components/pages/ListingDirectDmDialog";
import type { Locale } from "@/lib/i18n";
import {
  addCustomerReply,
  addLandlordReply,
  formatInquiryDate,
  getConversationMode,
  getInquiries,
  getInquiryById,
  markInquiryReadByCustomer,
  markInquiryReadByLandlord,
  subscribeToInquiryChanges,
  updateInquiryInternalMemo,
  type InquiryRecord,
  type InquiryStatus,
} from "@/lib/inquiryStore";
import { formatMaximumOccupancy, resolveLocalizedListingMeta } from "@/lib/listingResolver";
import { MOCK_LISTINGS, type MockListing } from "@/components/pages/LocaleListingsPage";
import { cn } from "@/lib/utils";

const INQUIRY_UI = {
  ko: {
    home: "홈",
    myTitle: "내 문의/DM",
    mySubtitle: "보낸 문의와 임대인 답변을 한곳에서 확인하세요.",
    emptyTitle: "아직 접수된 문의가 없습니다.",
    emptyBody: "관심 있는 매물에서 문의를 보내보세요.",
    browse: "매물 보러가기",
    detail: "문의 상세",
    back: "목록으로",
    listing: "매물",
    room: "선택한 방",
    status: "상태",
    received: "접수일",
    updated: "최근 업데이트",
    moveIn: "희망 입주일",
    stay: "예상 거주 기간",
    contact: "연락처",
    conversation: "문의 대화",
    customer: "고객",
    landlord: "임대인",
    unread: "새 답변",
    inboxTitle: "문의 관리",
    inboxSubtitle: "매물에서 접수된 문의를 확인하고 답변을 관리하세요.",
    search: "고객명, 연락처, 매물명, 문의 내용 검색",
    all: "전체",
    noMatch: "조건에 맞는 문의가 없습니다.",
    noInboxTitle: "아직 접수된 문의가 없습니다.",
    noInboxBody: "고객이 매물에서 문의를 보내면 이곳에 표시됩니다.",
    notFoundTitle: "문의 내역을 찾을 수 없습니다.",
    replyTitle: "답변 작성",
    replyPlaceholder: "답변을 입력해 주세요.",
    replyRequired: "답변을 입력해 주세요.",
    sendReply: "답변 보내기",
    replySaved: "답변이 문의 내역에 등록되었습니다.",
    internalNote: "내부 메모",
    internalNoteHelp: "임대인과 운영자에게만 보입니다.",
    saveNote: "메모 저장",
    noteSaved: "메모가 저장되었습니다.",
    activity: "활동 기록",
    newCount: "새 문의",
    mode: "유형",
    modeLabels: {
      "direct-landlord-dm": "집주인 DM",
      "maplehouse-assisted": "메이플하우스 문의",
    },
    statusLabels: {
      new: "신규 문의",
      reviewing: "확인 중",
      answered: "답변 완료",
      "reservation-review": "예약 검토",
      closed: "종료",
    },
    contactLabels: { email: "이메일", kakao: "카카오톡", phone: "전화" },
    activities: {
      created: "문의가 접수됨",
      opened: "문의 확인됨",
      "status-changed": "상태가 변경됨",
      "landlord-replied": "임대인이 답변함",
      "customer-replied": "고객이 메시지를 보냄",
      "tenant-message": "세입자가 DM을 보냄",
      "landlord-message": "집주인이 DM에 답장함",
      "maplehouse-request-created": "메이플하우스 문의가 접수됨",
      "auto-closed": "7일 후 자동 종료됨",
      "memo-updated": "내부 메모가 수정됨",
    },
  },  en: {
    home: "Home",
    myTitle: "My inquiries / DMs",
    mySubtitle: "Review your inquiries and landlord replies in one place.",
    emptyTitle: "You have not submitted any inquiries yet.",
    emptyBody: "Send an inquiry from a listing you are interested in.",
    browse: "Browse listings",
    detail: "Inquiry detail",
    back: "Back to list",
    listing: "Listing",
    room: "Selected room",
    status: "Status",
    received: "Received",
    updated: "Updated",
    moveIn: "Desired move-in date",
    stay: "Expected stay",
    contact: "Contact",
    conversation: "Conversation",
    customer: "Customer",
    landlord: "Landlord",
    unread: "New reply",
    inboxTitle: "Inquiries",
    inboxSubtitle: "Review listing inquiries and manage replies.",
    search: "Search customer, contact, listing, or message",
    all: "All",
    noMatch: "No inquiries match these conditions.",
    noInboxTitle: "No inquiries have been received yet.",
    noInboxBody: "Inquiries sent from listings will appear here.",
    replyTitle: "Write a reply",
    replyPlaceholder: "Please enter a reply.",
    replyRequired: "Please enter a reply.",
    sendReply: "Send reply",
    replySaved: "Reply has been added to the inquiry history.",
    internalNote: "Internal note",
    internalNoteHelp: "Visible only to the landlord and operators.",
    saveNote: "Save note",
    noteSaved: "Note saved.",
    activity: "Activity history",
    newCount: "New",
    mode: "Type",
    modeLabels: {
      "direct-landlord-dm": "Landlord DM",
      "maplehouse-assisted": "MapleHouse request",
    },
    statusLabels: {
      new: "New",
      reviewing: "Reviewing",
      answered: "Answered",
      "reservation-review": "Reservation review",
      closed: "Closed",
    },
    contactLabels: { email: "Email", kakao: "KakaoTalk", phone: "Phone" },
    activities: {
      created: "Inquiry received",
      opened: "Inquiry opened",
      "status-changed": "Status changed",
      "landlord-replied": "Landlord replied",
      "customer-replied": "Customer replied",
      "tenant-message": "Tenant sent a DM",
      "landlord-message": "Landlord replied in DM",
      "maplehouse-request-created": "MapleHouse request received",
      "auto-closed": "Automatically closed after 7 days",
      "memo-updated": "Internal note updated",
    },
  },
  fr: {
    home: "Accueil",
    myTitle: "Mes demandes / DM",
    mySubtitle: "Consultez vos demandes et les réponses du propriétaire.",
    emptyTitle: "Vous n'avez encore envoyé aucune demande.",
    emptyBody: "Envoyez une demande depuis une annonce qui vous intéresse.",
    browse: "Voir les logements",
    detail: "Détail de la demande",
    back: "Retour à la liste",
    listing: "Annonce",
    room: "Chambre choisie",
    status: "Statut",
    received: "Reçue",
    updated: "Mise à jour",
    moveIn: "Date d'emménagement souhaitée",
    stay: "Durée de séjour prévue",
    contact: "Coordonnées",
    conversation: "Conversation",
    customer: "Client",
    landlord: "Propriétaire",
    unread: "Nouvelle réponse",
    inboxTitle: "Demandes",
    inboxSubtitle: "Consultez les demandes reçues et gérez les réponses.",
    search: "Rechercher client, contact, annonce ou message",
    all: "Toutes",
    noMatch: "Aucune demande ne correspond à ces critères.",
    noInboxTitle: "Aucune demande n'a encore été reçue.",
    noInboxBody: "Les demandes envoyées depuis les annonces apparaîtront ici.",
    replyTitle: "Rédiger une réponse",
    replyPlaceholder: "Veuillez saisir une réponse.",
    replyRequired: "Veuillez saisir une réponse.",
    sendReply: "Envoyer",
    replySaved: "La réponse a été ajoutée à l'historique.",
    internalNote: "Note interne",
    internalNoteHelp: "Visible uniquement par le propriétaire et les opérateurs.",
    saveNote: "Enregistrer la note",
    noteSaved: "Note enregistrée.",
    activity: "Historique",
    newCount: "Nouvelles",
    mode: "Type",
    modeLabels: {
      "direct-landlord-dm": "DM propriétaire",
      "maplehouse-assisted": "Demande MapleHouse",
    },
    statusLabels: {
      new: "Nouvelle",
      reviewing: "En cours",
      answered: "Répondue",
      "reservation-review": "Réservation à vérifier",
      closed: "Clôturée",
    },
    contactLabels: { email: "E-mail", kakao: "KakaoTalk", phone: "Téléphone" },
    activities: {
      created: "Demande reçue",
      opened: "Demande ouverte",
      "status-changed": "Statut modifié",
      "landlord-replied": "Réponse du propriétaire",
      "customer-replied": "Réponse du client",
      "tenant-message": "DM envoyé par le locataire",
      "landlord-message": "Réponse au DM par le propriétaire",
      "maplehouse-request-created": "Demande MapleHouse reçue",
      "auto-closed": "Clôturée automatiquement après 7 jours",
      "memo-updated": "Note interne modifiée",
    },
  },
} satisfies Record<Locale, Record<string, unknown>>;

function useInquiryRecords() {
  const [records, setRecords] = useState<InquiryRecord[]>([]);

  useEffect(() => {
    setRecords(getInquiries());
    return subscribeToInquiryChanges(setRecords);
  }, []);

  return records;
}

export function SharedTenantInquiryListPage({ locale }: { locale: Locale }) {
  const copy = INQUIRY_UI[locale];
  const inquiries = useInquiryRecords();

  return (
    <main className="min-h-screen bg-[#F7F7F8] py-10 sm:py-14">
      <Container className="space-y-6">
        <InquiryHero title={copy.myTitle as string} subtitle={copy.mySubtitle as string} />
        {inquiries.length === 0 ? (
          <InquiryEmpty
            title={copy.emptyTitle as string}
            body={copy.emptyBody as string}
            action={copy.browse as string}
            href={`/${locale}/listings`}
          />
        ) : (
          <section className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
            <div className="divide-y divide-border">
              {inquiries.map((inquiry) => {
                const meta = getInquiryDisplayMeta(inquiry, locale);
                const isDirectDm = getConversationMode(inquiry) === "direct-landlord-dm";
                const rowClassName =
                  "grid gap-3 px-4 py-4 transition hover:bg-[#FFF8F1]/55 md:grid-cols-[minmax(0,1.3fr)_150px_140px_minmax(0,1fr)] md:items-center";
                const rowContent = (
                  <>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {inquiry.customerUnread ? <UnreadDot label={copy.unread as string} /> : null}
                        <p className="truncate text-sm font-semibold text-foreground">
                          {meta.listingTitle}
                        </p>
                      </div>
                      {meta.roomTitle ? (
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {meta.roomTitle}
                        </p>
                      ) : null}
                      <p className="mt-2 text-xs font-semibold text-primary">
                        {modeLabel(locale, inquiry)}
                      </p>
                    </div>
                    <StatusPill status={inquiry.status} label={statusLabel(locale, inquiry.status)} />
                    <p className="text-sm text-muted-foreground">
                      {formatInquiryDate(locale, inquiry.createdAt)}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {latestMessage(inquiry)}
                    </p>
                  </>
                );

                return isDirectDm ? (
                  <a
                    key={inquiry.id}
                    href={getListingDmHref(locale, inquiry.listingId, inquiry.roomId)}
                    className={rowClassName}
                  >
                    {rowContent}
                  </a>
                ) : (
                  <Link
                    key={inquiry.id}
                    to={
                      locale === "ko"
                        ? "/ko/my/inquiries/$inquiryId"
                        : locale === "en"
                          ? "/en/my/inquiries/$inquiryId"
                          : "/fr/my/inquiries/$inquiryId"
                    }
                    params={{ inquiryId: inquiry.id }}
                    className={rowClassName}
                  >
                    {rowContent}
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}

export function SharedTenantInquiryDetailPage({
  locale,
  inquiryId,
}: {
  locale: Locale;
  inquiryId: string;
}) {
  const copy = INQUIRY_UI[locale];
  const records = useInquiryRecords();
  const inquiry = records.find((record) => record.id === inquiryId) ?? getInquiryById(inquiryId);
  const [message, setMessage] = useState("");
  const [messageSaved, setMessageSaved] = useState(false);

  useEffect(() => {
    if (inquiryId) markInquiryReadByCustomer(inquiryId);
  }, [inquiryId]);

  if (!inquiry) {
    return (
      <main className="min-h-screen bg-[#F7F7F8] py-10 sm:py-14">
        <Container>
          <InquiryEmpty
            title={copy.emptyTitle as string}
            body={copy.emptyBody as string}
            action={copy.browse as string}
            href={`/${locale}/listings`}
          />
        </Container>
      </main>
    );
  }

  const sendTenantMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    addCustomerReply(inquiry.id, trimmed);
    setMessage("");
    setMessageSaved(true);
  };

  return (
    <main className="min-h-screen bg-[#F7F7F8] py-10 sm:py-14">
      <Container className="space-y-6">
        <InquiryHero title={copy.detail as string} subtitle={copy.mySubtitle as string} />
        <InquirySummary inquiry={inquiry} locale={locale} customerView />
        <section className="rounded-3xl border border-border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">
            {locale === "ko"
              ? "집주인과의 대화"
              : locale === "fr"
                ? "Conversation avec le propriétaire"
                : "Conversation with the landlord"}
          </h2>
          <MessageThread inquiry={inquiry} locale={locale} perspective="tenant" />
          <div className="mt-5 border-t border-border pt-4">
            <textarea
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setMessageSaved(false);
              }}
              placeholder={
                locale === "ko"
                  ? "메시지를 입력해 주세요."
                  : locale === "fr"
                    ? "Saisissez un message."
                    : "Enter a message."
              }
              className="min-h-24 w-full rounded-2xl border border-border bg-white p-3 text-sm leading-6 outline-none transition focus:border-primary/45"
            />
            {messageSaved ? (
              <p className="mt-2 text-xs font-semibold text-primary">
                {locale === "ko" ? "메시지를 보냈습니다." : locale === "fr" ? "Message envoyé." : "Message sent."}
              </p>
            ) : null}
            <button type="button" onClick={sendTenantMessage} className="mh-primary-soft-button mt-3">
              {locale === "ko" ? "보내기" : locale === "fr" ? "Envoyer" : "Send"}
            </button>
          </div>
        </section>
        <div className="flex flex-wrap gap-3">
          <a href={`/${locale}/my/inquiries`} className="mh-soft-button">
            {copy.back as string}
          </a>
          <a href={`/${locale}/listings/${inquiry.listingId}`} className="mh-soft-button">
            {copy.listing as string}
          </a>
        </div>
      </Container>
    </main>
  );
}

export function SharedLandlordInquiriesPage({ locale }: { locale: Locale }) {
  const copy = INQUIRY_UI[locale];
  const records = useInquiryRecords();
  const [query, setQuery] = useState("");

  const listingRows = useMemo(
    () => buildLandlordListingRows(locale, records),
    [locale, records],
  );
  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return listingRows.filter((row) => {
      if (!lower) return true;
      return [
        row.title,
        row.location,
        row.latestThread?.customerName ?? "",
        latestMessage(row.latestThread),
      ]
        .join(" ")
        .toLowerCase()
        .includes(lower);
    });
  }, [listingRows, query]);

  const pendingListingCount = listingRows.filter((row) => row.pendingCount > 0).length;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 rounded-3xl border border-border bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{copy.inboxTitle as string}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{copy.inboxSubtitle as string}</p>
        </div>
        <span className="w-fit rounded-full border border-primary/20 bg-[#FFF8F1] px-3 py-1 text-xs font-semibold text-primary">
          {copy.newCount as string}: {pendingListingCount}
        </span>
      </div>

      <div className="rounded-3xl border border-border bg-white p-4 shadow-sm">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.search as string}
            className="h-11 w-full rounded-2xl border border-border bg-white pl-9 pr-3 text-sm outline-none transition focus:border-primary/45"
          />
        </label>
      </div>

      {listingRows.length === 0 ? (
        <InquiryEmpty
          title={copy.noInboxTitle as string}
          body={copy.noInboxBody as string}
        />
      ) : filtered.length === 0 ? (
        <InquiryEmpty title={copy.noMatch as string} body="" />
      ) : (
        <section className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
          <div className="hidden grid-cols-[112px_minmax(0,1fr)_170px_150px] gap-4 border-b border-border bg-muted/30 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
            <span>{locale === "ko" ? "썸네일" : locale === "fr" ? "Miniature" : "Thumbnail"}</span>
            <span>{locale === "ko" ? "매물명" : locale === "fr" ? "Logement" : "Listing"}</span>
            <span>{locale === "ko" ? "리스팅 날짜" : locale === "fr" ? "Date de publication" : "Listed date"}</span>
            <span>{copy.status as string}</span>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((row) => (
              <Link
                key={row.listing.id}
                to={getListingInquiryRoute(locale)}
                params={{ listingId: row.listing.id }}
                className="grid gap-4 px-4 py-4 transition hover:bg-[#FFF8F1]/55 md:grid-cols-[112px_minmax(0,1fr)_170px_150px] md:items-center"
              >
                <ListingImageFrame
                  src={row.image}
                  alt={row.title}
                  className="h-20 w-28 rounded-2xl md:h-[76px] md:w-28"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{row.title}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{row.location}</p>
                  {row.latestThread ? (
                    <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
                      {row.latestThread.customerName}: {latestMessage(row.latestThread)}
                    </p>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">{row.listedDate}</p>
                <div className="flex items-center gap-2">
                  <ListingStatusPill status={row.statusKind} label={row.statusLabel} />
                  {row.pendingCount > 0 ? <UnreadDot label={String(row.pendingCount)} /> : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}

export function SharedLandlordListingInquiryPage({
  locale,
  listingId,
  selectedInquiryId,
}: {
  locale: Locale;
  listingId: string;
  selectedInquiryId?: string;
}) {
  const copy = INQUIRY_UI[locale];
  const records = useInquiryRecords();
  const listing = MOCK_LISTINGS.find((item) => item.id === listingId);
  const threads = useMemo(
    () =>
      records
        .filter((record) => record.listingId === listingId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [listingId, records],
  );
  const [activeId, setActiveId] = useState(selectedInquiryId ?? "");

  useEffect(() => {
    if (selectedInquiryId) {
      setActiveId(selectedInquiryId);
      return;
    }
    if (!activeId || !threads.some((thread) => thread.id === activeId)) {
      setActiveId(threads[0]?.id ?? "");
    }
  }, [activeId, selectedInquiryId, threads]);

  const activeInquiry = threads.find((thread) => thread.id === activeId) ?? null;

  useEffect(() => {
    if (activeInquiry) markInquiryReadByLandlord(activeInquiry.id);
  }, [activeInquiry?.id]);

  if (!listing) {
    return (
      <main className="min-h-screen bg-[#F7F7F8] py-10 sm:py-14">
        <Container className="space-y-5">
          <a href={`/${locale}/landlords/center/inquiries`} className="mh-soft-button w-fit">
            {locale === "ko" ? "문의 관리로 돌아가기" : locale === "fr" ? "Retour aux demandes" : "Back to inquiries"}
          </a>
          <InquiryEmpty
            title={locale === "ko" ? "매물을 찾을 수 없습니다." : locale === "fr" ? "Logement introuvable." : "Listing not found."}
            body=""
          />
        </Container>
      </main>
    );
  }

  const summary = buildLandlordListingRow(locale, listing, records);

  return (
    <main className="min-h-screen bg-[#F7F7F8] py-10 sm:py-14">
      <Container className="space-y-6">
        <a href={`/${locale}/landlords/center/inquiries`} className="mh-soft-button w-fit">
          {locale === "ko" ? "문의 관리로 돌아가기" : locale === "fr" ? "Retour aux demandes" : "Back to inquiries"}
        </a>
        <section className="rounded-3xl border border-border bg-white p-5 shadow-sm">
          <div className="grid gap-5 md:grid-cols-[260px_minmax(0,1fr)] md:items-center">
            <ListingImageFrame
              src={summary.image}
              alt={summary.title}
              className="h-[170px] rounded-2xl"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <ListingStatusPill status={summary.statusKind} label={summary.statusLabel} />
                {summary.pendingCount > 0 ? <UnreadDot label={`${summary.pendingCount}`} /> : null}
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                {summary.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{summary.location}</p>
              <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                <InfoRow label={locale === "ko" ? "리스팅 날짜" : locale === "fr" ? "Date de publication" : "Listed date"} value={summary.listedDate} />
                <InfoRow label={locale === "ko" ? "스레드" : locale === "fr" ? "Fils" : "Threads"} value={String(threads.length)} />
                <InfoRow label={locale === "ko" ? "대기 중" : locale === "fr" ? "En attente" : "Pending"} value={String(summary.pendingCount)} />
                <InfoRow label={copy.updated as string} value={summary.latestThread ? formatInquiryDate(locale, summary.latestThread.updatedAt) : "-"} />
              </dl>
            </div>
          </div>
        </section>

        {threads.length === 0 ? (
          <InquiryEmpty
            title={
              locale === "ko"
                ? "아직 이 매물에 접수된 문의가 없습니다."
                : locale === "fr"
                  ? "Aucune demande n’a encore été reçue pour ce logement."
                  : "No inquiries have been received for this listing yet."
            }
            body=""
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-[330px_minmax(0,1fr)]">
            <section className="rounded-3xl border border-border bg-white p-3 shadow-sm">
              <h2 className="px-2 py-2 text-sm font-semibold text-foreground">
                {locale === "ko" ? "문의/DM 스레드" : locale === "fr" ? "Fils demande/DM" : "Inquiry/DM threads"}
              </h2>
              <div className="mt-2 space-y-2">
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => setActiveId(thread.id)}
                    className={cn(
                      "w-full rounded-2xl border p-3 text-left transition",
                      activeId === thread.id
                        ? "border-primary/35 bg-[#FFF8F1]"
                        : "border-border bg-white hover:border-primary/25 hover:bg-[#FFF8F1]/45",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {displayThreadCustomerName(locale, thread)}
                        </p>
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{latestMessage(thread)}</p>
                      </div>
                      {thread.landlordUnread ? <UnreadDot label={unreadThreadLabel(locale)} /> : null}
                    </div>
                    <p className="mt-2 text-[11px] font-semibold text-primary">
                      {modeLabel(locale, thread)}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <StatusPill status={thread.status} label={statusLabel(locale, thread.status)} />
                      <span className="text-[11px] text-muted-foreground">{formatInquiryDate(locale, thread.updatedAt)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {activeInquiry ? (
              <LandlordInquiryThreadPanel inquiry={activeInquiry} locale={locale} />
            ) : null}
          </div>
        )}
      </Container>
    </main>
  );
}

export function SharedLandlordInquiryDetailPage({
  locale,
  inquiryId,
}: {
  locale: Locale;
  inquiryId: string;
}) {
  const records = useInquiryRecords();
  const inquiry = records.find((record) => record.id === inquiryId) ?? getInquiryById(inquiryId);
  const notFoundTitle =
    locale === "ko"
      ? "문의 내역을 찾을 수 없습니다."
      : locale === "fr"
        ? "Cette demande est introuvable."
        : "This inquiry could not be found.";
  const backToInbox =
    locale === "ko"
      ? "문의 관리로 돌아가기"
      : locale === "fr"
        ? "Retour aux demandes"
        : "Back to inquiries";

  useEffect(() => {
    if (inquiry) markInquiryReadByLandlord(inquiry.id);
  }, [inquiry?.id]);

  return (
    <main className="min-h-screen bg-[#F7F7F8] py-10 sm:py-14">
      <Container className="space-y-6">
        <a href={`/${locale}/landlords/center/inquiries`} className="mh-soft-button w-fit">
          {backToInbox}
        </a>
        <InquiryHero
          title={inquiry ? `${INQUIRY_UI[locale].detail as string} · ${inquiry.id}` : INQUIRY_UI[locale].detail as string}
          subtitle={INQUIRY_UI[locale].inboxSubtitle as string}
        />
        {!inquiry ? (
          <InquiryEmpty
            title={notFoundTitle}
            body=""
            action={backToInbox}
            href={`/${locale}/landlords/center/inquiries`}
          />
        ) : (
          <LandlordInquiryDetail inquiry={inquiry} locale={locale} />
        )}
      </Container>
    </main>
  );
}

function LandlordInquiryDetail({
  inquiry,
  locale,
}: {
  inquiry: InquiryRecord;
  locale: Locale;
}) {
  const copy = INQUIRY_UI[locale];
  const [reply, setReply] = useState("");
  const [replyError, setReplyError] = useState("");
  const [replySaved, setReplySaved] = useState(false);
  const [memo, setMemo] = useState(inquiry.internalMemo);
  const [memoSaved, setMemoSaved] = useState(false);

  useEffect(() => setMemo(inquiry.internalMemo), [inquiry.id, inquiry.internalMemo]);

  const submitReply = () => {
    const trimmed = reply.trim();
    if (!trimmed) {
      setReplyError(copy.replyRequired as string);
      return;
    }
    addLandlordReply(inquiry.id, trimmed);
    setReply("");
    setReplyError("");
    setReplySaved(true);
  };

  const saveMemo = () => {
    updateInquiryInternalMemo(inquiry.id, memo);
    setMemoSaved(true);
  };

  return (
    <div className="space-y-5">
      <InquirySummary inquiry={inquiry} locale={locale} />

      <section className="rounded-3xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">{copy.status as string}</h2>
        <div className="mt-3">
          <StatusPill status={inquiry.status} label={statusLabel(locale, inquiry.status)} />
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">{copy.conversation as string}</h2>
        <MessageThread inquiry={inquiry} locale={locale} perspective="landlord" />
      </section>

      <section className="rounded-3xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">{copy.replyTitle as string}</h2>
        <textarea
          value={reply}
          onChange={(event) => {
            setReply(event.target.value);
            setReplySaved(false);
          }}
          placeholder={copy.replyPlaceholder as string}
          className="mt-3 min-h-28 w-full rounded-2xl border border-border bg-white p-3 text-sm leading-6 outline-none transition focus:border-primary/45"
        />
        {replyError ? <p className="mt-2 text-xs font-semibold text-red-600">{replyError}</p> : null}
        {replySaved ? <p className="mt-2 text-xs font-semibold text-primary">{copy.replySaved as string}</p> : null}
        <button type="button" onClick={submitReply} className="mh-primary-soft-button mt-3">
          {copy.sendReply as string}
        </button>
      </section>

      <section className="rounded-3xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">{copy.internalNote as string}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{copy.internalNoteHelp as string}</p>
        <textarea
          value={memo}
          onChange={(event) => {
            setMemo(event.target.value);
            setMemoSaved(false);
          }}
          className="mt-3 min-h-24 w-full rounded-2xl border border-border bg-white p-3 text-sm leading-6 outline-none transition focus:border-primary/45"
        />
        {memoSaved ? <p className="mt-2 text-xs font-semibold text-primary">{copy.noteSaved as string}</p> : null}
        <button type="button" onClick={saveMemo} className="mh-soft-button mt-3">
          {copy.saveNote as string}
        </button>
      </section>

      <section className="rounded-3xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">{copy.activity as string}</h2>
        <ol className="mt-3 space-y-3">
          {[...inquiry.activities].reverse().map((activity) => (
            <li key={activity.id} className="border-l border-border pl-3 text-sm">
              <p className="font-medium text-foreground">
                {(copy.activities as Record<string, string>)[activity.type] ?? activity.type}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatInquiryDate(locale, activity.createdAt)}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function LandlordInquiryThreadPanel({
  inquiry,
  locale,
}: {
  inquiry: InquiryRecord;
  locale: Locale;
}) {
  const copy = INQUIRY_UI[locale];
  const [reply, setReply] = useState("");
  const [replyError, setReplyError] = useState("");
  const [replySaved, setReplySaved] = useState(false);
  const [memo, setMemo] = useState(inquiry.internalMemo);
  const [memoSaved, setMemoSaved] = useState(false);

  useEffect(() => {
    setMemo(inquiry.internalMemo);
    setReply("");
    setReplyError("");
    setReplySaved(false);
    setMemoSaved(false);
  }, [inquiry.id, inquiry.internalMemo]);

  const submitReply = () => {
    const trimmed = reply.trim();
    if (!trimmed) {
      setReplyError(copy.replyRequired as string);
      return;
    }
    addLandlordReply(inquiry.id, trimmed);
    setReply("");
    setReplyError("");
    setReplySaved(true);
  };

  const saveMemo = () => {
    updateInquiryInternalMemo(inquiry.id, memo);
    setMemoSaved(true);
  };

  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{copy.conversation as string}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{displayThreadCustomerName(locale, inquiry)}</p>
        </div>
        <StatusPill status={inquiry.status} label={statusLabel(locale, inquiry.status)} />
      </div>
      <MessageThread inquiry={inquiry} locale={locale} perspective="landlord" />

      <div className="mt-5 border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-foreground">{copy.replyTitle as string}</h3>
        <textarea
          value={reply}
          onChange={(event) => {
            setReply(event.target.value);
            setReplySaved(false);
          }}
          placeholder={copy.replyPlaceholder as string}
          className="mt-3 min-h-24 w-full rounded-2xl border border-border bg-white p-3 text-sm leading-6 outline-none transition focus:border-primary/45"
        />
        {replyError ? <p className="mt-2 text-xs font-semibold text-red-600">{replyError}</p> : null}
        {replySaved ? <p className="mt-2 text-xs font-semibold text-primary">{copy.replySaved as string}</p> : null}
        <button type="button" onClick={submitReply} className="mh-primary-soft-button mt-3">
          {copy.sendReply as string}
        </button>
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-foreground">{copy.internalNote as string}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{copy.internalNoteHelp as string}</p>
        <textarea
          value={memo}
          onChange={(event) => {
            setMemo(event.target.value);
            setMemoSaved(false);
          }}
          className="mt-3 min-h-20 w-full rounded-2xl border border-border bg-white p-3 text-sm leading-6 outline-none transition focus:border-primary/45"
        />
        {memoSaved ? <p className="mt-2 text-xs font-semibold text-primary">{copy.noteSaved as string}</p> : null}
        <button type="button" onClick={saveMemo} className="mh-soft-button mt-3">
          {copy.saveNote as string}
        </button>
      </div>
    </section>
  );
}

function InquiryHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{subtitle}</p>
    </section>
  );
}

function InquiryEmpty({
  title,
  body,
  action,
  href,
}: {
  title: string;
  body: string;
  action?: string;
  href?: string;
}) {
  return (
    <section className="rounded-3xl border border-border bg-white p-8 text-center shadow-sm">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      {body ? <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted-foreground">{body}</p> : null}
      {action && href ? (
        <a href={href} className="mh-primary-soft-button mt-5">
          {action}
        </a>
      ) : null}
    </section>
  );
}

function InquirySummary({
  inquiry,
  locale,
  customerView = false,
}: {
  inquiry: InquiryRecord;
  locale: Locale;
  customerView?: boolean;
}) {
  const copy = INQUIRY_UI[locale];
  const contactLabel = (copy.contactLabels as Record<string, string>)[inquiry.contactMethod];
  const meta = getInquiryDisplayMeta(inquiry, locale);

  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-sm">
      <div className="grid gap-5 md:grid-cols-[260px_minmax(0,1fr)]">
        <ListingImageFrame
          src={meta.image}
          alt={meta.listingTitle}
          className="aspect-[4/3] rounded-2xl"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={inquiry.status} label={statusLabel(locale, inquiry.status)} />
            {customerView && inquiry.customerUnread ? <UnreadDot label={copy.unread as string} /> : null}
          </div>
          <h2 className="mt-3 text-xl font-semibold text-foreground">
            {meta.listingTitle}
          </h2>
          {meta.roomTitle ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {copy.room as string}: {meta.roomTitle}
            </p>
          ) : null}
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <InfoRow label={copy.received as string} value={formatInquiryDate(locale, inquiry.createdAt)} />
            <InfoRow label={copy.updated as string} value={formatInquiryDate(locale, inquiry.updatedAt)} />
            <InfoRow label={copy.mode as string} value={modeLabel(locale, inquiry)} />
            <InfoRow label={copy.contact as string} value={contactDisplayValue(locale, inquiry, contactLabel)} />
            <InfoRow label={copy.status as string} value={statusLabel(locale, inquiry.status)} />
            {meta.maxGuests ? (
              <InfoRow
                label={locale === "ko" ? "수용 인원" : locale === "fr" ? "Capacité" : "Capacity"}
                value={formatMaximumOccupancy(meta.maxGuests, locale)}
              />
            ) : null}
            {inquiry.desiredMoveInDate ? <InfoRow label={copy.moveIn as string} value={inquiry.desiredMoveInDate} /> : null}
            {inquiry.expectedStay ? <InfoRow label={copy.stay as string} value={inquiry.expectedStay} /> : null}
          </dl>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0 border-b border-border/70 pb-2">
      <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words font-medium text-foreground">{value}</dd>
    </div>
  );
}

type MessagePerspective = "tenant" | "landlord";

function MessageThread({
  inquiry,
  locale,
  perspective = "tenant",
}: {
  inquiry: InquiryRecord;
  locale: Locale;
  perspective?: MessagePerspective;
}) {
  return (
    <div className="mt-4 space-y-4">
      {inquiry.messages.map((message) => {
        const system = message.author === "maplehouse";
        const outgoing =
          perspective === "tenant"
            ? message.author === "customer"
            : message.author === "landlord";
        const label = getMessageAuthorLabel(locale, inquiry, message.author, perspective);

        if (system) {
          return (
            <article key={message.id} className="flex justify-center">
              <div className="max-w-[78%] rounded-full bg-muted px-4 py-2 text-center text-xs font-semibold text-muted-foreground">
                {message.body}
              </div>
            </article>
          );
        }

        return (
          <article
            key={message.id}
            className={cn(
              "flex items-end gap-2",
              outgoing ? "justify-end" : "justify-start",
            )}
          >
            {!outgoing ? (
              <ThreadAvatar label={getMessageAvatarLabel(locale, message.author, perspective)} tone="incoming" />
            ) : null}
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
            {outgoing ? (
              <ThreadAvatar label={getMessageAvatarLabel(locale, message.author, perspective)} tone="outgoing" />
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function getMessageAuthorLabel(
  locale: Locale,
  inquiry: InquiryRecord,
  author: InquiryRecord["messages"][number]["author"],
  perspective: MessagePerspective,
) {
  if (author === "maplehouse") return "MapleHouse";
  if (perspective === "tenant") {
    if (author === "customer") return locale === "fr" ? "Moi" : locale === "ko" ? "나" : "Me";
    return locale === "fr" ? "Propriétaire" : locale === "ko" ? "집주인" : "Landlord";
  }
  if (author === "landlord") return locale === "fr" ? "Moi" : locale === "ko" ? "나" : "Me";
  return displayThreadCustomerName(locale, inquiry);
}

function getMessageAvatarLabel(
  locale: Locale,
  author: InquiryRecord["messages"][number]["author"],
  perspective: MessagePerspective,
) {
  if (author === "maplehouse") return "M";
  if (perspective === "tenant") {
    if (author === "customer") return locale === "fr" ? "Moi" : locale === "ko" ? "나" : "Me";
    return locale === "ko" ? "집" : "L";
  }
  if (author === "landlord") return locale === "fr" ? "Moi" : locale === "ko" ? "나" : "Me";
  return locale === "fr" ? "Loc" : locale === "ko" ? "입" : "T";
}

function ThreadAvatar({ label, tone }: { label: string; tone: "incoming" | "outgoing" }) {
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

function StatusPill({ status, label }: { status: InquiryStatus; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        status === "new" && "border-orange-200 bg-orange-50 text-orange-800",
        status === "reviewing" && "border-sky-200 bg-sky-50 text-sky-800",
        status === "answered" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        status === "reservation-review" && "border-violet-200 bg-violet-50 text-violet-800",
        status === "closed" && "border-border bg-muted text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}

function UnreadDot({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF8F1] px-2 py-1 text-xs font-semibold text-primary">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
      {label}
    </span>
  );
}

function unreadThreadLabel(locale: Locale) {
  if (locale === "ko") return "새 메시지";
  if (locale === "fr") return "Nouveau";
  return "New";
}

function displayThreadCustomerName(locale: Locale, inquiry: InquiryRecord) {
  const fallback = locale === "fr" ? "Locataire" : locale === "ko" ? "입주자" : "Tenant";
  const name = inquiry.customerName.trim();
  const localMeNames = new Set(["나", "Me", "Moi"]);
  if (
    getConversationMode(inquiry) === "direct-landlord-dm" &&
    (inquiry.contactValue.startsWith("guest-") || localMeNames.has(name))
  ) {
    return fallback;
  }
  return name || fallback;
}

function getInquiryDisplayMeta(inquiry: InquiryRecord, locale: Locale) {
  return resolveLocalizedListingMeta({
    listingId: inquiry.listingId,
    roomId: inquiry.roomId,
    locale,
    fallbackListingTitle:
      inquiry.listingTitleSnapshots?.[locale] ?? inquiry.listingTitleSnapshot,
    fallbackRoomTitle:
      inquiry.roomTitleSnapshots?.[locale] ?? inquiry.roomTitleSnapshot,
    fallbackImage: inquiry.listingImageSnapshot,
  });
}

type ListingRowStatusKind = "none" | "new" | "pending" | "answered" | "closed";

type LandlordListingRow = {
  listing: MockListing;
  title: string;
  location: string;
  image: string;
  listedDate: string;
  threads: InquiryRecord[];
  pendingCount: number;
  latestThread?: InquiryRecord;
  statusKind: ListingRowStatusKind;
  statusLabel: string;
};

function buildLandlordListingRows(locale: Locale, records: InquiryRecord[]) {
  return MOCK_LISTINGS.map((listing) => buildLandlordListingRow(locale, listing, records));
}

function buildLandlordListingRow(
  locale: Locale,
  listing: MockListing,
  records: InquiryRecord[],
): LandlordListingRow {
  const threads = records
    .filter((record) => record.listingId === listing.id)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const pendingThreads = threads.filter(isPendingInquiry);
  const activeThreads = threads.filter((thread) => thread.status !== "closed");
  const latestThread = threads[0];
  const answeredThreads = activeThreads.filter((thread) => thread.status === "answered");
  const statusKind: ListingRowStatusKind =
    pendingThreads.length > 0
      ? pendingThreads.some((thread) => thread.status === "new" || thread.landlordUnread)
        ? "new"
        : "pending"
      : answeredThreads.length > 0
        ? "answered"
        : threads.length > 0
          ? "closed"
          : "none";

  return {
    listing,
    title: listing.title[locale],
    location: listing.mapLocation.label || listing.area,
    image: listing.imagePath,
    listedDate: formatListingDate(locale, listing.registered),
    threads,
    pendingCount: pendingThreads.length,
    latestThread,
    statusKind,
    statusLabel: listingRowStatusLabel(locale, statusKind),
  };
}

function isPendingInquiry(inquiry: InquiryRecord) {
  return inquiry.landlordUnread || inquiry.status === "new" || inquiry.status === "reviewing";
}

export function getPendingInquiryListingCount() {
  return new Set(getInquiries().filter(isPendingInquiry).map((inquiry) => inquiry.listingId)).size;
}

function listingRowStatusLabel(locale: Locale, status: ListingRowStatusKind) {
  const labels: Record<Locale, Record<ListingRowStatusKind, string>> = {
    ko: {
      none: "문의 없음",
      new: "신규 문의",
      pending: "문의 대기",
      answered: "답변 완료",
      closed: "종료",
    },
    en: {
      none: "No inquiries",
      new: "New inquiry",
      pending: "Pending",
      answered: "Answered",
      closed: "Closed",
    },
    fr: {
      none: "Aucune demande",
      new: "Nouvelle demande",
      pending: "En attente",
      answered: "Répondue",
      closed: "Clôturée",
    },
  };
  return labels[locale][status];
}

function ListingStatusPill({
  status,
  label,
}: {
  status: ListingRowStatusKind;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        (status === "new" || status === "pending") && "border-orange-200 bg-orange-50 text-orange-800",
        status === "answered" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        (status === "closed" || status === "none") && "border-border bg-muted text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}

function formatListingDate(locale: Locale, value?: string) {
  if (!value) {
    return locale === "ko"
      ? "등록일 확인 필요"
      : locale === "fr"
        ? "Date de publication indisponible"
        : "Listed date unavailable";
  }
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" }).format(date);
}

function getListingInquiryRoute(locale: Locale) {
  if (locale === "ko") return "/ko/landlords/center/inquiries/listing/$listingId";
  if (locale === "en") return "/en/landlords/center/inquiries/listing/$listingId";
  return "/fr/landlords/center/inquiries/listing/$listingId";
}

function latestMessage(inquiry?: InquiryRecord) {
  if (!inquiry) return "";
  return inquiry.messages[inquiry.messages.length - 1]?.body ?? "";
}

function modeLabel(locale: Locale, inquiry: InquiryRecord) {
  const labels = INQUIRY_UI[locale].modeLabels as Record<ReturnType<typeof getConversationMode>, string>;
  return labels[getConversationMode(inquiry)];
}

function contactDisplayValue(locale: Locale, inquiry: InquiryRecord, contactLabel: string) {
  if (getConversationMode(inquiry) === "direct-landlord-dm" && inquiry.contactValue.startsWith("guest-")) {
    return locale === "ko"
      ? "DM 대화"
      : locale === "fr"
        ? "Conversation DM"
        : "DM conversation";
  }
  return `${contactLabel} - ${inquiry.contactValue}`;
}

function statusLabel(locale: Locale, status: InquiryStatus) {
  return (INQUIRY_UI[locale].statusLabels as Record<InquiryStatus, string>)[status];
}
