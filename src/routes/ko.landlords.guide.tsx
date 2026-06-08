import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/ko/landlords/guide")({
  head: () => ({
    meta: [
      { title: "임대인 등록 안내 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 임대인 등록 문의 전에 확인할 정보를 안내합니다.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="ko" page="guide" />,
});
