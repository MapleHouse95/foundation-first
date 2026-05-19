import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/layout/Section";
import { FeatureCard } from "@/components/layout/FeatureCard";

export const Route = createFileRoute("/listings")({
  head: () => ({
    meta: [
      { title: "Listings — MapleHouse" },
      {
        name: "description",
        content: "Browse curated home listings reviewed by MapleHouse consultants.",
      },
    ],
  }),
  component: ListingsPage,
});

function ListingsPage() {
  return (
    <Section
      eyebrow="Listings"
      title="Curated homes"
      description="Placeholder cards — real listing data arrives in a later phase."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <FeatureCard
            key={i}
            title={`Sample home ${i + 1}`}
            description="Neighborhood · Size · Approx. monthly cost (placeholder)"
          >
            <div className="mt-4 aspect-[4/3] rounded-xl bg-gradient-to-br from-accent to-secondary" />
          </FeatureCard>
        ))}
      </div>
    </Section>
  );
}