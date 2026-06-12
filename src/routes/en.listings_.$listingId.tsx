import { createFileRoute } from "@tanstack/react-router";
import { LocaleListingDetailPage } from "@/components/pages/LocaleListingDetailPage";

export const Route = createFileRoute("/en/listings_/$listingId")({
  component: ListingDetailRoute,
});

function ListingDetailRoute() {
  const { listingId } = Route.useParams();
  return <LocaleListingDetailPage locale="en" listingId={listingId} />;
}
