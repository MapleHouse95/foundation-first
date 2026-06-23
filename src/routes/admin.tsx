import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/layout/Section";
import { FeatureCard } from "@/components/layout/FeatureCard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "관리자 — MapleHouse" },
      { name: "description", content: "MapleHouse 내부 관리자 CRM (자리표시자)." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <Section
      eyebrow="관리자 · 테스트 모드"
      title="CRM 작업공간"
      description="고객, 신청, 결제, 환불, 계약서 초안 관리는 이후 단계에서 구축됩니다."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[
          "고객",
          "신청/문의",
          "결제 내역(모의)",
          "환불 내역(모의)",
          "계약서 초안(내부 미리보기)",
          "할 일",
        ].map((label) => (
          <FeatureCard
            key={label}
            title={label}
            description="이후 단계에서 구축 예정입니다."
          />
        ))}
      </div>
      <p className="mt-10 text-xs text-muted-foreground">
         MapleHouse 관리 화면입니다.
      </p>
    </Section>
  );
}
