import { createFileRoute } from "@tanstack/react-router";
import { LocaleListingsPage } from "@/components/pages/LocaleListingsPage";
import { LISTINGS_CONTENT } from "@/lib/i18n-content";

export const Route = createFileRoute("/en/listings")({
  head: () => ({
    meta: [
      { title: LISTINGS_CONTENT.en.metaTitle },
      { name: "description", content: LISTINGS_CONTENT.en.metaDescription },
    ],
  }),
  component: () => <LocaleListingsPage locale="en" />,
});
