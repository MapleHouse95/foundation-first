import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordCenterPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/ko/landlords/center/listings/draft/details")({
  head: () => ({
    meta: [
      { title: "Complete listing details · MapleHouse" },
      {
        name: "description",
        content: "Complete landlord listing detail draft information in the MapleHouse Preview.",
      },
    ],
  }),
  component: () => <LocaleLandlordCenterPage locale="ko" page="listingDetails" />,
});
