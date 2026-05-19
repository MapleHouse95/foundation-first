import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";
import { LANDLORDS_CONTENT } from "@/lib/i18n-content";

export const Route = createFileRoute("/fr/landlords")({
  head: () => ({
    meta: [
      { title: LANDLORDS_CONTENT.fr.metaTitle },
      { name: "description", content: LANDLORDS_CONTENT.fr.metaDescription },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="fr" />,
});
