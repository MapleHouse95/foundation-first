import { createFileRoute } from "@tanstack/react-router";
import { LocaleAuthPlaceholderPage } from "@/components/pages/LocaleAuthPlaceholderPage";

export const Route = createFileRoute("/en/login")({
  head: () => ({
    meta: [
      { title: "Login · MapleHouse" },
      { name: "description", content: "MapleHouse login placeholder page." },
    ],
  }),
  component: () => <LocaleAuthPlaceholderPage locale="en" mode="login" />,
});
