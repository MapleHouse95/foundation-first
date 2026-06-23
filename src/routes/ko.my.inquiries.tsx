import { createFileRoute } from "@tanstack/react-router";
import { LocaleTenantInquiryListPage } from "@/components/pages/LocaleTenantInquiriesPage";

export const Route = createFileRoute("/ko/my/inquiries")({
  head: () => ({
    meta: [
      { title: "문의 내역 | MapleHouse" },
      {
        name: "description",
        content: "MapleHouse tenant inquiry history page.",
      },
    ],
  }),
  component: () => <LocaleTenantInquiryListPage locale="ko" />,
});
