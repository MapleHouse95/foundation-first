import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/en/landlords/register/property")({
  head: () => ({
    meta: [
      { title: "Property details · MapleHouse" },
      {
        name: "description",
        content: "Enter property and location basics for a MapleHouse listing inquiry.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="en" page="property" />,
});
