import { createFileRoute } from "@tanstack/react-router";
import { LocaleLandlordsPage } from "@/components/pages/LocaleLandlordsPage";

export const Route = createFileRoute("/en/landlords/register/terms")({
  head: () => ({
    meta: [
      { title: "Terms and utilities · MapleHouse" },
      {
        name: "description",
        content: "Confirm deposits, utilities, rules, and notes for a MapleHouse listing inquiry.",
      },
    ],
  }),
  component: () => <LocaleLandlordsPage locale="en" page="terms" />,
});
