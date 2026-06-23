import { createFileRoute } from "@tanstack/react-router";
import { LocaleReservationCompletePage } from "@/components/pages/LocaleReservationCheckoutPage";

export const Route = createFileRoute("/ko/reservations/complete")({
  head: () => ({
    meta: [
      { title: "예약 요청 접수 | MapleHouse" },
      { name: "description", content: "MapleHouse reservation request complete page." },
    ],
  }),
  component: ReservationCompleteRoute,
});

function ReservationCompleteRoute() {
  return <LocaleReservationCompletePage locale="ko" />;
}
