import { createFileRoute } from "@tanstack/react-router";
import { LocaleListingDetailPage } from "@/components/pages/LocaleListingDetailPage";

export const Route = createFileRoute("/ko/listings_/draft")({
  component: () => <LocaleListingDetailPage locale="ko" listingId="draft" />,
});
