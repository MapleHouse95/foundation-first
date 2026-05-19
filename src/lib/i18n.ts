export const LOCALES = ["ko", "en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  fr: "Français",
};

export type LocaleNavKey = "home" | "listings" | "apply" | "landlords" | "admin";

export const NAV_LABELS: Record<Locale, Record<LocaleNavKey, string>> = {
  ko: {
    home: "홈",
    listings: "하우스·서비스",
    apply: "신청하기",
    landlords: "임대인 등록",
    admin: "관리자",
  },
  en: {
    home: "Home",
    listings: "Housing & Services",
    apply: "Apply",
    landlords: "Landlord Registration",
    admin: "Admin",
  },
  fr: {
    home: "Accueil",
    listings: "Logements & services",
    apply: "Faire une demande",
    landlords: "Proposer un logement",
    admin: "Admin",
  },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function localeFromPath(pathname: string): Locale | null {
  const seg = pathname.split("/")[1] ?? "";
  return isLocale(seg) ? seg : null;
}

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  ko: "ko",
  en: "en",
  fr: "fr",
};