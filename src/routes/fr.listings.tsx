import { createFileRoute } from "@tanstack/react-router";
import { LocaleListingsPage } from "@/components/pages/LocaleListingsPage";
import { LISTINGS_CONTENT } from "@/lib/i18n-content";

export const Route = createFileRoute("/fr/listings")({
  head: () => ({
    meta: [
      { title: LISTINGS_CONTENT.fr.metaTitle },
      { name: "description", content: LISTINGS_CONTENT.fr.metaDescription },
    ],
  }),
  component: () => <LocaleListingsPage locale="fr" />,
});
