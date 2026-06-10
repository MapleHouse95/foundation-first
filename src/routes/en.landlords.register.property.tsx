import { Navigate, createFileRoute } from "@tanstack/react-router";

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
  component: () => <Navigate to="/en/landlords/center/register/property" replace />,
});
