import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { LocaleLandlordCenterPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/en/landlords/center/listings")({
  head: () => ({
    meta: [
      { title: "Listings · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse landlord center listings MVP preview.",
      },
    ],
  }),
  component: EnLandlordCenterListingsRouteComponent,
});

function EnLandlordCenterListingsRouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname === "/en/landlords/center/listings") {
    return <LocaleLandlordCenterPage locale="en" page="listings" />;
  }

  return <Outlet />;
}
