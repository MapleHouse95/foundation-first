import { Navigate, createFileRoute } from "@tanstack/react-router";

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
  component: () => <Navigate to="/en/landlords/center/register/rooms" replace />,
});
