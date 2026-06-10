import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/fr/landlords/center/register/terms")({
  head: () => ({
    meta: [
      { title: "Conditions et règles · MapleHouse" },
      {
        name: "description",
        content: "Étape conditions et règles du flux d’inscription propriétaire MapleHouse.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="fr" page="terms" registrationBase="center" />,
});
