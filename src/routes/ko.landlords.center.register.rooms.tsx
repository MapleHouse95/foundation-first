import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/ko/landlords/center/register/rooms")({
  head: () => ({
    meta: [
      { title: "방 정보 입력 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 임대인 센터 등록 흐름의 방 정보 입력 화면입니다.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="ko" page="rooms" registrationBase="center" />,
});
