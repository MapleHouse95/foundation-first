import type { Locale } from "@/lib/i18n";

export const SELECTED_INQUIRY_STORAGE_KEY = "maplehouse_selected_inquiry";
export const MOCK_INQUIRY_DRAFT_STORAGE_KEY = "maplehouse_mock_inquiry_draft";

export type SelectedInquirySource = "listing_detail" | "listings_drawer";

export type SelectedInquiryPayload = {
  locale: Locale;
  mode: "assisted";
  listingId: string;
  listingTitle: string;
  city: string;
  area: string;
  rentCad: number;
  rentKrw: number;
  housingType: string;
  roomName: string;
  roomType: string;
  selectedMoveInDate: string;
  selectedGuestCount: number;
  thumbnailUrl: string;
  galleryUrls: string[];
  source: SelectedInquirySource;
  createdAt: string;
};

export type BuildSelectedInquiryPayloadInput = Omit<
  SelectedInquiryPayload,
  "mode" | "createdAt"
>;

export type MockInquiryDraftPayload = {
  selectedInquiry: SelectedInquiryPayload;
  form: {
    name: string;
    email: string;
    phone: string;
    preferredMoveInDate: string;
    stayLength: string;
    people: string;
    questions: string;
    request: string;
  };
  createdAt: string;
};

export function buildSelectedInquiryPayload(
  input: BuildSelectedInquiryPayloadInput,
): SelectedInquiryPayload {
  return {
    ...input,
    mode: "assisted",
    galleryUrls: input.galleryUrls.length > 0 ? input.galleryUrls : [input.thumbnailUrl].filter(Boolean),
    createdAt: new Date().toISOString(),
  };
}

export function saveSelectedInquiryPayload(payload: SelectedInquiryPayload) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(SELECTED_INQUIRY_STORAGE_KEY, JSON.stringify(payload));
}

export function readSelectedInquiryPayload({
  locale,
  listingId,
}: {
  locale?: Locale;
  listingId?: string | null;
} = {}) {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(SELECTED_INQUIRY_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<SelectedInquiryPayload>) : null;
    if (
      !parsed ||
      parsed.mode !== "assisted" ||
      parsed.source === undefined ||
      typeof parsed.listingId !== "string"
    ) {
      return null;
    }
    if (locale && parsed.locale !== locale) return null;
    if (listingId && parsed.listingId !== listingId) return null;
    return {
      ...(parsed as SelectedInquiryPayload),
      thumbnailUrl: typeof parsed.thumbnailUrl === "string" ? parsed.thumbnailUrl : "",
      galleryUrls: Array.isArray(parsed.galleryUrls) ? parsed.galleryUrls : [],
    };
  } catch {
    return null;
  }
}
