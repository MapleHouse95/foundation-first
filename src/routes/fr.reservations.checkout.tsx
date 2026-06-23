import { createFileRoute } from "@tanstack/react-router";
import { LocaleReservationCheckoutPage } from "@/components/pages/LocaleReservationCheckoutPage";

export const Route = createFileRoute("/fr/reservations/checkout")({
  validateSearch: (search: Record<string, unknown>) => ({
    listingId: typeof search.listingId === "string" ? search.listingId : "",
    roomId: typeof search.roomId === "string" ? search.roomId : "",
    inquiryId: typeof search.inquiryId === "string" ? search.inquiryId : undefined,
    currency: typeof search.currency === "string" ? search.currency : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Détails du paiement | MapleHouse" },
      { name: "description", content: "MapleHouse checkout page." },
    ],
  }),
  component: ReservationCheckoutRoute,
});

function ReservationCheckoutRoute() {
  const { listingId, roomId, inquiryId, currency } = Route.useSearch();

  return (
    <LocaleReservationCheckoutPage
      locale="fr"
      listingId={listingId}
      roomId={roomId}
      inquiryId={inquiryId}
      currency={currency}
    />
  );
}
