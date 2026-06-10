import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/ko/landlords/center/register/terms")({
  head: () => ({
    meta: [
      { title: "조건 및 규칙 입력 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 임대인 센터 등록 흐름의 조건 및 규칙 입력 화면입니다.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="ko" page="terms" registrationBase="center" />,
});
