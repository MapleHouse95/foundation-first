import { createFileRoute } from "@tanstack/react-router";
import { LocaleApplyCompletePage } from "@/components/pages/LocaleApplyPage";

export const Route = createFileRoute("/ko/apply_/complete")({
  head: () => ({
    meta: [
      { title: "Apply complete | MapleHouse" },
      {
        name: "description",
        content: "MapleHouse MVP inquiry completion screen.",
      },
    ],
  }),
  component: () => <LocaleApplyCompletePage locale="ko" />,
});
