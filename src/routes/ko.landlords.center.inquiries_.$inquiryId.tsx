import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordInquiryDetailPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/ko/landlords/center/inquiries_/$inquiryId")({
  head: () => ({
    meta: [
      { title: "문의 상세 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 임대인 센터 문의 상세 화면입니다.",
      },
    ],
  }),
  component: InquiryDetailRoute,
});

function InquiryDetailRoute() {
  const { inquiryId } = Route.useParams();

  return <LocaleLandlordInquiryDetailPage locale="ko" inquiryId={inquiryId} />;
}
