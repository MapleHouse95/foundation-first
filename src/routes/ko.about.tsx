import { createFileRoute } from "@tanstack/react-router";
import { LocaleAboutPage } from "@/components/pages/LocaleAboutPage";

export const Route = createFileRoute("/ko/about")({
  head: () => ({
    meta: [
      { title: "메이플하우스란? · MapleHouse" },
      {
        name: "description",
        content: "메이플하우스의 서비스 방향과 MVP 상태를 소개합니다.",
      },
    ],
  }),
  component: () => <LocaleAboutPage locale="ko" />,
});
