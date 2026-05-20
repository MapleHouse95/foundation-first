import { createFileRoute } from "@tanstack/react-router";
import { LocaleAuthPlaceholderPage } from "@/components/pages/LocaleAuthPlaceholderPage";

export const Route = createFileRoute("/fr/login")({
  head: () => ({
    meta: [
      { title: "Connexion · MapleHouse" },
      { name: "description", content: "MapleHouse connexion placeholder page." },
    ],
  }),
  component: () => <LocaleAuthPlaceholderPage locale="fr" mode="login" />,
});
