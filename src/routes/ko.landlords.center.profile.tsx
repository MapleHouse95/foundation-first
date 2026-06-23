import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordCenterPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/ko/landlords/center/profile")({
  head: () => ({
    meta: [
      { title: "임대인 정보 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 임대인 센터 프로필 화면입니다.",
      },
    ],
  }),
  component: () => <LocaleLandlordCenterPage locale="ko" page="profile" />,
});
