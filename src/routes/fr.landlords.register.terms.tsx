import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/fr/landlords/register/terms")({
  head: () => ({
    meta: [
      { title: "Conditions · MapleHouse" },
      {
        name: "description",
        content: "Confirmer les dépôts, services et notes pour une demande MapleHouse.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="fr" page="terms" />,
});
