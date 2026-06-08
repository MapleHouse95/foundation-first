import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/fr/landlords/register/property")({
  head: () => ({
    meta: [
      { title: "Informations du logement · MapleHouse" },
      {
        name: "description",
        content: "Renseigner les informations du logement pour une demande MapleHouse.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="fr" page="property" />,
});
