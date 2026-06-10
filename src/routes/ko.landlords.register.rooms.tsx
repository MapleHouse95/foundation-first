import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ko/landlords/register/rooms")({
  head: () => ({
    meta: [
      { title: "방과 요금 입력 · MapleHouse" },
      {
        name: "description",
        content: "MapleHouse 임대인 등록 문의의 방과 요금 입력 화면입니다.",
      },
    ],
  }),
  component: () => <Navigate to="/ko/landlords/center/register/rooms" replace />,
});
