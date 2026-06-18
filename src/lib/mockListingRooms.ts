import type { Locale } from "@/lib/i18n";
import type { MockListing } from "@/components/pages/LocaleListingsPage";

type LocalizedText = Record<Locale, string>;

export interface MockListingRoomOption {
  id: string;
  label: LocalizedText;
  roomType: LocalizedText;
  priceCAD: number;
  priceKRW: number;
  maxPeople: number;
  bathroom: LocalizedText;
  kitchen: LocalizedText;
  livingCondition: LocalizedText;
  bedroomUse: LocalizedText;
  bedSize: LocalizedText;
  floor: LocalizedText;
  furnished: LocalizedText;
  availableFrom: LocalizedText;
  minimumStay: LocalizedText;
  notes: Record<Locale, string[]>;
  photoOffset: number;
}

const roundToTen = (value: number) => Math.max(500, Math.round(value / 10) * 10);
const roundToTenThousand = (value: number) => Math.max(500000, Math.round(value / 10000) * 10000);

export function buildMockListingRoomOptions(listing: MockListing): MockListingRoomOption[] {
  const baseCad = listing.priceCAD;
  const baseKrw = listing.priceKRW;
  const lowerCad = roundToTen(baseCad * 0.88);
  const lowerKrw = roundToTenThousand(baseKrw * 0.88);
  const premiumCad = roundToTen(baseCad * 1.12);
  const premiumKrw = roundToTenThousand(baseKrw * 1.12);

  return [
    {
      id: `${listing.id}-room-a`,
      label: {
        ko: "Room A · 기본룸",
        en: "Room A · Standard room",
        fr: "Chambre A · Standard",
      },
      roomType: {
        ko: listing.roomType.ko,
        en: listing.roomType.en,
        fr: listing.roomType.fr,
      },
      priceCAD: lowerCad,
      priceKRW: lowerKrw,
      maxPeople: 1,
      bathroom: {
        ko: "공용사용",
        en: "Shared bathroom",
        fr: "Salle de bain partagée",
      },
      kitchen: {
        ko: "공용사용",
        en: "Shared kitchen",
        fr: "Cuisine partagée",
      },
      livingCondition: {
        ko: "공용사용",
        en: "Shared use",
        fr: "Usage partagé",
      },
      bedroomUse: {
        ko: "개인사용",
        en: "Private use",
        fr: "Usage privé",
      },
      bedSize: {
        ko: "싱글/더블 확인필요",
        en: "Single/double to confirm",
        fr: "Simple/double à confirmer",
      },
      floor: {
        ko: "2층",
        en: "2nd floor",
        fr: "2e étage",
      },
      furnished: {
        ko: "기본룸",
        en: "Basic furniture included",
        fr: "Meubles de base inclus",
      },
      availableFrom: {
        ko: "2026. 8. 15.",
        en: "Aug 15, 2026",
        fr: "15 août 2026",
      },
      minimumStay: {
        ko: "3개월",
        en: "3 months",
        fr: "3 mois",
      },
      notes: {
        ko: ["최대 1명", "2층", "기본룸", "확인필요"],
        en: ["Shared-space rules need confirmation.", "Best for users prioritizing budget."],
        fr: ["Règles des espaces partagés à confirmer.", "Convient aux personnes qui priorisent le budget."],
      },
      photoOffset: 0,
    },
    {
      id: `${listing.id}-room-b`,
      label: {
        ko: "Room B · 넓은룸",
        en: "Room B · Larger room",
        fr: "Chambre B · Plus grande",
      },
      roomType: {
        ko: listing.maxPeople > 1 ? listing.roomType.ko : "프리미엄 룸",
        en: listing.maxPeople > 1 ? listing.roomType.en : "Premium room",
        fr: listing.maxPeople > 1 ? listing.roomType.fr : "Chambre premium",
      },
      priceCAD: premiumCad,
      priceKRW: premiumKrw,
      maxPeople: Math.max(2, listing.maxPeople),
      bathroom: {
        ko: "개인사용",
        en: "Private or semi-private bathroom to confirm",
        fr: "Salle de bain privée ou semi-privée à confirmer",
      },
      kitchen: {
        ko: "공용사용",
        en: "Shared kitchen · storage to confirm",
        fr: "Cuisine partagée · rangement à confirmer",
      },
      livingCondition: {
        ko: "확인필요",
        en: "To confirm",
        fr: "À confirmer",
      },
      bedroomUse: {
        ko: "개인사용",
        en: "Private use",
        fr: "Usage privé",
      },
      bedSize: {
        ko: "더블/퀸 확인필요",
        en: "Double/queen to confirm",
        fr: "Double/queen à confirmer",
      },
      floor: {
        ko: "3층",
        en: "3rd floor",
        fr: "3e étage",
      },
      furnished: {
        ko: "넓은룸",
        en: "Furnished · desk to confirm",
        fr: "Meublée · bureau à confirmer",
      },
      availableFrom: {
        ko: "2026. 9. 1.",
        en: "Sep 1, 2026",
        fr: "1 sept. 2026",
      },
      minimumStay: {
        ko: "6개월",
        en: "6 months",
        fr: "6 mois",
      },
      notes: {
        ko: ["최대 2명", "3층", "넓은룸", "확인필요"],
        en: ["Max occupancy and bathroom details need confirmation.", "Better conditions may mean higher rent."],
        fr: ["Occupation maximale et salle de bain à confirmer.", "De meilleures conditions peuvent augmenter le loyer."],
      },
      photoOffset: 3,
    },
  ];
}

export function getMockListingRoomOption(
  listing: MockListing,
  roomId?: string,
): MockListingRoomOption {
  const rooms = buildMockListingRoomOptions(listing);
  return rooms.find((room) => room.id === roomId) ?? rooms[0];
}

export function getMockRoomShortLabel(room: MockListingRoomOption, locale: Locale): string {
  return room.label[locale].split("·")[0]?.trim() || room.label[locale];
}
