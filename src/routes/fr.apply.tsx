import { createFileRoute } from "@tanstack/react-router";
import { LocaleApplyPage } from "@/components/pages/LocaleApplyPage";
import { APPLY_CONTENT } from "@/lib/i18n-content";

export const Route = createFileRoute("/fr/apply")({
  head: () => ({
    meta: [
      { title: APPLY_CONTENT.fr.metaTitle },
      { name: "description", content: APPLY_CONTENT.fr.metaDescription },
    ],
  }),
  component: () => <LocaleApplyPage locale="fr" />,
});
