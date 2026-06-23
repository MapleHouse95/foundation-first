import { createFileRoute } from "@tanstack/react-router";
import { LocaleReservationNewPage } from "@/components/pages/LocaleTenantInquiriesPage";

export const Route = createFileRoute("/en/reservations/new")({
  validateSearch: (search: Record<string, unknown>) => ({
    listingId: typeof search.listingId === "string" ? search.listingId : "",
    roomId: typeof search.roomId === "string" ? search.roomId : undefined,
    inquiryId: typeof search.inquiryId === "string" ? search.inquiryId : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Reserve | MapleHouse" },
      {
        name: "description",
        content: "MapleHouse reservation page.",
      },
    ],
  }),
  component: ReservationNewRoute,
});

function ReservationNewRoute() {
  const { listingId, inquiryId, roomId } = Route.useSearch();

  return <LocaleReservationNewPage locale="en" listingId={listingId} inquiryId={inquiryId} roomId={roomId} />;
}
