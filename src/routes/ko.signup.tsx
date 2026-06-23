import { createFileRoute } from "@tanstack/react-router";
import { LocaleAuthPlaceholderPage } from "@/components/pages/LocaleAuthPlaceholderPage";

export const Route = createFileRoute("/ko/signup")({
  head: () => ({
    meta: [
      { title: "회원가입 · MapleHouse" },
      { name: "description", content: "MapleHouse 회원가입 페이지." },
    ],
  }),
  component: () => <LocaleAuthPlaceholderPage locale="ko" mode="signup" />,
});
