import { createFileRoute } from "@tanstack/react-router";
import { LocaleApplyCompletePage } from "@/components/pages/LocaleApplyPage";

export const Route = createFileRoute("/fr/apply_/complete")({
  head: () => ({
    meta: [
      { title: "Demande recue | MapleHouse" },
      {
        name: "description",
        content: "Ecran de confirmation de demande MVP MapleHouse.",
      },
    ],
  }),
  component: () => <LocaleApplyCompletePage locale="fr" />,
});
