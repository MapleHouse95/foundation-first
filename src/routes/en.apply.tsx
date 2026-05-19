import { createFileRoute } from "@tanstack/react-router";
import { LocaleApplyPage } from "@/components/pages/LocaleApplyPage";
import { APPLY_CONTENT } from "@/lib/i18n-content";

export const Route = createFileRoute("/en/apply")({
  head: () => ({
    meta: [
      { title: APPLY_CONTENT.en.metaTitle },
      { name: "description", content: APPLY_CONTENT.en.metaDescription },
    ],
  }),
  component: () => <LocaleApplyPage locale="en" />,
});
