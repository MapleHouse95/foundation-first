import { createFileRoute } from "@tanstack/react-router";
import { LocaleMainPage } from "@/components/pages/LocaleMainPage";
import { MAIN_CONTENT } from "@/lib/i18n-content";

export const Route = createFileRoute("/en")({
  head: () => ({
    meta: [
      { title: MAIN_CONTENT.en.metaTitle },
      { name: "description", content: MAIN_CONTENT.en.metaDescription },
    ],
  }),
  component: () => <LocaleMainPage locale="en" />,
});
