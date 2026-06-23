import { createFileRoute } from "@tanstack/react-router";
import { LocaleAuthPlaceholderPage } from "@/components/pages/LocaleAuthPlaceholderPage";

export const Route = createFileRoute("/fr/login")({
  head: () => ({
    meta: [
      { title: "Connexion · MapleHouse" },
      { name: "description", content: "Page de connexion MapleHouse." },
    ],
  }),
  component: () => <LocaleAuthPlaceholderPage locale="fr" mode="login" />,
});
