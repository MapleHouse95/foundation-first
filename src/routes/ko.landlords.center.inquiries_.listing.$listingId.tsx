import { createFileRoute } from "@tanstack/react-router";
import { SharedLandlordListingInquiryPage } from "@/components/pages/InquiryFlowPages";

export const Route = createFileRoute("/ko/landlords/center/inquiries_/listing/$listingId")({
  head: () => ({
    meta: [
      { title: "매물 문의 관리 · MapleHouse" },
      {
        name: "description",
        content: "매물별 문의와 DM을 관리하는 MapleHouse 임대인 센터 화면입니다.",
      },
    ],
  }),
  component: () => {
    const { listingId } = Route.useParams();
    const search = Route.useSearch() as { thread?: string };
    return (
      <SharedLandlordListingInquiryPage
        locale="ko"
        listingId={listingId}
        selectedInquiryId={search.thread}
      />
    );
  },
});
