import type { Locale } from "@/lib/i18n";
import { getStableMockListingGalleryImages } from "@/lib/mockListingImages";
import { buildMockListingRoomOptions } from "@/lib/mockListingRooms";
import { MOCK_LISTINGS, type MockListing } from "@/components/pages/LocaleListingsPage";

export type LocalizedSnapshot = Partial<Record<Locale, string>>;

export type ResolvedListingMeta = {
  listing: MockListing | null;
  listingId: string;
  roomId?: string;
  listingTitle: string;
  roomTitle?: string;
  listingTitleSnapshots: LocalizedSnapshot;
  roomTitleSnapshots?: LocalizedSnapshot;
  image: string;
  location: string;
  maxGuests?: number;
};

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function getListingById(listingId?: string | null) {
  if (!listingId) return null;
  return MOCK_LISTINGS.find((listing) => listing.id === listingId) ?? null;
}

export function getRoomById(listingId?: string | null, roomId?: string | null) {
  const listing = getListingById(listingId);
  if (!listing || !roomId) return null;
  return buildMockListingRoomOptions(listing).find((room) => room.id === roomId) ?? null;
}

export function resolveLocalizedListingMeta({
  listingId,
  roomId,
  locale,
  fallbackListingTitle,
  fallbackRoomTitle,
  fallbackImage,
}: {
  listingId: string;
  roomId?: string;
  locale: Locale;
  fallbackListingTitle?: string;
  fallbackRoomTitle?: string;
  fallbackImage?: string;
}): ResolvedListingMeta {
  const listing = getListingById(listingId);
  const room = listing && roomId ? getRoomById(listing.id, roomId) : null;
  const gallery = listing ? getStableMockListingGalleryImages(listing.id, 5) : [];
  const listingTitleSnapshots = listing
    ? {
        ko: listing.title.ko,
        en: listing.title.en,
        fr: listing.title.fr,
      }
    : {};
  const roomTitleSnapshots = room
    ? {
        ko: room.label.ko,
        en: room.label.en,
        fr: room.label.fr,
      }
    : undefined;

  return {
    listing,
    listingId,
    roomId,
    listingTitle:
      listing?.title[locale] ??
      listingTitleSnapshots[locale] ??
      fallbackListingTitle ??
      listingId,
    roomTitle:
      room?.label[locale] ??
      roomTitleSnapshots?.[locale] ??
      fallbackRoomTitle,
    listingTitleSnapshots,
    roomTitleSnapshots,
    image: gallery[0] ?? listing?.imagePath ?? fallbackImage ?? "",
    location: listing?.mapLocation.label ?? listing?.area ?? "",
    maxGuests: listing?.maxPeople,
  };
}

export function normalizeInquiryMoveInDate(value?: string | null) {
  if (!value || !ISO_DATE_PATTERN.test(value)) return undefined;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return undefined;
  return value;
}

export function resolveInquiryMoveInDate({
  detailSelectedMoveInDate,
  listingsFilterMoveInDate,
  routeMoveInDate,
}: {
  detailSelectedMoveInDate?: string | null;
  listingsFilterMoveInDate?: string | null;
  routeMoveInDate?: string | null;
}) {
  return (
    normalizeInquiryMoveInDate(detailSelectedMoveInDate) ??
    normalizeInquiryMoveInDate(listingsFilterMoveInDate) ??
    normalizeInquiryMoveInDate(routeMoveInDate)
  );
}

export function formatMaximumOccupancy(maxGuests: number | undefined, locale: Locale, fallback = "") {
  if (!Number.isFinite(maxGuests) || !maxGuests || maxGuests < 1) return fallback;
  const count = Math.round(maxGuests);
  if (locale === "ko") return `최대 ${count}명`;
  if (locale === "fr") return `Jusqu’à ${count} personnes`;
  return `Up to ${count} ${count === 1 ? "person" : "people"}`;
}
