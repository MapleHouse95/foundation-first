import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/fr/landlords/register/terms")({
  head: () => ({
    meta: [
      { title: "Conditions · MapleHouse" },
      {
        name: "description",
        content: "Confirmer les dépôts, services et notes pour une demande MapleHouse.",
      },
    ],
  }),
  component: () => <Navigate to="/fr/landlords/center/register/terms" replace />,
});
