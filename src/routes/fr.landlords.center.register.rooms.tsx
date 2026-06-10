import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/fr/landlords/center/register/rooms")({
  head: () => ({
    meta: [
      { title: "Informations sur la chambre · MapleHouse" },
      {
        name: "description",
        content: "Étape chambre du flux d’inscription propriétaire MapleHouse.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="fr" page="rooms" registrationBase="center" />,
});
