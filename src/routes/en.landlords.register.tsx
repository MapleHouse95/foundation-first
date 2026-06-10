import { Navigate, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";

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
    return <Navigate to="/en/landlords/center/register" replace />;
  }

  return <Outlet />;
}
