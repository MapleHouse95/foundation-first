import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";
import { LANDLORDS_CONTENT } from "@/lib/i18n-content";

export const Route = createFileRoute("/ko/landlords")({
  head: () => ({
    meta: [
      { title: LANDLORDS_CONTENT.ko.metaTitle },
      { name: "description", content: LANDLORDS_CONTENT.ko.metaDescription },
    ],
  }),
  component: KoLandlordsRouteComponent,
});

function KoLandlordsRouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname === "/ko/landlords") {
    return <LocaleLandlordsPage locale="ko" />;
  }

  return <Outlet />;
}
