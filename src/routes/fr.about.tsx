import { createFileRoute } from "@tanstack/react-router";
import { LocaleAboutPage } from "@/components/pages/LocaleAboutPage";

export const Route = createFileRoute("/fr/about")({
  head: () => ({
    meta: [
      { title: "À propos de MapleHouse · MapleHouse" },
      {
        name: "description",
        content: "Présentation de MapleHouse et de l'aperçu  actuel.",
      },
    ],
  }),
  component: () => <LocaleAboutPage locale="fr" />,
});
