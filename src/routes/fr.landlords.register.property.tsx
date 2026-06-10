import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/fr/landlords/register/property")({
  head: () => ({
    meta: [
      { title: "Informations du logement · MapleHouse" },
      {
        name: "description",
        content: "Renseigner les informations du logement pour une demande MapleHouse.",
      },
    ],
  }),
  component: () => <Navigate to="/fr/landlords/center/register/property" replace />,
});
