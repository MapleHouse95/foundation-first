import { createFileRoute } from "@tanstack/react-router";
import { LocaleReservationCheckoutPage } from "@/components/pages/LocaleReservationCheckoutPage";

export const Route = createFileRoute("/ko/reservations/checkout")({
  validateSearch: (search: Record<string, unknown>) => ({
    listingId: typeof search.listingId === "string" ? search.listingId : "",
    roomId: typeof search.roomId === "string" ? search.roomId : "",
    inquiryId: typeof search.inquiryId === "string" ? search.inquiryId : undefined,
    currency: typeof search.currency === "string" ? search.currency : undefined,
  }),
  head: () => ({
    meta: [
      { title: "결제 정보 확인 | MapleHouse" },
      { name: "description", content: "MapleHouse MVP checkout mock page." },
    ],
  }),
  component: ReservationCheckoutRoute,
});

function ReservationCheckoutRoute() {
  const { listingId, roomId, inquiryId, currency } = Route.useSearch();

  return (
    <LocaleReservationCheckoutPage
      locale="ko"
      listingId={listingId}
      roomId={roomId}
      inquiryId={inquiryId}
      currency={currency}
    />
  );
}
