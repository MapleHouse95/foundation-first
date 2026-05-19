import { Section } from "@/components/layout/Section";
import { FeatureCard } from "@/components/layout/FeatureCard";
import { LISTINGS_CONTENT } from "@/lib/i18n-content";
import type { Locale } from "@/lib/i18n";

export function LocaleListingsPage({ locale }: { locale: Locale }) {
  const t = LISTINGS_CONTENT[locale];
  return (
    <Section eyebrow={t.eyebrow} title={t.title} description={t.description}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <FeatureCard key={i} title={t.cardTitle(i)} description={t.cardBody}>
            <div className="mt-4 aspect-[4/3] rounded-xl bg-gradient-to-br from-accent to-secondary" />
          </FeatureCard>
        ))}
      </div>
      <p className="mt-10 text-center text-xs text-muted-foreground">{t.mvpNotice}</p>
    </Section>
  );
}