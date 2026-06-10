import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/fr/landlords/center/register/preview")({
  head: () => ({
    meta: [
      { title: "Aperçu de l’annonce · MapleHouse" },
      {
        name: "description",
        content: "Étape d’aperçu de l’annonce du flux d’inscription propriétaire MapleHouse.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="fr" page="preview" registrationBase="center" />,
});
