import { createFileRoute } from "@tanstack/react-router";
import { LocaleChecklistPage } from "@/components/pages/LocaleChecklistPage";

export const Route = createFileRoute("/en/checklist")({
  head: () => ({
    meta: [
      { title: "Checklist · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse checklist  for Toronto housing search decisions.",
      },
    ],
  }),
  component: () => <LocaleChecklistPage locale="en" />,
});
