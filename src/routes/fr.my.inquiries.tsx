import { createFileRoute } from "@tanstack/react-router";
import { LocaleTenantInquiryListPage } from "@/components/pages/LocaleTenantInquiriesPage";

export const Route = createFileRoute("/fr/my/inquiries")({
  head: () => ({
    meta: [
      { title: "Historique des demandes | MapleHouse" },
      {
        name: "description",
        content: "MapleHouse tenant inquiry history page.",
      },
    ],
  }),
  component: () => <LocaleTenantInquiryListPage locale="fr" />,
});
