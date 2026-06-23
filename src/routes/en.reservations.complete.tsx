import { createFileRoute } from "@tanstack/react-router";
import { LocaleReservationCompletePage } from "@/components/pages/LocaleReservationCheckoutPage";

export const Route = createFileRoute("/en/reservations/complete")({
  head: () => ({
    meta: [
      { title: "Reservation request received | MapleHouse" },
      { name: "description", content: "MapleHouse reservation request complete page." },
    ],
  }),
  component: ReservationCompleteRoute,
});

function ReservationCompleteRoute() {
  return <LocaleReservationCompletePage locale="en" />;
}
