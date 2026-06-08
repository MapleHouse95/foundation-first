import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/fr/landlords/register/preview")({
  head: () => ({
    meta: [
      { title: "Aperçu de la demande · MapleHouse" },
      {
        name: "description",
        content: "Vérifier l’aperçu d’une demande d’annonce MapleHouse.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="fr" page="preview" />,
});
