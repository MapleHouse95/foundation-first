import { createFileRoute } from "@tanstack/react-router";
import { LocaleListingDmPage } from "@/components/pages/ListingDirectDmDialog";

export const Route = createFileRoute("/fr/messages/listing/$listingId")({
  validateSearch: (search: Record<string, unknown>) => ({
    roomId: typeof search.roomId === "string" ? search.roomId : undefined,
  }),
  head: () => ({
    meta: [
      { title: "DM propriétaire | MapleHouse" },
      {
        name: "description",
        content: "Page DM propriétaire par logement MapleHouse.",
      },
    ],
  }),
  component: ListingDmRoute,
});

function ListingDmRoute() {
  const { listingId } = Route.useParams();
  const { roomId } = Route.useSearch();

  return <LocaleListingDmPage locale="fr" listingId={listingId} roomId={roomId} />;
}
