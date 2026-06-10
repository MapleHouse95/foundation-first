import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/fr/landlords/register/preview")({
  head: () => ({
    meta: [
      { title: "Aperçu de la demande · MapleHouse" },
      {
        name: "description",
        content: "Vérifier l’aperçu d’une demande d’annonce MapleHouse.",
      },
    ],
  }),
  component: () => <Navigate to="/fr/landlords/center/register/preview" replace />,
});
