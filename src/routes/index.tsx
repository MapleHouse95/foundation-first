import { createFileRoute, Link } from "@tanstack/react-router";
import { Home as HomeIcon, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { FeatureCard } from "@/components/layout/FeatureCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MapleHouse — Find your home, calmly" },
      {
        name: "description",
        content:
          "MapleHouse is a beginner-friendly home consultation service for first-time renters and buyers in Korea.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-accent/40 to-background">
        <Container className="grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:py-32">
          <div>
            <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              Test mode · MVP preview
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Find your home,
              <br className="hidden sm:block" /> calmly and clearly.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              MapleHouse walks first-time renters and buyers through every step — from
              listings to consultation — in plain language, with no pressure.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/apply">Start free consultation</Link>
              </Button>
              <Button asChild variant="soft" size="xl">
                <Link to="/listings">Browse listings</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/15 via-accent to-secondary" />
              <p className="mt-4 text-sm text-muted-foreground">
                Layout preview — real imagery added in a later phase.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Section
        eyebrow="Why MapleHouse"
        title="Built for first-time home seekers"
        description="Clear steps, honest guidance, and a calm pace. No flashy gimmicks, no surprise fees."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<HomeIcon className="h-5 w-5" />}
            title="Curated listings"
            description="Hand-picked homes reviewed for safety, fit, and fair pricing before they reach you."
          />
          <FeatureCard
            icon={<MessageCircle className="h-5 w-5" />}
            title="1:1 consultation"
            description="Talk to a real consultant who explains contracts and paperwork in plain Korean."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Transparent process"
            description="Every step — application, payment, and refund — is tracked clearly in your dashboard."
          />
        </div>
      </Section>
    </>
  );
}
