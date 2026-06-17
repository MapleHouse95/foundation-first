import { createFileRoute } from "@tanstack/react-router";
import { LocaleTenantInquiryListPage } from "@/components/pages/LocaleTenantInquiriesPage";

export const Route = createFileRoute("/ko/my/inquiries")({
  head: () => ({
    meta: [
      { title: "문의 내역 | MapleHouse" },
      {
        name: "description",
        content: "MapleHouse MVP tenant inquiry history mock page.",
      },
    ],
  }),
  component: () => <LocaleTenantInquiryListPage locale="ko" />,
});
