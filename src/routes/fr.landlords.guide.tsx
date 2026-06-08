import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/fr/landlords/guide")({
  head: () => ({
    meta: [
      { title: "Guide propriétaire · MapleHouse" },
      {
        name: "description",
        content: "Informations à vérifier avant une demande d’annonce MapleHouse.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="fr" page="guide" />,
});
