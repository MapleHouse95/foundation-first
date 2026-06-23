import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordInquiryDetailPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/fr/landlords/center/inquiries_/$inquiryId")({
  head: () => ({
    meta: [
      { title: "Détail de la demande · MapleHouse" },
      {
        name: "description",
        content: "Page  de detail de demande du centre proprietaire MapleHouse.",
      },
    ],
  }),
  component: InquiryDetailRoute,
});

function InquiryDetailRoute() {
  const { inquiryId } = Route.useParams();

  return <LocaleLandlordInquiryDetailPage locale="fr" inquiryId={inquiryId} />;
}
