import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ko/landlords/register/terms")({
  head: () => ({
    meta: [
      { title: "조건 확인 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 임대인 등록 문의의 조건 확인 화면입니다.",
      },
    ],
  }),
  component: () => <Navigate to="/ko/landlords/center/register/terms" replace />,
});
