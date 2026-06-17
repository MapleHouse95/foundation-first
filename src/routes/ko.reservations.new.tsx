import { createFileRoute } from "@tanstack/react-router";
import { LocaleReservationNewPage } from "@/components/pages/LocaleTenantInquiriesPage";

export const Route = createFileRoute("/ko/reservations/new")({
  validateSearch: (search: Record<string, unknown>) => ({
    listingId: typeof search.listingId === "string" ? search.listingId : "",
    inquiryId: typeof search.inquiryId === "string" ? search.inquiryId : undefined,
  }),
  head: () => ({
    meta: [
      { title: "예약하기 | MapleHouse" },
      {
        name: "description",
        content: "MapleHouse MVP reservation mock page.",
      },
    ],
  }),
  component: ReservationNewRoute,
});

function ReservationNewRoute() {
  const { listingId, inquiryId } = Route.useSearch();

  return <LocaleReservationNewPage locale="ko" listingId={listingId} inquiryId={inquiryId} />;
}
