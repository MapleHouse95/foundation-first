import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/ko/landlords/center/register/preview")({
  head: () => ({
    meta: [
      { title: "매물 미리보기 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 임대인 센터 등록 흐름의 매물 미리보기 화면입니다.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="ko" page="preview" registrationBase="center" />,
});
