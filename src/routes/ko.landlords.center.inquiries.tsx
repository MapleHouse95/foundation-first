import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordCenterPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/ko/landlords/center/inquiries")({
  head: () => ({
    meta: [
      { title: "문의 관리 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 임대인 센터 문의 관리 MVP 미리보기 화면입니다.",
      },
    ],
  }),
  component: () => <LocaleLandlordCenterPage locale="ko" page="inquiries" />,
});
