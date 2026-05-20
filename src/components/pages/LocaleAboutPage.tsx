import { CheckCircle2, Compass, ShieldCheck, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/Container";
import type { Locale } from "@/lib/i18n";

type AboutContent = {
  eyebrow: string;
  title: string;
  coreMessage: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
  notice: string;
};

const CONTENT: Record<Locale, AboutContent> = {
  ko: {
    eyebrow: "About MapleHouse",
    title: "메이플하우스란?",
    coreMessage:
      "메이플하우스는 해외 단기거주자가 낯선 도시에서 주거 선택을 더 안전하고 명확하게 할 수 있도록 돕는 신뢰 기반 주거 의사결정 플랫폼입니다.",
    sections: [
      {
        title: "왜 만들었나요?",
        body: "해외에서 처음 집을 찾을 때는 매물이 부족해서보다, 무엇을 기준으로 판단해야 하는지 모르는 것이 더 큰 문제입니다.",
      },
      {
        title: "어떤 문제를 해결하나요?",
        body: "흩어진 정보, 낯선 지역명, 언어 장벽, 계약 불안, 마지막 확인일을 알기 어려운 문제를 구조화하려고 합니다.",
      },
      {
        title: "메이플하우스가 제공하려는 기준",
        body: "지역, 예산, 교통, 생활 편의, 계약 전 질문, 검증 상태 같은 기준을 함께 보여주는 방향으로 준비하고 있습니다.",
      },
      {
        title: "현재는 MVP 미리보기 단계",
        body: "실제 결제, 계약, 매물 등록, 문의 저장 기능은 아직 활성화되지 않았고, 화면과 흐름을 검증하는 단계입니다.",
      },
    ],
    notice: "MVP 미리보기 · 실제 서비스 정책과 법적 문구는 출시 전 확정 예정입니다.",
  },
  en: {
    eyebrow: "About MapleHouse",
    title: "About MapleHouse",
    coreMessage:
      "MapleHouse helps overseas residents make safer housing decisions by organizing listings, local context, checklists, and trust signals.",
    sections: [
      {
        title: "Why MapleHouse exists",
        body: "When searching abroad, the hardest part is often not the number of listings, but knowing how to judge them.",
      },
      {
        title: "What problem it addresses",
        body: "MapleHouse focuses on fragmented information, unfamiliar neighborhoods, language barriers, contract anxiety, and weak verification signals.",
      },
      {
        title: "Decision criteria",
        body: "The product is being shaped around location, budget, transit, daily convenience, questions before signing, and last-checked status.",
      },
      {
        title: "Current MVP preview",
        body: "Real payments, contracts, property registration, and persisted inquiries are not active yet.",
      },
    ],
    notice: "MVP preview · Real policy and legal wording will be finalized before launch.",
  },
  fr: {
    eyebrow: "À propos",
    title: "À propos de MapleHouse",
    coreMessage:
      "MapleHouse aide les résidents à l'étranger à choisir un logement plus sûr grâce à des annonces structurées, du contexte local, des listes de vérification et des signaux de confiance.",
    sections: [
      {
        title: "Pourquoi MapleHouse ?",
        body: "À l'étranger, le plus difficile n'est pas toujours le manque d'annonces, mais le manque de critères pour les évaluer.",
      },
      {
        title: "Problèmes visés",
        body: "Informations fragmentées, quartiers inconnus, barrière de langue, inquiétude contractuelle et vérification peu claire.",
      },
      {
        title: "Critères proposés",
        body: "Le service prépare des critères autour du quartier, du budget, du transport, des questions avant contrat et du statut de vérification.",
      },
      {
        title: "Aperçu MVP",
        body: "Les paiements, contrats, inscriptions réelles et messages enregistrés ne sont pas encore actifs.",
      },
    ],
    notice: "Aperçu MVP · Les politiques et textes juridiques seront finalisés avant le lancement.",
  },
};

const ICONS = [Sparkles, Compass, ShieldCheck, CheckCircle2];

export function LocaleAboutPage({ locale }: { locale: Locale }) {
  const t = CONTENT[locale];

  return (
    <main className="bg-background">
      <Container className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-5 rounded-2xl border border-border bg-card p-6 text-base leading-relaxed text-foreground shadow-sm">
            {t.coreMessage}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {t.sections.map((section, index) => {
            const Icon = ICONS[index] ?? CheckCircle2;
            return (
              <section
                key={section.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-base font-semibold text-foreground">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {section.body}
                </p>
              </section>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">{t.notice}</p>
      </Container>
    </main>
  );
}
