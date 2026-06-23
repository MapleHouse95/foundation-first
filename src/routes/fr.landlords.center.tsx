import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { LocaleLandlordCenterPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/fr/landlords/center")({
  head: () => ({
    meta: [
      { title: "Espace propriétaire · MapleHouse" },
      {
        name: "description",
        content: "Aperçu de l’espace propriétaire MapleHouse.",
      },
    ],
  }),
  component: FrLandlordCenterRouteComponent,
});

function FrLandlordCenterRouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname === "/fr/landlords/center") {
    return <LocaleLandlordCenterPage locale="fr" page="dashboard" />;
  }

  return <Outlet />;
}
