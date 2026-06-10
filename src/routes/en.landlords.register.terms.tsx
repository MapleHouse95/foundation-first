import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/en/landlords/register/terms")({
  head: () => ({
    meta: [
      { title: "Terms and utilities · MapleHouse" },
      {
        name: "description",
        content: "Confirm deposits, utilities, rules, and notes for a MapleHouse listing inquiry.",
      },
    ],
  }),
  component: () => <Navigate to="/en/landlords/center/register/terms" replace />,
});
