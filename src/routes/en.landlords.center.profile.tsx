import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordCenterPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/en/landlords/center/profile")({
  head: () => ({
    meta: [
      { title: "Landlord profile · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse landlord center profile MVP preview.",
      },
    ],
  }),
  component: () => <LocaleLandlordCenterPage locale="en" page="profile" />,
});
