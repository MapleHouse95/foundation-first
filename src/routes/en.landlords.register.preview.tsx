import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/en/landlords/register/preview")({
  head: () => ({
    meta: [
      { title: "Listing inquiry preview · MapleHouse" },
      {
        name: "description",
        content: "Review a MapleHouse listing inquiry preview.",
      },
    ],
  }),
  component: () => <Navigate to="/en/landlords/center/register/preview" replace />,
});
