import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/ko/landlords/register/preview")({
  head: () => ({
    meta: [
      { title: "등록 문의 미리보기 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 임대인 등록 문의 미리보기 화면입니다.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="ko" page="preview" />,
});
