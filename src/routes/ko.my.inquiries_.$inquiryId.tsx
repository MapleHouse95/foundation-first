import { createFileRoute } from "@tanstack/react-router";
import { LocaleTenantInquiryDetailPage } from "@/components/pages/LocaleTenantInquiriesPage";

export const Route = createFileRoute("/ko/my/inquiries_/$inquiryId")({
  head: () => ({
    meta: [
      { title: "문의 상세 | MapleHouse" },
      {
        name: "description",
        content: "MapleHouse tenant inquiry detail page.",
      },
    ],
  }),
  component: InquiryDetailRoute,
});

function InquiryDetailRoute() {
  const { inquiryId } = Route.useParams();

  return <LocaleTenantInquiryDetailPage locale="ko" inquiryId={inquiryId} />;
}
