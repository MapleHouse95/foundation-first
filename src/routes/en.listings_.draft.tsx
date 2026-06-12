import { createFileRoute } from "@tanstack/react-router";
import { LocaleListingDetailPage } from "@/components/pages/LocaleListingDetailPage";

export const Route = createFileRoute("/en/listings_/draft")({
  component: () => <LocaleListingDetailPage locale="en" listingId="draft" />,
});
