import { createFileRoute } from "@tanstack/react-router";
import { LocaleAuthPlaceholderPage } from "@/components/pages/LocaleAuthPlaceholderPage";

export const Route = createFileRoute("/en/signup")({
  head: () => ({
    meta: [
      { title: "Sign up · MapleHouse" },
      { name: "description", content: "MapleHouse sign up placeholder page." },
    ],
  }),
  component: () => <LocaleAuthPlaceholderPage locale="en" mode="signup" />,
});
