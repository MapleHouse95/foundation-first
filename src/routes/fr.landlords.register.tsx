import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/fr/landlords/register")({
  head: () => ({
    meta: [
      { title: "Commencer une demande · MapleHouse" },
      {
        name: "description",
        content: "Commencer un aperçu de demande d’annonce MapleHouse.",
      },
    ],
  }),
  component: FrLandlordsRegisterRouteComponent,
});

function FrLandlordsRegisterRouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname === "/fr/landlords/register") {
    return <LocaleLandlordsPage locale="fr" page="register" />;
  }

  return <Outlet />;
}
