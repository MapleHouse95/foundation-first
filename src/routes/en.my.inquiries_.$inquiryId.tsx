import { createFileRoute } from "@tanstack/react-router";
import { LocaleTenantInquiryDetailPage } from "@/components/pages/LocaleTenantInquiriesPage";

export const Route = createFileRoute("/en/my/inquiries_/$inquiryId")({
  head: () => ({
    meta: [
      { title: "Inquiry detail | MapleHouse" },
      {
        name: "description",
        content: "MapleHouse MVP tenant inquiry detail mock page.",
      },
    ],
  }),
  component: InquiryDetailRoute,
});

function InquiryDetailRoute() {
  const { inquiryId } = Route.useParams();

  return <LocaleTenantInquiryDetailPage locale="en" inquiryId={inquiryId} />;
}
