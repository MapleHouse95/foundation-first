import { createFileRoute } from "@tanstack/react-router";
import { LocaleListingDmPage } from "@/components/pages/ListingDirectDmDialog";

export const Route = createFileRoute("/ko/messages/listing/$listingId")({
  validateSearch: (search: Record<string, unknown>) => ({
    roomId: typeof search.roomId === "string" ? search.roomId : undefined,
  }),
  head: () => ({
    meta: [
      { title: "집주인 DM | MapleHouse" },
      {
        name: "description",
        content: "MapleHouse listing-specific landlord DM page.",
      },
    ],
  }),
  component: ListingDmRoute,
});

function ListingDmRoute() {
  const { listingId } = Route.useParams();
  const { roomId } = Route.useSearch();

  return <LocaleListingDmPage locale="ko" listingId={listingId} roomId={roomId} />;
}
