import { createFileRoute } from "@tanstack/react-router";
import { LocaleReservationCompletePage } from "@/components/pages/LocaleReservationCheckoutPage";

export const Route = createFileRoute("/fr/reservations/complete")({
  head: () => ({
    meta: [
      { title: "Demande de réservation reçue | MapleHouse" },
      { name: "description", content: "MapleHouse MVP reservation request complete page." },
    ],
  }),
  component: ReservationCompleteRoute,
});

function ReservationCompleteRoute() {
  return <LocaleReservationCompletePage locale="fr" />;
}
