import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { LocaleLandlordCenterPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/ko/landlords/center/listings")({
  head: () => ({
    meta: [
      { title: "매물 관리 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 임대인 센터 매물 관리 MVP 미리보기 화면입니다.",
      },
    ],
  }),
  component: KoLandlordCenterListingsRouteComponent,
});

function KoLandlordCenterListingsRouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname === "/ko/landlords/center/listings") {
    return <LocaleLandlordCenterPage locale="ko" page="listings" />;
  }

  return <Outlet />;
}
