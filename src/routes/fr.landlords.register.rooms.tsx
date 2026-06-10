import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/fr/landlords/register/rooms")({
  head: () => ({
    meta: [
      { title: "Chambre et loyer · MapleHouse" },
      {
        name: "description",
        content: "Renseigner la chambre, le loyer et la disponibilité pour une demande MapleHouse.",
      },
    ],
  }),
  component: () => <Navigate to="/fr/landlords/center/register/rooms" replace />,
});
