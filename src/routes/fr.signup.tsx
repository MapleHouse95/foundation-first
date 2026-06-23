import { createFileRoute } from "@tanstack/react-router";
import { LocaleAuthPlaceholderPage } from "@/components/pages/LocaleAuthPlaceholderPage";

export const Route = createFileRoute("/fr/signup")({
  head: () => ({
    meta: [
      { title: "Inscription · MapleHouse" },
      { name: "description", content: "Page d’inscription MapleHouse." },
    ],
  }),
  component: () => <LocaleAuthPlaceholderPage locale="fr" mode="signup" />,
});
