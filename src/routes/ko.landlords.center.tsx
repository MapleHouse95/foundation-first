import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { LocaleLandlordCenterPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/ko/landlords/center")({
  head: () => ({
    meta: [
      { title: "임대인 센터 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 임대인 센터 MVP 미리보기 화면입니다.",
      },
    ],
  }),
  component: KoLandlordCenterRouteComponent,
});

function KoLandlordCenterRouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname === "/ko/landlords/center") {
    return <LocaleLandlordCenterPage locale="ko" page="dashboard" />;
  }

  return <Outlet />;
}
