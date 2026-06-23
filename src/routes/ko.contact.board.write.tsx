import { createFileRoute } from "@tanstack/react-router";
import { ContactBoardWritePage } from "@/components/pages/LocaleContactBoardPage";

export const Route = createFileRoute("/ko/contact/board/write")({
  head: () => ({
    meta: [
      { title: "문의글 작성 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 문의 게시판 글쓰기 페이지입니다.",
      },
    ],
  }),
  component: ContactBoardWritePage,
});
