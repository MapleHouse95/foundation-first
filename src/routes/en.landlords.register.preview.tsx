import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/en/landlords/register/preview")({
  head: () => ({
    meta: [
      { title: "Listing inquiry preview · MapleHouse" },
      {
        name: "description",
        content: "Review a MapleHouse listing inquiry preview.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="en" page="preview" />,
});
