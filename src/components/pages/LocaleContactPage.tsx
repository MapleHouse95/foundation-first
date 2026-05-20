import { Building2, Mail, MessageSquareText, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import type { Locale } from "@/lib/i18n";

type ContactContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
  formTitle: string;
  nameLabel: string;
  emailLabel: string;
  categoryLabel: string;
  messageLabel: string;
  disabledCta: string;
  notice: string;
};

const CONTENT: Record<Locale, ContactContent> = {
  ko: {
    eyebrow: "Contact",
    title: "문의하기",
    subtitle:
      "메이플하우스 서비스 이용, 제휴, 운영 관련 문의를 남길 수 있는 공간입니다.",
    sections: [
      {
        title: "서비스 문의",
        body: "메이플하우스 이용 흐름, 언어 지원, 서비스 준비 상황에 대한 문의입니다.",
      },
      {
        title: "제휴/임대인 문의",
        body: "제휴 제안, 매물 제공자 협력, 임대인 등록 준비 관련 문의입니다.",
      },
      {
        title: "오류/피드백 제보",
        body: "MVP 화면 오류, 문구 개선, 사용성 피드백을 남길 수 있습니다.",
      },
      {
        title: "MVP 준비 중 안내",
        body: "현재 문의 제출은 저장되지 않습니다. 실제 접수 기능은 이후 단계에서 연결됩니다.",
      },
    ],
    formTitle: "문의 양식 미리보기",
    nameLabel: "이름",
    emailLabel: "이메일",
    categoryLabel: "문의 유형",
    messageLabel: "문의 내용",
    disabledCta: "제출 준비 중",
    notice: "MVP 미리보기 · 실제 문의 저장/전송 기능은 아직 활성화되지 않았습니다.",
  },
  en: {
    eyebrow: "Contact",
    title: "Contact MapleHouse",
    subtitle: "For service questions, partnership inquiries, and MVP feedback.",
    sections: [
      {
        title: "Service questions",
        body: "Questions about MapleHouse usage, language support, and MVP status.",
      },
      {
        title: "Partnership / landlord inquiries",
        body: "For partnerships, property provider discussions, and landlord onboarding.",
      },
      {
        title: "Bug reports / feedback",
        body: "Share MVP screen issues, copy suggestions, or usability feedback.",
      },
      {
        title: "MVP preparation notice",
        body: "Submissions are not saved yet. Real contact handling will be connected later.",
      },
    ],
    formTitle: "Contact form preview",
    nameLabel: "Name",
    emailLabel: "Email",
    categoryLabel: "Category",
    messageLabel: "Message",
    disabledCta: "Submission not active",
    notice: "MVP preview · Real contact submission is not active yet.",
  },
  fr: {
    eyebrow: "Contact",
    title: "Contacter MapleHouse",
    subtitle: "Pour les questions de service, les partenariats et les retours sur le MVP.",
    sections: [
      {
        title: "Questions de service",
        body: "Questions sur l'utilisation de MapleHouse, les langues et l'état du MVP.",
      },
      {
        title: "Partenariats / propriétaires",
        body: "Pour les partenariats, les fournisseurs de logements et l'inscription propriétaire.",
      },
      {
        title: "Erreurs / retours",
        body: "Partagez les problèmes d'écran MVP, les suggestions de texte ou d'usage.",
      },
      {
        title: "MVP en préparation",
        body: "Les messages ne sont pas encore enregistrés. Le vrai contact sera connecté plus tard.",
      },
    ],
    formTitle: "Aperçu du formulaire",
    nameLabel: "Nom",
    emailLabel: "Email",
    categoryLabel: "Catégorie",
    messageLabel: "Message",
    disabledCta: "Envoi non actif",
    notice: "Aperçu MVP · L'envoi réel de contact n'est pas encore actif.",
  },
};

const ICONS = [Mail, Building2, Wrench, MessageSquareText];

export function LocaleContactPage({ locale }: { locale: Locale }) {
  const t = CONTENT[locale];

  return (
    <main className="bg-background">
      <Container className="py-12 sm:py-16">
        <div className="mx-auto min-h-[11rem] max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {t.title}
          </h1>
          <p className="mh-clamp-3 mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t.subtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {t.sections.map((section, index) => {
            const Icon = ICONS[index] ?? MessageSquareText;
            return (
              <section
                key={section.title}
                className="min-h-[12.75rem] rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mh-clamp-2 mt-4 min-h-10 text-base font-semibold text-foreground">
                  {section.title}
                </h2>
                <p className="mh-clamp-3 mt-2 text-sm leading-relaxed text-muted-foreground">
                  {section.body}
                </p>
              </section>
            );
          })}
        </div>

        <section className="mx-auto mt-8 min-h-[24rem] max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">{t.formTitle}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <PreviewField label={t.nameLabel} />
            <PreviewField label={t.emailLabel} />
            <PreviewField label={t.categoryLabel} />
            <PreviewField label={t.messageLabel} className="sm:col-span-2" multiline />
          </div>
          <Button disabled className="mt-5 min-w-[10rem]">
            {t.disabledCta}
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">{t.notice}</p>
        </section>
      </Container>
    </main>
  );
}

function PreviewField({
  label,
  multiline = false,
  className = "",
}: {
  label: string;
  multiline?: boolean;
  className?: string;
}) {
  const baseClass =
    "mt-1 w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm text-muted-foreground";

  return (
    <label className={className}>
      <span className="mh-clamp-1 block min-h-[1rem] text-xs font-medium text-muted-foreground">{label}</span>
      {multiline ? (
        <textarea className={`${baseClass} min-h-24 resize-none`} disabled />
      ) : (
        <input className={baseClass} disabled />
      )}
    </label>
  );
}
