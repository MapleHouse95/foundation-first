import { createFileRoute } from "@tanstack/react-router";
import { LocaleReservationNewPage } from "@/components/pages/LocaleTenantInquiriesPage";

export const Route = createFileRoute("/fr/reservations/new")({
  validateSearch: (search: Record<string, unknown>) => ({
    listingId: typeof search.listingId === "string" ? search.listingId : "",
    inquiryId: typeof search.inquiryId === "string" ? search.inquiryId : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Réserver | MapleHouse" },
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

  return <LocaleReservationNewPage locale="fr" listingId={listingId} inquiryId={inquiryId} />;
}
