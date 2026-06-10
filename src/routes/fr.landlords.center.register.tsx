import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/fr/landlords/center/register")({
  head: () => ({
    meta: [
      { title: "Inscription propriétaire · MapleHouse" },
      {
        name: "description",
        content: "Commencer l’inscription propriétaire et la première annonce dans l’espace propriétaire MapleHouse.",
      },
    ],
  }),
  component: FrLandlordsCenterRegisterRouteComponent,
});

function FrLandlordsCenterRegisterRouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname === "/fr/landlords/center/register") {
    return <LocaleLandlordsPage locale="fr" page="register" registrationBase="center" />;
  }

  return <Outlet />;
}
