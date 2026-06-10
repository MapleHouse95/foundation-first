import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/ko/landlords/center/register")({
  head: () => ({
    meta: [
      { title: "임대인 등록 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 임대인 센터 안에서 임대인 등록과 첫 매물 등록을 시작합니다.",
      },
    ],
  }),
  component: KoLandlordsCenterRegisterRouteComponent,
});

function KoLandlordsCenterRegisterRouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname === "/ko/landlords/center/register") {
    return <LocaleLandlordsPage locale="ko" page="register" registrationBase="center" />;
  }

  return <Outlet />;
}
