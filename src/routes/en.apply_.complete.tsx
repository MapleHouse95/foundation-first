import { createFileRoute } from "@tanstack/react-router";
import { LocaleApplyCompletePage } from "@/components/pages/LocaleApplyPage";

export const Route = createFileRoute("/en/apply_/complete")({
  head: () => ({
    meta: [
      { title: "Inquiry received | MapleHouse" },
      {
        name: "description",
        content: "MapleHouse MVP inquiry completion screen.",
      },
    ],
  }),
  component: () => <LocaleApplyCompletePage locale="en" />,
});
