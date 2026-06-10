import { Navigate, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/ko/landlords/register")({
  head: () => ({
    meta: [
      { title: "임대인 등록 시작 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 임대인 등록 문의 시작 화면입니다.",
      },
    ],
  }),
  component: KoLandlordsRegisterRouteComponent,
});

function KoLandlordsRegisterRouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname === "/ko/landlords/register") {
    return <Navigate to="/ko/landlords/center/register" replace />;
  }

  return <Outlet />;
}
