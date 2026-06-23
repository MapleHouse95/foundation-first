import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { ContactBoardListPage } from "@/components/pages/LocaleContactBoardPage";

export const Route = createFileRoute("/ko/contact/board")({
  head: () => ({
    meta: [
      { title: "문의 게시판 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 문의 게시판 페이지입니다.",
      },
    ],
  }),
  component: KoContactBoardRouteComponent,
});

function KoContactBoardRouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname === "/ko/contact/board") {
    return <ContactBoardListPage />;
  }

  return <Outlet />;
}
