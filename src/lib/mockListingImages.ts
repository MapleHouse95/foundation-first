export const MOCK_LISTING_IMAGES = [
  "/mock/listing/hero-1.jpg",
  "/mock/listing/hero-2.jpg",
  "/mock/listing/hero-3.jpg",
  "/mock/listing/hero-4.jpg",
  "/mock/listing/hero-5.jpg",
  "/mock/listing/hero-6.jpg",
  "/mock/listing/hero-7.jpg",
  "/mock/listing/hero-8.jpg",
  "/mock/listing/hero-9.jpg",
  "/mock/listing/hero-10.jpg",
  "/mock/listing/hero-11.jpg",
  "/mock/listing/hero-12.jpg",
  "/mock/listing/hero-13.jpg",
  "/mock/listing/hero-14.jpg",
  "/mock/listing/hero-15.jpg",
  "/mock/listing/hero-16.jpg",
  "/mock/listing/hero-17.jpg",
  "/mock/listing/hero-18.jpg",
  "/mock/listing/hero-19.jpg",
  "/mock/listing/hero-20.jpg",
  "/mock/listing/hero-21.jpg",
  "/mock/listing/hero-22.jpg",
  "/mock/listing/hero-23.jpg",
  "/mock/listing/hero-24.jpg",
  "/mock/listing/hero-25.jpg",
  "/mock/listing/hero-26.jpg",
];

export const MAIN_HERO_EXCLUDED_IMAGES = [
  "/mock/listing/hero-4.jpg",
  "/mock/listing/hero-6.jpg",
  "/mock/listing/hero-12.jpg",
  "/mock/listing/hero-18.jpg",
  "/mock/listing/hero-19.jpg",
  "/mock/listing/hero-21.jpg",
];

export const MAIN_HERO_IMAGES = [
  "/mock/listing/hero-1.jpg",
  "/mock/listing/hero-5.jpg",
  "/mock/listing/hero-8.jpg",
  "/mock/listing/hero-9.jpg",
  "/mock/listing/hero-10.jpg",
  "/mock/listing/hero-11.jpg",
  "/mock/listing/hero-13.jpg",
  "/mock/listing/hero-16.jpg",
  "/mock/listing/hero-17.jpg",
  "/mock/listing/hero-20.jpg",
  "/mock/listing/hero-22.jpg",
  "/mock/listing/hero-24.jpg",
  "/mock/listing/hero-25.jpg",
  "/mock/listing/hero-26.jpg",
];

export const ROOM_THUMB_IMAGES = [
  "/mock/listing/hero-5.jpg",
  "/mock/listing/hero-13.jpg",
  "/mock/listing/hero-17.jpg",
  "/mock/listing/hero-20.jpg",
  "/mock/listing/hero-22.jpg",
  "/mock/listing/hero-24.jpg",
  "/mock/listing/hero-26.jpg",
  "/mock/listing/hero-1.jpg",
  "/mock/listing/hero-8.jpg",
  "/mock/listing/hero-10.jpg",
];

export const SECONDARY_GALLERY_IMAGES = MOCK_LISTING_IMAGES;

export const MOCK_LISTING_IMAGE_SETS: Record<string, string[]> = {
  "L-001": [
    "/mock/listing/hero-5.jpg",
    "/mock/listing/hero-13.jpg",
    "/mock/listing/hero-22.jpg",
    "/mock/listing/hero-8.jpg",
    "/mock/listing/hero-26.jpg",
  ],
  "L-002": [
    "/mock/listing/hero-17.jpg",
    "/mock/listing/hero-10.jpg",
    "/mock/listing/hero-11.jpg",
    "/mock/listing/hero-24.jpg",
    "/mock/listing/hero-16.jpg",
  ],
  "L-003": [
    "/mock/listing/hero-20.jpg",
    "/mock/listing/hero-1.jpg",
    "/mock/listing/hero-3.jpg",
    "/mock/listing/hero-9.jpg",
    "/mock/listing/hero-25.jpg",
  ],
  "L-004": [
    "/mock/listing/hero-24.jpg",
    "/mock/listing/hero-26.jpg",
    "/mock/listing/hero-11.jpg",
    "/mock/listing/hero-16.jpg",
    "/mock/listing/hero-15.jpg",
  ],
  "L-005": [
    "/mock/listing/hero-13.jpg",
    "/mock/listing/hero-22.jpg",
    "/mock/listing/hero-5.jpg",
    "/mock/listing/hero-8.jpg",
    "/mock/listing/hero-10.jpg",
  ],
};

function getStableHash(seed: string) {
  return Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function getStablePoolImage(pool: string[], seed: string, offset = 0) {
  const hash = getStableHash(seed);
  return pool[(hash + offset) % pool.length];
}

export function getStableMockImage(seed: string, offset = 0) {
  return getStablePoolImage(MOCK_LISTING_IMAGES, seed, offset);
}

export function getMockListingMainHeroImage(listingId: string) {
  return (
    MOCK_LISTING_IMAGE_SETS[listingId]?.[0] ??
    getStablePoolImage(MAIN_HERO_IMAGES, listingId)
  );
}

export function getMockListingThumbnailImage(listingId: string) {
  return (
    MOCK_LISTING_IMAGE_SETS[listingId]?.[0] ??
    getStablePoolImage(ROOM_THUMB_IMAGES, listingId)
  );
}

export function getStableMockImages(seed: string, count: number, offset = 0) {
  return Array.from({ length: count }, (_, index) =>
    getStablePoolImage(SECONDARY_GALLERY_IMAGES, seed, offset + index * 7),
  );
}

export function getAllMockListingImages() {
  return [...MOCK_LISTING_IMAGES];
}

export function getStableMockListingGalleryImages(
  listingId: string,
  count: number,
) {
  if (count <= 0) return [];

  const curatedSet = MOCK_LISTING_IMAGE_SETS[listingId];
  if (curatedSet) return curatedSet.slice(0, count);

  return [
    getMockListingMainHeroImage(listingId),
    ...getStableMockImages(listingId, count - 1, 3),
  ];
}
