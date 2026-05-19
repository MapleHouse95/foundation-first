import { createFileRoute } from "@tanstack/react-router";
import { LocaleMainPage } from "@/components/pages/LocaleMainPage";
import { MAIN_CONTENT } from "@/lib/i18n-content";

export const Route = createFileRoute("/fr")({
  head: () => ({
    meta: [
      { title: MAIN_CONTENT.fr.metaTitle },
      { name: "description", content: MAIN_CONTENT.fr.metaDescription },
    ],
  }),
  component: () => <LocaleMainPage locale="fr" />,
});
