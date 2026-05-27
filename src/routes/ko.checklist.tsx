import { createFileRoute } from "@tanstack/react-router";
import { LocaleChecklistPage } from "@/components/pages/LocaleChecklistPage";

export const Route = createFileRoute("/ko/checklist")({
  head: () => ({
    meta: [
      { title: "토론토 기준역 체크리스트 · MapleHouse" },
      {
        name: "description",
        content: "워킹홀리데이 사용자를 위한 토론토 기준역 후보 추천 MVP 미리보기입니다.",
      },
    ],
  }),
  component: () => <LocaleChecklistPage locale="ko" />,
});
