import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/en/landlords/register/rooms")({
  head: () => ({
    meta: [
      { title: "Room and rent · MapleHouse" },
      {
        name: "description",
        content: "Enter room, rent, and availability details for a MapleHouse listing inquiry.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="en" page="rooms" />,
});
