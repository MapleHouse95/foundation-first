import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/en/landlords/guide")({
  head: () => ({
    meta: [
      { title: "Listing guide · MapleHouse" },
      {
        name: "description",
        content: "Information to review before submitting a MapleHouse listing inquiry.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="en" page="guide" />,
});
