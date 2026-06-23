import { createFileRoute } from "@tanstack/react-router";
import { LocaleContactPage } from "@/components/pages/LocaleContactPage";

export const Route = createFileRoute("/en/contact")({
  head: () => ({
    meta: [
      { title: "Contact MapleHouse · MapleHouse" },
      {
        name: "description",
        content: "Contact page for MapleHouse service questions, partnerships, and  feedback.",
      },
    ],
  }),
  component: () => <LocaleContactPage locale="en" />,
});
