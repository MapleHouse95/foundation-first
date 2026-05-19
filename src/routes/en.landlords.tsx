import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";
import { LANDLORDS_CONTENT } from "@/lib/i18n-content";

export const Route = createFileRoute("/en/landlords")({
  head: () => ({
    meta: [
      { title: LANDLORDS_CONTENT.en.metaTitle },
      { name: "description", content: LANDLORDS_CONTENT.en.metaDescription },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="en" />,
});
