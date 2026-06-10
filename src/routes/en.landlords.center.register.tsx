import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/en/landlords/center/register")({
  head: () => ({
    meta: [
      { title: "Landlord registration · MapleHouse" },
      {
        name: "description",
        content: "Start landlord registration and first listing inside the MapleHouse landlord center.",
      },
    ],
  }),
  component: EnLandlordsCenterRegisterRouteComponent,
});

function EnLandlordsCenterRegisterRouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname === "/en/landlords/center/register") {
    return <LocaleLandlordsPage locale="en" page="register" registrationBase="center" />;
  }

  return <Outlet />;
}
