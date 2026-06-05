import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  FileText,
  HelpCircle,
  LifeBuoy,
  Mail,
  MessageSquareText,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

type SupportCategoryKey = "renter" | "landlord" | "maplePass" | "general";

type FaqItem = {
  question: string;
  answer: string;
};

type SupportCategory = {
  key: SupportCategoryKey;
  title: string;
  description: string;
  detailTitle: string;
  detailDescription: string;
  faqs: FaqItem[];
};

type SupportPanel = {
  title: string;
  checklist: string[];
  contactTitle: string;
  contactMethods: Array<{
    label: string;
    value: string;
  }>;
  noticeTitle: string;
  notices: string[];
};

type ContactContent = {
  eyebrow: string;
  title: string;
  heroDescription: string;
  searchLabel: string;
  searchPlaceholder: string;
  chips: string[];
  categoryTitle: string;
  faqLabel: string;
  supportPanel: SupportPanel;
  topicTitle: string;
  topics: Array<{
    title: string;
    description: string;
  }>;
  categories: SupportCategory[];
};

const CONTENT: Record<Locale, ContactContent> = {
  ko: {
    eyebrow: "CONTACT / SUPPORT",
    title: "무엇을 도와드릴까요?",
    heroDescription:
      "메이플하우스 이용 중 궁금한 점, 매물 관련 질문, 임대인 관련 질문, 메이플패스 이용 안내를 한곳에서 확인해보세요. 자주 묻는 질문을 먼저 확인하고, 필요한 경우 문의 방법을 참고해 주세요.",
    searchLabel: "질문 내용을 찾아보세요",
    searchPlaceholder: "궁금한 내용을 검색해보세요",
    chips: ["매물 문의", "체크리스트", "임대인 등록", "메이플패스", "기타 문의"],
    categoryTitle: "문의 유형을 선택해 주세요",
    faqLabel: "자주 묻는 질문",
    categories: [
      {
        key: "renter",
        title: "고객 문의",
        description: "매물 확인, 체크리스트, 서비스 이용 관련 질문",
        detailTitle: "고객 문의 도움말",
        detailDescription:
          "토론토에서 집을 찾는 사용자가 자주 묻는 매물 확인, 체크리스트, 계약 전 확인 범위를 정리했습니다.",
        faqs: [
          {
            question: "메이플하우스가 매물을 직접 보장하나요?",
            answer:
              "아니요. 메이플하우스는 매물 상태나 입주 가능 여부를 보장하지 않습니다. 계약 전에 확인해야 할 질문과 비교 기준을 정리하는 데 도움을 줍니다.",
          },
          {
            question: "선택한 매물은 어떻게 문의하나요?",
            answer:
              "매물 상세 화면에서 표시된 문의 흐름을 참고해 직접 문의하거나, 메이플하우스와 함께 확인 요청서를 작성하는 방식으로 준비할 수 있습니다.",
          },
          {
            question: "체크리스트 결과가 정답인가요?",
            answer:
              "아니요. 체크리스트 결과는 집을 찾기 시작할 기준점입니다. 실제 통학 시간, 생활 동선, 매물 상태는 직접 다시 확인해야 합니다.",
          },
          {
            question: "실제 계약이나 송금도 진행하나요?",
            answer:
              "현재 MVP 단계에서는 실제 결제, 송금, 전자서명을 진행하지 않습니다. 관련 기능은 추후 별도 안내가 필요합니다.",
          },
        ],
      },
      {
        key: "landlord",
        title: "임대인 문의",
        description: "매물 등록, 노출 방식, 운영 관련 질문",
        detailTitle: "임대인 문의 도움말",
        detailDescription:
          "매물을 등록하거나 한국 출국 예정자에게 구조화된 방식으로 소개하고 싶은 제공자를 위한 기본 안내입니다.",
        faqs: [
          {
            question: "임대인도 비용을 내야 하나요?",
            answer:
              "현재 메이플하우스는 임대인에게 리스팅 비용이나 성공 수수료를 부과하지 않는 방향을 기준으로 설계하고 있습니다.",
          },
          {
            question: "어떤 매물을 등록할 수 있나요?",
            answer:
              "룸렌트, 쉐어하우스, 콘도, 하우스, 스튜디오 등 실제 거주 가능한 매물을 등록하는 방향을 기준으로 합니다.",
          },
          {
            question: "등록한 매물 정보는 어떻게 관리하나요?",
            answer:
              "MVP 단계에서는 운영자 확인을 통해 정보가 정리되며, 추후 임대인이 직접 수정하고 관리할 수 있는 기능으로 확장할 수 있습니다.",
          },
          {
            question: "한국 출국 예정자에게 어떤 식으로 안내되나요?",
            answer:
              "메이플하우스는 출국 전에 집을 찾는 사용자가 지역, 예산, 계약 조건을 이해하기 쉽도록 매물 정보를 구조화해 보여주는 것을 목표로 합니다.",
          },
        ],
      },
      {
        key: "maplePass",
        title: "메이플패스 고객",
        description: "유료 서비스 이용 범위, 진행 방식, 정책 안내",
        detailTitle: "메이플패스 도움말",
        detailDescription:
          "메이플패스는 향후 유료 지원 서비스의 가칭입니다. 현재 MVP에서는 범위와 정책을 안내하는 수준으로만 다룹니다.",
        faqs: [
          {
            question: "메이플패스는 어떤 서비스인가요?",
            answer:
              "메이플패스는 유료 지원 서비스의 가칭입니다. 매물 확인 지원, 질문 정리, 진행 안내 등 추후 제공할 서비스 범위를 기준으로 설계 중입니다.",
          },
          {
            question: "메이플패스 이용 범위는 어디까지인가요?",
            answer:
              "현재 MVP 단계에서는 실제 유료 기능이 완전히 연결되어 있지 않을 수 있으며, 정식 서비스 범위는 추후 별도로 안내할 예정입니다.",
          },
          {
            question: "환불이나 변경 정책은 어떻게 되나요?",
            answer:
              "정식 유료 서비스 오픈 전까지는 확정 정책이 아니며, 실제 판매가 시작되면 별도 정책 안내가 필요합니다.",
          },
          {
            question: "이용 중 진행 상태는 어디서 확인하나요?",
            answer:
              "추후 마이페이지와 진행 현황 확인 기능을 추가할 수 있습니다. 현재 MVP에서는 화면 구조와 안내 흐름을 우선 구성합니다.",
          },
        ],
      },
      {
        key: "general",
        title: "기타 문의",
        description: "제휴, 오류 제보, 일반 문의",
        detailTitle: "기타 문의 도움말",
        detailDescription:
          "서비스 제휴, 화면 오류, 일반 문의처럼 특정 매물이나 임대인 등록에 속하지 않는 질문을 정리했습니다.",
        faqs: [
          {
            question: "서비스 제휴 문의도 가능한가요?",
            answer:
              "제휴, 작업, 파트너십 관련 문의를 받을 수 있도록 별도 연락 채널을 준비 중입니다.",
          },
          {
            question: "사이트 오류나 버그는 어떻게 알려야 하나요?",
            answer:
              "페이지 오류, 잘못된 정보, 사용 중 불편한 점은 문의 채널을 통해 전달할 수 있도록 준비 중입니다.",
          },
          {
            question: "계정이나 로그인 문의도 여기에 하나요?",
            answer:
              "향후 로그인과 회원 기능이 정식으로 연결되면 계정 관련 문의 항목도 이 페이지에서 안내할 수 있습니다.",
          },
          {
            question: "그 밖의 일반 문의도 가능한가요?",
            answer:
              "네. 서비스와 관련된 일반 문의는 이 페이지에서 기본 안내를 확인할 수 있도록 구성했습니다.",
          },
        ],
      },
    ],
    supportPanel: {
      title: "문의 전 확인해주세요",
      checklist: [
        "매물 번호 또는 매물명을 함께 적어주세요.",
        "입주 희망일과 예상 거주 기간을 알려주세요.",
        "확인하고 싶은 항목을 구체적으로 적어주세요.",
        "계약이나 송금 전에는 반드시 본인이 최종 확인해야 합니다.",
      ],
      contactTitle: "연락 방법",
      contactMethods: [
        { label: "이메일", value: "contact@maplehouse.example" },
        { label: "카카오톡/채팅", value: "준비 중" },
        { label: "운영 시간", value: "준비 중" },
      ],
      noticeTitle: "현재 안내",
      notices: [
        "현재 MVP 단계에서는 실제 문의 전송 기능이 연결되어 있지 않습니다.",
        "실제 결제, 송금, 전자서명 기능은 아직 지원하지 않습니다.",
        "정식 오픈 전까지 세부 운영 정책은 별도로 안내할 예정입니다.",
      ],
    },
    topicTitle: "자주 찾는 안내 항목",
    topics: [
      {
        title: "매물 확인 안내",
        description: "매물 상태, 사진, 가격, 계약 전 질문을 어떻게 정리할지 확인합니다.",
      },
      {
        title: "체크리스트 이해하기",
        description: "추천 기준역과 매물 비교 결과를 참고용으로 사용하는 방법을 봅니다.",
      },
      {
        title: "임대인 등록 안내",
        description: "제공자가 매물을 소개할 때 필요한 기본 정보와 운영 방향을 확인합니다.",
      },
      {
        title: "메이플패스 안내",
        description: "향후 유료 지원 서비스의 범위와 준비 중인 흐름을 확인합니다.",
      },
    ],
  },
  en: {
    eyebrow: "CONTACT / SUPPORT",
    title: "How can MapleHouse help?",
    heroDescription:
      "Find answers about listings, provider registration, MaplePass support, and MVP service scope. Start with common questions, then use the contact guidance if you need more help.",
    searchLabel: "Find support topics",
    searchPlaceholder: "Search support topics",
    chips: ["Listing questions", "Checklist", "Landlords", "MaplePass", "General"],
    categoryTitle: "Choose a support category",
    faqLabel: "Common questions",
    categories: [
      {
        key: "renter",
        title: "Renter Support",
        description: "Listing questions, checklist flow, and user support",
        detailTitle: "Renter support",
        detailDescription:
          "Answers for people comparing homes, checking listings, or using MapleHouse before arrival.",
        faqs: [
          {
            question: "Does MapleHouse guarantee listings?",
            answer:
              "No. MapleHouse helps organize information and questions, but does not guarantee availability, condition, or contract outcomes.",
          },
          {
            question: "How do users ask about a listing?",
            answer:
              "Users can open a listing and follow the inquiry flow shown in the listing experience.",
          },
          {
            question: "Is the checklist result a final answer?",
            answer:
              "No. It is a starting point for comparing homes. Real routes, listing conditions, and contract terms still need to be checked directly.",
          },
        ],
      },
      {
        key: "landlord",
        title: "Landlord Support",
        description: "Listing registration and provider onboarding",
        detailTitle: "Landlord support",
        detailDescription:
          "Basic information for housing providers who want to introduce listings through MapleHouse.",
        faqs: [
          {
            question: "Can housing providers register interest?",
            answer:
              "Yes. Providers can use the landlord registration page to share basic listing or onboarding information.",
          },
          {
            question: "Is there a listing fee now?",
            answer:
              "The current MVP direction is provider-friendly and does not activate listing fees.",
          },
          {
            question: "What listing types can be introduced?",
            answer:
              "Rooms, shared homes, condos, houses, studios, and other real housing options can be prepared for structured display.",
          },
        ],
      },
      {
        key: "maplePass",
        title: "MaplePass Support",
        description: "Paid support scope and future policy",
        detailTitle: "MaplePass support",
        detailDescription:
          "MaplePass is a working name for future paid support. This MVP only explains the intended support scope.",
        faqs: [
          {
            question: "What is MaplePass?",
            answer:
              "MaplePass is a planned paid support concept for listing checks, question organization, and guided progress.",
          },
          {
            question: "Is MaplePass fully available now?",
            answer:
              "Not yet. The official paid service scope will be announced separately before launch.",
          },
          {
            question: "Are refund policies final?",
            answer:
              "No. Final policies will be provided when the paid service is actually launched.",
          },
        ],
      },
      {
        key: "general",
        title: "General Inquiries",
        description: "Partnerships, bugs, and general questions",
        detailTitle: "General inquiries",
        detailDescription:
          "For questions that are not tied to a specific listing, provider registration, or MaplePass support.",
        faqs: [
          {
            question: "Can I contact MapleHouse about partnerships?",
            answer:
              "Partnership and collaboration channels are being prepared for future launch.",
          },
          {
            question: "How can I report a bug?",
            answer:
              "A formal report channel is not connected in this MVP, but the support page explains what information will be useful.",
          },
          {
            question: "Does MapleHouse handle contracts or payments?",
            answer:
              "No. MapleHouse does not provide legal advice, brokerage, escrow, payment handling, or lease guarantees.",
          },
        ],
      },
    ],
    supportPanel: {
      title: "Before contacting us",
      checklist: [
        "Include a listing name or listing ID if relevant.",
        "Tell us whether this is a renter or provider question.",
        "Describe what needs to be checked or clarified.",
        "Final contract and payment decisions remain your responsibility.",
      ],
      contactTitle: "Contact channels",
      contactMethods: [
        { label: "Email", value: "contact@maplehouse.example" },
        { label: "Chat", value: "Preparing" },
        { label: "Hours", value: "Preparing" },
      ],
      noticeTitle: "Current status",
      notices: [
        "Real contact submission is not connected in this MVP preview.",
        "Payment, remittance, and e-signature features are not supported.",
        "Official support policies will be announced separately before launch.",
      ],
    },
    topicTitle: "Frequently used help topics",
    topics: [
      {
        title: "Listing checks",
        description: "What to ask before comparing or choosing a listing.",
      },
      {
        title: "Checklist guidance",
        description: "How to use checklist results as a reference point.",
      },
      {
        title: "Provider onboarding",
        description: "What providers can prepare before listing with MapleHouse.",
      },
      {
        title: "MaplePass",
        description: "Planned paid-support scope and service boundaries.",
      },
    ],
  },
  fr: {
    eyebrow: "CONTACT / SUPPORT",
    title: "Comment MapleHouse peut aider?",
    heroDescription:
      "Retrouvez les réponses sur les annonces, l’inscription propriétaire, MaplePass et les limites du MVP. Consultez d’abord les questions courantes, puis les indications de contact si nécessaire.",
    searchLabel: "Trouvez un sujet d’aide",
    searchPlaceholder: "Rechercher un sujet d’aide",
    chips: ["Annonces", "Check-list", "Propriétaires", "MaplePass", "Général"],
    categoryTitle: "Choisissez une catégorie",
    faqLabel: "Questions courantes",
    categories: [
      {
        key: "renter",
        title: "Aide locataire",
        description: "Questions sur les annonces, la check-list et l’usage",
        detailTitle: "Aide locataire",
        detailDescription:
          "Réponses pour les personnes qui comparent des logements ou utilisent MapleHouse avant leur arrivée.",
        faqs: [
          {
            question: "MapleHouse garantit-il les annonces?",
            answer:
              "Non. MapleHouse aide à organiser les informations et les questions, mais ne garantit pas la disponibilité, l’état du logement ni le contrat.",
          },
          {
            question: "Comment poser une question sur une annonce?",
            answer:
              "L’utilisateur peut ouvrir une annonce et suivre le parcours de demande affiché dans l’expérience logement.",
          },
          {
            question: "Le résultat de la check-list est-il définitif?",
            answer:
              "Non. C’est un point de départ pour comparer. Les trajets, l’annonce et les conditions doivent être vérifiés directement.",
          },
        ],
      },
      {
        key: "landlord",
        title: "Aide propriétaire",
        description: "Inscription, annonces et mise en relation",
        detailTitle: "Aide propriétaire",
        detailDescription:
          "Informations de base pour les propriétaires ou fournisseurs qui souhaitent présenter un logement via MapleHouse.",
        faqs: [
          {
            question: "Un propriétaire peut-il s’inscrire?",
            answer:
              "Oui. La page propriétaire permet de partager les premières informations de logement ou d’onboarding.",
          },
          {
            question: "Y a-t-il des frais maintenant?",
            answer:
              "Le MVP garde une approche favorable aux propriétaires et n’active pas de frais de listing.",
          },
          {
            question: "Quels logements peuvent être présentés?",
            answer:
              "Chambres, maisons partagées, condos, maisons, studios et autres logements réels peuvent être structurés.",
          },
        ],
      },
      {
        key: "maplePass",
        title: "Assistance MaplePass",
        description: "Portée du support payant et futures règles",
        detailTitle: "Assistance MaplePass",
        detailDescription:
          "MaplePass est un nom de travail pour un futur support payant. Ce MVP explique seulement le périmètre prévu.",
        faqs: [
          {
            question: "Qu’est-ce que MaplePass?",
            answer:
              "MaplePass est un concept de support payant pour vérifier des annonces, organiser des questions et guider le suivi.",
          },
          {
            question: "MaplePass est-il disponible maintenant?",
            answer:
              "Pas encore. Le périmètre officiel du service payant sera annoncé séparément avant le lancement.",
          },
          {
            question: "Les règles de remboursement sont-elles finales?",
            answer:
              "Non. Les règles définitives seront communiquées lorsque le service payant sera réellement lancé.",
          },
        ],
      },
      {
        key: "general",
        title: "Questions générales",
        description: "Partenariats, erreurs et demandes générales",
        detailTitle: "Questions générales",
        detailDescription:
          "Pour les questions qui ne concernent pas une annonce précise, un propriétaire ou MaplePass.",
        faqs: [
          {
            question: "Puis-je contacter MapleHouse pour un partenariat?",
            answer:
              "Les canaux de partenariat et de collaboration sont en préparation pour le lancement.",
          },
          {
            question: "Comment signaler une erreur?",
            answer:
              "Un canal formel n’est pas connecté dans ce MVP, mais cette page indique les informations utiles.",
          },
          {
            question: "MapleHouse gère-t-il les contrats ou paiements?",
            answer:
              "Non. MapleHouse ne fournit pas de conseil juridique, de courtage, d’escrow, de paiement ni de garantie de bail.",
          },
        ],
      },
    ],
    supportPanel: {
      title: "Avant de nous contacter",
      checklist: [
        "Ajoutez le nom ou l’ID de l’annonce si nécessaire.",
        "Indiquez s’il s’agit d’une question locataire ou propriétaire.",
        "Expliquez ce qui doit être vérifié ou clarifié.",
        "Le contrat et le paiement restent votre responsabilité finale.",
      ],
      contactTitle: "Canaux de contact",
      contactMethods: [
        { label: "Email", value: "contact@maplehouse.example" },
        { label: "Chat", value: "En préparation" },
        { label: "Horaires", value: "En préparation" },
      ],
      noticeTitle: "État actuel",
      notices: [
        "L’envoi réel de message n’est pas connecté dans cet aperçu MVP.",
        "Le paiement, le transfert d’argent et la signature électronique ne sont pas pris en charge.",
        "Les règles officielles seront annoncées séparément avant le lancement.",
      ],
    },
    topicTitle: "Sujets d’aide fréquents",
    topics: [
      {
        title: "Vérifier une annonce",
        description: "Les points à demander avant de comparer ou choisir un logement.",
      },
      {
        title: "Comprendre la check-list",
        description: "Utiliser les résultats comme point de référence.",
      },
      {
        title: "Inscription propriétaire",
        description: "Ce qu’un fournisseur peut préparer avant de publier.",
      },
      {
        title: "MaplePass",
        description: "Portée prévue du support payant et limites du service.",
      },
    ],
  },
};

const CATEGORY_ICONS: Record<SupportCategoryKey, typeof MessageSquareText> = {
  renter: MessageSquareText,
  landlord: Building2,
  maplePass: ShieldCheck,
  general: HelpCircle,
};

export function LocaleContactPage({ locale }: { locale: Locale }) {
  const t = CONTENT[locale];
  const keepAll = locale === "ko";
  const [activeCategoryKey, setActiveCategoryKey] = useState<SupportCategoryKey>("renter");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const activeCategory =
    t.categories.find((category) => category.key === activeCategoryKey) ?? t.categories[0];

  return (
    <main className={cn("bg-[#F8F7F4]", keepAll && "[word-break:keep-all]")}>
      <Container className="max-w-[1320px] py-8 sm:py-10 lg:py-12">
        {locale === "ko" ? (
          <PageBreadcrumb
            className="mb-5"
            items={[
              { label: "홈", to: "/ko" },
              { label: "문의하기" },
            ]}
          />
        ) : null}

        <section className="rounded-[1.75rem] bg-gradient-to-br from-[#FF8A3D] via-[#FF7A1A] to-[#FF9F59] p-5 text-white shadow-lg shadow-primary/15 sm:p-6 lg:p-7">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,34rem)] lg:items-center">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">
                {t.eyebrow}
              </p>
              <h1 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">
                {t.searchLabel}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/85">
                {t.heroDescription}
              </p>
            </div>

            <div className="min-w-0 rounded-2xl bg-white/15 p-3 ring-1 ring-white/25">
              <label className="sr-only" htmlFor={`support-search-${locale}`}>
                {t.searchLabel}
              </label>
              <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 shadow-sm">
                <Search className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                <input
                  id={`support-search-${locale}`}
                  type="search"
                  placeholder={t.searchPlaceholder}
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {t.chips.map((chip, index) => (
                  <span
                    key={chip}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-bold shadow-sm",
                      index === 0
                        ? "border-white bg-white text-primary"
                        : "border-white/60 bg-white/90 text-primary",
                    )}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 overflow-x-auto rounded-3xl border border-primary/15 bg-white p-2 shadow-sm">
          <div className="flex min-w-max gap-2 sm:min-w-0 sm:flex-wrap" role="tablist">
            {t.categories.map((category) => {
              const Icon = CATEGORY_ICONS[category.key];
              const isActive = category.key === activeCategory.key;

              return (
                <button
                  key={category.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveCategoryKey(category.key);
                    setOpenFaqIndex(0);
                  }}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-2xl border px-4 py-2.5 text-sm font-bold transition",
                    isActive
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-transparent bg-[#FAFAF9] text-muted-foreground hover:border-primary/25 hover:bg-[#FFF8F1] hover:text-primary",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {category.title}
                </button>
              );
            })}

            {locale === "ko" ? (
              <Link
                to="/ko/contact/board"
                className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-2xl border border-transparent bg-[#FAFAF9] px-4 py-2.5 text-sm font-bold text-muted-foreground transition hover:border-primary/25 hover:bg-[#FFF8F1] hover:text-primary"
              >
                <FileText className="h-4 w-4" aria-hidden />
                문의 게시판
              </Link>
            ) : null}
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <section className="min-w-0 rounded-3xl border border-border/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 border-b border-primary/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  {t.faqLabel}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-foreground">
                  {activeCategory.detailTitle}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {activeCategory.detailDescription}
                </p>
              </div>
              <span className="inline-flex w-fit shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                {activeCategory.title}
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {activeCategory.faqs.map((item, index) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-border/80 bg-white px-4 py-3 open:border-primary/35 open:bg-[#FFF8F1]"
                  open={openFaqIndex === index}
                >
                  <summary
                    onClick={(event) => {
                      event.preventDefault();
                      setOpenFaqIndex((current) => (current === index ? null : index));
                    }}
                    className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-bold text-foreground"
                  >
                    <span>{item.question}</span>
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <aside className="space-y-3">
            <section className="rounded-3xl border border-primary/20 bg-[#FFF8F1] p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                  <ClipboardList className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="text-base font-bold text-foreground">{t.supportPanel.title}</h2>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                {t.supportPanel.checklist.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl border border-border/80 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="text-lg font-bold text-foreground">
                  {t.supportPanel.contactTitle}
                </h2>
              </div>
              <dl className="mt-4 space-y-2">
                {t.supportPanel.contactMethods.map((method) => (
                  <div
                    key={method.label}
                    className="rounded-2xl border border-border/80 bg-[#FCFCFB] px-4 py-3"
                  >
                    <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      {method.label}
                    </dt>
                    <dd className="mt-1 text-sm font-bold text-foreground">{method.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-3xl border border-border/80 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF3E6] text-primary">
                  <HelpCircle className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="text-lg font-bold text-foreground">
                  {t.supportPanel.noticeTitle}
                </h2>
              </div>
              <div className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                {t.supportPanel.notices.map((notice) => (
                  <p key={notice}>{notice}</p>
                ))}
              </div>
            </section>
          </aside>
        </section>      </Container>
    </main>
  );
}
