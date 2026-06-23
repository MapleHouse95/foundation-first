import { createFileRoute } from "@tanstack/react-router";
import { ContactBoardDetailPage } from "@/components/pages/LocaleContactBoardPage";

export const Route = createFileRoute("/ko/contact/board/$postId")({
  head: () => ({
    meta: [
      { title: "문의 상세 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 문의 게시판 상세 페이지입니다.",
      },
    ],
  }),
  component: ContactBoardDetailRoute,
});

function ContactBoardDetailRoute() {
  const { postId } = Route.useParams();
  return <ContactBoardDetailPage postId={postId} />;
}
