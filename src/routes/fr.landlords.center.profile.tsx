import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordCenterPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/fr/landlords/center/profile")({
  head: () => ({
    meta: [
      { title: "Profil propriétaire · MapleHouse" },
      {
        name: "description",
        content: "Aperçu du profil propriétaire MapleHouse.",
      },
    ],
  }),
  component: () => <LocaleLandlordCenterPage locale="fr" page="profile" />,
});
