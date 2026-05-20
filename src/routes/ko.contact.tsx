import { createFileRoute } from "@tanstack/react-router";
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
  component: () => <LocaleContactPage locale="ko" />,
});
