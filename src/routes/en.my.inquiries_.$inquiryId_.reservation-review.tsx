import { createFileRoute } from "@tanstack/react-router";
import { LocaleTenantReservationReviewPage } from "@/components/pages/LocaleTenantInquiriesPage";

export const Route = createFileRoute("/en/my/inquiries_/$inquiryId_/reservation-review")({
  head: () => ({
    meta: [
      { title: "Reserve | MapleHouse" },
      {
        name: "description",
        content: "Temporary compatibility route for the MapleHouse MVP reservation mock page.",
      },
    ],
  }),
  component: ReservationReviewRoute,
});

function ReservationReviewRoute() {
  const { inquiryId } = Route.useParams();

  return <LocaleTenantReservationReviewPage locale="en" inquiryId={inquiryId} />;
}
