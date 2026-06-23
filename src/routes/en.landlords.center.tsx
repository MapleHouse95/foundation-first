import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { LocaleLandlordCenterPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/en/landlords/center")({
  head: () => ({
    meta: [
      { title: "Landlord center · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse landlord center Preview.",
      },
    ],
  }),
  component: EnLandlordCenterRouteComponent,
});

function EnLandlordCenterRouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname === "/en/landlords/center") {
    return <LocaleLandlordCenterPage locale="en" page="dashboard" />;
  }

  return <Outlet />;
}
