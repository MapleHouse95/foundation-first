import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply — MapleHouse" },
      {
        name: "description",
        content: "Request a consultation with a MapleHouse home advisor.",
      },
    ],
  }),
  component: ApplyPage,
});

function ApplyPage() {
  return (
    <Section
      eyebrow="Apply"
      title="Request a consultation"
      description="The full inquiry form arrives in a later phase. This page is a placeholder."
    >
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">
          Form fields, validation, and submission flow are not built yet.
        </p>
        <Button className="mt-6" disabled>
          Submit (disabled in this phase)
        </Button>
      </div>
    </Section>
  );
}