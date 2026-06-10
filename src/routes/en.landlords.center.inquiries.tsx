import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordCenterPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/en/landlords/center/inquiries")({
  head: () => ({
    meta: [
      { title: "Inquiry management · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse landlord center inquiry management MVP preview.",
      },
    ],
  }),
  component: () => <LocaleLandlordCenterPage locale="en" page="inquiries" />,
});
