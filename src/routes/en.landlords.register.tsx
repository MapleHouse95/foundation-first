import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/en/landlords/register")({
  head: () => ({
    meta: [
      { title: "Start listing inquiry · MapleHouse" },
      {
        name: "description",
        content: "Start a MapleHouse landlord listing inquiry preview.",
      },
    ],
  }),
  component: EnLandlordsRegisterRouteComponent,
});

function EnLandlordsRegisterRouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname === "/en/landlords/register") {
    return <LocaleLandlordsPage locale="en" page="register" />;
  }

  return <Outlet />;
}
