import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/ko/landlords/center/register/property")({
  head: () => ({
    meta: [
      { title: "공간 정보 입력 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 임대인 센터 등록 흐름의 공간 정보 입력 화면입니다.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="ko" page="property" registrationBase="center" />,
});
