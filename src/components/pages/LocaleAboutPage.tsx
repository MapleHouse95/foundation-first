import { Link } from "@tanstack/react-router";
import { CheckCircle2, Compass, Home, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

type AboutCard = {
  title: string;
  body: string;
};

type AboutContent = {
  eyebrow: string;
  title: string;
  heroTitle: string;
  heroDescription: string;
  storyTitle: string;
  storyBody: string[];
  serviceTitle: string;
  serviceCards: AboutCard[];
  scopeTitle: string;
  scopeBody: string[];
  providerTitle: string;
  providerBody: string[];
  visionTitle: string;
  visionBody: string[];
  ctas: Array<{
    label: string;
    to: string;
    variant: "default" | "soft" | "outline";
  }>;
};

const CONTENT: Record<Locale, AboutContent> = {
  ko: {
    eyebrow: "About MapleHouse",
    title: "메이플하우스란?",
    heroTitle: "토론토에서 처음 집을 구할 때, 무엇을 확인해야 할지 함께 정리하는 서비스입니다",
    heroDescription:
      "메이플하우스는 캐나다에 도착하기 전 집을 찾아보는 사람이 매물 정보만 보고 판단하기 어려운 부분을 더 쉽게 비교하고 확인할 수 있도록 돕는 주거 판단·확인 지원 서비스입니다.",
    storyTitle: "왜 만들었나요?",
    storyBody: [
      "처음 캐나다에서 집을 구할 때는 지역 이름, 월세 기준, 계약 조건, 보증금, 공과금, 룸메이트 규칙 같은 정보를 한 번에 이해하기 어렵습니다.",
      "특히 한국에서 출국 전 집을 찾아보는 경우에는 직접 방문하기 어렵고, 집주인에게 무엇을 물어봐야 할지도 막막할 수 있습니다.",
      "메이플하우스는 이런 불확실성을 줄이기 위해 시작되었습니다.",
    ],
    serviceTitle: "무엇을 도와주나요?",
    serviceCards: [
      {
        title: "기준역 찾기",
        body: "체크리스트를 통해 목적, 예산, 생활 방식에 맞는 기준역 후보를 정리합니다.",
      },
      {
        title: "매물 비교",
        body: "월세, 위치, 주거 형태, 최근 확인일 같은 정보를 보기 쉽게 정리합니다.",
      },
      {
        title: "확인 요청",
        body: "선택한 매물에 대해 집주인 또는 주거 제공자에게 확인하고 싶은 내용을 정리할 수 있게 돕습니다.",
      },
      {
        title: "입금 전 점검",
        body: "계약이나 송금 전에 확인해야 할 항목을 놓치지 않도록 안내합니다.",
      },
    ],
    scopeTitle: "무엇을 제공하지 않나요?",
    scopeBody: [
      "메이플하우스는 계약 당사자가 아니며, 법률 자문, 비자 자문, 부동산 중개, 송금 대행을 제공하지 않습니다.",
      "또한 입주 가능 여부, 매물 상태, 집주인의 응답, 계약 성사 여부를 확정하지 않습니다.",
      "대신 사용자가 스스로 판단할 수 있도록 확인 질문과 비교 기준을 정리해드립니다.",
    ],
    providerTitle: "임대인에게는 어떤 서비스인가요?",
    providerBody: [
      "임대인 또는 주거 제공자는 메이플하우스를 통해 한국에서 출국 전 집을 찾는 예비 세입자에게 매물을 보여줄 수 있습니다.",
      "메이플하우스는 임대인에게 리스팅 비용이나 성공 수수료를 부과하지 않는 방향을 기준으로 설계하고 있습니다.",
      "세입자에게는 매물을 비교하고 확인할 수 있는 별도 지원 서비스를 제공합니다.",
    ],
    visionTitle: "우리가 지향하는 것",
    visionBody: [
      "메이플하우스의 목표는 매물을 많이 보여주는 것만이 아닙니다.",
      "처음 집을 구하는 사람이 어떤 질문을 해야 하는지, 어떤 항목을 확인해야 하는지, 어떤 기준으로 비교해야 하는지를 스스로 판단할 수 있게 돕는 것입니다.",
    ],
    ctas: [
      { label: "매물 보러가기", to: "/ko/listings", variant: "default" },
      { label: "체크리스트 시작하기", to: "/ko/checklist", variant: "soft" },
      { label: "임대인 등록하기", to: "/ko/landlords", variant: "outline" },
    ],
  },
  en: {
    eyebrow: "About MapleHouse",
    title: "About MapleHouse",
    heroTitle: "A housing information and pre-arrival inquiry support service for Toronto rentals.",
    heroDescription:
      "MapleHouse helps incoming renters compare listings more clearly and helps housing providers present homes to people looking before arrival.",
    storyTitle: "Why MapleHouse exists",
    storyBody: [
      "Finding housing before arriving in Toronto can be difficult because listings, routes, costs, and lease questions are not always easy to compare.",
      "MapleHouse is being built to organize that information into a clearer first step.",
    ],
    serviceTitle: "What MapleHouse does",
    serviceCards: [
      {
        title: "Listing context",
        body: "We organize rent, location, housing type, and recent check information in a consistent format.",
      },
      {
        title: "Pre-arrival questions",
        body: "We help renters prepare what to ask before committing to a listing.",
      },
      {
        title: "Provider visibility",
        body: "Housing providers can present listings to people searching before arrival.",
      },
      {
        title: "Service boundaries",
        body: "We keep decision support separate from contracts, payment, and legal advice.",
      },
    ],
    scopeTitle: "What MapleHouse does not guarantee",
    scopeBody: [
      "MapleHouse does not provide legal advice, brokerage, escrow, payment handling, or lease guarantees.",
      "Listing availability, provider response, property condition, and final contract decisions must be checked by the user and provider.",
    ],
    providerTitle: "For housing providers",
    providerBody: [
      "MapleHouse is designed to help providers show rental options to incoming renters in a clearer, more structured way.",
      "The English experience is provider-oriented while still allowing general visitors to browse and understand the service.",
    ],
    visionTitle: "Our purpose",
    visionBody: [
      "The goal is not just to show more listings. It is to help people compare the right details before they make housing decisions.",
    ],
    ctas: [
      { label: "View listings", to: "/en/listings", variant: "default" },
      { label: "Register as landlord", to: "/en/landlords", variant: "soft" },
      { label: "Contact", to: "/en/contact", variant: "outline" },
    ],
  },
  fr: {
    eyebrow: "À propos",
    title: "À propos de MapleHouse",
    heroTitle: "Un service d’information logement et d’aide aux demandes avant l’arrivée à Toronto.",
    heroDescription:
      "MapleHouse aide les futurs locataires à comparer les annonces plus clairement et aide les propriétaires à présenter leurs logements.",
    storyTitle: "Pourquoi MapleHouse existe",
    storyBody: [
      "Chercher un logement avant d’arriver à Toronto peut être difficile lorsque les annonces, les trajets, les coûts et les questions de bail sont dispersés.",
      "MapleHouse organise ces informations pour créer un premier point de repère plus clair.",
    ],
    serviceTitle: "Ce que MapleHouse fait",
    serviceCards: [
      {
        title: "Contexte des annonces",
        body: "Loyer, emplacement, type de logement et dernières informations sont présentés de façon structurée.",
      },
      {
        title: "Questions avant l’arrivée",
        body: "Nous aidons à préparer les points à vérifier avant de s’engager sur une annonce.",
      },
      {
        title: "Visibilité propriétaire",
        body: "Les propriétaires peuvent présenter leurs logements à des personnes qui cherchent avant leur arrivée.",
      },
      {
        title: "Portée du service",
        body: "L’aide à la décision reste séparée du contrat, du paiement et du conseil juridique.",
      },
    ],
    scopeTitle: "Ce que MapleHouse ne garantit pas",
    scopeBody: [
      "MapleHouse ne fournit pas de conseil juridique, de courtage, d’escrow, de gestion de paiement ni de garantie de bail.",
      "La disponibilité, la réponse du propriétaire, l’état du logement et la décision finale doivent être vérifiés par les parties concernées.",
    ],
    providerTitle: "Pour les propriétaires",
    providerBody: [
      "MapleHouse aide les propriétaires à présenter leurs logements de manière plus claire aux personnes qui cherchent avant leur arrivée.",
      "L’expérience en français reste orientée propriétaires, tout en restant lisible pour les visiteurs généraux.",
    ],
    visionTitle: "Notre objectif",
    visionBody: [
      "Le but n’est pas seulement d’afficher plus d’annonces. Il est d’aider chacun à comparer les bons éléments avant une décision de logement.",
    ],
    ctas: [
      { label: "Voir les logements", to: "/fr/listings", variant: "default" },
      { label: "Propriétaires", to: "/fr/landlords", variant: "soft" },
      { label: "Contact", to: "/fr/contact", variant: "outline" },
    ],
  },
};

const CARD_ICONS = [Compass, Home, MessageSquareText, CheckCircle2];

export function LocaleAboutPage({ locale }: { locale: Locale }) {
  const t = CONTENT[locale];
  const keepAll = locale === "ko";

  return (
    <main className={cn("bg-background", keepAll && "[word-break:keep-all]")}>
      <Container className="py-12 sm:py-16">
        {locale === "ko" ? (
          <PageBreadcrumb
            className="mb-5"
            items={[
              { label: "홈", to: "/ko" },
              { label: "메이플하우스란?" },
            ]}
          />
        ) : null}

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {t.eyebrow}
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:items-end">
            <div>
              <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                {t.heroTitle}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t.heroDescription}
              </p>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <h2 className="text-lg font-bold text-foreground">{t.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t.visionBody[0]}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-foreground">{t.storyTitle}</h2>
          </div>
          <div className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t.storyBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-foreground">{t.serviceTitle}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {t.serviceCards.map((card, index) => {
              const Icon = CARD_ICONS[index] ?? CheckCircle2;
              return (
                <article
                  key={card.title}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <InfoSection title={t.scopeTitle} body={t.scopeBody} icon={<ShieldCheck />} />
          <InfoSection title={t.providerTitle} body={t.providerBody} icon={<Home />} />
          <InfoSection title={t.visionTitle} body={t.visionBody} icon={<Compass />} />
        </div>

        <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {t.ctas.map((cta) => (
              <Button key={cta.to} asChild variant={cta.variant} size="lg">
                <Link to={cta.to}>{cta.label}</Link>
              </Button>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}

function InfoSection({ title, body, icon }: { title: string; body: string[]; icon: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </span>
      <h2 className="mt-4 text-base font-bold text-foreground">{title}</h2>
      <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
        {body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
