import { createFileRoute } from "@tanstack/react-router";
import { LocaleListingDetailPage } from "@/components/pages/LocaleListingDetailPage";

export const Route = createFileRoute("/fr/listings_/$listingId")({
  component: ListingDetailRoute,
});

function ListingDetailRoute() {
  const { listingId } = Route.useParams();
  return <LocaleListingDetailPage locale="fr" listingId={listingId} />;
}
