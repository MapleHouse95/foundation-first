import { createFileRoute } from "@tanstack/react-router";
import { LocaleListingDetailPage } from "@/components/pages/LocaleListingDetailPage";

export const Route = createFileRoute("/fr/listings_/draft")({
  component: () => <LocaleListingDetailPage locale="fr" listingId="draft" />,
});
