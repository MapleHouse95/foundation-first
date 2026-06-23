import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordCenterPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/en/landlords/center/listings/new")({
  head: () => ({
    meta: [
      { title: "Add a new listing · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse additional listing Preview.",
      },
    ],
  }),
  component: () => <LocaleLandlordCenterPage locale="en" page="newListing" />,
});
