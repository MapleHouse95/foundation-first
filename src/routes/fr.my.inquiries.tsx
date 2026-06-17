import { createFileRoute } from "@tanstack/react-router";
import { LocaleTenantInquiryListPage } from "@/components/pages/LocaleTenantInquiriesPage";

export const Route = createFileRoute("/fr/my/inquiries")({
  head: () => ({
    meta: [
      { title: "Historique des demandes | MapleHouse" },
      {
        name: "description",
        content: "MapleHouse MVP tenant inquiry history mock page.",
      },
    ],
  }),
  component: () => <LocaleTenantInquiryListPage locale="fr" />,
});
