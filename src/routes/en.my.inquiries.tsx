import { createFileRoute } from "@tanstack/react-router";
import { LocaleTenantInquiryListPage } from "@/components/pages/LocaleTenantInquiriesPage";

export const Route = createFileRoute("/en/my/inquiries")({
  head: () => ({
    meta: [
      { title: "Inquiry history | MapleHouse" },
      {
        name: "description",
        content: "MapleHouse tenant inquiry history page.",
      },
    ],
  }),
  component: () => <LocaleTenantInquiryListPage locale="en" />,
});
