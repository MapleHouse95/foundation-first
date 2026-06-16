import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordInquiryDetailPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/en/landlords/center/inquiries_/$inquiryId")({
  head: () => ({
    meta: [
      { title: "Inquiry detail · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse landlord center inquiry detail MVP mock page.",
      },
    ],
  }),
  component: InquiryDetailRoute,
});

function InquiryDetailRoute() {
  const { inquiryId } = Route.useParams();

  return <LocaleLandlordInquiryDetailPage locale="en" inquiryId={inquiryId} />;
}
