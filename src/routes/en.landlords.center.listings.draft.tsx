import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordCenterPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/en/landlords/center/listings/draft")({
  head: () => ({
    meta: [
      { title: "First listing draft · MapleHouse" },
      {
        name: "description",
        content: "Review the first landlord listing draft in the MapleHouse Preview.",
      },
    ],
  }),
  component: () => <LocaleLandlordCenterPage locale="en" page="listingDraft" />,
});
