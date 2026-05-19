import { Link } from "@tanstack/react-router";
import { Home as HomeIcon, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { MAIN_CONTENT } from "@/lib/i18n-content";
import type { Locale } from "@/lib/i18n";

export function LocaleMainPage({ locale }: { locale: Locale }) {
  const t = MAIN_CONTENT[locale];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-accent/40 to-background">
        <Container className="grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              {t.testModeBadge}
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              {t.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to={`/${locale}/apply`}>{t.seekerCta}</Link>
              </Button>
              <Button asChild variant="soft" size="xl">
                <Link to={`/${locale}/landlords`}>{t.landlordCta}</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/15 via-accent to-secondary" />
              <p className="mt-4 text-sm text-muted-foreground">{t.mvpNotice}</p>
            </div>
          </div>
        </Container>
      </section>

      <Section eyebrow={t.rolesEyebrow} title={t.rolesTitle} description={t.rolesDescription}>
        <div className="grid gap-6 md:grid-cols-2">
          <RoleCard
            icon={<HomeIcon className="h-5 w-5" />}
            title={t.seekerCardTitle}
            body={t.seekerCardBody}
            ctaTo={`/${locale}/apply`}
            ctaLabel={t.seekerCardCta}
          />
          <RoleCard
            icon={<Building2 className="h-5 w-5" />}
            title={t.landlordCardTitle}
            body={t.landlordCardBody}
            ctaTo={`/${locale}/landlords`}
            ctaLabel={t.landlordCardCta}
          />
        </div>
      </Section>

      <Section
        className="bg-secondary/30 py-14 sm:py-16"
        eyebrow={t.aboutEyebrow}
        title={t.aboutTitle}
        description={t.aboutBody}
      />
    </>
  );
}

function RoleCard({
  icon,
  title,
  body,
  ctaTo,
  ctaLabel,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  ctaTo: string;
  ctaLabel: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-6">
        <Button asChild variant="outline" size="sm">
          <Link to={ctaTo}>{ctaLabel}</Link>
        </Button>
      </div>
    </div>
  );
}