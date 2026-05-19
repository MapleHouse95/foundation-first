import { createFileRoute } from "@tanstack/react-router";
import { LocaleApplyPage } from "@/components/pages/LocaleApplyPage";
import { APPLY_CONTENT } from "@/lib/i18n-content";

export const Route = createFileRoute("/ko/apply")({
  head: () => ({
    meta: [
      { title: APPLY_CONTENT.ko.metaTitle },
      { name: "description", content: APPLY_CONTENT.ko.metaDescription },
    ],
  }),
  component: () => <LocaleApplyPage locale="ko" />,
});
