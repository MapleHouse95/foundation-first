import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/en/landlords/center/register/rooms")({
  head: () => ({
    meta: [
      { title: "Room information · MapleHouse" },
      {
        name: "description",
        content: "Room information step in the MapleHouse landlord center registration flow.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="en" page="rooms" registrationBase="center" />,
});
