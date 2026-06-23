import { createFileRoute } from "@tanstack/react-router";
import { LocaleContactPage } from "@/components/pages/LocaleContactPage";

export const Route = createFileRoute("/fr/contact")({
  head: () => ({
    meta: [
      { title: "Contacter MapleHouse · MapleHouse" },
      {
        name: "description",
        content: "Page de contact pour les questions de service, partenariats et retours .",
      },
    ],
  }),
  component: () => <LocaleContactPage locale="fr" />,
});
