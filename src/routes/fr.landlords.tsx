import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";
import { LANDLORDS_CONTENT } from "@/lib/i18n-content";

export const Route = createFileRoute("/fr/landlords")({
  head: () => ({
    meta: [
      { title: LANDLORDS_CONTENT.fr.metaTitle },
      { name: "description", content: LANDLORDS_CONTENT.fr.metaDescription },
    ],
  }),
  component: FrLandlordsRouteComponent,
});

function FrLandlordsRouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname === "/fr/landlords") {
    return <LocaleLandlordsPage locale="fr" />;
  }

  return <Outlet />;
}
