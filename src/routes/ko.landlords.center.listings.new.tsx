import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordCenterPage } from "@/components/pages/LocaleLandlordCenterPage";

export const Route = createFileRoute("/ko/landlords/center/listings/new")({
  head: () => ({
    meta: [
      { title: "추가 매물 등록 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 임대인 센터 추가 매물 등록 MVP 미리보기 화면입니다.",
      },
    ],
  }),
  component: () => <LocaleLandlordCenterPage locale="ko" page="newListing" />,
});
