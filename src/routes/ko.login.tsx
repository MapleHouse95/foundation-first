import { createFileRoute } from "@tanstack/react-router";
import { LocaleAuthPlaceholderPage } from "@/components/pages/LocaleAuthPlaceholderPage";

export const Route = createFileRoute("/ko/login")({
  head: () => ({
    meta: [
      { title: "로그인 · MapleHouse" },
      { name: "description", content: "MapleHouse 로그인 페이지." },
    ],
  }),
  component: () => <LocaleAuthPlaceholderPage locale="ko" mode="login" />,
});
