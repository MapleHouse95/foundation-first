import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordCenterPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/fr/landlords/center/listings/new")({
  head: () => ({
    meta: [
      { title: "Ajouter une nouvelle annonce · MapleHouse" },
      {
        name: "description",
        content: "Aperçu MVP de l’ajout d’annonce propriétaire MapleHouse.",
      },
    ],
  }),
  component: () => <LocaleLandlordCenterPage locale="fr" page="newListing" />,
});
