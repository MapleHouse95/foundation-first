import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/fr/landlords/register/rooms")({
  head: () => ({
    meta: [
      { title: "Chambre et loyer · MapleHouse" },
      {
        name: "description",
        content: "Renseigner la chambre, le loyer et la disponibilité pour une demande MapleHouse.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="fr" page="rooms" />,
});
