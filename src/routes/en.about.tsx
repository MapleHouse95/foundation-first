import { createFileRoute } from "@tanstack/react-router";
import { LocaleAboutPage } from "@/components/pages/LocaleAboutPage";

export const Route = createFileRoute("/en/about")({
  head: () => ({
    meta: [
      { title: "About MapleHouse · MapleHouse" },
      {
        name: "description",
        content: "Learn what MapleHouse is and what the MVP preview currently includes.",
      },
    ],
  }),
  component: () => <LocaleAboutPage locale="en" />,
});
