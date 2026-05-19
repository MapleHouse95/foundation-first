import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { APPLY_CONTENT } from "@/lib/i18n-content";
import type { Locale } from "@/lib/i18n";

export function LocaleApplyPage({ locale }: { locale: Locale }) {
  const t = APPLY_CONTENT[locale];
  return (
    <Section eyebrow={t.eyebrow} title={t.title} description={t.description}>
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">{t.placeholderBody}</p>
        <Button className="mt-6" disabled>
          {t.disabledCta}
        </Button>
        <p className="mt-6 text-xs text-muted-foreground">{t.mvpNotice}</p>
      </div>
    </Section>
  );
}