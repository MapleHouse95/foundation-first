import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ko/landlords/register/preview")({
  head: () => ({
    meta: [
      { title: "등록 문의 미리보기 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 임대인 등록 문의 화면입니다.",
      },
    ],
  }),
  component: () => <Navigate to="/ko/landlords/center/register/preview" replace />,
});
