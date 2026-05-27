import { createFileRoute } from "@tanstack/react-router";
import { LocaleChecklistPage } from "@/components/pages/LocaleChecklistPage";

export const Route = createFileRoute("/fr/checklist")({
  head: () => ({
    meta: [
      { title: "Liste de vérification · MapleHouse" },
      {
        name: "description",
        content: "Aperçu de la checklist MVP MapleHouse.",
      },
    ],
  }),
  component: () => <LocaleChecklistPage locale="fr" />,
});
