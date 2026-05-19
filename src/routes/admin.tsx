import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/layout/Section";
import { FeatureCard } from "@/components/layout/FeatureCard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — MapleHouse" },
      { name: "description", content: "MapleHouse internal admin CRM (placeholder)." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <Section
      eyebrow="Admin · Test mode"
      title="CRM workspace"
      description="Layout placeholder. Customers, inquiries, payments, refunds, and contract drafts will be built in later phases."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[
          "Customers",
          "Inquiries",
          "Payments (mock)",
          "Refunds (mock)",
          "Contract drafts (internal preview)",
          "Tasks",
        ].map((label) => (
          <FeatureCard
            key={label}
            title={label}
            description="Coming in a later phase."
          />
        ))}
      </div>
    </Section>
  );
}