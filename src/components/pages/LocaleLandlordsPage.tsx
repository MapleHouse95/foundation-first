import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { LANDLORDS_CONTENT } from "@/lib/i18n-content";
import type { Locale } from "@/lib/i18n";

export function LocaleLandlordsPage({ locale }: { locale: Locale }) {
  const t = LANDLORDS_CONTENT[locale];
  return (
    <main className={locale === "ko" ? "[word-break:keep-all]" : undefined}>
      {locale === "ko" ? (
        <Container className="pt-8 sm:pt-10 lg:pt-12">
          <PageBreadcrumb
            items={[
              { label: "홈", to: "/ko" },
              { label: "임대인 등록" },
            ]}
          />
        </Container>
      ) : null}
      <Section
        className={locale === "ko" ? "pt-8 sm:pt-10 lg:pt-12" : undefined}
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      >
        <div className="mx-auto grid max-w-3xl gap-6">
          <span className="mx-auto inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            {t.comingSoonBadge}
          </span>
          <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">{t.forWhoTitle}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {t.forWhoItems.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">{t.prepTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.prepBody}</p>
          </div>
          <p className="text-center text-xs text-muted-foreground">{t.mvpNotice}</p>
        </div>
      </Section>
    </main>
  );
}
