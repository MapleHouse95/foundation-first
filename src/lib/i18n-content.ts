import type { Locale } from "./i18n";

export interface MainContent {
  metaTitle: string;
  metaDescription: string;
  testModeBadge: string;
  heroTitle: string;
  heroDescription: string;
  seekerCta: string;
  landlordCta: string;
  rolesEyebrow: string;
  rolesTitle: string;
  rolesDescription: string;
  seekerCardTitle: string;
  seekerCardBody: string;
  seekerCardCta: string;
  landlordCardTitle: string;
  landlordCardBody: string;
  landlordCardCta: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutBody: string;
  mvpNotice: string;
}

export interface ListingsContent {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  cardTitle: (i: number) => string;
  cardBody: string;
  mvpNotice: string;
}

export interface ApplyContent {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  placeholderBody: string;
  disabledCta: string;
  mvpNotice: string;
}

export interface LandlordsContent {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  forWhoTitle: string;
  forWhoItems: string[];
  prepTitle: string;
  prepBody: string;
  comingSoonBadge: string;
  mvpNotice: string;
}

export const MAIN_CONTENT: Record<Locale, MainContent> = {
  ko: {
    metaTitle: "MapleHouse — 차분하고 명확한 주거 연결",
    metaDescription:
      "메이플하우스는 집을 찾는 사람과 임대인을 구조적으로 연결해 주는 반응형 웹서비스입니다.",
    testModeBadge: "테스트 모드 · MVP 미리보기",
    heroTitle: "집 찾기와 매물 연결을 더 차분하고 명확하게.",
    heroDescription:
      "메이플하우스는 집을 찾는 사람과 매물을 제공하려는 임대인이 더 구조적으로 상담하고 연결될 수 있도록 돕는 반응형 웹서비스입니다.",
    seekerCta: "집을 찾고 있어요",
    landlordCta: "임대인 등록/문의",
    rolesEyebrow: "어떤 도움이 필요하세요?",
    rolesTitle: "두 가지 흐름으로 안내합니다",
    rolesDescription:
      "언어와 역할은 서로 분리되어 있어요. 원하는 흐름을 선택해 주세요.",
    seekerCardTitle: "집을 찾는 분",
    seekerCardBody:
      "지역·예산·상황을 알려주시면, 관리자가 검토한 매물과 안내를 받으실 수 있습니다.",
    seekerCardCta: "매물 보러 가기",
    landlordCardTitle: "임대인 / 매물 제공자",
    landlordCardBody:
      "보유 매물을 구조적으로 소개하고, 메이플하우스를 통해 신뢰 가능한 신청자와 연결되세요.",
    landlordCardCta: "임대인 등록 안내",
    aboutEyebrow: "MapleHouse 소개",
    aboutTitle: "차분하고, 명확하고, 초보자 친화적인 주거 서비스",
    aboutBody:
      "메이플하우스는 첫 자취·첫 전월세·외국인 정착 등 처음 집을 구하는 분과, 안정적인 입주자를 찾는 임대인을 연결합니다. 모든 절차는 사람과 관리자가 함께 검토합니다.",
    mvpNotice:
      "MVP 준비 단계입니다. 결제·계약·실제 등록 기능은 아직 활성화되지 않았습니다.",
  },
  en: {
    metaTitle: "MapleHouse — Calm, clearer housing connections",
    metaDescription:
      "MapleHouse connects housing seekers and property owners through a structured, admin-managed web service.",
    testModeBadge: "Test mode · MVP preview",
    heroTitle: "Clearer housing connections, in the language you prefer.",
    heroDescription:
      "MapleHouse helps housing seekers and property owners communicate through a structured, admin-managed process.",
    seekerCta: "I’m looking for housing",
    landlordCta: "I want to list a property",
    rolesEyebrow: "How can we help?",
    rolesTitle: "Two flows, one calm process",
    rolesDescription:
      "Language and role are kept separate. Pick the flow that fits you.",
    seekerCardTitle: "Housing seekers",
    seekerCardBody:
      "Tell us your area, budget, and situation. An admin reviews listings and guides you through next steps.",
    seekerCardCta: "Browse listings",
    landlordCardTitle: "Landlords & property owners",
    landlordCardBody:
      "Introduce your property in a structured way and get connected to vetted applicants through MapleHouse.",
    landlordCardCta: "Landlord info",
    aboutEyebrow: "About MapleHouse",
    aboutTitle: "Calm, clear, beginner-friendly housing",
    aboutBody:
      "MapleHouse supports first-time renters, newcomers, and property owners looking for reliable occupants. Every step is reviewed by a real admin team.",
    mvpNotice:
      "MVP in preparation. Payments, contracts, and real property registration are not active yet.",
  },
  fr: {
    metaTitle: "MapleHouse — Des échanges immobiliers plus clairs",
    metaDescription:
      "MapleHouse met en relation les chercheurs de logement et les propriétaires via un service web structuré.",
    testModeBadge: "Mode test · Aperçu MVP",
    heroTitle:
      "Des échanges immobiliers plus clairs, dans la langue que vous préférez.",
    heroDescription:
      "MapleHouse aide les personnes qui cherchent un logement et les propriétaires à communiquer grâce à un processus structuré.",
    seekerCta: "Je cherche un logement",
    landlordCta: "Je veux proposer un logement",
    rolesEyebrow: "Comment pouvons-nous aider ?",
    rolesTitle: "Deux parcours, un processus apaisé",
    rolesDescription:
      "La langue et le rôle sont indépendants. Choisissez le parcours qui vous correspond.",
    seekerCardTitle: "Chercheurs de logement",
    seekerCardBody:
      "Indiquez votre zone, votre budget et votre situation. Un administrateur examine les annonces et vous accompagne.",
    seekerCardCta: "Voir les logements",
    landlordCardTitle: "Propriétaires et bailleurs",
    landlordCardBody:
      "Présentez votre bien de manière structurée et entrez en contact avec des candidats sérieux via MapleHouse.",
    landlordCardCta: "Infos propriétaires",
    aboutEyebrow: "À propos de MapleHouse",
    aboutTitle: "Un logement clair, calme et accessible",
    aboutBody:
      "MapleHouse accompagne les primo-locataires, les nouveaux arrivants et les propriétaires en quête d’occupants fiables. Chaque étape est revue par une équipe d’administration humaine.",
    mvpNotice:
      "MVP en préparation. Les paiements, les contrats et l’enregistrement réel des biens ne sont pas encore actifs.",
  },
};

export const LISTINGS_CONTENT: Record<Locale, ListingsContent> = {
  ko: {
    metaTitle: "하우스·서비스 — MapleHouse",
    metaDescription: "관리자가 검토한 매물 미리보기 (자리표시자).",
    eyebrow: "하우스·서비스",
    title: "검토된 매물",
    description: "실제 매물 데이터는 다음 단계에서 추가됩니다. 현재는 예시 카드입니다.",
    cardTitle: (i) => `예시 매물 ${i + 1}`,
    cardBody: "지역 · 면적 · 예상 월비용 (자리표시자)",
    mvpNotice: "MVP 준비 단계 — 실제 매물 등록과 검색은 아직 활성화되지 않았습니다.",
  },
  en: {
    metaTitle: "Housing & Services — MapleHouse",
    metaDescription: "Preview of admin-reviewed housing options (placeholder).",
    eyebrow: "Housing & Services",
    title: "Reviewed listings",
    description: "Real listing data arrives in a later phase. These are placeholder cards.",
    cardTitle: (i) => `Sample home ${i + 1}`,
    cardBody: "Neighborhood · Size · Approx. monthly cost (placeholder)",
    mvpNotice: "MVP preview — real property registration and search are not active yet.",
  },
  fr: {
    metaTitle: "Logements & services — MapleHouse",
    metaDescription: "Aperçu de logements vérifiés par l’administration (placeholder).",
    eyebrow: "Logements & services",
    title: "Logements vérifiés",
    description:
      "Les vraies annonces arriveront dans une prochaine phase. Voici des cartes d’exemple.",
    cardTitle: (i) => `Logement exemple ${i + 1}`,
    cardBody: "Quartier · Surface · Coût mensuel approx. (placeholder)",
    mvpNotice:
      "Aperçu MVP — l’enregistrement et la recherche réels de biens ne sont pas encore actifs.",
  },
};

export const APPLY_CONTENT: Record<Locale, ApplyContent> = {
  ko: {
    metaTitle: "신청하기 — MapleHouse",
    metaDescription: "메이플하우스 상담 신청 페이지 자리표시자.",
    eyebrow: "신청하기",
    title: "상담을 신청해 주세요",
    description: "정식 신청 폼은 다음 단계에서 제공됩니다. 현재 페이지는 자리표시자입니다.",
    placeholderBody:
      "입력 필드·검증·제출 흐름은 아직 구현되지 않았습니다. 결제와 계약 기능도 아직 활성화되지 않았습니다.",
    disabledCta: "제출 (이 단계에서는 비활성화)",
    mvpNotice: "MVP 준비 단계입니다.",
  },
  en: {
    metaTitle: "Apply — MapleHouse",
    metaDescription: "Placeholder application page for a MapleHouse consultation.",
    eyebrow: "Apply",
    title: "Request a consultation",
    description: "The full inquiry form arrives in a later phase. This page is a placeholder.",
    placeholderBody:
      "Form fields, validation, and submission flow are not built yet. Payments and contracts are not active either.",
    disabledCta: "Submit (disabled in this phase)",
    mvpNotice: "MVP preview — not connected to any database.",
  },
  fr: {
    metaTitle: "Faire une demande — MapleHouse",
    metaDescription: "Page de demande placeholder pour une consultation MapleHouse.",
    eyebrow: "Faire une demande",
    title: "Demander une consultation",
    description:
      "Le vrai formulaire arrivera dans une prochaine phase. Cette page est un placeholder.",
    placeholderBody:
      "Les champs, la validation et l’envoi ne sont pas encore construits. Les paiements et les contrats ne sont pas non plus actifs.",
    disabledCta: "Envoyer (désactivé à cette étape)",
    mvpNotice: "Aperçu MVP — aucune base de données connectée.",
  },
};

export const LANDLORDS_CONTENT: Record<Locale, LandlordsContent> = {
  ko: {
    metaTitle: "임대인 등록 — MapleHouse",
    metaDescription: "임대인·매물 제공자·룸 렌탈 운영자를 위한 안내 페이지 자리표시자.",
    eyebrow: "임대인 등록",
    title: "임대인·매물 제공자를 위한 안내",
    description:
      "메이플하우스는 매물을 제공하려는 분과 신뢰 가능한 신청자를 구조적으로 연결합니다.",
    forWhoTitle: "이 페이지가 도움이 되는 분",
    forWhoItems: [
      "임대인 / 집주인",
      "원룸·투룸·셰어하우스 운영자",
      "매물을 직접 등록·관리하려는 분",
      "외국인·초보 입주자에게 안내가 필요한 매물 제공자",
    ],
    prepTitle: "현재 준비 중",
    prepBody:
      "구조화된 매물 등록과 파트너 문의 흐름을 준비하고 있습니다. 정식 등록은 아직 가능하지 않습니다.",
    comingSoonBadge: "곧 공개 · MVP 자리표시자",
    mvpNotice:
      "실제 매물 등록·계약·결제 기능은 아직 활성화되지 않았습니다.",
  },
  en: {
    metaTitle: "Landlord Registration — MapleHouse",
    metaDescription:
      "Placeholder info page for landlords, property owners, and room rental hosts.",
    eyebrow: "Landlord Registration",
    title: "For landlords & property owners",
    description:
      "MapleHouse is building a structured way for property owners to connect with vetted applicants.",
    forWhoTitle: "Who this page is for",
    forWhoItems: [
      "Landlords and property owners",
      "Studio, share-house, and room rental hosts",
      "Owners who want to manage their own listings",
      "Providers serving newcomers or first-time tenants",
    ],
    prepTitle: "Currently in preparation",
    prepBody:
      "We’re preparing a structured listing and partner inquiry flow. Real registration is not yet available.",
    comingSoonBadge: "Coming soon · MVP placeholder",
    mvpNotice:
      "Real property registration, contracts, and payments are not active yet.",
  },
  fr: {
    metaTitle: "Proposer un logement — MapleHouse",
    metaDescription:
      "Page d’information placeholder pour propriétaires, bailleurs et hôtes de locations.",
    eyebrow: "Proposer un logement",
    title: "Pour les propriétaires et bailleurs",
    description:
      "MapleHouse prépare un parcours structuré pour mettre en relation les propriétaires et des candidats sérieux.",
    forWhoTitle: "À qui s’adresse cette page",
    forWhoItems: [
      "Propriétaires et bailleurs",
      "Hôtes de studios, colocations et chambres",
      "Propriétaires qui veulent gérer leurs propres annonces",
      "Fournisseurs accueillant des nouveaux arrivants ou primo-locataires",
    ],
    prepTitle: "En préparation",
    prepBody:
      "Nous préparons un parcours structuré d’annonces et de prise de contact partenaire. L’inscription réelle n’est pas encore disponible.",
    comingSoonBadge: "Bientôt · Placeholder MVP",
    mvpNotice:
      "L’enregistrement réel des biens, les contrats et les paiements ne sont pas encore actifs.",
  },
};