import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordCenterPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/fr/landlords/center/inquiries")({
  head: () => ({
    meta: [
      { title: "Gestion des demandes · MapleHouse" },
      {
        name: "description",
        content: "Aperçu de la gestion des demandes propriétaire MapleHouse.",
      },
    ],
  }),
  component: () => <LocaleLandlordCenterPage locale="fr" page="inquiries" />,
});
