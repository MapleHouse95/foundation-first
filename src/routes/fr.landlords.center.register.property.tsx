import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/fr/landlords/center/register/property")({
  head: () => ({
    meta: [
      { title: "Informations sur le logement · MapleHouse" },
      {
        name: "description",
        content: "Étape logement du flux d’inscription propriétaire MapleHouse.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="fr" page="property" registrationBase="center" />,
});
