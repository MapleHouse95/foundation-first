import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { LocaleLandlordCenterPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/fr/landlords/center/listings")({
  head: () => ({
    meta: [
      { title: "Annonces · MapleHouse" },
      {
        name: "description",
        content: "Aperçu MVP de la gestion des annonces propriétaire MapleHouse.",
      },
    ],
  }),
  component: FrLandlordCenterListingsRouteComponent,
});

function FrLandlordCenterListingsRouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname === "/fr/landlords/center/listings") {
    return <LocaleLandlordCenterPage locale="fr" page="listings" />;
  }

  return <Outlet />;
}
