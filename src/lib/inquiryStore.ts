import type { Locale } from "@/lib/i18n";

export const INQUIRY_STORAGE_KEY = "maplehouse:inquiries:v1";
const INQUIRY_EVENT_NAME = "maplehouse:inquiries:changed";

export type InquiryStatus =
  | "new"
  | "reviewing"
  | "answered"
  | "reservation-review"
  | "closed";

export type InquiryContactMethod = "email" | "kakao" | "phone";
export type ConversationMode = "direct-landlord-dm" | "maplehouse-assisted";
export type InquiryMethod = "direct" | "assisted" | ConversationMode;
export type InquiryAuthor = "customer" | "landlord" | "maplehouse";

export type InquiryMessage = {
  id: string;
  author: InquiryAuthor;
  body: string;
  createdAt: string;
};

export type InquiryActivityType =
  | "created"
  | "opened"
  | "status-changed"
  | "landlord-replied"
  | "customer-replied"
  | "tenant-message"
  | "landlord-message"
  | "maplehouse-request-created"
  | "auto-closed"
  | "memo-updated";

export type InquiryActivity = {
  id: string;
  type: InquiryActivityType;
  createdAt: string;
  description?: string;
};

export type InquiryRecord = {
  id: string;
  listingId: string;
  roomId?: string;
  listingTitleSnapshot: string;
  listingTitleSnapshots?: Partial<Record<Locale, string>>;
  roomTitleSnapshot?: string;
  roomTitleSnapshots?: Partial<Record<Locale, string>>;
  listingImageSnapshot?: string;
  customerName: string;
  inquiryMethod?: InquiryMethod;
  contactMethod: InquiryContactMethod;
  contactValue: string;
  desiredMoveInDate?: string;
  expectedStay?: string;
  status: InquiryStatus;
  messages: InquiryMessage[];
  internalMemo: string;
  landlordUnread: boolean;
  customerUnread: boolean;
  tenantUnread?: boolean;
  maplehouseUnread?: boolean;
  createdAt: string;
  updatedAt: string;
  lastTenantMessageAt?: string;
  lastLandlordMessageAt?: string;
  activities: InquiryActivity[];
};

export type CreateInquiryInput = {
  listingId: string;
  roomId?: string;
  listingTitleSnapshot: string;
  listingTitleSnapshots?: Partial<Record<Locale, string>>;
  roomTitleSnapshot?: string;
  roomTitleSnapshots?: Partial<Record<Locale, string>>;
  listingImageSnapshot?: string;
  customerName: string;
  inquiryMethod?: InquiryMethod;
  contactMethod: InquiryContactMethod;
  contactValue: string;
  desiredMoveInDate?: string;
  expectedStay?: string;
  message: string;
};

export type CreateDirectDmInput = {
  listingId: string;
  roomId?: string;
  locale: Locale;
  listingTitleSnapshot: string;
  listingTitleSnapshots?: Partial<Record<Locale, string>>;
  roomTitleSnapshot?: string;
  roomTitleSnapshots?: Partial<Record<Locale, string>>;
  listingImageSnapshot?: string;
  message: string;
};

export const GUEST_ID_STORAGE_KEY = "maplehouse:guest:id:v1";

type InquiryListener = (records: InquiryRecord[]) => void;

const listeners = new Set<InquiryListener>();

function createId(prefix: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${random}`;
}

function normalizeInquiryMethod(method?: InquiryMethod): InquiryMethod {
  if (method === "direct") return "direct-landlord-dm";
  if (method === "assisted") return "maplehouse-assisted";
  return method ?? "maplehouse-assisted";
}

function normalizeRecord(record: InquiryRecord): InquiryRecord {
  const inquiryMethod = normalizeInquiryMethod(record.inquiryMethod);
  const messages: InquiryMessage[] = record.messages.map((message) => {
    const author: InquiryAuthor =
      message.author === "landlord"
        ? "landlord"
        : message.author === "maplehouse"
          ? "maplehouse"
          : "customer";
    return { ...message, author };
  });
  const latestTenantMessageAt = [...messages]
    .reverse()
    .find((message) => message.author === "customer")?.createdAt;
  const latestLandlordMessageAt = [...messages]
    .reverse()
    .find((message) => message.author === "landlord")?.createdAt;

  return {
    ...record,
    inquiryMethod,
    messages,
    internalMemo: typeof record.internalMemo === "string" ? record.internalMemo : "",
    landlordUnread: Boolean(record.landlordUnread),
    customerUnread: Boolean(record.customerUnread ?? record.tenantUnread),
    tenantUnread: Boolean(record.tenantUnread ?? record.customerUnread),
    activities: Array.isArray(record.activities) ? record.activities : [],
    lastTenantMessageAt: record.lastTenantMessageAt ?? latestTenantMessageAt,
    lastLandlordMessageAt: record.lastLandlordMessageAt ?? latestLandlordMessageAt,
  };
}

function isRecord(value: unknown): value is InquiryRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<InquiryRecord>;
  return (
    typeof record.id === "string" &&
    typeof record.listingId === "string" &&
    typeof record.listingTitleSnapshot === "string" &&
    typeof record.customerName === "string" &&
    typeof record.contactValue === "string" &&
    Array.isArray(record.messages) &&
    typeof record.createdAt === "string" &&
    typeof record.updatedAt === "string"
  );
}

function readRawRecords() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(INQUIRY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecord).map(normalizeRecord);
  } catch {
    return [];
  }
}

function writeRecords(records: InquiryRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify(records));
  window.dispatchEvent(new CustomEvent(INQUIRY_EVENT_NAME));
  listeners.forEach((listener) => listener(records));
}

function sortNewestFirst(records: InquiryRecord[]) {
  return records.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function getLatestLandlordReplyAt(inquiry: InquiryRecord) {
  return [...inquiry.messages]
    .reverse()
    .find((message) => message.author === "landlord")?.createdAt;
}

export function getLatestCustomerMessageAt(inquiry: InquiryRecord) {
  return [...inquiry.messages]
    .reverse()
    .find((message) => message.author === "customer")?.createdAt;
}

export function shouldAutoCloseInquiry(inquiry: InquiryRecord, now = new Date()) {
  if (inquiry.status !== "answered") return false;
  const latestLandlordReplyAt = getLatestLandlordReplyAt(inquiry);
  if (!latestLandlordReplyAt) return false;
  const landlordReplyTime = new Date(latestLandlordReplyAt).getTime();
  if (Number.isNaN(landlordReplyTime)) return false;
  const latestCustomerMessageAt = getLatestCustomerMessageAt(inquiry);
  const customerMessageTime = latestCustomerMessageAt
    ? new Date(latestCustomerMessageAt).getTime()
    : 0;
  if (customerMessageTime > landlordReplyTime) return false;
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return now.getTime() - landlordReplyTime >= sevenDaysMs;
}

export function applyInquiryAutomation(records: InquiryRecord[], now = new Date()) {
  let changed = false;
  const automated = records.map((record) => {
    if (!shouldAutoCloseInquiry(record, now)) return record;
    const alreadyLogged = record.activities.some((activity) => activity.type === "auto-closed");
    changed = true;
    return {
      ...record,
      status: "closed" as const,
      landlordUnread: false,
      customerUnread: false,
      tenantUnread: false,
      updatedAt: now.toISOString(),
      activities: alreadyLogged
        ? record.activities
        : [
            ...record.activities,
            {
              id: createId("act"),
              type: "auto-closed" as const,
              createdAt: now.toISOString(),
              description: "Auto closed after 7 days without customer follow-up",
            },
          ],
    };
  });
  return { records: automated, changed };
}

export function getInquiries() {
  const rawRecords = readRawRecords();
  const automated = applyInquiryAutomation(rawRecords);
  if (automated.changed) writeRecords(automated.records);
  return sortNewestFirst(automated.records);
}

export function getInquiryById(id: string) {
  return getInquiries().find((record) => record.id === id) ?? null;
}

export function getConversationMode(record: InquiryRecord): ConversationMode {
  const method = normalizeInquiryMethod(record.inquiryMethod);
  return method === "direct-landlord-dm" ? "direct-landlord-dm" : "maplehouse-assisted";
}

export function getLocalGuestId() {
  if (typeof window === "undefined") return "guest-server";
  try {
    const existing = window.localStorage.getItem(GUEST_ID_STORAGE_KEY);
    if (existing) return existing;
    const id = createId("guest");
    window.localStorage.setItem(GUEST_ID_STORAGE_KEY, id);
    return id;
  } catch {
    return "guest-local";
  }
}

export function findDirectLandlordDmThread({
  listingId,
  roomId,
}: {
  listingId: string;
  roomId?: string;
}) {
  return getInquiries().find((record) => {
    if (getConversationMode(record) !== "direct-landlord-dm") return false;
    if (record.listingId !== listingId) return false;
    if (roomId) return record.roomId === roomId;
    return !record.roomId;
  }) ?? null;
}

function defaultTenantName(locale: Locale) {
  if (locale === "ko") return "나";
  if (locale === "fr") return "Moi";
  return "Me";
}

export function createInquiry(input: CreateInquiryInput) {
  const now = new Date().toISOString();
  const record: InquiryRecord = {
    id: createId("inq"),
    listingId: input.listingId,
    roomId: input.roomId,
    listingTitleSnapshot: input.listingTitleSnapshot,
    listingTitleSnapshots: input.listingTitleSnapshots,
    roomTitleSnapshot: input.roomTitleSnapshot,
    roomTitleSnapshots: input.roomTitleSnapshots,
    listingImageSnapshot: input.listingImageSnapshot,
    customerName: input.customerName.trim(),
    inquiryMethod: normalizeInquiryMethod(input.inquiryMethod),
    contactMethod: input.contactMethod,
    contactValue: input.contactValue.trim(),
    desiredMoveInDate: input.desiredMoveInDate,
    expectedStay: input.expectedStay,
    status: "new",
    messages: [
      {
        id: createId("msg"),
        author: "customer",
        body: input.message.trim(),
        createdAt: now,
      },
    ],
    internalMemo: "",
    landlordUnread: true,
    customerUnread: false,
    tenantUnread: false,
    createdAt: now,
    updatedAt: now,
    lastTenantMessageAt: now,
    activities: [
      {
        id: createId("act"),
        type: normalizeInquiryMethod(input.inquiryMethod) === "maplehouse-assisted"
          ? "maplehouse-request-created"
          : "created",
        createdAt: now,
        description: "Inquiry received",
      },
    ],
  };
  writeRecords([record, ...readRawRecords()]);
  return record;
}

export function createDirectLandlordDmThread(input: CreateDirectDmInput) {
  const now = new Date().toISOString();
  const body = input.message.trim();
  if (!body) return null;

  const record: InquiryRecord = {
    id: createId("dm"),
    listingId: input.listingId,
    roomId: input.roomId,
    listingTitleSnapshot: input.listingTitleSnapshot,
    listingTitleSnapshots: input.listingTitleSnapshots,
    roomTitleSnapshot: input.roomTitleSnapshot,
    roomTitleSnapshots: input.roomTitleSnapshots,
    listingImageSnapshot: input.listingImageSnapshot,
    customerName: defaultTenantName(input.locale),
    inquiryMethod: "direct-landlord-dm",
    contactMethod: "email",
    contactValue: getLocalGuestId(),
    status: "new",
    messages: [
      {
        id: createId("msg"),
        author: "customer",
        body,
        createdAt: now,
      },
    ],
    internalMemo: "",
    landlordUnread: true,
    customerUnread: false,
    tenantUnread: false,
    createdAt: now,
    updatedAt: now,
    lastTenantMessageAt: now,
    activities: [
      {
        id: createId("act"),
        type: "created",
        createdAt: now,
        description: "Direct landlord DM created",
      },
      {
        id: createId("act"),
        type: "tenant-message",
        createdAt: now,
        description: "Tenant message added",
      },
    ],
  };

  writeRecords([record, ...readRawRecords()]);
  return record;
}

export function updateInquiry(
  id: string,
  updater: (record: InquiryRecord) => InquiryRecord,
) {
  let updated: InquiryRecord | null = null;
  const records = readRawRecords().map((record) => {
    if (record.id !== id) return record;
    updated = updater(record);
    return updated;
  });
  writeRecords(records);
  return updated;
}

export function changeInquiryStatus(id: string, status: InquiryStatus) {
  const now = new Date().toISOString();
  return updateInquiry(id, (record) => ({
    ...record,
    status,
    updatedAt: now,
    activities: [
      ...record.activities,
      {
        id: createId("act"),
        type: "status-changed",
        createdAt: now,
        description: status,
      },
    ],
  }));
}

export function addLandlordReply(id: string, message: string) {
  const now = new Date().toISOString();
  const body = message.trim();
  if (!body) return null;
  return updateInquiry(id, (record) => ({
    ...record,
    status: record.status === "reservation-review" ? record.status : "answered",
    messages: [
      ...record.messages,
      { id: createId("msg"), author: "landlord", body, createdAt: now },
    ],
    landlordUnread: false,
    customerUnread: true,
    tenantUnread: true,
    updatedAt: now,
    lastLandlordMessageAt: now,
    activities: [
      ...record.activities,
      {
        id: createId("act"),
        type: getConversationMode(record) === "direct-landlord-dm"
          ? "landlord-message"
          : "landlord-replied",
        createdAt: now,
        description: "Landlord reply added",
      },
    ],
  }));
}

export function addCustomerReply(id: string, message: string) {
  const now = new Date().toISOString();
  const body = message.trim();
  if (!body) return null;
  return updateInquiry(id, (record) => ({
    ...record,
    status: record.status === "reservation-review" ? record.status : "new",
    messages: [
      ...record.messages,
      { id: createId("msg"), author: "customer", body, createdAt: now },
    ],
    landlordUnread: true,
    customerUnread: false,
    tenantUnread: false,
    updatedAt: now,
    lastTenantMessageAt: now,
    activities: [
      ...record.activities,
      {
        id: createId("act"),
        type: getConversationMode(record) === "direct-landlord-dm"
          ? "tenant-message"
          : "customer-replied",
        createdAt: now,
        description: "Customer follow-up added",
      },
    ],
  }));
}

export function updateInquiryInternalMemo(id: string, memo: string) {
  const now = new Date().toISOString();
  return updateInquiry(id, (record) => ({
    ...record,
    internalMemo: memo,
    updatedAt: now,
    activities: [
      ...record.activities,
      {
        id: createId("act"),
        type: "memo-updated",
        createdAt: now,
        description: "Internal note updated",
      },
    ],
  }));
}

export function markInquiryReadByLandlord(id: string) {
  const now = new Date().toISOString();
  return updateInquiry(id, (record) =>
    record.landlordUnread
      ? {
          ...record,
          landlordUnread: false,
          updatedAt: now,
          activities: [
            ...record.activities,
            {
              id: createId("act"),
              type: "opened",
              createdAt: now,
              description: "Opened by landlord",
            },
          ],
        }
      : record,
  );
}

export function markInquiryReadByCustomer(id: string) {
  return updateInquiry(id, (record) => ({
    ...record,
    customerUnread: false,
    tenantUnread: false,
  }));
}

export function subscribeToInquiryChanges(listener: InquiryListener) {
  listeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === INQUIRY_STORAGE_KEY) listener(getInquiries());
  };
  const handleLocal = () => listener(getInquiries());
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
    window.addEventListener(INQUIRY_EVENT_NAME, handleLocal);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(INQUIRY_EVENT_NAME, handleLocal);
    }
  };
}

export function formatInquiryDate(locale: Locale, value: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}
