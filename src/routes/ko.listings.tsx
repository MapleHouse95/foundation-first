import { createFileRoute } from "@tanstack/react-router";
import { LocaleListingsPage } from "@/components/pages/LocaleListingsPage";
import { LISTINGS_CONTENT } from "@/lib/i18n-content";

export const Route = createFileRoute("/ko/listings")({
  head: () => ({
    meta: [
      { title: LISTINGS_CONTENT.ko.metaTitle },
      { name: "description", content: LISTINGS_CONTENT.ko.metaDescription },
    ],
  }),
  component: () => <LocaleListingsPage locale="ko" />,
});
