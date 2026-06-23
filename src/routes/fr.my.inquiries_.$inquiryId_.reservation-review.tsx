import { createFileRoute } from "@tanstack/react-router";
import { LocaleTenantReservationReviewPage } from "@/components/pages/LocaleTenantInquiriesPage";

export const Route = createFileRoute("/fr/my/inquiries_/$inquiryId_/reservation-review")({
  head: () => ({
    meta: [
      { title: "Réserver | MapleHouse" },
      {
        name: "description",
        content: "Temporary compatibility route for the MapleHouse reservation page.",
      },
    ],
  }),
  component: ReservationReviewRoute,
});

function ReservationReviewRoute() {
  const { inquiryId } = Route.useParams();

  return <LocaleTenantReservationReviewPage locale="fr" inquiryId={inquiryId} />;
}
