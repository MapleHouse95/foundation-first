import { createFileRoute } from "@tanstack/react-router";
import { LocaleMainPage } from "@/components/pages/LocaleMainPage";
import { MAIN_CONTENT } from "@/lib/i18n-content";

export const Route = createFileRoute("/ko/")({
  head: () => ({
    meta: [
      { title: MAIN_CONTENT.ko.metaTitle },
      { name: "description", content: MAIN_CONTENT.ko.metaDescription },
    ],
  }),
  component: () => <LocaleMainPage locale="ko" />,
});
