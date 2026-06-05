import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { LocaleContactPage } from "@/components/pages/LocaleContactPage";

export const Route = createFileRoute("/ko/contact")({
  head: () => ({
    meta: [
      { title: "문의하기 · MapleHouse" },
      {
        name: "description",
        content: "메이플하우스 서비스 이용, 제휴, 운영 관련 문의 페이지입니다.",
      },
    ],
  }),
  component: KoContactRouteComponent,
});

function KoContactRouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname === "/ko/contact") {
    return <LocaleContactPage locale="ko" />;
  }

  return <Outlet />;
}
